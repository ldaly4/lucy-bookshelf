# Painted artwork

Generated with the built-in image-generation tool; optimized locally to WebP for the website. The originals remain in the generation library.

## Final assets

- `assets/aged-spine.webp`: 420-pixel-wide blank binding; each book colour comes from content.js.
- `assets/painted-keepsakes.webp`: 1200-pixel-wide transparent still life.
- `assets/wood-grain.svg`: editable procedural grain used on the shelves and frame.

All titles remain HTML and all books remain individual interactive buttons. The mobile binding texture rotates in CSS.

## Generation prompts

**Binding:** A tall, narrow, straight-on Victorian clothbound book spine, edge to edge, in desaturated grey-brown for CSS tinting. Century-old faded buckram with traces of leather, rounded spine, rubbed head and foot, frayed edges, exposed cardboard at corners, water stains and abrasion. Faded gold tooling only near the top and bottom; central 75 percent plain for HTML titles. Soft raking upper-left daylight. Realistic but lightly painted in gouache, matte tactile finish. No letters, numbers, labels, surrounding books or background.

**Shelf objects:** Three separate objects sharing a baseline: a leafy plant in weathered terracotta, a small worn wood and tarnished gold frame holding a painted river landscape, and a rounded sage ceramic jug with botanical decoration. Front-on, upper-left warm daylight, believable materials, chips, surface wear, subtle gouache and oil brushwork, muted earthy colours. Plant tallest; frame and jug lower. Transparent background, no wall, shelf, table, text or extra objects.

**Cutout refinement:** Remove all background and floor to genuine alpha transparency while preserving the plant, picture and jug, their paint textures, proportions, composition and baseline. Clean edges around all leaves, pot, frame, jug and handle; fully transparent areas around and between objects; no halo or atmospheric haze.

## Upper shelf revision

Built-in image-generation tool, then web-optimized locally:

- `assets/trailing-pothos.webp`: variegated pothos in weathered terracotta, pot near the top quarter of a tall canvas, long trailing leafy vines, softly realistic oil/gouache brushwork, warm upper-left daylight, completely transparent surroundings. A recognisable indoor houseplant, no hanging basket, wall, shelf or floor.
- `assets/stained-glass.webp`: small arched antique botanical panel on a tabletop brass easel, leaf and white flower motif in amber, ivory, bottle green and pale blue glass, tarnished rim and little feet, realistic gently painted texture, transparent surroundings, no text or backdrop.

The photo frame is HTML/CSS so Lucy’s actual photo can be inserted without regenerating artwork. Previous still-life artwork is retained but no longer displayed.

## Photographic walnut revision

`assets/natural-walnut.webp` was generated with the built-in image-generation tool and compressed for the web. Prompt: a wide 3:1, straight-on macro photograph of aged, matte, medium-brown walnut furniture wood, edge to edge, with irregular horizontal fibres, pores, small elongated knots, and natural colour variation. Soft diffuse daylight; no plank seams, perspective, objects, text, illustrated lines, shiny varnish, or oversaturated orange. CSS crops the material at its natural aspect ratio rather than stretching the grain to match the shelf.

## Shorter houseplant

`assets/trimmed-pothos.webp` was made with the built-in image-generation edit tool, referencing the previous plant. Prompt: preserve the lush variegated pothos crown, weathered terracotta pot, painted-realistic texture, colours and light; shorten both dangling vines to a natural little drape no more than half a pot-height beneath the pot, ending in small terminal leaves. Keep a fully transparent background with no shelf, wall, floor or haze. The original long-vine version is retained in assets.
