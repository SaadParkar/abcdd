# Caesar's Cipher Wheel

Caesar Cipher Wheel — two rotating concentric disks (inner/outer alphabet) that shift letters by a number. Very visual, easy to build on chart paper/cardboard, and fun to demo live by rotating the wheel

Create a stunning, animated single-page web app called "The Caesar Cipher Wheel: Julius Caesar's Secret Code" — themed around Ancient Roman aesthetics, museum-exhibit quality design.

VISUAL THEME:

- Background: aged parchment/scroll texture in warm cream, sepia, and faded gold tones, with subtle stone or marble border accents
- Color palette: deep imperial red/maroon, antique gold/bronze, marble white, dark walnut brown for text
- Typography: bold Roman-inscription style serif font for headings (like letters carved on a Roman monument), clean readable serif for body text
- Decorative Roman elements throughout: laurel wreath dividers, SPQR-style banner accents, column silhouettes, olive branch borders
- Subtle texture overlay to feel like aged stone/parchment, not flat/modern

HERO SECTION:

- Large animated title "THE CAESAR CIPHER WHEEL" with a gold-shimmer or carved-stone text reveal animation
- Subtitle: "How Julius Caesar Hid His Military Messages — 58 BCE"
- Smooth fade-in/slide-up entrance animation on page load
- A subtle animated laurel wreath or Roman eagle icon beside the title

HISTORY SECTION:

- Short storytelling paragraph about Julius Caesar using this cipher to send secret orders to his generals during military campaigns, so that even if a messenger was captured, the enemy couldn't read the message
- Explain simply: he shifted every letter in the alphabet by a fixed number of positions (e.g., shift of 3: A becomes D, B becomes E)
- Add a small decorative illustration/SVG accent (scroll, wax seal, or quill) with a subtle animation (gentle glow or sway)

INTERACTIVE CIPHER WHEEL (main feature):

- Build a beautiful circular rotating wheel: two concentric circular disks, outer ring and inner ring, both with the alphabet A-Z engraved around the edge in Roman-inscription style lettering
- The inner wheel should be DRAGGABLE/ROTATABLE by the user (mouse drag or touch), with smooth rotation animation and a satisfying "click" snap to each letter position
- A shift indicator in the center showing the current shift number (e.g., "Shift: 3"), updating live as the wheel rotates
- Style the wheel like an ancient bronze/gold mechanical device — add subtle metallic gradient, engraved-looking numbers, a decorative center hub with a Roman emblem
- Below the wheel, a text input: "Enter a word to encode"
- When user types a word with a chosen shift:
  - Animate each letter transforming into its shifted letter one at a time, with a glowing highlight effect as if being "stamped" or "carved"
  - Show the final encoded word appearing letter-by-letter with a reveal animation
- Add a "Decode" toggle: user enters an encoded word and the shift amount, wheel rotates automatically to show the shift, and the decoded word reveals with the same animation style
- Add a subtle spark/glow particle effect on successful encode/decode

MICRO-INTERACTIONS & ANIMATIONS:

- Hover effects on the wheel: soft golden glow
- The wheel should feel tactile and satisfying to rotate — add slight momentum/easing on drag release
- Smooth scroll-triggered fade-in animations as user scrolls through sections
- Subtle ambient background animation (slow drifting dust/parchment grain particles, very minimal and non-distracting)
- Buttons styled like wax-sealed scrolls with a warm glow hover state

FOOTER:

- Small line: "Inspired by Julius Caesar, Roman General & Statesman, c. 58 BCE"
- Decorative laurel wreath or Roman key-pattern border

DESIGN QUALITY:

- Must feel premium, like an interactive Roman history museum exhibit — not a plain webpage
- Fully responsive for mobile and desktop (wheel should still be smoothly draggable on touch screens)
- Smooth 60fps animations, no jank
- All logic (wheel rotation, encode/decode) should run entirely client-side in JavaScript, no backend needed

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1de684ec-4fdf-4754-a376-220db8b1ca2b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
