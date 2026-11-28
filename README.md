# Open WebUI Documentation

Source for [docs.openwebui.com](https://docs.openwebui.com/), built with Docusaurus.

Use the Node.js version in [.node-version](.node-version), then run:

```bash
npm ci
npm start
```

Edit pages in `docs/`. Run `npm run build` to check the production build before submitting a pull request.

See the [contributing guide](docs/tutorials/contributing-tutorial.md) for more details.

## Translations

Simplified Chinese uses Docusaurus i18n with the `zh-Hans` locale. Start the localized development server with:

```bash
npm run start -- --locale zh-Hans
```

Keep translated documents at the same relative paths as their English sources. See the [translation maintenance guide](i18n/zh-Hans/README.md) for the directory layout, terminology, heading anchors, and validation steps.
