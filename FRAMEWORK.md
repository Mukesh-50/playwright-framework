# How This Framework Works

This is a UI test automation framework built with **Playwright** and **JavaScript**. It tests a web app at `https://freelance-learn-automation.vercel.app` (login, category management, course management).

Below is a plain-language walkthrough of every folder and how they work together. 

---

## 1. The big idea: Page Object Model (POM)

Instead of writing raw Playwright code (`page.click(...)`, `page.fill(...)`) directly inside every test, we describe each **page of the app** as a class. Each class knows:
- Where things are on that page (the locators)
- What actions a user can do on that page (login, add a category, save a course, etc.)

Tests then just call these actions in plain English, e.g. `loginPage.loginToApplication(user, pass)`. This keeps tests short and readable, and if the UI changes, you fix the locator in **one place** (the page class) instead of in every test that uses it.

```
Test file  --uses-->  Page object (e.g. LoginPage)  --uses-->  BasePage (shared helpers)  --drives-->  Playwright
```

---

## 2. Folder-by-folder

### `pages/` — the Page Object Model
- **`basepage.js`** — the parent class every page object extends. It holds generic, reusable actions: `click`, `fill`, `goto`, `selectOptions`, `uploadFile`, `acceptDialogAndClick` (for JS `confirm`/`prompt` dialogs), and `clickAndWaitForNewPage` (for actions that open a new tab/window). Nothing app-specific lives here.
- **`loginpage.js`**, **`dashboardpage.js`**, **`categorypage.js`**, **`coursepage.js`** — one class per screen. Each defines locators in its constructor and exposes methods like `loginToApplication()`, `clickOnManageCategory()`, `enterCourseName()`. They all `extends BasePage`, so they inherit `click`/`fill`/etc. instead of re-implementing them.

### `fixture/fixture.js` — wiring pages into tests
Playwright's `test.extend()` is used to create custom "fixtures" — reusable pieces of test setup that Playwright automatically prepares before a test runs and cleans up after. Instead of every test doing `new LoginPage(page)` manually, a test just asks for the fixture by name and Playwright hands it over already created.

Fixtures defined here:
- `loginPage`, `dashboardPage`, `coursePage` — plain page objects, ready to use.
- `loggedInUser` — goes further: it navigates to `/login`, logs in as an admin **before** the test body runs, hands control to the test, and after the test finishes it **automatically logs out**. Good for tests where you don't want to repeat login/logout boilerplate.
- `loggedInOnce` — logs in but does **not** auto-logout afterward.

This file re-exports a custom `test` and `expect` — that's why every spec file imports from `../../fixture/fixture.js` instead of `@playwright/test` directly.

### `tests/` — the actual test cases, grouped by type
- `tests/smoke/` — quick, critical-path checks (e.g. `login-test.spec.js`: valid login + a data-driven loop over invalid credentials).
- `tests/e2e/` — full user journeys (e.g. `manage-category-test.spec.js`: create → verify → update → verify → delete a category).
- `tests/regression/` — broader, more detailed suites (e.g. `manage-course.spec.js`: fill out and save a whole course form, once with JSON data and once with Excel data).

Each spec file:
1. Imports `test`/`expect` from the fixture file (not directly from Playwright).
2. Imports test data (from `data/json/*.json` or via `readExcel()`).
3. Asks for whichever fixtures it needs in the test function's parameter object, e.g. `({ page, loggedInUser, dashboardPage, coursePage }) => {...}`.
4. Calls page-object methods to perform steps and `expect(...)` to assert results.

### `data/` — test data, separated from test logic
- `data/json/` — credentials, course details, etc. as `.json` files, imported directly into tests.
- `data/excel/` — the same kind of data but in a spreadsheet (`course.xlsx`), read at runtime.
- `data/images/` — sample files used for upload tests (e.g. a course thumbnail).
- `data/csv/` — reserved for CSV-based data (currently empty).

Keeping data out of the test file means the same test logic can run against many different inputs, and non-developers can update data without touching code.

### `utils/readexcel.js`
A small helper that opens an Excel file (using the `xlsx` package) and converts a named sheet into an array of JSON objects — so Excel data can be used exactly like JSON data in tests.

### `config/`
`prod.env`, `qa.env`, `stag.env` — placeholders for environment-specific values (URLs, credentials) per environment. (Currently empty — the base URL is hardcoded in `playwright.config.js` instead; this is a natural next step to make the framework multi-environment.)

### `playwright.config.js` — global settings
- `testDir: './tests'` — where Playwright looks for spec files.
- `fullyParallel: true` — tests run in parallel by default.
- `baseURL` — so tests can call `page.goto("/login")` instead of the full URL.
- `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'` — debugging artifacts are only captured when something goes wrong, keeping runs fast.
- `reporter: [['html'], ['allure-playwright']]` — produces two kinds of reports (see below).
- `projects` — the same tests run against Chromium, Firefox, and WebKit (Safari engine), so cross-browser coverage is automatic.

### Reports & results (generated, not hand-written)
- `playwright-report/` — Playwright's built-in HTML report.
- `allure-results/` + `reports/` — raw data and generated report for **Allure**, a richer, more detailed test report (steps, attachments, history, trends).
- `test-results/` — temporary artifacts (traces, screenshots, videos) from the last run.

These folders are all regenerated every time you run the tests — they're outputs, not source code.

---

## 3. Putting it together: how a test actually runs

Take `tests/e2e/manage-category-test.spec.js` as an example:

1. Playwright starts, sees the test needs `page`, `loggedInUser`, and `dashboardPage`.
2. The `loggedInUser` fixture runs first: opens `/login`, logs in as admin, then hands control to the test.
3. Inside the test, `dashboardPage.clickOnManageButton()` and `dashboardPage.clickOnManageCategory()` are called — these are just methods on the `DashBoardPage` class, which internally call `this.click(locator)` from `BasePage`.
4. A `CategoryPage` object is created for the new tab that opens, and its methods (`clickOnAddNewCategory`, `clickOnUpdateCategory`, `clickOnDeleteCategory`) drive the create/update/delete flow.
5. `expect(...)` assertions verify the UI reflects each change.
6. After the test body finishes, the `loggedInUser` fixture's cleanup code runs and logs the user out automatically.
7. Results are written out as an HTML report and Allure results.

---

## 4. Why it's structured this way (the benefits)

- **Readable tests** — a test reads like a set of business steps, not low-level browser commands.
- **One place to fix UI changes** — locators live in page objects, not scattered across tests.
- **Reusable setup** — fixtures remove repeated login/logout code from every test.
- **Data-driven** — swapping JSON/Excel data doesn't require touching test logic.
- **Cross-browser by default** — the same tests run on Chromium, Firefox, and WebKit via `projects` in the config.
- **Traceable failures** — screenshots, video, and traces are captured automatically only when a test fails.
