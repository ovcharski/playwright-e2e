# 🎭 Playwright Demo

![Playwright logo](https://playwright.dev/img/playwright-logo.svg "Playwright logo")

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Playwright](https://img.shields.io/badge/playwright-latest-green)

Demo automation testing framework created with **Playwright**, a NodeJS library for browser automation.  
It’s open-source, maintained by **Microsoft**, and built for **fast, reliable, cross-browser testing**.

Playwright supports all major rendering engines — **Chromium**, **WebKit**, and **Firefox** — and works seamlessly across **Windows, Linux, and macOS**.  
You can test headless or with UI, locally or on CI/CD, and even emulate **mobile browsers** like Chrome for Android or Safari for iOS.

---

## 📘 Overview

This project demonstrates **end-to-end (E2E) web testing** using Playwright.  
It automates real browser actions — such as navigation, form filling, clicks, and assertions — to validate web application behavior.  
The demo highlights Playwright’s speed, stability, and flexibility compared to traditional tools like Selenium.

---

## 🚀 Features

✅ **Cross-browser automation** (Chromium, Firefox, WebKit)  
🧠 **Auto-waiting** for elements to be ready before interacting  
💻 **Headless & UI modes** supported  
🧪 **TypeScript-based configuration** for cleaner, strongly-typed tests  
📊 **Generates detailed HTML reports** after each test run  
📸 **Captures screenshots** automatically for test results  
🔧 **Customizable setup** via `playwright.config.ts`

---


# Demo site - E-commerce

The [demo website](https://ovcharski.com/shop/) is using WooCommerce - an open-source e-commerce plugin for WordPress. It is designed for small to large-sized online merchants using WordPress.

The website has few pages - Home, Shop, Login, Registration, Profile.

The products (37) are in 4 categories - Clothing (23), Decor (1), Jenkins Artwork (10), Music (2). Clothing has few subcategories - Accessories (8), Hoodies (4), Jackets (1), Shirts (4), Sweater (1), Tshirts (5).

The Registration form has 10 fields: username, first name, last name, email, password, gender, birth date, coutry, phone number. Some of the fields are required, some are optional. Different type of fields are used - text box, password, radio, date picker, dropdown, telephone box.

The payment provider is Stripe.

# Test suite

The tests in the framework cover:

- User login and registration
- Search
- Making an order
- Using Page Object Model
- GitHub Actions with HTML report
- API Testing - Playwright is not the most comprehensive tool for API testing, but it can be used to get access to the REST API of your application. ([Official Documentation - API testing](https://playwright.dev/docs/test-api-testing))

# Project Structure

```bash
playwright-e2e/
├── pages/
│   ├── BasePage.ts
│   ├── CheckoutPage.ts
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── ProductPage.ts
│   ├── RegisterPage.ts
├── tests/
│   ├── api/
│   ├── e2e/
│   ├── ui/
├── global-setup.js
├── playwright.config.js
└── ...
```

# Configuration
The framework can be configured through `playwright.config.ts`. Key configurations include:
- Browsers: Chromium, Firefox, WebKit
- Viewport sizes
- Test timeouts
- Parallel execution settings

# E2E test

The e2e tests are located in `/tests/e2e/` folder. They cover scenarios such as user authentication, navigation, and interactions with different pages.

# API test

Site API Swagger doc is located [here](https://ovcharski.com/shop/rest-api/docs/).

The API tests are located in `/tests/api/`

# Locators

Playwright comes with multiple built-in locators. To make tests resilient, Playwright recommend prioritizing user-facing attributes and explicit contracts. These are the recommended built in locators.

**page.getByRole()** to locate by explicit and implicit accessibility attributes.

**page.getByText()** to locate by text content.

**page.getByLabel()** to locate a form control by associated label's text.

**page.getByPlaceholder()** to locate an input by placeholder.

**page.getByAltText()** to locate an element, usually image, by its text alternative.

**page.getByTitle()** to locate an element by its title attribute.

**page.getByTestId()** to locate an element based on its data-testid attribute (other attributes can be configured).

# Usage

Get started by installing Playwright using npm or yarn. Alternatively you can also get started and run tests using the VS Code Extension.
```bash
npm init playwright@latest
```
```bash
yarn create playwright
```

## Running tests

```bash
npx playwright test
```

## The most common options available in the command line

Run a single test file
```bash
npx playwright test tests/todo-page.spec.ts
```

Run a set of test files
```bash
npx playwright test tests/todo-page/ tests/landing-page/
```

Run tests in headed browsers
```bash
npx playwright test --headed
```

Run all the tests against a specific project
```bash
npx playwright test --project=chromium
```

Disable parallelization
```bash
npx playwright test --workers=1
```

Choose a reporter
```bash
npx playwright test --reporter=dot
```

Run in debug mode with Playwright Inspector
```bash
npx playwright test --debug
```

Ask for help
```bash
npx playwright test --help
```

Complete set of Playwright Test options is available in the configuration file.

# How to Update Playwright version

Checking Playwright version
```bash
npx @playwright/test --version
```

Check if package needs update
```bash
npm outdated @playwright/test
```

Playwright updade can be made by running
```bash
npm i @playwright/test
```

Update to specific version
```bash
npm install @playwright/test@1.36.2
```

Usually after Playwright update, browsers need to be updated
```bash
npx playwright install
```
# Checklist

| Task                          | Status              | 
|-------------------------------|---------------------| 
| GitHub Actions                | :white_check_mark:  |
| Page Object Model             | :white_check_mark:  |
| E2E tests                      | :white_check_mark:  |
| API tests                     | :white_check_mark:  |
| Mobile ViewPorts tests        | :white_check_mark:  |
| FakerJS                       | :white_check_mark:  |
| Reuse authentication state    | :white_check_mark:  |
| Multiple browser tabs         | :white_check_mark:  |
| Data driven tests             | :white_check_mark:  |
| Accessibility - Axe-core      | :white_check_mark:  |
| Visual Comparisons            | :black_square_button: |
