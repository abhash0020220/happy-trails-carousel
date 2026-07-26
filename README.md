# Happy Trails Dog Walking — Carousel Generator

A one-click, client-side tool that generates the 3-slide Instagram carousel for
Happy Trails Dog Walking (a teen-run dog walking business in the Cambrian
area), matching the existing Canva brand template pixel-for-pixel in color,
border, and font.

Clicking **Generate & Download All 3** renders three 1080×1350 PNGs on
`<canvas>` and downloads them:

- `slide-1-hook.png` — logo badge + rotating hook headline + fixed mission statement
- `slide-2-services.png` — services, rates, and a swappable dog photo/name
- `slide-3-contact.png` — contact info, identical on every generation

Everything runs in the browser — no backend, no build step, no database.

## Adding or editing preset hooks

Preset headlines live in the `HOOKS` array near the top of `app.js`. Add,
remove, or edit strings in that array — the rotation automatically adjusts to
the new list length. The current position in the rotation is stored in the
browser's `localStorage` (key `htdw_hook_index`) so it survives page reloads.

## Updating the brand colors

The three brand colors are defined as constants at the top of `app.js`
(sampled directly from the original reference PNGs, not eyeballed):

```js
const GREEN = "#135C48"; // borders + all text
const CREAM = "#FBF3DC"; // background for slides 2 & 3, and the logo badge
const GOLD = "#EFD389"; // background for slide 1 only
```

Change these hex values to update the palette everywhere at once. Border
thickness (`BORDER = 40`) and canvas size (`W = 1080`, `H = 1350`) are also
defined as constants near the top of the file.

## Font

All text uses **Baloo 2** (weight 800/ExtraBold), loaded from Google Fonts in
`index.html`. It's the closest free match to the rounded, extra-bold,
friendly sans-serif used in the original Canva design. Do not mix in other
fonts — every slide should use the same family for a consistent brand look.

## Running locally

No build step needed — just serve the folder statically, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

This site is deployed to GitHub Pages from the `main` branch (`/` root).
