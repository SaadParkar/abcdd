import {
  ArrowDownUp,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  HelpCircle,
  Minus,
  Plus,
  RotateCcw,
  Scissors,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { ALPHABET, getShiftBreakdown, normalizeShift, shiftText } from "@/lib/cipher";

const STEP = 360 / 26;

type DragState = {
  lastAngle: number;
  lastTime: number;
  velocity: number;
};

function pointAngle(event: ReactPointerEvent, element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return (
    (Math.atan2(
      event.clientY - (rect.top + rect.height / 2),
      event.clientX - (rect.left + rect.width / 2),
    ) *
      180) /
    Math.PI
  );
}

function playWheelTick() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(700, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch {
    // Ignore audio restrictions
  }
}

export function CipherWheel() {
  const [shift, setShift] = useState(3);
  const [rotation, setRotation] = useState(-3 * STEP);
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("ROMA INVICTA");
  const [reveal, setReveal] = useState(0);
  const [celebrate, setCelebrate] = useState(0);
  const [inspectedLetter, setInspectedLetter] = useState<string | null>("A");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showDiyGuide, setShowDiyGuide] = useState(false);

  const wheelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState>({ lastAngle: 0, lastTime: 0, velocity: 0 });

  const result = useMemo(() => shiftText(input, shift, mode === "decode"), [input, mode, shift]);
  const breakdown = useMemo(
    () => getShiftBreakdown(input, shift, mode === "decode"),
    [input, shift, mode],
  );

  const setSnappedShift = useCallback(
    (value: number) => {
      const next = normalizeShift(value);
      setShift(next);
      setRotation(-next * STEP);
      if (soundEnabled) playWheelTick();
    },
    [soundEnabled],
  );

  useEffect(() => {
    setReveal(0);
    if (!result) return;
    const timer = window.setInterval(() => {
      setReveal((current) => {
        if (current >= result.length) {
          window.clearInterval(timer);
          setCelebrate((value) => value + 1);
          return current;
        }
        return current + 1;
      });
    }, 45);
    return () => window.clearInterval(timer);
  }, [result]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!wheelRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      lastAngle: pointAngle(event, wheelRef.current),
      lastTime: performance.now(),
      velocity: 0,
    };
    setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging || !wheelRef.current) return;
    const now = performance.now();
    const angle = pointAngle(event, wheelRef.current);
    let delta = angle - dragRef.current.lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const elapsed = Math.max(now - dragRef.current.lastTime, 1);
    dragRef.current = { lastAngle: angle, lastTime: now, velocity: delta / elapsed };
    setRotation((current) => current + delta);
  };

  const handlePointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    const projected = rotation + dragRef.current.velocity * 35;
    const nextShift = normalizeShift(-Math.round(projected / STEP));
    setSnappedShift(nextShift);
  };

  const copyToClipboard = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const swapTextAndDirection = () => {
    if (result) {
      setInput(result);
      setMode((current) => (current === "encode" ? "decode" : "encode"));
    }
  };

  // Currently aligned letter under Outer 'A' (at top 12 o'clock)
  const topInnerLetter = shiftText("A", shift);
  const inspectedInner = inspectedLetter ? shiftText(inspectedLetter, shift) : null;

  return (
    <div className="space-y-10">
      <div className="cipher-layout">
        {/* WHEEL COLUMN */}
        <div className="wheel-column">
          {/* TOP ALIGNMENT MARKER */}
          <div
            className="alignment-marker"
            aria-label={`Alignment at top: Outer A maps to Inner ${topInnerLetter} with shift ${shift}`}
          >
            <span className="marker-label">KEY +{shift}</span>
            <span className="marker-pair">A ➔ {topInnerLetter}</span>
          </div>

          {/* TWO ROTATING CONCENTRIC DISKS */}
          <div
            ref={wheelRef}
            className={`cipher-wheel ${dragging ? "is-dragging" : ""}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                event.preventDefault();
                setSnappedShift(shift + 1);
              }
              if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                event.preventDefault();
                setSnappedShift(shift - 1);
              }
            }}
            role="slider"
            tabIndex={0}
            aria-label="Caesar cipher concentric wheel"
            aria-valuemin={0}
            aria-valuemax={25}
            aria-valuenow={shift}
            aria-valuetext={`Shift ${shift}, outer A aligns with inner ${topInnerLetter}`}
          >
            {/* OUTER DISK METAL RIM */}
            <div className="wheel-metal" aria-hidden="true" />

            {/* OUTER ALPHABET RING (PLAINTEXT) */}
            <div className="absolute inset-0 z-10 rounded-full" aria-label="Outer plaintext ring">
              {Array.from(ALPHABET).map((letter, index) => {
                const angle = index * STEP;
                const isSelected = inspectedLetter === letter;
                return (
                  <button
                    key={`outer-${letter}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectedLetter(letter);
                    }}
                    onMouseEnter={() => setInspectedLetter(letter)}
                    className={`wheel-letter ${isSelected ? "is-inspected" : ""}`}
                    style={{
                      left: `${(50 + 46.1 * Math.sin((angle * Math.PI) / 180)).toFixed(4)}%`,
                      top: `${(50 - 46.1 * Math.cos((angle * Math.PI) / 180)).toFixed(4)}%`,
                      transform: `translate(-50%, -50%) rotate(${angle.toFixed(4)}deg)`,
                    }}
                    title={`Outer (Plain): ${letter} ➔ Inner (Cipher): ${shiftText(letter, shift)}`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            {/* INNER DISK (ROTATING CONCENTRIC DISK) */}
            <div
              className="inner-disk"
              style={{ transform: `rotate(${rotation}deg)` }}
              aria-hidden="true"
            >
              <div className="inner-rivet inner-rivet-one" />
              <div className="inner-rivet inner-rivet-two" />
              <div className="inner-rivet inner-rivet-three" />
              <div className="inner-rivet inner-rivet-four" />
            </div>

            {/* INNER ALPHABET RING (CIPHERTEXT - ROTATES WITH DISK) */}
            <div
              className="absolute inset-[14.5%] z-20 rounded-full pointer-events-none"
              style={{ transform: `rotate(${rotation}deg)` }}
              aria-label="Inner ciphertext ring"
            >
              {Array.from(ALPHABET).map((letter, index) => {
                const angle = index * STEP;
                const isSelected = inspectedInner === letter;
                return (
                  <span
                    key={`inner-${letter}`}
                    className={`wheel-letter wheel-letter-inner ${isSelected ? "is-inspected" : ""}`}
                    style={{
                      left: `${(50 + 37.3 * Math.sin((angle * Math.PI) / 180)).toFixed(4)}%`,
                      top: `${(50 - 37.3 * Math.cos((angle * Math.PI) / 180)).toFixed(4)}%`,
                      transform: `translate(-50%, -50%) rotate(${angle.toFixed(4)}deg)`,
                    }}
                    title={`Inner letter: ${letter}`}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>

            {/* CENTER PIVOT FASTENER PIN (SPQR ROMA) */}
            <div className="wheel-hub" aria-hidden="true">
              <span className="hub-eagle">✦</span>
              <strong>SPQR</strong>
              <small>PIVOT</small>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between w-full max-w-sm px-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-semibold text-primary">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent border border-primary" />
              Outer: Plaintext
            </span>
            <span className="flex items-center gap-1 font-semibold text-foreground">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary" />
              Inner: Ciphertext
            </span>
          </div>

          <p className="drag-hint">
            Drag the inner disk to rotate · Use Arrow keys · Click any letter to inspect
          </p>

          {/* ACTIVE LETTER PAIR INSPECTION BADGE */}
          {inspectedLetter && (
            <div className="mt-3 px-4 py-1.5 rounded-full bg-card border border-accent/40 text-xs shadow-sm flex items-center gap-2">
              <span className="font-semibold text-primary">Selected:</span>
              <span className="font-mono font-bold text-sm bg-background px-2 py-0.5 rounded border border-border">
                {inspectedLetter} (Outer)
              </span>
              <span>➔</span>
              <span className="font-mono font-bold text-sm bg-primary text-primary-foreground px-2 py-0.5 rounded">
                {shiftText(inspectedLetter, shift)} (Inner)
              </span>
              <span className="text-muted-foreground">[+{shift} shift]</span>
            </div>
          )}
        </div>

        {/* CIPHER CONSOLE */}
        <div className="cipher-console">
          <div className="console-heading">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Field Cipher Console</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-muted-foreground gap-1.5"
                onClick={() => setSoundEnabled((prev) => !prev)}
                title={soundEnabled ? "Disable sound effects" : "Enable tactile wheel sounds"}
              >
                {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                <span>{soundEnabled ? "Sound ON" : "Sound OFF"}</span>
              </Button>
            </div>
            <h3>Compose your dispatch</h3>
            <p>Rotate the concentric disks or use controls to encrypt and decrypt live.</p>
          </div>

          {/* MODE SWITCH WITH DIRECTION & SWAP */}
          <div className="flex items-center gap-2 my-4">
            <div className="mode-switch flex-1 m-0" aria-label="Cipher direction">
              <button
                className={mode === "encode" ? "active" : ""}
                onClick={() => setMode("encode")}
                type="button"
              >
                Encode (Outer ➔ Inner)
              </button>
              <button
                className={mode === "decode" ? "active" : ""}
                onClick={() => setMode("decode")}
                type="button"
              >
                Decode (Inner ➔ Outer)
              </button>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0 border-primary/40 hover:bg-accent/20"
              onClick={swapTextAndDirection}
              title="Swap result into input and reverse direction"
            >
              <ArrowDownUp size={17} />
            </Button>
          </div>

          {/* SHIFT CONTROLS & STEPPER */}
          <div className="shift-control bg-card/60 p-3 rounded border border-border/60 mb-4">
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm text-foreground">
                Rotation Shift Key
              </span>
              <span className="text-xs text-muted-foreground">
                Inner disk turns {shift * (360 / 26)}° (Key {shift})
              </span>
            </div>
            <div className="shift-stepper">
              <Button
                variant="outline"
                size="icon"
                aria-label="Decrease shift"
                onClick={() => setSnappedShift(shift - 1)}
              >
                <Minus size={18} />
              </Button>
              <label>
                <span className="sr-only">Shift amount</span>
                <input
                  value={shift}
                  onChange={(event) => setSnappedShift(Number(event.target.value))}
                  min={0}
                  max={25}
                  type="number"
                />
              </label>
              <Button
                variant="outline"
                size="icon"
                aria-label="Increase shift"
                onClick={() => setSnappedShift(shift + 1)}
              >
                <Plus size={18} />
              </Button>
            </div>
          </div>

          {/* ROTATION SLIDER */}
          <div className="mb-4 px-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-mono">
              <span>0 (No shift)</span>
              <span className="text-primary font-bold">Shift: {shift}</span>
              <span>25 (-1 shift)</span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              value={shift}
              onChange={(e) => setSnappedShift(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer h-2 bg-muted rounded-lg"
              aria-label="Caesar shift slider"
            />
          </div>

          {/* QUICK SHIFT PRESETS */}
          <div className="mb-5 flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-muted-foreground font-semibold mr-1">Presets:</span>
            <Button
              variant={shift === 3 ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setSnappedShift(3)}
            >
              Key 3 (Caesar)
            </Button>
            <Button
              variant={shift === 13 ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setSnappedShift(13)}
            >
              Key 13 (ROT13)
            </Button>
            <Button
              variant={shift === 1 ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setSnappedShift(1)}
            >
              Key 1 (Augustus)
            </Button>
            <Button
              variant={shift === 0 ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setSnappedShift(0)}
            >
              Reset (0)
            </Button>
          </div>

          {/* MESSAGE INPUT */}
          <label className="message-field">
            <div className="flex items-center justify-between">
              <span>{mode === "encode" ? "Message in plain text" : "Encoded dispatch"}</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setInput("ROMA INVICTA")}
                  className="text-[10px] text-accent font-semibold hover:underline"
                >
                  ROMA
                </button>
                <span className="text-muted-foreground text-[10px]">·</span>
                <button
                  type="button"
                  onClick={() => setInput("VENI VIDI VICI")}
                  className="text-[10px] text-accent font-semibold hover:underline"
                >
                  VICI
                </button>
                <span className="text-muted-foreground text-[10px]">·</span>
                <button
                  type="button"
                  onClick={() => setInput("ATTACK AT DAWN")}
                  className="text-[10px] text-accent font-semibold hover:underline"
                >
                  DISPATCH
                </button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value.slice(0, 140))}
              placeholder={
                mode === "encode"
                  ? "Enter a word or sentence to encode"
                  : "Enter a message to decode"
              }
              rows={3}
            />
            <small>{input.length} / 140</small>
          </label>

          {/* RESULT DISPLAY */}
          <div className="result-scroll" aria-live="polite">
            <div className="result-label flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles size={15} />{" "}
                {mode === "encode"
                  ? "Sealed dispatch (Ciphertext)"
                  : "Decrypted message (Plaintext)"}
              </span>
              {result && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-7 px-2 text-xs gap-1 hover:bg-primary/20"
                >
                  {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </Button>
              )}
            </div>
            <div className="result-text" aria-label={result || "No result"}>
              {Array.from(result).map((letter, index) => (
                <span
                  key={`${celebrate}-${index}`}
                  className={index < reveal ? "revealed" : ""}
                  style={{ animationDelay: `${index * 15}ms` }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </span>
              ))}
              {!result && <em>Awaiting your message…</em>}
            </div>
            {reveal === result.length && result.length > 0 && (
              <div key={celebrate} className="sparks" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            )}
          </div>

          {/* CONSOLE ACTION BUTTONS */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="reset-button text-xs gap-1.5"
              onClick={() => {
                setInput("");
                setSnappedShift(3);
                setInspectedLetter("A");
              }}
            >
              <RotateCcw size={14} /> Clear tablet
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 border-border"
              onClick={() => setShowBreakdown((prev) => !prev)}
            >
              <HelpCircle size={14} />
              <span>{showBreakdown ? "Hide Math Breakdown" : "View Math Algorithm"}</span>
              {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          </div>
        </div>
      </div>

      {/* STEP-BY-STEP MATHEMATICAL FORMULA BREAKDOWN */}
      {showBreakdown && (
        <div className="breakdown-card animate-rise space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/70 pb-3 gap-2">
            <div>
              <h4 className="font-display font-bold text-base text-foreground uppercase tracking-wide">
                Modular Arithmetic Breakdown (Caesar Cipher Algorithm)
              </h4>
              <p className="text-xs text-muted-foreground">
                {mode === "encode"
                  ? "Encryption Formula: C = (P + k) mod 26"
                  : "Decryption Formula: P = (C - k) mod 26"}{" "}
                (where k = {shift})
              </p>
            </div>
            <div className="font-mono text-xs bg-muted px-2.5 py-1 rounded self-start">
              Key k = {shift}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground uppercase font-mono">
                  <th className="py-2 px-3">Character</th>
                  <th className="py-2 px-3">Alphabet Index (0–25)</th>
                  <th className="py-2 px-3">Shift Formula</th>
                  <th className="py-2 px-3">New Index</th>
                  <th className="py-2 px-3">Resulting Letter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 font-mono">
                {breakdown.slice(0, 15).map((step, idx) => (
                  <tr key={idx} className="hover:bg-muted/40 transition-colors">
                    <td className="py-2 px-3 font-bold text-foreground">
                      {step.char === " " ? "<space>" : step.char}
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">
                      {step.isLetter ? step.originalIndex : "—"}
                    </td>
                    <td className="py-2 px-3 text-primary font-medium">
                      {step.formula || "Unchanged (non-alphabetic)"}
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">
                      {step.isLetter ? step.shiftedIndex : "—"}
                    </td>
                    <td className="py-2 px-3 font-extrabold text-foreground">{step.resultChar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {breakdown.length > 15 && (
              <p className="text-center text-xs text-muted-foreground py-2 italic">
                ...and {breakdown.length - 15} more characters
              </p>
            )}
          </div>
        </div>
      )}

      {/* CHART PAPER & CARDBOARD DIY BUILD GUIDE */}
      <div className="diy-guide-card rounded-md p-6 border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-primary text-primary-foreground">
              <Scissors size={22} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground uppercase tracking-wide">
                How to Build this on Chart Paper &amp; Cardboard
              </h3>
              <p className="text-xs text-muted-foreground">
                Perfect for school projects, classroom presentations, and live hands-on cipher
                demonstrations!
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDiyGuide((prev) => !prev)}
            className="self-start sm:self-center text-xs gap-1.5"
          >
            {showDiyGuide ? "Collapse Instructions" : "Expand DIY Instructions"}
            {showDiyGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>

        {showDiyGuide && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5 animate-rise">
            <div className="bg-background/80 p-4 rounded border border-border space-y-2">
              <div className="font-display font-bold text-sm text-primary flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  1
                </span>
                Materials Needed
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Stiff cardboard or 2 colors of chart paper</li>
                <li>Compass, protractor, and ruler</li>
                <li>Scissors / paper cutter</li>
                <li>One brass split pin (paper fastener / brad)</li>
                <li>Fine black marker or pen</li>
              </ul>
            </div>

            <div className="bg-background/80 p-4 rounded border border-border space-y-2">
              <div className="font-display font-bold text-sm text-primary flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  2
                </span>
                Cutting the 2 Disks
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>
                  <strong>Outer Disk:</strong> Draw a circle of radius 10 cm (20 cm diameter).
                </li>
                <li>
                  <strong>Inner Disk:</strong> Draw a circle of radius 7.5 cm (15 cm diameter).
                </li>
                <li>
                  Divide each circle into <strong>26 equal sectors of 13.85°</strong> using a
                  protractor (360° ÷ 26 = 13.85°).
                </li>
                <li>Write letters A–Z clockwise on both disks.</li>
              </ul>
            </div>

            <div className="bg-background/80 p-4 rounded border border-border space-y-2">
              <div className="font-display font-bold text-sm text-primary flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  3
                </span>
                Assembly &amp; Live Demo
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Place the smaller disk directly on top of the larger disk.</li>
                <li>Poke a hole in the exact center and push the split pin through.</li>
                <li>Spread the prongs at the back so the inner disk spins freely.</li>
                <li>
                  <strong>To Demo Live:</strong> Align Outer A to Inner D (Shift +3). Pick letters
                  from the outer ring and read off the inner ring!
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
