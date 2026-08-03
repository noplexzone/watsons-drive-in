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
- Build command: blank
- Output directory: `/`
- Production branch: `main`
- Temporary custom domain target: `watsons-drive-in.noplexzone.com`

Use the temporary No Plex Zone subdomain until Watson’s Drive-In has its official domain.

### Cloudflare Pages dashboard settings

This is a static Pages site, not a Worker. Do **not** use `npx wrangler deploy`; that command deploys Workers and fails here with `Missing entry-point to Worker script or to assets directory`.

Use one of these configurations:

**Recommended Git-connected Pages setup:**

- Framework preset: None
- Build command: `exit 0` or blank
- Build output directory: `/`
- Deploy command: blank / Cloudflare default Pages asset upload

**If Cloudflare requires an explicit deploy command:**

- Deploy command: `npx wrangler pages deploy . --project-name=watsons-drive-in`
