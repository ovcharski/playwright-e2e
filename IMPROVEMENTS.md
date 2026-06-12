# Improvements

This document tracks the roadmap for the framework. It's also a learning aid — if you're new to Playwright or QA automation, the "Good first contributions" section is a deliberate on-ramp, and the completed items below show patterns worth studying before changing them.

For architecture and commands, see [CLAUDE.md](./CLAUDE.md) and [README.md](./README.md).

## Already in place

These used to be on the todo list and are now implemented. They're listed here so learners can see *what good looks like* in this codebase.

- **Environment variables.** Credentials are read from `.env` in `global-setup.ts` via `dotenv`. A `.env.example` template ships with the repo.
- **Video/trace strategy.** `video: 'retain-on-failure'` and `trace: 'on-first-retry'` in `playwright.config.ts` — keeps CI artifacts small without losing debug signal.
- **Typed Page Object Model.** `BasePage` methods take `Locator` objects (not raw selectors), preserving Playwright's auto-waiting and type safety. Study `pages/BasePage.ts` first; every other page extends it.
- **Reused auth state.** `global-setup.ts` logs in once and persists state to `LoginAuth.json`; tests that need an anonymous session opt in with `test.use({ storageState: './NoAuth.json' })`.
- **Data-driven tests.** See `tests/e2e/search.spec.ts`, `tests/e2e/register.spec.ts`, and `tests/e2e/make-order-stripe.spec.ts` for the pattern — one `forEach` over a scenario array instead of copy-pasted test blocks.
- **Dynamic Stripe expiry.** `make-order-stripe.spec.ts` computes an expiry date from `getFullYear() + 3` rather than hard-coding a year that will eventually expire.
- **Refactored mobile viewport tests.** `tests/ui/open-homepage-mobile-refactored.spec.ts` replaces the earlier duplicated spec.
- **Visual regression.** `tests/ui/logo-compare.spec.ts` with snapshot baselines. Update baselines with `npx playwright test --update-snapshots` after an intentional UI change.
- **CI on every push/PR.** `.github/workflows/playwright.yml` runs the suite on `ubuntu-latest` for pushes and PRs against `main`/`master`. Uploads the HTML report as a 30-day artifact.
- **Accessibility checks.** `tests/e2e/accessibility-scan.spec.ts` uses `@axe-core/playwright`.
- **Logout flow.** `tests/e2e/logout.spec.ts`.
- **npm scripts.** `npm test`, `test:headed`, `test:ui`, `report`, `lint`, `lint:fix`.
- **Centralized timeouts.** `constants/timeouts.ts` exports named constants (`SHORT`, `ERROR_MESSAGE`, `ACTION`, `UPLOAD_PROCESSING`, `IFRAME_LOAD`). Page objects import these instead of inlining numbers, so tuning a category is a one-line change.
- **Test data factories.** `helpers/test-data.ts` exposes `buildBillingInfo()` and `buildRegistrationUser()` — thin faker wrappers that accept `Partial<>` overrides. Specs no longer repeat the 9-field billing block or the 5-field registration block inline.
- **Checkout shipping correctness.** `CheckoutPage.fillCheckoutForm` selects `#billing_country` first (default `BG` — the only configured WooCommerce shipping zone) and waits for the `.blockUI` AJAX overlay before filling the rest. Postcode is pinned to a 4-digit Bulgarian format in the factory.
- **API negative coverage (anonymous GET only).** `tests/api/wp-posts.spec.ts` pins pagination boundaries, invalid params, search edge cases (XSS/SQL-ish payloads), `_fields` abuse, and unsupported namespaces. `tests/api/wp-invalid-ids.spec.ts` parameterizes invalid-ID 404s across `/pages`, `/categories`, `/media`, `/tags`. `tests/api/wc-store-products.spec.ts` covers WooCommerce Store API reads (`/wc/store/v1/products`) plus the `/wc/v3` auth boundary (401 without credentials).

## Active improvements

Open work, roughly ordered by value.

### Test coverage gaps

- **Shopping cart operations.** Add/remove/update quantity/clear cart. No `tests/e2e/shopping-cart.spec.ts` exists today.
- **Guest checkout.** End-to-end order placement without authentication. Use `test.use({ storageState: './NoAuth.json' })`.
- **Password reset.** Forgot-password and reset-password flows.
- **Profile edit validation.** `edit-profile.spec.ts` only covers the happy path. Add invalid input, required-field omissions, and boundary cases.
- **3D Secure / SCA flow.** Stripe provides test cards that trigger the SCA challenge (e.g. `4000 0027 6000 3184`). Exercise the challenge modal.

### API coverage gaps

The API suite (`tests/api/`) covers anonymous `GET`s against WordPress core (`/wp-json/wp/v2/…`) and the WooCommerce Store API (`/wc/store/v1/…`) — see "API negative coverage" above for what's already pinned down. **Scope rule for this project: anonymous `GET` only** — the demo site is shared and public, so write methods (`POST`/`PUT`/`DELETE`) and credentialed tests are deliberately out of scope to avoid polluting real data or leaking keys.

Within that scope, still worth adding:

- **Response schema validation.** `toMatchObject` only checks the fields you name. Bring in `zod` or `ajv` to validate the *whole* response shape against a schema — catches accidental field removals on the server side.
- **Store API categories and tags.** `wc-store-products.spec.ts` covers `/wc/store/v1/products`; the sibling `/products/categories` and `/products/tags` endpoints accept anonymous reads too.
- **Empty `_fields=` filter.** `wp-posts.spec.ts` asserts `?_fields=nonexistent_field` degrades gracefully; the empty `?_fields=` case is still unasserted.

### Known flake

- **`tests/e2e/check-price.spec.ts`** is marked "Flaky test" with no retry config and no investigation. Likely cause: prices rendered after an AJAX call. Fixes to try, in order:
  1. `await page.waitForLoadState('networkidle')` before assertions, or
  2. Assert on the price locator with a web-first matcher (`await expect(locator).toHaveText(...)`) which auto-retries, or
  3. Trace the test once (`--trace on`) and identify the exact moment the price swaps in.

### Cross-browser coverage

- Only Chromium is enabled. Uncomment Firefox (and optionally WebKit) in `playwright.config.ts` once the suite is flake-free — running multi-browser while there's an unresolved flake just multiplies noise.

### Configuration hardening

- **Environment-specific configs.** Everything points at the public demo. For learners adapting this to their own site, show how to parameterize `baseURL`, timeouts, and credentials per environment (e.g. `.env.dev`, `.env.staging`).

## Good first contributions

If you're using this repo to learn, these are deliberately chosen to teach one concept each without requiring broad changes.

1. **Write `tests/e2e/shopping-cart.spec.ts`.** Teaches: creating a new Page Object (`CartPage.ts`), locator strategy, and the add/remove/assert loop. Start with "add one item, assert cart count = 1".
2. **Fix the flake in `check-price.spec.ts`.** Teaches: diagnosing timing bugs, reading traces, and the difference between `waitFor` and web-first assertions.
3. **Enable Firefox in `playwright.config.ts`.** Teaches: the project system, reading the config, and interpreting cross-browser failures. Do this *after* #2 — running multi-browser while there's an unresolved flake just multiplies noise.

When picking one, read the relevant existing file first, then open a PR with a short description of what you learned.

## Stretch goals

Advanced tasks — take these on once you're comfortable with the patterns above.

- **Custom fixtures.** `fixtures/test-fixtures.ts` with pre-built fixtures for `loggedInPage`, `productInCart`, `checkoutWithBilling`. Reduces boilerplate in specs.
- **API + UI combined flows.** Seed state via the REST API (from `tests/api/`), then validate in the UI. Faster than clicking through setup.
- **Performance baselines.** Record Navigation Timing / LCP metrics and assert they stay within budget. The official Playwright docs cover this but it's not wired up here.
- **BDD layer.** Add `playwright-bdd` or `@cucumber/cucumber` on top of the existing specs for stakeholder-readable scenarios.
- **Parallel-safe test data.** The current suite runs with `workers: 1`. Making it parallel-safe means generating isolated data per worker (Faker + unique suffixes) and handling WooCommerce rate limits.

## Common gotchas worth knowing

Surfacing these up-front saves an afternoon of debugging.

- **Stripe rejects payments without billing details.** Fill the full billing block (name, address, email, phone) before touching the card iframe. See `pages/CheckoutPage.ts`.
- **Checkout currency is Euro.** Price strings include `,00 €` — watch out when asserting against numeric-formatted strings.
- **Stripe lives in an iframe.** Use `page.frameLocator()`, not `page.locator()`. Test cards: `4242 4242 4242 4242` (success), `4000 0000 0000 0002` (decline), `4000 0027 6000 3184` (3DS challenge).
- **`workers: 1` is intentional.** The demo site is shared and rate-limited. Don't bump it up without also isolating test data per worker.
- **Auth state expires.** If `LoginAuth.json` is stale, `global-setup.ts` re-runs on the next `npx playwright test`. Delete the file to force a refresh.
- **Only Bulgaria has a shipping zone.** WooCommerce admin on the demo site has `BG` as the sole configured shipping zone. Any other country fails with "No shipping method has been selected". `buildBillingInfo()` defaults to `BG` with a 4-digit postcode — override via `buildBillingInfo({ country: 'NL', postcode: '1234 AB' })` only if you first add that zone in admin.
- **Visual snapshots are OS-specific.** Playwright names baselines like `…-chromium-win32.png` and `…-chromium-linux.png` separately. The committed baseline here was generated on Windows; CI runs on Linux. Expect visual tests to fail on CI until you generate a Linux baseline (run the suite once, commit the new `*-linux.png`, or generate both locally with Docker).
