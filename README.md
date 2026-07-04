# AI-Powered Portfolio Website

A polished single-page portfolio website with an interactive AI assistant experience.

## Run locally

Open [index.html](index.html) in your browser, or serve the folder with any static server.

Example:

```bash
python -m http.server 8000
```

Then open http://localhost:8000/

## Deploy to GitHub Pages

This frontend is ready to be deployed as a static site from GitHub Pages.

1. Push this repository to GitHub.
2. Open the repository Settings → Pages.
3. Select GitHub Actions as the deployment source.
4. The workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) will publish the site automatically.

> The AI assistant backend in [backend/app.py](backend/app.py) is a separate Python service and is not hosted by GitHub Pages by default.
