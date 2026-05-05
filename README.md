# QA Practice

End-to-end test automation practice project for https://qa-practice.netlify.app built with [Playwright](https://playwright.dev/) and TypeScript.

## Prerequisites

- Node.js 24, as defined in `.nvmrc`
- Access to the test application and valid test credentials

If you use `nvm` (https://github.com/nvm-sh/nvm), install and select the project Node version:

```bash
nvm install
nvm use
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

3. Create a local `.env` file in the project root by copying and renaming `.env.example` file:

```bash
cp .env.example .env
```
 and replace dummy values with real url, email and password (those can be found on https://qa-practice.netlify.app/auth_ecommerce).
 
```bash
BASE_URL=https://your-test-app-url.example
TEST_EMAIL=your-test-user@example.com
TEST_PASSWORD=your-test-password
```

The test configuration check if variables exist and loads them through `env.ts` helper. In CI, the same values are expected to be provided as environment secrets.

## CI

Tests are configured to run via GitHub actions, results can be found on https://github.com/azeljkovic/qa-practice-playwright/actions

## Test Structure

```text
.
├── playwright.config.ts          # Playwright configuration
├── env.ts                        # Required environment variable loading
├── tests/
│   ├── fileUpload.spec.ts        # File upload scenarios
│   ├── happyFlow.spec.ts         # End-to-end happy path
│   ├── login.spec.ts             # Login and logout scenarios
│   ├── order.spec.ts             # Cart and checkout scenarios
│   ├── pageObjects/              # Page Object Model classes
│   │   ├── checkoutPage.ts
│   │   ├── fileUploadPage.ts
│   │   ├── loginPage.ts
│   │   ├── orderConfirmationPage.ts
│   │   └── orderPage.ts
│   ├── testAssets/               # Files used by tests
│   │   └── sample.txt
│   └── testData/                 # Shared test data
│       └── orderData.ts
└── .github/workflows/
    └── playwright.yml            # GitHub Actions test workflow
```

## Running Tests

Run the full test suite in headless mode:

```bash
npm run test:headless
```

Run tests with the Playwright UI:

```bash
npm run test:ui
```

Run a specific test file:

```bash
npx playwright test tests/order.spec.ts
```

Run tests in a specific browser project:

```bash
npx playwright test --project=chromium
```

Open the latest HTML report:

```bash
npx playwright show-report
```

## Configuration Notes

- Tests are located in the `tests/` directory.
- The suite is configured to run against Chromium, Firefox, and WebKit.
- Tests run fully in parallel locally.
- CI retries failed tests twice and uses a single worker for stability.
- Playwright traces are collected on the first retry.
- The custom test id attribute is `test-data` based on application selectors

