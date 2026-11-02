# edgepillar / personal index

A personal website inspired by the terminal aesthetic of [0x3639.com](https://0x3639.com/). The layout, wordmark, copy, and implementation are original. No code or media from the reference site is included.

The site uses plain HTML, CSS, JavaScript, and local SVG assets. It needs no package installation or build step. It sends no analytics or third-party asset requests and does not store cookies or browser preferences.

## Preview

With Node.js installed, run this command from the project directory:

```sh
node serve.mjs
```

Open the printed local URL. The server binds only to the loopback interface and serves an explicit list of public files. Set `PORT` if the default port is occupied.

## Content

- Edit the slogan, work links, and contact labels in `index.html`; the revealed email address is assembled in `script.js`.
- Edit colors and layout in `styles.css`.
- `script.js` adds the optional visual-effects toggle, clipboard actions, and email reveal. GitHub, X, project links, and navigation work without JavaScript.
- The `[ show email ]` button reveals the email address, its copy button, and the owner-supplied OpenPGP key search link. Email and OpenPGP links are created after that interaction. This is lightweight obfuscation that deters simple address harvesters; client-side code and public repository history do not keep the address secret or guarantee spam prevention.
- The OpenPGP link opens a keyserver search; no key or fingerprint is embedded or independently verified. No other person's contact information has been copied from the reference.
- Project descriptions were checked against their public repositories on 2026-11-02. The x402 project is an experiment; the Bitcoin document is a research draft. These labels do not imply production readiness.

## Deployment

Deployment target: [edgepillar.com](https://edgepillar.com/).

GitHub Pages publishes updates to `main` through `.github/workflows/pages.yml`. The workflow stages only `index.html`, `styles.css`, `script.js`, the two SVG assets, and an empty `.nojekyll` marker. Development files, documentation, preview images, and repository metadata are excluded from the deployed artifact. The official GitHub Actions are pinned to commit SHAs.

## Public sources

- [Public profile](https://github.com/edgepillar)
- [zenon-spv](https://github.com/edgepillar/zenon-spv)
- [zenon-x402-poc](https://github.com/edgepillar/zenon-x402-poc)
- [bitcoin-payments-zenon](https://github.com/edgepillar/bitcoin-payments-zenon)
