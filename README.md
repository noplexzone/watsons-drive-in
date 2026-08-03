# Watson’s Drive-In

Static first-version website for Watson’s Drive-In, a planned nostalgic 1950s-style drive-in theater near Magnolia, Arkansas.

## Current scope

- Static Cloudflare Pages-ready site.
- One-page anchor navigation.
- Placeholder movie listings and poster treatments.
- Ticket, concession, venue rules, events, sponsorship, employment, merch, and contact sections.
- Future-ready UI language for ticketing, QR check-in, and mobile concessions without pretending those systems are live.

## Run locally

```bash
npm run serve
```

Then open <http://127.0.0.1:4173>.

## Verify

```bash
npm run check
```

The check validates required files, required page sections, local data shape, and common public-site safety rules.

## Cloudflare Pages

For the current static version:

- Project name: `watsons-drive-in`
- Framework preset: None
- Build command: `npm run build`
- Output directory: `dist`
- Production branch: `main`
- Temporary custom domain target: `watsons-drive-in.noplexzone.com`

Use the temporary No Plex Zone subdomain until Watson’s Drive-In has its official domain.

### Cloudflare Pages dashboard settings

This is a static Pages site, not a Worker. Do **not** use `npx wrangler deploy`; that command deploys Workers and fails here with `Missing entry-point to Worker script or to assets directory`.

Use one of these configurations:

**Recommended Git-connected Pages setup:**

- Framework preset: None
- Build command: `npm run build`
- Build output directory: `dist`
- Deploy command: blank / Cloudflare default Pages asset upload

**If Cloudflare requires an explicit deploy command:**

- Deploy command: `npx wrangler pages deploy dist --project-name=watsons-drive-in`

## Current Cloudflare build failure note

If the build log says `Executing user deploy command`, remove that deploy command in Cloudflare Pages settings. The Git-connected Pages build already performs the deployment after the build command succeeds. A custom deploy command causes Wrangler to authenticate inside the build and may fail with Cloudflare API token permission errors.
