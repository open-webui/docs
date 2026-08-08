# Open WebUI Docs Search Worker

This Worker serves `https://docs.openwebui.com/api/search?q=...`.

Do not route `/search*` to this Worker. Docusaurus uses `/search-doc-*.json`
for the built-in search index.

The Worker is deployed by the `deploy-worker` job in
`.github/workflows/gh-pages.yml`, which runs only after the GitHub Pages deploy
has finished. That ordering matters: the Worker answers against
`https://docs.openwebui.com/search-corpus.json`, which the Pages build produces,
so deploying the Worker first would point it at the previous corpus.

Two repository secrets are required:

- `CLOUDFLARE_API_TOKEN`, scoped to edit Workers on the `openwebui.com` account
- `CLOUDFLARE_ACCOUNT_ID`

**Turn off Cloudflare's own build trigger.** If the Worker is also connected to
this repository under **Settings > Builds** in the Cloudflare dashboard,
Cloudflare starts its own deploy on every push to `main`, independently of
GitHub Actions and with no ordering against the Pages build. Disconnect that
integration, or the two deploy paths race and the ordering above buys nothing.
