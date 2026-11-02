# HTTP error diagnostics

## Approval and scope

The user approved this local implementation on 2026-11-02 ("Hacelo") after
explicitly rejecting DNS changes. Implement structured, sanitized logging only.
The motivating Inagro execution lost the fetch cause; Docker logs subsequently
showed DNS timeouts for the Centum hostname during all three attempts.

Correction approved on 2026-11-02: the user explicitly required preserving the
existing debug functionality ("Deja esa parte como estba, no la modifiques").
Restore baseline debug helpers and calls exactly; technical diagnostics are additive.

## Impact

Estimated six files: two HTTP helper source files, one new offline test file,
README, CHANGELOG, and this plan. No existing automated tests are present.
Instrument apiRequest, apiGetRequest, apiPostRequest and apiPostRequestPaginated.
Standalone image, credential-test and dropdown requests are outside this patch.
Do not modify workflow outputs, exception semantics, network requests, retries,
DNS, dependencies, package version, credentials or server configuration.

## Implementation

1. Add bounded, explicit error/cause/AggregateError serialization and safe
   single-string JSON logging. Include request correlation, execution/node/item,
   method, origin and elapsed time. New `[Centum HTTP]` records never log URL paths/query/userinfo, credentials,
   request/response bodies, cookies, authorization headers or arbitrary error fields.
2. Log response status and allowlisted headers as soon as fetch resolves, before
   consuming the response. Distinguish no response, body read, HTTP and parse errors.
   Preserve native error codes; suppress API/body-derived free-text error messages.
3. Preserve all baseline `[Centum debug]` helpers, payloads and conditions, including
   enableDebugLogging, debugEndpointContains, includeRequestBody, response bodies and
   error-request-body logs. Preserve the original apiRequest error log as well.
   Add structured diagnostics alongside them: successful request/response records
   obey the existing switch/filter; failures remain visible with debug off.
   The new observer must not affect requests or exception handling if its logger
   fails. Do not change baseline debug logger behavior. Preserve outgoing requests
   and return values. Do not edit the debug UI or saved settings.
4. Add mocked Node test-runner tests; build, test and review without calling Centum.
5. Update documentation and changelog. Pause before any release/deployment.

## Validation

Use the existing Docker build image with source/test directories mounted read-only
(avoid copying the local .env into a new Docker image):

```sh
docker compose run --rm --no-deps \
  -v "$PWD/nodes:/app/nodes:ro" -v "$PWD/tests:/app/tests:ro" \
  build sh -lc 'rm -rf dist/* && pnpm exec tsc --incremental false && pnpm exec gulp build:icons && node --test tests/http-diagnostics.test.cjs'
```

Test DNS/timeout/nested aggregate causes, HTTP 200/400/500, binary/text body failures,
malformed JSON, debug off/filtering, concurrent request correlation, redaction,
bounded/cyclic errors, logger failure, original request/output/error compatibility
and no extra retries. Use only mocked fetch; no real API writes or reads.
Run targeted lint/format checks in Docker and git diff --check.
Separate legacy logs from structured records in test assertions. Add regressions
for the exact original debug payloads and gates across all four helpers, including
includeRequestBody on/off, response/error bodies, endpoint filter, item index,
pagination and arraybuffer handling. Apply new redaction/noninterference guarantees
only to the new observer, not to intentionally verbose baseline logging.

## Decisions Log

- Preserve the existing error string/output; diagnostics live in logs only.
- Do not infer DNS/TLS phases from a generic fetch error or invent HTTP status.
  Use request/body/http/parse phases and actual cause codes.
- Each request gets a correlation ID; do not claim an n8n retry-attempt count.
- No DNS changes, workflow changes, schema changes, live tests, publishing or package
  installation on the server are authorized by this patch. Commit and push were
  initially excluded; the user explicitly authorized them on 2026-11-02
  ("commitea y pushealo").
- User-directed correction: legacy debug behavior is unchanged, including body
  logging under its original conditions and existing header redaction. No new
  policy for legacy payload logging is introduced. Only new diagnostic records
  have the new bounded/redacted metadata guarantees.

## Status

Completed after reopening for the user-requested debug restoration. Six files overall;
the correction edits functions.ts, existing tests, README, CHANGELOG and this plan.
The new httpDiagnostics.ts observer stayed unchanged during the correction.
No files beyond the original six-file estimate were added.
Restoration is implemented. Regression-first run reproduced the removed debug
payloads; after restoring baseline helpers/calls, Docker build and all 77 mocked
tests pass. The whitespace-insensitive diff contains only additive observer wiring
and phase tracking, not debug changes. UI, output handling, version, dependencies
and infrastructure remain unchanged. Targeted ESLint, Prettier (new files and the
modified functions.ts range), and git diff --check pass.
Classification: non-trivial observability change with a compatibility correction;
std-requesting-code-review completed against the fixed baseline below. Independent
parallel read-only Standards and Spec reviews both approved with 0 findings. The
parent dispatched both code-review axes through the available general runner;
no findings remain open. std-finishing-a-development-branch closeout completed
with validation, documentation updates and this plan returned to completed.

Previous revision (superseded):
Initial regression run: 27 failed / 1 passed against the original implementation,
including discarded error metadata and unsafe payload logging.
Initial review: Standards clean; Spec identified URL-token leakage around quotes,
unguarded Unicode encoding in diagnostics initialization, and missing fallback logs.
All three implementation findings were reproduced and fixed in the same source/test
files; seven new regressions and stronger assertions cover them. No scope additions.
Previous validation: Docker TypeScript build + icons passed; 44 mocked tests passed;
targeted ESLint, Prettier and git diff --check passed. Independent parallel re-review
completed through std-requesting-code-review: Standards approved with 0 findings;
Spec approved with 0 findings. The parent dispatched both read-only review axes
directly because the initial reviewer had no child-agent runner.
Build environment: Node 20.20.2, pnpm 9.1.4,
n8n-workflow 1.82.0. This is local mocked validation, not a production engine test.
At local implementation closeout, no remote changes, publishing, version bump,
live calls, commits or pushes had been performed.
Fixed review baseline: fff4a76ff0b664e91ca0c2ec603ef2cf37e8ab7b.

Fresh reviews cover the corrected implementation. Git delivery to origin/main is
now authorized; no source changes were added after those reviews.
Release, installation on main/worker services and production verification are a
separate phase requiring explicit authorization. Pre-push Docker build, all 77
mocked tests, targeted lint/format checks and git diff --check were repeated and
passed. Changelog and README are current. The repository has no standard skills
lock/check scripts or pre-push quality hook; its local skills are checked for file
presence without changing or installing tooling. GitHub npm publication triggers
only on release creation; this delivery creates neither a tag nor a release.
