# Nexcode — step 1

Goal of this step: prove that two people can edit the same file live,
with cursors and presence, before building anything else (auth, teams,
review workflow, dashboard).

## What's here
- `app/page.js` — a Monaco editor bound to a shared Yjs document.
- `server/sync-server.js` — the relay server that passes CRDT updates
  between everyone editing the same "room" (a room = one file for now).

## Run it

Install dependencies:

```bash
npm install
```

Start the sync server in one terminal:

```bash
npm run sync-server
```

Start the Next.js app in another terminal:

```bash
npm run dev
```

Open http://localhost:3000 in two different browser tabs (or one normal
+ one incognito window, so they get different awareness colors). Type
in one tab — it should appear in the other within a fraction of a
second, and you'll see both people's colored avatar in the top bar.

## What this does NOT have yet (on purpose)
- No login / auth — everyone who opens the URL joins the same room.
- No file tree, multiple files, or projects — one hardcoded document.
- No roles (view / edit / admin) — anyone can edit.
- No review workflow (the blue/green/red pending-line states).
- No database — nothing is saved if the sync server restarts.

That's deliberate. This step is only about validating the real-time
editing feel. Once this feels good, the next steps in order are:

1. **Roles** — make the WebsocketProvider connection read-only for
   "view" role users (Monaco supports a readOnly option; the awareness
   layer already tells you who's who).
2. **Review layer** — track text ranges by author + status
   (pending/accepted/rejected) as Monaco decorations, driven by a
   small piece of shared state in the same Yjs doc.
3. **Projects & files** — swap the single hardcoded room for a real
   file tree, one Yjs doc per file.
4. **Persistence** — snapshot Yjs docs into Postgres periodically (or
   on disconnect) so content survives a server restart.
5. **Auth + teams dashboard** — wrap the editor in the Next.js
   dashboard shell with login, team creation, and email invites.

## Note on ports
The sync server runs on `ws://localhost:1234` — separate from the
Next.js dev server on `:3000` — because WebSocket relays like this
don't run well inside serverless/Next API routes. In production
you'd deploy these as two separate services (e.g. Next app on Vercel,
sync server on Railway/Fly.io).



npm run sync-server