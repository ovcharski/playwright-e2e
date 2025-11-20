# 🔧 Improvements Needed

This document outlines recommended improvements to enhance test coverage, configuration, and code quality for the Playwright E2E testing framework.

## Test Coverage Gaps

### Missing Critical User Flows
- **No logout tests** - Add test to verify user can successfully log out and session is cleared
- **No shopping cart tests** - Missing add/remove/update cart item operations
- **No password reset flow** - Missing forgot password and reset password tests
- **Limited profile edit scenarios** - Only basic profile update is tested, need edge cases
- **Guest checkout missing** - Need to test checkout flow without authentication

### Recommended Actions
1. Create `tests/e2e/logout.spec.ts` to verify logout functionality
2. Create `tests/e2e/shopping-cart.spec.ts` for cart operations (add, remove, update quantity, clear cart)
3. Create `tests/e2e/password-reset.spec.ts` for password recovery flow
4. Expand `tests/e2e/profile-edit.spec.ts` with validation tests (invalid data, character limits)
5. Create `tests/e2e/checkout-guest.spec.ts` using `test.use({ storageState: './NoAuth.json' })`

## Configuration Issues

### Browser Coverage
- **Only Chromium enabled** - No Firefox/WebKit testing
  - Recommended: Enable at least Firefox for cross-browser validation
  - Update `playwright.config.ts` to uncomment Firefox and WebKit projects

### Video Recording Strategy
- **Video recording on all tests** - Use `retain-on-failure` instead
  - Current: `video: 'on'` (wastes storage)
  - Recommended: `video: 'retain-on-failure'` or `video: 'on-first-retry'`
  - Update in `playwright.config.ts`

### Environment Configuration
- **dotenv commented out** - Environment variables not properly loaded
  - Ensure `dotenv` is configured in `playwright.config.ts`
  - Create `.env.example` template for required variables
  - Document required environment variables in README

### Missing Configuration
- **No environment-specific configs** - Same config for dev/staging/prod
  - Recommended: Create separate configs or use environment variables
  - Example: `BASE_URL`, `API_TIMEOUT`, `TEST_USER_EMAIL`, etc.

## Code Quality

### Type Safety Issues

#### pages/BasePage.ts
- **Problem**: Methods accept `string` selectors instead of `Locator` objects
- **Impact**: Bypasses Playwright's type safety and auto-waiting features
- **Recommended Fix**:
  ```typescript
  // Instead of:
  async verifyText(selector: string, expectedText: string)

  // Use:
  async verifyText(locator: Locator, expectedText: string)
  ```
- **File**: `pages/BasePage.ts`

### Code Duplication

#### tests/ui/open-homepage-mobile.spec.ts
- **Problem**: Repeats same test code 4 times for different viewports
- **Impact**: Maintenance burden, violates DRY principle
- **Recommended Fix**: Use data-driven approach
  ```typescript
  const viewports = [
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPhone 13', width: 390, height: 844 },
    // ... etc
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`should open homepage on ${name}`, async ({ page }) => {
      // test implementation
    });
  });
  ```
- **File**: `tests/ui/open-homepage-mobile.spec.ts`

### Commented Code

#### Incomplete Tests
- **tests/e2e/checkout-stripe.spec.ts** - Contains commented CVC validation tests
  - Either implement or remove commented code
  - If keeping, add TODO comment explaining why

- **Visual comparison tests** - Multiple commented visual regression tests
  - Decide if visual testing is needed
  - If yes, implement properly with baseline images
  - If no, remove commented code

### Flaky Tests

#### tests/e2e/check-price.spec.ts
- **Problem**: Test marked as flaky
- **Root Cause**: Likely timing issues with dynamic price loading
- **Recommended Fix**:
  1. Review price verification logic in `ProductPage.ts`
  2. Add proper wait conditions before price assertions
  3. Check if prices are loaded via AJAX/JavaScript
  4. Consider adding `page.waitForLoadState('networkidle')` before verification

## Priority Recommendations

### High Priority
1. Fix flaky test in `tests/e2e/check-price.spec.ts`
2. Enable `video: 'retain-on-failure'` to save CI storage
3. Fix type safety in `BasePage.ts`
4. Add shopping cart tests (critical user flow)

### Medium Priority
5. Refactor duplicated mobile viewport tests
6. Add logout tests
7. Enable Firefox browser testing
8. Add guest checkout tests

### Low Priority
9. Remove commented code or implement missing tests
10. Add password reset flow tests
11. Expand profile edit test scenarios
12. Create environment-specific configurations

## Implementation Order

1. **Quick Wins** (1-2 hours):
   - Update video recording config
   - Remove commented code
   - Refactor mobile viewport tests

2. **Test Coverage** (4-6 hours):
   - Add logout tests
   - Add shopping cart tests
   - Add guest checkout tests

3. **Code Quality** (3-4 hours):
   - Fix type safety in BasePage
   - Investigate and fix flaky test
   - Enable Firefox testing

4. **Long-term** (Ongoing):
   - Environment-specific configurations
   - Password reset flow
   - Expanded profile edit scenarios
   - Visual regression testing (if needed)
