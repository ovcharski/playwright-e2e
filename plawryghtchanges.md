# Playwright Changelog

# v.1.32

> Introducing UI Mode (preview) - lets you explore, run and debug tests. Comes with a built-in watch mode. Engage with a new flag --ui: npx playwright test --ui

# v1.31 

# v1.30

# v1.29

# v1.28

# v1.27 - 8 Oct 2022

## New getBy* APIs, inspired by Testing Library

> page.getByRole(role, options)

> page.getByLabel(label, options)

> page.getByPlaceholder(placeholder, options)

> page.getByText(text, options)

> page.getByAltText(altText, options)

> page.getByTitle(title, options)

> page.getByTestId(testId)

Available on Page, Locator & FrameLocator classes. 

| Before | After | Notes |
|   :---   | :---: | :---: |
| page.locator('text=Submit'); | page.getByText('Submit'); | to locate by text content.
| page.locator('role=button');  | page.getByRole('button'); | to locate by ARIA role, ARIA attributes and accessible name.
| page.locator('text=Password'); | page.getByLabel('Password') | to locate a form control by associated label's text.
| page.locator('[placeholder="Search Github"]'); | page.getByPlaceholder('Search Github') | to locate an input by placeholder.
| page.locator('[alt="castle"]'); | page.getByAltText('castle') | to locate an element, usually image, by its text alternative.
| page.locator('[title="Place the order"]'); | page.getByTitle('Place the order') | to locate an element by its title.
| page.locator('data-testid="submit"]'); | page.getByTestId('submit')

## Workers option

Workers option in the playwright.config.ts now accepts a percentage string to use some of the available CPUs. You can also pass it in the command line:

> npx playwright test --workers=20%

## New options host and port for the html reporter.

> reporters: [['html', { host: 'localhost', port: '9223' }]]

Use host 0.0.0.0 if running tests inside docker and want to expose report to host
machine.

# v1.26

# v1.25

# v1.24