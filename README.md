# Home

A browser-based 3D room planner built with React, Three.js, React Three Fiber and Vite. Designed for desktop and mobile; deployed through GitHub Pages.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

`npm test` runs data validation and geometry tests. `npm run build` creates the static production site in `dist`. `npm run preview` serves that build. For the browser smoke check, run the dev server, then `npx playwright install chromium` and `node smoke.mjs` (screenshots are written to `/workspace`).

## Design your room

- **Furniture:** add beds, desks, wardrobes, shelves, chairs, tables, rugs, plants, lamps and custom objects. Select and drag objects; use the inspector to enter exact dimensions, position, rotation and colour, replace a piece, duplicate it or remove it.
- **Room:** set width, depth, height, wall/floor colours, floor material and lighting. Set the wall, dimensions and centre offset for one door and one window. All measurements use metres. Door and window must occupy separate walls. Room size is 2–20 m; window and door dimensions adapt to the available wall space.
- **3D edit:** drag the background to orbit, scroll/pinch to zoom; drag furniture to move it. Snap rounds movement to 10 cm. Furniture positions are constrained to the room's rotated footprint; objects larger than the room can still extend beyond it.
- **Floor plan:** overhead view, drag pieces and pan/zoom. The edit view hides front and right walls; walkthrough renders all four walls. The door is an open doorway, without a hinged leaf.
- **Walkthrough:** WASD or arrow keys to move; drag to look. Mobile has directional buttons. Movement stays inside room boundaries but intentionally passes through furniture; this is a visual exploration tool, not a collision simulator.
- **Layouts:** save named snapshots, open them, compare two floor plans side by side, and export/import JSON. Ctrl/Cmd+Z undoes, Shift+Ctrl/Cmd+Z redoes; Delete removes selected furniture and Escape exits walkthrough/deselects.
- **Export:** JSON preserves editable data; the camera button downloads a PNG of the 3D view.

The starter bedroom is illustrative, **not a reconstruction of the owner's actual room**. Enter actual room and furniture measurements before using the planner for space planning. Photos/videos from previous chats are not included. Models are editable procedural furniture, not photorealistic scans. This version supports a rectangular room with one door and one window.

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
