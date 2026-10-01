# MyAnchor

MyAnchor is a multilingual self-help application for anxiety education, guided
exercises, exposure challenges, moment logging, and AI-assisted reflections.
It is not a diagnostic or emergency-care service.

## Local development

Requirements:

- Node.js 24.19.0
- Corepack with Yarn 4.18.0
- PostgreSQL

```bash
corepack enable
yarn install --immutable
cp env.example .env.local
yarn db:migrate:deploy
yarn db:seed
yarn dev
```

Update `.env.local` with your local database and provider credentials. The
development master OTP works only when both `DEV_MASTER_OTP` and an address in
`DEV_MASTER_OTP_EMAILS` are configured, and it is disabled in production.

## Verify changes

```bash
yarn lint
yarn typecheck --incremental false
yarn test
yarn prisma:validate
yarn build
```

## Deploy on Railway

Use Railway's Railpack builder; this repository intentionally has no
Dockerfile. Configure the web service with:

- Build command: `yarn build`
- Pre-deploy command: `yarn release`
- Start command: `yarn start`
- Healthcheck path: `/health/ready`
- Restart policy: `On Failure`

Set `DATABASE_URL` from a Railway PostgreSQL service and configure the values
listed in `env.example`. In production, set `AUTH_URL` to the public HTTPS URL,
set `TRUST_PROXY_HEADERS=true`, and never configure the development master OTP.

Create a separate Railway cron service that runs `yarn maintenance:cleanup`
once per day. Enable scheduled PostgreSQL backups and point-in-time recovery,
and test a restore before relying on them.

Production schema changes must be committed as Prisma migrations. Railway runs
them through the pre-deploy command before switching the web deployment.

## Runtime checks

- `GET /health/live` verifies that the process is running.
- `GET /health/ready` verifies that the process can reach PostgreSQL.

The application emits structured JSON errors with request IDs. Logs must not
include health answers, AI prompts or results, OTP values, cookies, or secrets.

Before a public launch, have the privacy, consent, retention, crisis, and
therapeutic language reviewed by appropriate legal and clinical professionals.
