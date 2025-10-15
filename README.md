# Draggable Dashboard

A ReactJS draggable/resizable dashboard using `react-grid-layout` with Edit/Save/Cancel
and persistence to `localStorage`.

- Build tool: Vite
- Routing: HashRouter (works well on GitHub Pages)
- Styling: Tailwind CSS
- CI/CD: GitHub Actions deploy to GitHub Pages

## Demo Link

Demmo domain: https://dd.fmit.sg

## Scripts
- `npm run dev` — local dev
- `npm run build` — production build
- `npm run preview` — preview prod build

## Deploy (GitHub Pages)
1. Push to `main`.
2. In GitHub → **Settings → Pages** → **Source: GitHub Actions**.
3. The workflow publishes to: `https://<username>.github.io/draggable-dashboard/`.
