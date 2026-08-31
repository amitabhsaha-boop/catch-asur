# Srijonee Catch the Asur — Cloudflare version

This version fixes the v2 button/event handling and replaces browser-only leaderboard storage with a standalone Cloudflare D1 score database/API. It does not connect to the Srijonee member database.

## Deploy with Cloudflare Workers + Assets
1. Install Node.js and Wrangler: `npm install -g wrangler`
2. Log in: `wrangler login`
3. Create D1: `wrangler d1 create srijonee-game`
4. Copy the returned database ID into `wrangler.toml`.
5. Initialize schema: `wrangler d1 execute srijonee-game --remote --file=schema.sql`
6. Deploy: `wrangler deploy`

The Worker serves the game and `/api/scores` from the same domain, so there are no CORS issues.

## Custom domain
In Cloudflare dashboard, open Workers & Pages → your Worker → Settings/Domains & Routes and add a domain such as `play.srijonee.in`.

## Security note
This MVP accepts public score submissions. Before a public contest, add server-side anti-cheat/rate limiting and optionally a daily/seasonal leaderboard. Never store phone numbers or member IDs in this game database.

## Branding
The supplied Srijonee logo is used on the branded screens. `favicon.png` is derived from that logo, so the logo appears as the browser tab/site icon; the browser title is `🌺 Srijonee | Catch the Asur`.
