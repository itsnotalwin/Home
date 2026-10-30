# Home

A browser-based 3D room planner built with React, Three.js, React Three Fiber and Vite. Designed for desktop and mobile; deployed through GitHub Pages.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

`npm test` runs data validation and geometry tests. `npm run build` creates the static production site in `dist`. `npm run preview` serves that build. For the browser smoke check, run the dev server, then `npx playwright install chromium` and `node smoke.mjs`. Run `node photo-smoke.mjs` to check photo-reference loading, backups, undo/redo and mobile controls (screenshots are written to `/workspace`).

## Design your room

- **Furniture:** add beds, desks, wardrobes, shelves, chairs, tables, rugs, plants, lamps and custom objects. Select and drag objects; use the inspector to enter exact dimensions, position, rotation and colour, replace a piece, duplicate it or remove it.
- **Room:** set width, depth, height, wall/floor colours, floor material and lighting. Set the wall, dimensions and centre offset for one door and an optional window. All measurements use metres. Door and window must occupy separate walls. Room size is 2–20 m; window and door dimensions adapt to the available wall space.
- **3D edit:** drag the background to orbit, scroll/pinch to zoom; drag furniture to move it. Snap rounds movement to 10 cm. Furniture positions are constrained to the room's rotated footprint; objects larger than the room can still extend beyond it.
- **Floor plan:** overhead view, drag pieces and pan/zoom. The edit view hides front and right walls; walkthrough renders all four walls. The door can be displayed as an open doorway or a closed decorative leaf. Its swing is not simulated.
- **Walkthrough:** WASD or arrow keys to move; drag to look. Mobile has directional buttons. Movement stays inside room boundaries but intentionally passes through furniture; this is a visual exploration tool, not a collision simulator.
- **Layouts:** save named snapshots, open them, compare two floor plans side by side, and export/import JSON. Ctrl/Cmd+Z undoes, Shift+Ctrl/Cmd+Z redoes; Delete removes selected furniture and Escape exits walkthrough/deselects.
- **Export:** JSON preserves editable data; the camera button downloads a PNG of the 3D view.

The starter bedroom is illustrative. **Room → Load photo reference** loads a separate reconstruction based on the two supplied bedroom photos and automatically saves a backup of the current layout first. The current scene can also be recovered using Undo. Earlier layouts and exports remain compatible.

The reference uses the visible annotations: **2.45 m** floor-to-ceiling, **3.83 m** wall span (used as room depth), and **1.59 m wide × 1.99 m high** wardrobe. The owner identified the visible white surface as the wardrobe's back; the wardrobe faces away from the bed. It also includes a grey divan bed, cream walls, beige tiled floor, brown closed door and dark skirting. A window is hidden because its position is not established by these photos; it can be enabled in Room settings.

**Explicit placeholders:** 3.00 m room width, 0.55 m wardrobe depth, 1.37 × 1.88 m bed footprint, 0.80 × 2.05 m door, 0.50 m floor tiles, and all furniture/opening positions. Colours are visual approximations. These are not surveyed dimensions. The reference card and scene caption identify the uncertainty; measurements and pieces remain editable. The source photos are not bundled in the public app. Models are editable procedural furniture, not photorealistic scans. This version supports a rectangular room with one door and an optional window.

## Storage and privacy

Your current layout and saved snapshots live in this browser's local storage. They are not uploaded to a server and do not sync across devices. Export JSON regularly and before clearing browser data. Import rejects malformed layouts. There is no login or backend. Fonts load from Google Fonts, with local sans-serif fallbacks. WebGL is required for the 3D viewport.

## Publish

The included `.github/workflows/pages.yml` tests, builds and deploys on pushes to `main`. In GitHub **Settings → Pages → Build and deployment**, choose **GitHub Actions**. The Vite relative asset base supports `https://itsnotalwin.github.io/Home/` as well as other static hosts. No secrets are needed for the app.

## Implementation

- `src/model.js`: furniture catalogue, initial scene, import validation, boundary constraints.
- `src/Scene.jsx`: procedural furniture/room geometry, cameras, shadows, dragging and walkthrough.
- `src/main.jsx`: responsive editor, history, inspector, persistence, export/import and comparison.
- `src/style.css`: responsive interface.

Undo history is limited to 50 edits per session; saved snapshot deletion does not enter room undo history. JSON export is the portable backup format.
