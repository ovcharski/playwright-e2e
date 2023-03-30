# Playwright E2E Testing Framework

![Playwright logo](/assets/images/playwright-logo.png "Playwright logo")

Demo automation testing framework created with Playwright. A NodeJS library made for browser automation. It's free, open source and backed up by Microsoft. 

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

The Registration form has 10 fields: username, first name, last name, email, password, gender, birth date, coutry, phone number. Some of the fields are required, some are optional. Different type of fields are used - text box, password, radio, date picker, dropdown, telepone box.

# Test suite

The tests in the framework will cover:

- User login and registration
- Search
- Making an order
- Page Object Model
- GutHub Actions with HTML report
- Docker
- Visual Regression Testing (VRT)? `toMatchSnapshot()` method 
- BDD? Playwright does not support natively BDD / Gherkin, but some work around solutions are available. Use the playwright steps to explain all Given/When/Then assertions  ([BDD implementation with Playwright test runner](https://github.com/microsoft/playwright))
- API Testing? Playwright is not the most comprehensive tool for API testing but it is possible ([API testing](https://playwright.dev/docs/test-api-testing))
- Performance testing? Playwright is not designed for performance testing, but may be there are some variants. To be ivestigated.

A repo with Postman collection for API testing of the same website is available at [ovcharski/postman-wp](https://github.com/microsoft/playwright). The repo is just for an idea for combination of Playwright UI and Postman API testing in a one whole package.

# Checklist

A checklist showing what is the status of the framework

|  Task    | Status | 
|   :---   | :---:  | 
| Creation of checklist | :white_check_mark: 
| GitHub Actions | :white_check_mark: 
| Page Object Model | :white_check_mark:
| UI tests  | :white_check_mark:
| API tests | :white_check_mark:
| Mobile only test | :black_square_button:
| FakerJS | :white_check_mark:
| Reuse authentication state | 
| Visual Comparisons  | :black_square_button:
| - | :black_square_button:
| - | :black_square_button:

# POM

Page Object Model (POM) is a design pattern that creates a repository for storing all web elements. It is useful in reducing code duplication and improves test script maintenance. In Page Object Model, consider each web page of an application as a separate class file. Each class file will contain only corresponding web page elements. Using these elements, testers can perform operations on the website under test.

# UI test

The UI tests are located in /tests/ folder

More tests will be added over time.

# API test

Site API Swagger doc is located [here](https://ovcharski.com/shop/rest-api/docs/).

The API tests are located in /tests/api/

More tests will be added over time.

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
