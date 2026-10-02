import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, Feather, ShieldCheck } from "lucide-react";

import { CipherWheel } from "@/components/CipherWheel";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "The Caesar Cipher Wheel — Julius Caesar's Secret Code" },
      {
        name: "description",
        content:
          "Rotate an interactive Caesar cipher wheel and discover how Julius Caesar concealed military messages in 58 BCE.",
      },
      { property: "og:title", content: "The Caesar Cipher Wheel" },
      {
        property: "og:description",
        content: "An interactive Roman history exhibit about Julius Caesar's secret code.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return (
    <main className="exhibit-shell">
      {/* Top Banner requested: AYESHA ADHIKARI T.24.150 */}
      <div className="w-full bg-primary/95 text-primary-foreground border-b border-accent/40 py-2.5 px-4 shadow-md relative z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 text-center">
          <span className="text-accent text-xs select-none">✦</span>
          <span className="font-display tracking-[0.22em] font-extrabold text-sm sm:text-base text-parchment drop-shadow-sm uppercase">
            AYESHA ADHIKARI T.24.150
          </span>
          <span className="text-accent text-xs select-none">✦</span>
        </div>
      </div>

      <div className="grain" aria-hidden="true" />
      <div className="dust" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>

      <section className="hero-section">
        <div className="column column-left" aria-hidden="true" />
        <div className="column column-right" aria-hidden="true" />
        <div className="spqr-banner animate-reveal">
          <span>SPQR</span>
        </div>
        <div className="laurel-mark animate-reveal" aria-hidden="true">
          <span>❧</span>
          <b>✦</b>
          <span>❧</span>
        </div>
        <p className="hero-kicker animate-rise">AYESHA ADHIKARI T.24.150 · Archivum Romanum</p>
        <h1 className="animate-rise">
          The Caesar
          <br />
          <span>Cipher Wheel</span>
        </h1>
        <div className="hero-rule animate-rise">
          <i />
          <b>•</b>
          <i />
        </div>
        <p className="hero-subtitle animate-rise">
          How Julius Caesar Hid His Military Messages <span>58 BCE</span>
        </p>
        <a className="scroll-cue animate-rise" href="#history">
          <span>Enter the archive</span>
          <ArrowDown size={18} />
        </a>
      </section>

      <section id="history" className="history-section reveal-section">
        <div className="section-number">I</div>
        <div className="history-copy">
          <p className="eyebrow">From the campaign archives</p>
          <h2>A message no enemy could read</h2>
          <p className="dropcap">
            Across the battlefields of Gaul, Julius Caesar sent secret orders to his generals by
            trusted messenger. If a courier was captured, the words would appear meaningless to the
            enemy.
          </p>
          <p>
            His method was elegant: shift every letter by a fixed number of places. With a shift of
            three, <strong>A becomes D</strong>, B becomes E, and the alphabet turns like a wheel.
          </p>
          <div className="alphabet-example" aria-label="A shifts to D with a shift of three">
            <span>A</span>
            <i>+3</i>
            <span>D</span>
          </div>
        </div>
        <div className="history-art" aria-hidden="true">
          <div className="wax-seal">
            <ShieldCheck />
            <span>CAESAR</span>
          </div>
          <Feather className="quill" />
          <div className="scroll-lines">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </section>

      <div className="laurel-divider" aria-hidden="true">
        <span>❧</span>
        <i />
        <b>✦</b>
        <i />
        <span>❧</span>
      </div>

      <section className="wheel-section reveal-section">
        <div className="section-heading">
          <p className="eyebrow">The instrument</p>
          <h2>Turn the wheel. Conceal the word.</h2>
          <p>Outer letters are the original message. Inner letters reveal the substitution.</p>
        </div>
        <CipherWheel />
      </section>

      <footer>
        <div className="key-border" aria-hidden="true" />
        <div className="footer-laurel" aria-hidden="true">
          ❧ <span>SPQR</span> ❧
        </div>
        <p>Inspired by Julius Caesar, Roman General &amp; Statesman, c. 58 BCE</p>
        <small>Made for curious minds · MMXXVI</small>
      </footer>
    </main>
  );
}
