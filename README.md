# Haochen Liu · 刘昊琛 — Academic homepage

Responsive English / Chinese academic homepage, prepared for `https://LHappyCureall.github.io/`.

## Preview

From this directory run:

```sh
python -m http.server 4188 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:4188/`. The page can also be opened directly from `dist/index.html`; no build or package installation is required.

## GitHub Pages

1. Create the public repository `LHappyCureall/LHappyCureall.github.io` without initial files.
2. Push this project to its `main` branch.
3. Under **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
4. Run **Actions → Deploy personal homepage → Run workflow** if the first push occurred before Pages was enabled.
5. A successful deployment serves `https://LHappyCureall.github.io/`.

The included workflow publishes only `dist/`. Future commits changing that directory redeploy the site. It uses GitHub's built-in token; no personal access token or external account is required.

## Content and editing

- `dist/index.html`: bilingual biography and section content. English uses `lang="en"`; Chinese uses `lang="zh-CN"`.
- `dist/styles.css`: responsive layout, print styles, colors and typography.
- `dist/script.js`: language preference, active section navigation and opt-in simulation animations.
- `dist/assets/`: locally served research illustrations and favicon.

Identity confirmed by the owner: 刘昊琛 / HAOCHEN LIU, PhD student, Faculty of Science, University of Macau. Education, publication status, teaching link and portrait were supplied in the owner's CV. Research descriptions, software tools and simulation assets also use the owner's existing public GitHub profile. The numerical scaling figures retain the experimental conditions reported there. The academic email follows the more recent CV: `yc37477@um.edu.mo`.

The page lists four published journal articles and one submitted manuscript; these categories must remain distinct. Published metadata and DOI links were checked against the journal pages where available. No awards, service roles or supervisor have been invented. No phone number, residential address, birth date or political affiliation is included. The original CV file is not part of the website or repository.

The two-column structure and language switch were inspired by https://cyhwswswws.github.io/. All page code and personal text here are newly written for Haochen Liu; the reference person's portrait, biography and publication list are not reused.

## Bibliographic sources

- JCP (2025): https://doi.org/10.1016/j.jcp.2025.113980 — metadata verified via Crossref's DOI record.
- DCDS-B (2023): https://www.aimsciences.org/article/doi/10.3934/dcdsb.2023064
- JAAC (2023): https://www.jaac-online.com/article/doi/10.11948/20220258
- IJNAM (2023): https://www.global-sci.com/ijnam/article/view/10543

GitHub Pages workflow follows https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages .
