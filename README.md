# Pixel Art Converter

A lightweight, client-side tool that converts any image into pixel art directly in the browser — no uploads, no server, no dependencies.

## Features

- **Drag & drop or click to upload** any image format (`jpg`, `png`, `webp`, `gif`, …)
- **Adjustable block size** (2–64 px) via a live slider
- **Color / B&W mode** toggle — grayscale is applied at the pixel-data level and preserved in the downloaded file
- **Remove BG / Keep BG** toggle — removes near-white backgrounds before pixelating (threshold 230/255), useful for sprite reference images
- **Image info** — shows pixel dimensions and block count for both the original and the output
- **Checkerboard preview** on the output canvas — makes transparency visible
- **Download as PNG** — exports the exact pixelated canvas, including the active color mode
- Zero dependencies, zero build step — plain HTML + CSS + JS

## Usage

Open `index.html` through a local HTTP server (opening it directly as a `file://` URL may trigger OS default app association):

```bash
python -m http.server 8765
# then visit http://localhost:8765
```

## Project structure

```
pixel-art-converter/
├── index.html   # markup & favicon
├── style.css    # dark-theme styles
└── script.js    # pixelation logic, mode toggle, download
```
