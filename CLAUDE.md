# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Playwright E2E testing framework for a WooCommerce shop at `https://ovcharski.com/shop/`. Uses Page Object Model pattern with TypeScript.

Tests run against a **live, shared, stateful site** — there is no local fixture or seeded database. This drives most decisions here:

- Site-side changes (theme tweaks, plugin updates) break tests with no code change on our side. A failure is as likely to be UI drift as a test bug.
- `make-order-stripe.spec.ts` places real test-mode orders, and the cart accumulates across runs because it lives in the saved auth state.
- `register.spec.ts` creates real users.
- API tests are anonymous `GET` only — no writes, no authenticated calls.
- Concurrent runs (two CI jobs at once, or CI plus a local run) trip the site's WAF and return 403s that look like real failures. Stagger runs rather than adding a concurrency guard.

## Commands

```bash
# npm scripts (preferred)
npm test                 # Run all tests
npm run test:headed      # Headed mode
npm run test:ui          # UI mode
npm run report           # View HTML report
npm run lint             # Lint all files
npm run lint:fix         # Lint and auto-fix

# Playwright CLI (for flags not covered by scripts)
npx playwright test tests/e2e/login-positive.spec.ts   # Single file
npx playwright test -g "pay with VISA"                 # Single test by title
npx playwright test --last-failed                      # Re-run only failures
npx playwright test --debug                            # Debug mode
npx playwright install --with-deps                     # Install/update browsers
```

## Architecture

### Page Object Model Structure

All page classes extend `BasePage` which provides common methods:
- Actions: `typeIntoLocator()`, `clickElement()`, `fillForm()`, `navigate()`
- Assertions: `verifyText()`, `verifyTextWithOptions()`, `verifyElementVisible()`, `getTextContent()`
- `captureScreenshot()` — the only public member; writes timestamped files to `screenshots/`

Page classes in `pages/`:
- **BasePage.ts**: Abstract base with shared utilities
- **HomePage.ts**: Welcome text, footer, home screenshots
- **LoginPage.ts**, **RegisterPage.ts**: Authentication flows
- **CheckoutPage.ts**: Order placement, billing form, Stripe iframe handling
- **ProductPage.ts**: Category/product navigation, price verification
- **ProfilePage.ts**: Profile updates, file uploads

### Shared Modules

- `helpers/test-data.ts`: faker-backed builders `buildBillingInfo()` and `buildRegistrationUser()`, both accepting overrides. Billing country is pinned to `BG` — the only shipping zone configured in WooCommerce; other countries fail with "No shipping method has been selected".
- `constants/timeouts.ts`: named timeouts (`SHORT`, `ERROR_MESSAGE`, `ACTION`, `UPLOAD_PROCESSING`, `IFRAME_LOAD`) used by the page objects.

### Test Organization

- `tests/e2e/`: End-to-end user flows (login, register, checkout, search, price checks, accessibility scan)
- `tests/api/`: WordPress REST API tests
- `tests/ui/`: Viewport and logo checks. The visual-comparison test in `logo-compare.spec.ts` is commented out — its committed snapshot is win32-only and fails on Linux CI.

### Authentication

Credentials come from `.env` (copy `.env.example`). `global-setup.ts` throws if `TEST_USERNAME` or `TEST_PASSWORD` is missing, which aborts the whole run.

Global setup authenticates before all tests and saves state to `LoginAuth.json` (generated, gitignored). `NoAuth.json` is a committed empty state.

```typescript
// Default: tests use authenticated state from LoginAuth.json

// For unauthenticated tests:
test.use({ storageState: './NoAuth.json' });
```

### Configuration Highlights

- **Base URL**: `https://ovcharski.com/shop/`
- **Test timeout**: 30s
- **Expect timeout**: 15s
- **Browser**: Chromium only
- **Workers**: 1 everywhere, with `fullyParallel: false` — not just on CI
- **Video**: `retain-on-failure`; trace: `on-first-retry`
- **CI**: 2 retries (0 locally)

### CI

`.github/workflows/playwright.yml` runs on push and PR to `main`/`master`: `npm ci` → `npm run lint` → `npx playwright test`. Credentials come from the `TEST_USERNAME` / `TEST_PASSWORD` GitHub secrets, and `playwright-report/` is uploaded as an artifact.

## Key Patterns

### Locator Priority
1. `getByRole()` - preferred
2. `getByText()`, `getByLabel()`
3. `getByTestId()`
4. CSS selectors

### Data-Driven Tests
```typescript
const testData = [{ searchQuery: 'Album', sku: 'woo-album' }];
testData.forEach((data) => {
    test(`Search for ${data.searchQuery}`, async ({ page }) => {
        // test implementation
    });
});
```

### Stripe Payment Handling

The gateway renders the Stripe **Payment Element** inside an iframe. `CheckoutPage` reaches it with `page.locator('iframe[name*="__privateStripeFrame"]').first().contentFrame()` — not `frameLocator()`.

- Target the **placeholders** (`1234 1234 1234 1234`, `MM / YY`, `CVC`), which have survived gateway updates. The visible labels ("Card number", "Expiration (MM/YY)", "Security code") have not.
- The payment method radio is `Payment options` and is already selected — use `.check()`, not `.click()`, so it stays a no-op and cannot fire a stray `update_checkout` AJAX before `#place_order`.
- Validation strings come from Stripe and change between element versions (e.g. "Your security code is incomplete."). When these tests break, read the current wording out of `error-context.md` instead of guessing.
- Billing details (name, address, email, phone) must be filled before payment — Stripe rejects the transaction otherwise. Checkout currency is Euro; test cards are 4242 4242 4242 4242 and friends.

### Debugging Failures

`test-results/<test-name>/error-context.md` holds an accessibility snapshot of the page at the moment of failure. It is usually enough to spot a renamed label or moved element without opening a browser — start there. Videos land in the same folder.

## Dependencies

- `@playwright/test`: Test framework
- `@axe-core/playwright`: Accessibility testing
- `@faker-js/faker`: Test data generation
- `dotenv`: Env-var loading (used in `global-setup.ts` only; the `playwright.config.ts` hook is commented out)
- `eslint` with `@typescript-eslint/*`: Linting (config in `eslint.config.js`)
- `@types/node`: Node typings for `process.env` access

## Related Docs

- `README.md`: Public-facing project intro and setup
- `IMPROVEMENTS.md`: Tracked improvement ideas and rationale
- `plawryghtchanges.md`: Digest of Playwright release notes (not a project change log)

## Behavioral Guidelines

Adapted from [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills). Bias toward caution over speed; use judgment for trivial tasks.

### 1. Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

### 3. Surgical Changes

Touch only what you must. Clean up only your own mess.

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove imports/variables/functions that *your* changes made unused; leave pre-existing dead code alone unless asked.
- Test: every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

Define success criteria. Loop until verified.

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan with a verify step for each item.
