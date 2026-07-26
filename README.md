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

A **Generate Caption** button also writes an Instagram caption (via Gemini,
see below) that pulls in the current hook, services, rates, and dog name.

There's also a separate **Post-Walk Thank You Post** section below the
carousel — a one-off single image (same brand look, cream background) for
posting right after a walk: upload today's photo, set the dog's name and a
short blurb about the walk, and it renders a "Thank you for walking with me
today, {name}!" post with a business footer (contact info + "Book your next
walk!"). Click **Download Post** to export it.

Everything else runs in the browser — no backend, no build step, no database.

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

## AI caption generation

The **Generate Caption** button calls a small Cloudflare Worker
(`worker/src/index.js`) that holds a Gemini API key server-side and proxies a
fixed prompt built from the carousel's own content (hook, mission, services,
rates, dog name). The key is never exposed to the browser or committed to
this repo.

- Worker source: `worker/src/index.js`
- Deployed at: `https://happy-trails-caption-proxy.happytrailsdogwalking.workers.dev`
- The frontend's `CAPTION_API_URL` constant in `app.js` points at that URL.

**To redeploy the Worker** (e.g. after editing the prompt):

```bash
cd worker
npx wrangler deploy
```

**To change the Gemini API key** (e.g. if it's rotated or revoked):

```bash
cd worker
npx wrangler secret put GEMINI_API_KEY
```

Note: if your Google account is on a Workspace/organization policy, keys
created at aistudio.google.com/apikey may come back as "service-account-bound"
keys (they look like `AQ.Ab8...` instead of the classic `AIzaSy...` format).
Those still work with this Worker as-is — no code changes needed.

**Allowed origins**: the Worker only accepts requests from the `ALLOWED_ORIGINS`
list at the top of `worker/src/index.js` (the GitHub Pages URL + localhost for
local dev). Add any other origin you serve this site from to that list and
redeploy.

## Deployment

This site is deployed to GitHub Pages from the `main` branch (`/` root). The
caption proxy is a separate deployment (a Cloudflare Worker, see above) since
GitHub Pages can't hold a secret API key.
