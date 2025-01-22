# Playwright E2E Testing Framework

![Playwright logo](/assets/images/playwright-logo.png "Playwright logo")

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Playwright](https://img.shields.io/badge/playwright-latest-green)

Demo automation testing framework created with Playwright, a NodeJS library made for browser automation. It's free, open source and backed up by Microsoft. 

Playwright supports all modern rendering engines including Chromium, WebKit, and Firefox. Test on Windows, Linux, and macOS, locally or on CI, headless or headed with native mobile emulation of Google Chrome for Android and Mobile Safari.

[Playwright Github](https://github.com/microsoft/playwright)

# What does Playwright support

- One API, cross platform, cross language and cross browser
- Test on Windows, Linux and MacOS
- Supports Chromium, Firefox & Webkit
- Playwright API can be used in JavaScript, TypeScript, Python, Java & .NET

# Why Playwright

Resilent tests:
- Auto-waiting
- Web first assertions (automatic retries)
- Strong debugging capabilities (tracing, screenshots, videos...)

Fast execution:
- Isolated testing (new browser profile for each test)
- Re-use authentication (save and reuse state)

Powerful tooling:
- CodeGen
- Inspector
- Traceviewer

Limitations:
- Multi tab, origin and windows support
- Iframe support
- Pierce the shadow DOM
- Make API request


# Demo site - E-commerce

The [demo website](https://ovcharski.com/shop/) is using WooCommerce - an open-source e-commerce plugin for WordPress. It is designed for small to large-sized online merchants using WordPress.

The website has few pages - Home, Shop, Login, Registration, Profile.

The products (37) are in 4 categories - Clothing (23), Decor (1), Jenkins Artwork (10), Music (2). Clothing has few subcategories - Accessories (8), Hoodies (4), Jackets (1), Shirts (4), Sweater (1), Tshirts (5).

The Registration form has 10 fields: username, first name, last name, email, password, gender, birth date, coutry, phone number. Some of the fields are required, some are optional. Different type of fields are used - text box, password, radio, date picker, dropdown, telephone box.

# Test suite

The tests in the framework cover:

- User login and registration
- Search
- Making an order
- Using Page Object Model
- GitHub Actions with HTML report
- API Testing - Playwright is not the most comprehensive tool for API testing, but it can be used to get access to the REST API of your application. ([Official Documentation - API testing](https://playwright.dev/docs/test-api-testing))

# Project Structure
├── pages/                # Page Object Models \
├── tests/                # Test files \
│   ├── api/              # API tests \
└── global-setup.ts       # Saved state of logged-in user \
├── screenshots/          # Recorded screenshots from tests \
└── playwright.config.ts  # Playwright configuration \

# Configuration
The framework can be configured through `playwright.config.ts`. Key configurations include:
- Browsers: Chromium, Firefox, WebKit
- Viewport sizes
- Test timeouts
- Parallel execution settings

# For future improvements and considerations

- Using Environment Variables - to create .env file and use library like dotenv to load the sensitive data.
- Organizing test data in JSONs like login and user data.
- Implement robust error handling
- Visual Regression Testing (VRT)
- Performance testing - Playwright is not designed for performance testing, but there are various ways to do it (Navigation and Resource Timing API, Paint Timing API, Largest Contentful Paint API, Layout Instability, Long Task API). ([Blog post](https://ray.run/blog/measuring-website-performance-with-playwright-tests)). These types of tests are not included in this repo/framework.
- BDD - Playwright does not support natively BDD / Gherkin, but various integrations and plugins are available (Cucumber.js, Playwright-Cucumber, Jest-Cucumber, Playwright-BDD). 

A repo with Postman collection for API testing of the same website is available at [ovcharski/postman-wp](https://github.com/ovcharski/postman-wp). The repo is just for an idea for combination of Playwright UI and Postman API testing in a one whole package.

# Checklist

| Task                          | Status              | 
|-------------------------------|---------------------| 
| GitHub Actions                | :white_check_mark:  |
| Page Object Model             | :white_check_mark:  |
| UI tests                      | :white_check_mark:  |
| API tests                     | :white_check_mark:  |
| Mobile ViewPorts tests        | :white_check_mark:  |
| FakerJS                       | :white_check_mark:  |
| Reuse authentication state    | :white_check_mark:  |
| Multiple browser tabs         | :white_check_mark:  |
| Data driven tests             | :white_check_mark:  |
| Accessibility - Axe-core      | :white_check_mark:  |
| Visual Comparisons            | :black_square_button: |
| BDD                           | :black_square_button: |

# Page Object Model (POM)

Page Object Model (POM) is a design pattern that creates a repository for storing all web elements. It is useful in reducing code duplication and improving test script maintenance. In POM, consider each web page of an application as a separate class file. Each class file will contain only corresponding web page elements. Using these elements, testers can perform operations on the website under test.

## Benefits of POM
- **Maintainability**: Changes in the UI require updates only in the page classes.
- **Reusability**: Common operations can be reused across different tests.
- **Readability**: Tests are more readable and easier to understand.

# UI test

The UI tests are located in /tests/ folder

# API test

Site API Swagger doc is located [here](https://ovcharski.com/shop/rest-api/docs/).

The API tests are located in /tests/api/

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

> npm init playwright@latest

> yarn create playwright

Running tests

> npx playwright test

Here are the most common options available in the command line.

Run a single test file

> npx playwright test tests/todo-page.spec.ts

Run a set of test files

> npx playwright test tests/todo-page/ tests/landing-page/

Run tests in headed browsers

> npx playwright test --headed

Run all the tests against a specific project

> npx playwright test --project=chromium

Disable parallelization

> npx playwright test --workers=1

Choose a reporter

> npx playwright test --reporter=dot

Run in debug mode with Playwright Inspector

> npx playwright test --debug

Ask for help

> npx playwright test --help

Complete set of Playwright Test options is available in the configuration file.

# How to Update Playwright version

Checking Playwright version

> npx @playwright/test --version

Check if package needs update

> npm outdated @playwright/test

Playwright updade can be made by running

> npm i @playwright/test

Update to specific version

> npm install @playwright/test@1.36.2

Usually after Playwright update, browsers need to be updated

> npx playwright install
