# Lucy Maria Daly’s bookshelf

Live website: https://ldaly4.github.io/lucy-bookshelf/

A static personal website in plain HTML, CSS, and JavaScript. No backend, dependencies, build command, or framework. This project lives separately from the church app at `/Users/lucy/lucy-bookshelf`.

## Preview

Open `index.html`, or run `python3 -m http.server 8080` in this folder and visit http://localhost:8080.

## Books and navigation

The first eight books, in order, are Work History; University (and building cool cars); Communities; VapeBox; Water Projects; Software Projects; Hardware Projects; Arts and Crafts.

Every book opens to a generated numbered contents page. Select a section to jump to it; select Contents on any text or photo page to return. Desktop shows a two-page spread per section. Phones show the text and photos on separate pages, with one contents page at the start. Arrows, clickable corners, keyboard arrows, and swipes turn pages. Escape and Back to shelf close the reader. Cross-book links open the other book’s contents; browser Back still closes the reader. Sounds are off by default and can be enabled inside the reader. Reduced-motion preferences use fades.

All 35 sections and 47 photo slots come from Lucy’s supplied notes. Bracketed editing notes remain unchanged. No unfinished claims or project details have been filled in.

## Edit content and add photos

Everything about the books is in `content.js`. Each book has an `id`, `title`, `color`, `height`, `width`, `symbol`, and `sections`. Contents lists are generated automatically from section headings; adding or reordering sections updates them automatically. `spineTitle` and `spineSubtitle` optionally split a long title on its spine.

Each section has `heading`, `text`, and `photos`. Separate paragraphs with `\n\n` inside the text string. Each photo has:

```js
{
  description: "Patch team or cohort", // Appears on the placeholder.
  src: "",                           // Add e.g. "assets/patch-team.jpg" here.
  alt: "Patch team or cohort",        // Describe the real photo when you add it.
  caption: "Patch team or cohort"     // Handwritten caption under the photo.
}
```

Every photo currently has an empty `src`, so it appears as a labelled, taped-in cream or grey placeholder. Add your image files to `assets/` and set `src` to the relative file path. Images lazy-load. A missing image falls back to its labelled placeholder.

A section’s optional `bookLink` has `book` (the destination book’s `id`) and `text`. The Communities/Patch section links to Work History, and Software/Flood and river maps links to Water Projects.

Set `shelfPhoto.src` and `shelfPhoto.alt` to put your photo into the upper shelf’s empty frame. The trailing pothos and stained-glass picture are decorative. Your name is HTML in `index.html`.

## Files and artwork

`app.js` handles the reader, history, contents, keyboard, swipe, and sounds. `styles.css` contains base styles and 3D page animations; `room.css` styles the wallpaper, wooden shelves, aged bindings, objects, and scrapbook pages. Artwork provenance and prompts are in `ARTWORK.md`.

## Deploy

- Netlify: deploy this whole folder as the publish directory; leave the build command empty.
- GitHub Pages: put this folder’s contents at the root of your publishing branch or your chosen `/docs` source.
- All asset paths are relative and work in a project subdirectory.
- A raster social preview is included. Once your domain is known, use its absolute URL for `og:image` and `twitter:image` and add `og:url` and a canonical URL in `index.html`.

Google Fonts are optional; serif, sans-serif, and cursive fallbacks keep the site usable offline. Published with GitHub Pages from the main branch.

`details.css` adds the handwritten name, walnut shelf grain, bronze brackets, frame glass, and subtle stained-glass lighting. Its decorative SVGs total about 3.8 KB, with no additional raster images. The name uses Dancing Script from Google Fonts with a cursive fallback.

A smaller ninth book, About me, contains an editable personal introduction and photo placeholder in `content.js`. The plant artwork is trimmed so it clears the first book completely on desktop and phones.
