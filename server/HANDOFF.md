# LINE OA AI Server Handoff

## Scope

Built a minimal standalone Express + TypeScript application layer under `server/`.
It wires the existing read-only module at `../modules/line-oa-ai-module` via:

`../../modules/line-oa-ai-module/src/index.js`

No files under `modules/line-oa-ai-module/` were modified. No Supabase/shared runtime wiring was added.

## Files Created

- `server/package.json`
- `server/package-lock.json`
- `server/tsconfig.json`
- `server/.env.example`
- `server/src/config.ts`
- `server/src/app.ts`
- `server/src/index.ts`
- `server/tests/webhook.test.ts`
- `server/HANDOFF.md`

`npm install` also created `server/node_modules/` locally.

## Available NPM Scripts

- `npm run dev` - runs `tsx watch src/index.ts`
- `npm start` - runs `tsx src/index.ts`
- `npm run typecheck` - runs `tsc --noEmit`
- `npm test` - runs `vitest run`

## Runtime Config

Default port: `3002`

Required environment variables:

- `LINE_CHANNEL_ACCESS_TOKEN`
- `LINE_CHANNEL_SECRET`

Both values come from LINE Developers Console > Messaging API channel.

## Routes

- `GET /health` returns `{ "ok": true }`
- `POST /webhook/line` accepts raw request body, reads `x-line-signature`, calls `handleWebhook(rawBody, signature)`, returns:
  - `200 { "status": "OK", "processed": <number> }` when signature verification is valid
  - `401 { "error": <reason> }` when signature verification is invalid

## Verification

Install command:

```text
npm install
```

Result: passed. npm reported 5 audit vulnerabilities in the dependency tree: 3 moderate, 1 high, 1 critical. No automatic audit fix was run because that could change dependency versions outside the requested scope.

Typecheck command:

```text
npm run typecheck
```

Actual output:

```text
> typecheck
> tsc --noEmit
```

Result: passed.

Test command:

```text
npm test
```

Actual output:

```text
> test
> vitest run


 RUN  v2.1.9 D:/AI-Workspace/projects/saas-product-hub/products/line-oa-ai/server

 ✓ tests/webhook.test.ts (3 tests) 34ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  19:47:24
   Duration  654ms (transform 85ms, setup 0ms, collect 205ms, tests 34ms, environment 0ms, prepare 96ms)
```

Result: passed. Test count: 3 passed.
