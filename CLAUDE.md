# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Playwright E2E testing framework for a WooCommerce shop at `https://ovcharski.com/shop/`. Uses Page Object Model pattern with TypeScript.

## Commands

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/e2e/login-positive.spec.ts

# Run tests in headed mode
npx playwright test --headed

# Run with UI mode
npx playwright test --ui

# Debug mode
npx playwright test --debug

# Run single worker (disable parallelization)
npx playwright test --workers=1

# View HTML report
npx playwright show-report

# Install/update browsers
npx playwright install --with-deps
```

## Architecture

### Page Object Model Structure

All page classes extend `BasePage` which provides common methods:
- `typeIntoLocator()`, `clickElement()`, `verifyText()`, `fillForm()`, `navigate()`

Page classes in `pages/`:
- **BasePage.ts**: Abstract base with shared utilities
- **LoginPage.ts**, **RegisterPage.ts**: Authentication flows
- **CheckoutPage.ts**: Order placement, Stripe iframe handling
- **ProductPage.ts**: Category/product navigation, price verification
- **ProfilePage.ts**: Profile updates, file uploads

### Test Organization

- `tests/e2e/`: End-to-end user flows (login, register, checkout, search)
- `tests/api/`: WordPress REST API tests
- `tests/ui/`: Visual and viewport tests

### Authentication

Global setup (`global-setup.ts`) authenticates before all tests and saves state to `LoginAuth.json`.

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
- **Video**: Always recorded
- **CI**: Single worker, 2 retries

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
Tests interact with Stripe iframe using `page.frameLocator()` and test card numbers (4242 4242 4242 4242, etc.).

## Dependencies

- `@playwright/test`: Test framework
- `@axe-core/playwright`: Accessibility testing
- `@faker-js/faker`: Test data generation
