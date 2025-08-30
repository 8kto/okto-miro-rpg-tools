# Okto Miro RPG Tools

**Okto Miro RPG Tools** is a free plugin for [Miro](https://miro.com/) designed to enhance role-playing game (RPG)
sessions. Uses [ttrpg-lib-dice](https://github.com/8kto/ttrpg-lib-dice) library to roll dice. 

## Features

- Drag-and-drop RPG tokens
- Dice roller
- Phased combat tracker

## Development

- Run app locally with `yarn dev`. 
- Add an extension to the Miro board pointing to the local machine.
- Open your Miro board.
- Go to the Miro marketplace and search for "Okto Miro RPG Tools."
- Click on the plugin and hit "Install" to add it to your board.
- Pin the app icon to the toolbar.

## Production Build

```bash
yarn build
# outputs static files to ./dist
```

Serve `dist/` via any static host (Nginx/Apache/Netlify/etc.). Example domain: `https://tools.example.org/`.
In Miro, set **sdkUri** to your production HTTPS URL.

---

## Deploy to a Server (built-in script)

Create `.env.development.local`:

```dotenv
DEPLOY_SSH_HOST=deploy@tools.example.org:/var/www/okto-miro/
DEPLOY_SSH_PORT=22
```

Run:

```bash
# main branch → production; other branches → beta path
yarn deploy
```

What it does (conceptually):

* Builds the app (`yarn build`).
* Stages `dist` files to `/tmp/TMP_DIR`.
* `scp` uploads `dist/` to the remote target.
* If not on `main`, it targets a `/beta/` path on the same host.

---

## Hosting Notes

* Static hosting only (no server rendering).
* If you publish to a subpath like `/beta/`, ensure your bundle’s **public path** is set accordingly so assets resolve from `/beta/`.
* Keep the site on **HTTPS**; Miro requires it for `sdkUri`.

## Usage

Once installed, you can access Okto Miro RPG Tools via the Miro app sidebar.

## Images and Tokens

Put your tokens in `src/images/tokens` to make them appear in the Token Gallery.

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License** (CC BY-NC
4.0). You are free to use and modify this plugin for non-commercial purposes, but commercial use is prohibited without
the author's consent.

For full license details, see the [LICENSE.md](./LICENSE.md) file.

## Contribution

Contributions are welcome! Please feel free to submit pull requests, open issues, or suggest features.
