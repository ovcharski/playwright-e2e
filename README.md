# Playwright E2E Testing Framework

![The San Juan Mountains are beautiful!](/assets/images/playwright-logo.png "San Juan Mountains")

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

The demo website is using WooCommerce - an open-source e-commerce plugin for WordPress. It is designed for small to large-sized online merchants using WordPress.

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
- BDD?
- API Testing?
- Performance testing?

# Checklist

|          | Status | 
|   :---   | :---: | 
| Creation of checklist | :white_check_mark: 
| TBD | :black_square_button:
| TBD | :black_square_button:

# Usage

Get started by installing Playwright using npm or yarn. Alternatively you can also get started and run tests using the VS Code Extension.

> npm init playwright@latest

> yarn create playwright

Running tests

> npx playwright test
