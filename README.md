# AI-Powered Portfolio Website

A polished single-page portfolio website with an interactive AI assistant experience.

## Run locally

Open [index.html](index.html) in your browser, or serve the folder with any static server.

Example:

```bash
python -m http.server 8000
```

Then open http://localhost:8000/

## Deploy the frontend to GitHub Pages

This frontend is ready to be deployed as a static site from GitHub Pages.

1. Push this repository to GitHub.
2. Open the repository Settings → Pages.
3. Select GitHub Actions as the deployment source.
4. The workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) will publish the site automatically.

Your site will be available at:

https://mehak692002.github.io/Portfolio/

## Deploy the backend

The AI assistant lives in [backend/app.py](backend/app.py) and should be hosted separately from GitHub Pages.

### Recommended option: Render

1. Create a free Render account.
2. Click New → Web Service.
3. Connect your GitHub repository.
4. Use these settings:
   - Root directory: backend
   - Build command: pip install -r requirements.txt
   - Start command: uvicorn app:app --host 0.0.0.0 --port $PORT
5. Add an environment variable named OPENAI_API_KEY if you want real OpenAI responses. Leave it empty to use the built-in fallback responses.
6. Deploy the service and copy the public URL.

### Point the frontend to the backend

After the backend is live, replace the placeholder URL in [index.html](index.html) with your Render URL:

```html
window.__PORTFOLIO_BACKEND_URL__ = "https://your-backend-url.onrender.com";
```

## Will the backend stay alive?

Not forever on a free plan. Free-tier services often sleep after inactivity, so the first request can take a few seconds to wake up.

To keep it reliable:

- Use a paid always-on plan if you want near-constant availability.
- Add an uptime monitor or cron ping to keep it warm.
- Keep the health endpoint enabled at /health for monitoring.

The backend health check is available at:

https://your-backend-url.onrender.com/health
