# Caesar Cipher Wheel

## Overview

Build the home page as an immersive, single-page Roman museum exhibit centered on a fully interactive Caesar cipher wheel. Everything runs locally in the browser with no sign-in or backend.

## Experience

- Open with a theatrical parchment-and-stone title scene featuring the exhibit name, 58 BCE subtitle, imperial banner, laurels, and restrained gold reveal motion.
- Follow with a concise illustrated history passage explaining Caesar's military use of letter shifting and a clear A → D example.
- Make the cipher wheel the visual centerpiece: two engraved A–Z bronze disks, alignment marker, central SPQR-style medallion, and live shift readout.
- Add a polished encode/decode console beneath the wheel with a segmented mode control, text input, direct shift controls, animated letter-by-letter output, and a brief success sparkle.
- Finish with the requested historical attribution and a Roman key-pattern border.

## Interaction

- Let users rotate the inner disk using mouse, touch, keyboard arrows, plus/minus controls, or direct shift selection.
- Track the drag angle smoothly, apply light release momentum, then snap precisely to one of 26 letter positions.
- Keep wheel position, shift controls, mapped alphabet, and encoded/decoded output synchronized.
- Preserve spaces, punctuation, and letter case while shifting only A–Z characters.
- Re-run the stamped letter reveal whenever the input, mode, or snapped shift changes.

## Visual Direction

- Use warm parchment, walnut ink, imperial maroon, marble, bronze, and antique gold through semantic design tokens.
- Create the wheel and Roman ornaments with layered CSS and inline vector geometry so they stay crisp and responsive.
- Add restrained grain, drifting dust, metallic highlights, carved lettering, wax-seal controls, and scroll-triggered entrances without overwhelming the content.
- Use Roman display serif typography for headings and a highly readable classical serif for supporting copy.
- Respect reduced-motion settings and provide visible focus states and descriptive control labels.

## Technical Details

- Implement the wheel as a focused React component with pointer capture and angle math; keep cipher helpers separate and deterministic.
- Use transform-only animation for wheel motion and ambient effects to maintain smooth performance.
- Scale the wheel with stable aspect-ratio constraints for desktop and mobile, preventing layout shifts or text overlap.
- Add page-specific title, description, Open Graph, and Twitter metadata.
- Add targeted tests for wrapping shifts, decode behavior, punctuation, case preservation, and all 26 positions.
- Validate the finished page in the live preview at desktop and mobile widths, including drag, encode, decode, and reduced-motion behavior.
