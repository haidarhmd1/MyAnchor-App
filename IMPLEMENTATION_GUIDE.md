# MyAnchor Security and Railway Implementation Guide

This document explains what was changed in MyAnchor, why each change exists,
how the pieces work together, and what you must configure in Railway.

The goal is deliberately simple: keep the controls that protect users and
their sensitive data, while letting Railway handle hosting, builds, networking,
and deployments.

## 1. Resulting architecture

```text
Browser
  |
  v
Railway web service (Next.js application)
  |-- Auth.js email OTP (One-Time Password) sign-in
  |-- Application Programming Interface (API) routes
  |-- OpenAI and MailerSend calls
  |
  v
Railway PostgreSQL

GitHub push or pull request
  |
  v
CI (Continuous Integration) checks
  |
  v
Railway build -> database migration -> healthcheck -> new deployment
```

Railway is responsible for running the service. The application remains
responsible for authentication, authorization, consent, safe database writes,
data deletion, and avoiding sensitive information in logs.

## 2. What was intentionally removed

The following items were removed because they duplicated Railway or added
complexity without helping the current deployment:

- Google Cloud Platform infrastructure and OpenTofu files
- Cloud Run deployment workflows
- The production Dockerfile and Docker-specific deployment configuration
- Container signing, Software Bill of Materials generation, and image scanning
- Multiple deployment environments controlled through Google Cloud commands
- Extended incident runbooks and Service Level Objective documents
- Extra static-analysis workflows and unrelated formatting changes

There is intentionally no `railway.json`. Railway's older configuration-as-code
format is deprecated, and the small number of required settings are easier to
manage in the Railway dashboard.

The retained GitHub workflow performs only the checks that directly protect the
application from broken or unsafe releases.

## 3. Authentication and One-Time Password security

### Concept

OTP (One-Time Password) authentication sends a short-lived code to an email
address. A code must be unpredictable, expire quickly, tolerate only a small
number of guesses, and become unusable after one successful sign-in.

### Changes

- OTP codes are generated with Node.js cryptographic randomness rather than
  general-purpose pseudo-randomness.
- Every code is six decimal digits.
- The database stores a bcrypt hash of the code, not the original code.
- Codes expire after 10 minutes.
- A code permits at most five failed verification attempts.
- Successful verification atomically marks the code as consumed.
- Concurrent requests cannot successfully reuse the same code.
- Failed sign-ins are recorded without inventing a fake user identifier.
- MailerSend requests time out after 10 seconds.

"Atomic" means the database performs the important state change as one
indivisible operation. Two requests arriving at nearly the same time cannot
both consume the same code.

Relevant files:

- `src/lib/auth/otp.ts`
- `src/lib/auth/auth.ts`
- `src/app/api/auth/otp/request/route.ts`
- `prisma/migrations/20260925120000_allow_anonymous_signin_audit/migration.sql`

### Development master code

The optional development master OTP is disabled in production. In development,
it works only when both conditions are true:

1. `DEV_MASTER_OTP` contains the code.
2. The requested email is listed in `DEV_MASTER_OTP_EMAILS`.

Do not set either variable in Railway production.

## 4. Rate limiting

### Concept

Rate limiting restricts how often an operation may be performed during a time
window. It reduces automated guessing, email abuse, accidental loops, and
unexpected Artificial Intelligence (AI) provider costs.

The implementation uses a fixed-window counter stored in PostgreSQL. This is
simple and works across multiple application processes because all instances
share the same database.

### Current limits

| Operation                               |             Limit |
| --------------------------------------- | ----------------: |
| OTP requests per email                  |  5 per 15 minutes |
| OTP requests per trusted client address | 20 per 15 minutes |
| AI reasoning previews per user          | 20 per 10 minutes |
| AI anxiety-profile previews per user    | 10 per 10 minutes |

Client-address limiting is enabled only when `TRUST_PROXY_HEADERS=true`.
Forwarded address headers are unsafe if requests can reach the application
without passing through a trusted proxy that overwrites them. Railway provides
that proxy boundary, so production should set this variable to `true`.

Relevant file: `src/lib/rate-limit.ts`.

## 5. Authentication before AI calls

The AI routes now authenticate the user before calling OpenAI. This prevents an
anonymous caller from using paid model requests.

The request order is:

1. Authenticate the user.
2. Apply the per-user rate limit.
3. Validate the request body.
4. Record explicit health-data consent.
5. Call the model.
6. Validate and return the model response.

The handler logic is separated from the route export so it can be tested with
fake dependencies without calling OpenAI.

Relevant files:

- `src/app/api/reasoning/handler.ts`
- `src/app/api/anxietyProfile/handler.ts`
- `src/app/api/reasoning/route.ts`
- `src/app/api/anxietyProfile/route.ts`

## 6. Health-data consent and privacy

### Concept

Consent must be an affirmative user action. A preselected or silently assumed
value is not meaningful evidence that the user agreed.

### Changes

- Anxiety screening and moment logging require explicit checkboxes.
- Server validation requires the consent value to be literally `true`.
- Consent is stored with a policy name, policy version, user, and timestamp.
- Production fails safely if `PRIVACY_POLICY_VERSION` is missing.
- The profile page lets the user withdraw active health-data consent.
- Withdrawing consent records `withdrawnAt`; it does not silently delete the
  user's existing records.
- A later AI or health-data submission requires consent again.
- Consent text exists in English, German, Arabic, and Lebanese Arabic.

Relevant files:

- `src/lib/consent.ts`
- `src/app/api/consent/health-data/route.ts`
- `src/components/HealthDataConsent/HealthDataConsent.tsx`
- `messages/en.json`, `messages/de.json`, `messages/ar.json`, and
  `messages/ar-LB.json`

Existing legacy `privacy_policy` rows should not automatically be treated as
proof of explicit health-data consent. Review those records before relying on
them for legal or compliance decisions.

## 7. Account deletion

The account deletion endpoint now performs a hard deletion inside a database
transaction.

It deletes:

- OTP records for the email
- Email delivery logs for the email
- Sign-in audit records for the email
- The user row
- User-owned records connected through cascading database relationships

A database transaction means either the complete deletion succeeds or the
database rolls the operation back. It avoids leaving a partly deleted account.

Relevant file: `src/app/api/account/route.ts`.

## 8. Idempotent writes

### Concept

Idempotency means that retrying the same write request does not create a second
record or apply the same outcome twice. It is useful when a connection drops
after the server completed a request but before the browser received the
response.

The browser adds an `Idempotency-Key` header containing a UUID (Universally
Unique Identifier) to important write requests. If the same user, route, and
key are received again, the server returns the stored response rather than
repeating the write.

The server retains these records for 24 hours. Stored responses are deliberately
small—for example, only the new record identifier—so the idempotency table does
not become another copy of sensitive health data.

Idempotency is applied to:

- Creating an exposure challenge
- Saving a challenge outcome
- Saving a moment log
- Saving an anxiety profile

Relevant files:

- `src/lib/idempotency.ts`
- `src/lib/api.ts`
- `prisma/migrations/20260925150000_add_idempotency_records/migration.sql`

## 9. Safe errors and structured logging

### Concept

Structured logging writes one JSON (JavaScript Object Notation) object per log
line. Railway can search fields such as `level`, `event`, and `requestId`
without trying to interpret free-form sentences.

Production error responses now return:

- A stable, non-sensitive message
- The correct status code
- A request identifier that can be matched to a server log

Unexpected provider messages and stack details are not returned to the user.
Production logs include the error type and optional error code, but not the
error message. Development may include the message to make local debugging
practical.

Never add the following to log context:

- OTP values
- Cookies or session tokens
- Health answers, AI prompts, or AI results
- Email, OpenAI, push, or database credentials

Relevant files:

- `src/lib/api-errors.ts`
- `src/lib/logger.ts`

## 10. Provider timeouts and retry limits

External services can become slow or unavailable. Waiting forever would hold
application resources and cause requests to pile up.

Current boundaries:

- MailerSend email request timeout: 10 seconds
- OpenAI request timeout: 20 seconds
- OpenAI automatic retries: one
- Database readiness timeout: 1.5 seconds

The OpenAI client is created lazily. This means importing application code for
tests or build analysis does not require a live OpenAI credential.

Relevant file: `src/lib/ai/openai.ts`.

## 11. Database connection limits

The PostgreSQL connection pool now has explicit defaults:

| Variable                      | Default | Meaning                                              |
| ----------------------------- | ------: | ---------------------------------------------------- |
| `DATABASE_POOL_MAX`           |       5 | Maximum database connections per application process |
| `DATABASE_CONNECT_TIMEOUT_MS` |    5000 | Maximum connection wait in milliseconds              |
| `DATABASE_IDLE_TIMEOUT_MS`    |   30000 | How long an unused connection remains open           |

Explicit limits protect PostgreSQL from an unexpectedly large number of
connections when the application restarts or scales.

Relevant file: `lib/prisma.ts`.

## 12. Healthchecks

### Concept

A healthcheck is a small endpoint used by a hosting platform or monitoring
service to decide whether an application can receive traffic.

- `GET /health/live` confirms that the Next.js process can answer requests.
- `GET /health/ready` performs a small `SELECT 1` query and confirms that the
  application can reach PostgreSQL.

Railway should use `/health/ready`. A deployment that cannot reach its database
should not replace the currently working deployment.

Railway's deployment healthcheck is not continuous uptime monitoring. It gates
new deployments. An external uptime monitor can call `/health/live` if
continuous availability checks are needed.

Relevant files:

- `src/app/health/live/route.ts`
- `src/app/health/ready/route.ts`

## 13. Security-related response headers

The application adds browser security headers in `next.config.ts`:

- `X-Content-Type-Options` prevents browsers from guessing a different content
  type.
- `X-Frame-Options` prevents the application from being embedded in a frame.
- `Referrer-Policy` limits address information sent to other sites.
- `Permissions-Policy` disables camera, microphone, and location access because
  the application does not need them.
- `Strict-Transport-Security` tells production browsers to prefer encrypted
  connections.
- CSP (Content Security Policy) restricts where scripts, styles, images,
  connections, workers, and other resources may come from.

The current CSP permits inline scripts and styles for compatibility with the
application stack. It is still useful, but it is not the strictest possible
policy and should not be described as complete protection from browser attacks.

The service worker is served with no-cache headers so browsers can receive
updates promptly.

## 14. Web push configuration

VAPID (Voluntary Application Server Identification) identifies the application
server to browser push services.

The public VAPID key is now fetched from an authenticated runtime endpoint
rather than embedded at build time. The private key remains a Railway secret.
This lets the same source build work across environments without rebuilding it
for a different public key.

Push failures record only bounded status information. Expired subscriptions are
removed, and logs do not include push endpoints or private keys.

Relevant files:

- `src/app/api/push/public-key/route.ts`
- `src/hooks/usePushSubscription.ts`
- `src/lib/push/web-push.ts`

## 15. Retention cleanup

### Concept

Data retention means keeping information only for a defined period. Operational
records should not accumulate indefinitely when they are no longer needed.

The cleanup command is:

```bash
yarn maintenance:cleanup
```

Default retention:

| Data                            |                  Default retention |
| ------------------------------- | ---------------------------------: |
| Expired or consumed OTP records |                              1 day |
| Rate-limit counters             |                              1 day |
| Email delivery logs             |                            90 days |
| Sign-in audit records           |                           365 days |
| Expired idempotency records     | Deleted after their 24-hour expiry |

This job deliberately does not automatically delete moment logs, anxiety
profiles, or challenges. Those user records remain under explicit user control.

Create a separate Railway cron service that runs this command once per day. A
cron service is a process that starts on a schedule, performs a task, and exits.

Relevant file: `scripts/cleanup-retention.ts`.

## 16. Safer offline behavior and fonts

The offline page provides a small grounding exercise without claiming that
private or authenticated data remains available offline. It also includes an
emergency-services caveat.

Google's remotely downloaded build-time font was removed. The application uses
a system-font fallback, which avoids making a network request during a build and
reduces one external build dependency.

Relevant files:

- `public/offline.html`
- `src/app/[locale]/layout.tsx`
- `src/app/globals.css`

## 17. Dependency updates

Security-audited packages were upgraded and pinned where appropriate. Important
versions include:

- Next.js 16.3.6
- Auth.js adapter 2.11.3
- NextAuth 5.0.0 beta 32
- Prisma 7.10.0
- Axios 1.20.0
- Tailwind PostCSS package 4.3.3
- Minimatch 10.2.6
- Node.js 24.19.0
- Yarn 4.18.0

Several transitive dependency resolutions are present in `package.json` to
avoid known high-severity advisories in indirect packages. A transitive
dependency is a package used by another package rather than imported directly
by this application.

The last dependency audit returned no suggestions. This is a point-in-time
result, so the audit remains part of every CI run.

## 18. CI (Continuous Integration)

### Concept

CI (Continuous Integration) automatically checks each proposed change before
it is accepted or deployed. Its purpose is to catch broken code, incompatible
database migrations, and known vulnerable dependencies consistently rather
than relying on someone to remember every command.

The workflow runs for pull requests and pushes to `main`. It performs these
steps:

1. Starts a temporary PostgreSQL 17 database.
2. Installs the exact dependency versions from `yarn.lock`.
3. Runs ESLint to find suspicious or invalid code patterns.
4. Runs the TypeScript compiler without producing files to validate types.
5. Runs the focused security tests.
6. Validates the Prisma schema.
7. Replays every migration into the empty temporary database.
8. Creates an optimized production build.
9. Fails if Yarn reports a high-severity dependency advisory.

Relevant file: `.github/workflows/ci.yml`.

### Current focused tests

The test suite verifies that:

- Generated OTP values are cryptographically generated six-digit numbers.
- Anonymous reasoning requests never reach the AI model.
- Anonymous anxiety-profile requests never reach the AI model.
- Missing explicit health-data consent stops the request before the AI call.

Relevant file: `tests/security-boundaries.test.ts`.

These tests cover the most important security boundaries, but they are not a
complete application test suite. New business-critical behavior should receive
new tests as it is added.

## 19. Railway configuration

Use Railway's Railpack builder. Railpack detects Node.js, Yarn, and Next.js,
installs dependencies, builds the application, and packages the runtime.

Configure the Railway web service as follows:

| Setting            | Value           | Purpose                                             |
| ------------------ | --------------- | --------------------------------------------------- |
| Builder            | Railpack        | Builds the Node.js application without a Dockerfile |
| Build command      | `yarn build`    | Generates Prisma Client and builds Next.js          |
| Pre-deploy command | `yarn release`  | Applies committed database migrations               |
| Start command      | `yarn start`    | Starts the production Next.js server                |
| Healthcheck path   | `/health/ready` | Blocks a release that cannot reach PostgreSQL       |
| Restart policy     | `On Failure`    | Restarts a process that exits because of an error   |

Railway injects the `PORT` variable. Next.js reads it automatically.

Official references:

- [Railway Railpack](https://docs.railway.com/builds/railpack)
- [Railway pre-deploy commands](https://docs.railway.com/deployments/pre-deploy-command)
- [Railway healthchecks](https://docs.railway.com/deployments/healthchecks)
- [Railway restart policies](https://docs.railway.com/deployments/restart-policy)

## 20. Railway environment variables

Use Railway variables for configuration and secrets. Do not commit real values
to the repository.

### Required production variables

| Variable                 | Secret? | Purpose                                                                     |
| ------------------------ | ------- | --------------------------------------------------------------------------- |
| `DATABASE_URL`           | Yes     | PostgreSQL connection string; reference the Railway PostgreSQL service      |
| `AUTH_SECRET`            | Yes     | Signs and protects authentication state                                     |
| `AUTH_URL`               | No      | Public encrypted application address, such as `https://app.example.com`     |
| `MAILERSEND_API_KEY`     | Yes     | Authorizes email delivery                                                   |
| `EMAIL_FROM`             | No      | Verified sender email address                                               |
| `OPENAI_API_KEY`         | Yes     | Authorizes OpenAI requests                                                  |
| `PRIVACY_POLICY_VERSION` | No      | Version recorded with new consent                                           |
| `VAPID_PUBLIC_KEY`       | No      | Browser push public key                                                     |
| `VAPID_PRIVATE_KEY`      | Yes     | Browser push private key                                                    |
| `VAPID_SUBJECT`          | No      | Push contact address, normally a `mailto:` value                            |
| `TRUST_PROXY_HEADERS`    | No      | Set to `true` on Railway so trusted forwarded addresses can be rate-limited |

`EMAIL_FROM_NAME`, database pool variables, and retention variables have useful
defaults but may be set explicitly. See `env.example` for the complete list.

Generate a strong `AUTH_SECRET` locally with:

```bash
openssl rand -base64 32
```

Generate VAPID keys locally with:

```bash
npx web-push generate-vapid-keys
```

Never expose `AUTH_SECRET`, `DATABASE_URL`, `MAILERSEND_API_KEY`,
`OPENAI_API_KEY`, or `VAPID_PRIVATE_KEY` in browser code or logs.

## 21. Deployment lifecycle

```text
1. Push code to GitHub
2. CI (Continuous Integration) validates the change
3. Railway builds the commit with Railpack
4. Railway runs `yarn release`
5. Prisma applies pending migrations
6. Railway starts `yarn start`
7. Railway calls `/health/ready`
8. Railway activates the deployment only after a successful response
```

If the migration command fails, the deployment must stop. If the healthcheck
fails, the new version must not receive traffic.

Before an important schema deployment, take a database backup. Application
rollback does not automatically reverse a database migration.

## 22. Prisma migrations

Prisma is the ORM (Object-Relational Mapper). An ORM maps TypeScript operations
to database tables and SQL (Structured Query Language) statements.

Two new migrations were added:

1. `20260925120000_allow_anonymous_signin_audit` allows failed sign-in audit
   rows to exist before a user account exists.
2. `20260925150000_add_idempotency_records` adds the table used to prevent
   duplicate writes.

Create a migration during development with:

```bash
yarn db:migrate:dev
```

Apply committed migrations without creating new ones with:

```bash
yarn release
```

Never edit a migration that has already been applied to a shared or production
database. Create a new migration for the correction.

## 23. Railway backups and recovery

Railway's PostgreSQL template is hosted for you, but database backup and
recovery settings remain your responsibility.

For production:

1. Enable scheduled volume backups.
2. Enable PITR (Point-In-Time Recovery) if available for your plan.
3. Take a logical `pg_dump` backup before risky migrations.
4. Test restoring a backup into an isolated service.

PITR (Point-In-Time Recovery) replays database history to restore the database
to a selected moment rather than only to the time of a daily snapshot.

A backup is not proven until a restore has been tested.

Official reference:
[Railway PostgreSQL backup and restore guide](https://docs.railway.com/guides/postgres-backups-restores).

## 24. Local verification commands

Run these before pushing a substantial change:

```bash
yarn install --immutable
yarn lint
yarn typecheck --incremental false
yarn test
yarn prisma:validate
yarn build
```

What they mean:

- `yarn install --immutable` installs exactly what the lockfile declares and
  fails if `package.json` and `yarn.lock` disagree.
- `yarn lint` checks source-code rules.
- `yarn typecheck --incremental false` checks TypeScript types from a clean
  state.
- `yarn test` runs automated security-boundary tests.
- `yarn prisma:validate` checks the database schema configuration.
- `yarn build` creates the same type of optimized build Railway will run.

## 25. Routine operating checklist

### For every normal deployment

1. Confirm CI (Continuous Integration) is green.
2. Check that the Railway pre-deploy migration completed.
3. Confirm `/health/ready` returns status `200`.
4. Test email sign-in.
5. Review Railway logs for new error events without exposing user data.

### Monthly

1. Review dependency audit results.
2. Confirm the retention cron service is completing.
3. Confirm database backups are recent.
4. Review unusual OTP failures and AI rate-limit events.

### Before a risky migration

1. Take a backup.
2. Review the generated SQL.
3. Prefer additive changes before removing old columns.
4. Deploy application code compatible with both the old and new schema when
   possible.
5. Test the rollback path.

## 26. What is not automated

The repository cannot perform these account-level or professional tasks:

- Creating Railway services or changing Railway dashboard settings
- Adding real Railway secret values
- Enabling PostgreSQL backups and PITR (Point-In-Time Recovery)
- Creating the scheduled cleanup service
- Testing a real backup restoration
- Reviewing historical consent records
- Legal review of privacy, retention, and consent
- Clinical review of therapeutic and crisis language
- Continuous external uptime monitoring

These are deployment-owner responsibilities.

## 27. Key file map

| Area                        | Main files                                                                  |
| --------------------------- | --------------------------------------------------------------------------- |
| Railway setup               | `README.md`, `env.example`                                                  |
| CI (Continuous Integration) | `.github/workflows/ci.yml`                                                  |
| Authentication              | `src/lib/auth/auth.ts`, `src/lib/auth/otp.ts`                               |
| Rate limiting               | `src/lib/rate-limit.ts`                                                     |
| Consent                     | `src/lib/consent.ts`, `src/app/api/consent/health-data/route.ts`            |
| Idempotency                 | `src/lib/idempotency.ts`, `src/lib/api.ts`                                  |
| Error handling              | `src/lib/api-errors.ts`, `src/lib/logger.ts`                                |
| AI routes                   | `src/app/api/reasoning/handler.ts`, `src/app/api/anxietyProfile/handler.ts` |
| Database schema             | `prisma/schema.prisma`, `prisma/migrations/`                                |
| Database connection         | `lib/prisma.ts`                                                             |
| Retention                   | `scripts/cleanup-retention.ts`                                              |
| Healthchecks                | `src/app/health/live/route.ts`, `src/app/health/ready/route.ts`             |
| Security tests              | `tests/security-boundaries.test.ts`                                         |
| Browser headers             | `next.config.ts`                                                            |
| Push notifications          | `src/lib/push/web-push.ts`, `src/hooks/usePushSubscription.ts`              |

## 28. Short glossary

| Term                                                | Meaning                                                              |
| --------------------------------------------------- | -------------------------------------------------------------------- |
| AI (Artificial Intelligence)                        | The external model used to generate support and profile text         |
| API (Application Programming Interface)             | A server endpoint used by the browser or another service             |
| CI (Continuous Integration)                         | Automated validation of code changes                                 |
| CSP (Content Security Policy)                       | A browser rule limiting where page resources can come from           |
| Healthcheck                                         | An endpoint that reports whether a process or dependency is ready    |
| Idempotency                                         | Safely receiving the same write request more than once               |
| JSON (JavaScript Object Notation)                   | A structured text format used by APIs and logs                       |
| ORM (Object-Relational Mapper)                      | A library mapping application objects to database operations         |
| OTP (One-Time Password)                             | A temporary sign-in code intended for one successful use             |
| PITR (Point-In-Time Recovery)                       | Restoring a database to a selected historical moment                 |
| Rate limiting                                       | Restricting how often an action can be performed                     |
| Transaction                                         | A group of database changes that succeed or fail together            |
| UUID (Universally Unique Identifier)                | A randomly generated identifier with an extremely low collision risk |
| VAPID (Voluntary Application Server Identification) | Keys identifying a web-push sender                                   |

## 29. Final principle

Railway reduces infrastructure work; it does not replace application security.
The retained controls are the small, practical set needed to protect sign-in,
sensitive health-related data, database consistency, paid provider access, and
safe deployments without introducing a second cloud platform or a complex
container release system.
