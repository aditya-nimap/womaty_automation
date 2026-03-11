# 🎭 Playwright Automation Framework — Antigravity Prompt & Reference Guide

> **How to use this file:**
> Paste the prompt in the **"Prompt"** section directly into Antigravity (or any AI codegen tool).
> The **"Framework Reference"** section below it is the living spec the AI uses to understand decisions and extend the framework correctly.

---

## ──────────────────────────────────────────────
## SECTION 1 — ANTIGRAVITY PROMPT (copy-paste this)
## ──────────────────────────────────────────────

```
You are a senior SDET. Generate a complete, production-ready Playwright E2E 
automation framework in TypeScript following 2026 best practices.

APPLICATION UNDER TEST: [YOUR APP NAME]
Flows to cover: Signup → Login → Dashboard → Activity CRUD 
                (Create / Read / Search / Filter / Edit / Delete / Bulk Delete) 
                → Profile Update → Password Change → Logout

════════════════════════════════════════════════
STRICT REQUIREMENTS — follow every rule below
════════════════════════════════════════════════

── ARCHITECTURE ──────────────────────────────────────────────────────────────

1. Page Object Model (POM)
   - Every page has a class that extends BasePage
   - Locators are CLASS PROPERTIES (not methods), typed as Locator
   - Only use data-testid selectors: page.getByTestId('...')
   - Compound action methods on every page:
       createXAndExpectSuccess(), editXAndExpectError(), etc.
   - BasePage provides: goto, waitForPageLoad, fillAndTab, clearAndFill,
     assertToast(message, type), waitForSpinner, confirmDialog(bool),
     assertUrl, assertTitle

2. Fixture-based Dependency Injection (fixtures/index.ts)
   - Extend base.extend<T>() with: all page objects, API helper, data factories
   - Include "pre-navigated" convenience fixtures (loginPageReady, activityPageReady)
   - Include "withActivity" lifecycle fixture:
       → seeds data via API before test
       → yields { page, title } to test body
       → deletes via API after test (even on failure)
   - Tests import ONLY from fixtures/index.ts — never import pages directly

3. Auth via storageState
   - fixtures/global.setup.ts logs in once and saves context.storageState()
     to fixtures/.auth/user.json
   - playwright.config.ts "setup" project runs testMatch: '**/global.setup.ts'
   - All authenticated projects list dependencies: ['setup'] and set:
     storageState: './fixtures/.auth/user.json'
   - Auth test files live in tests/auth/ and use a separate project with
     NO storageState dependency

4. API Helper (helpers/api.helper.ts)
   - Uses Playwright's APIRequestContext (injected via fixture)
   - Methods: createActivity, getActivity, updateActivity, deleteActivity,
     listActivities, deleteAllActivities, createUser, deleteUser, loginAndGetToken
   - Throws descriptive errors on non-2xx responses
   - Used for test setup/teardown — NEVER use UI to set up state for non-UI tests

5. Data Factories (data/*.factory.ts)
   - Use @faker-js/faker for all test data
   - ActivityDataFactory: create(), createMany(n), createMinimal(),
     createHighPriority(), createWithSpecialChars(), createWithLongTitle()
   - UserDataFactory: create(), createSignupPayload(), createAdmin(),
     createWithPasswordMismatch(), createWithInvalidEmail(), createWithWeakPassword()
   - Factories accept Partial<T> overrides

── FILE STRUCTURE ─────────────────────────────────────────────────────────────

Generate exactly this structure:

playwright-framework/
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── .env.dev
├── .gitignore
│
├── types/
│   └── index.ts               ← User, Activity, ApiResponse, SignupPayload,
│                                 FilterOptions, ToastType interfaces
│
├── pages/
│   ├── base.page.ts
│   ├── login.page.ts
│   ├── signup.page.ts
│   ├── dashboard.page.ts
│   ├── activity.page.ts       ← Full CRUD + bulk + filter + search
│   └── profile.page.ts
│
├── fixtures/
│   ├── index.ts               ← Single export: { test, expect }
│   └── global.setup.ts
│
├── helpers/
│   └── api.helper.ts
│
├── data/
│   ├── activity.factory.ts
│   └── user.factory.ts
│
├── config/
│   ├── global-setup.ts        ← mkdir reports dirs, log env
│   └── global-teardown.ts
│
├── tests/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── signup.spec.ts
│   ├── activity/
│   │   └── activity-crud.spec.ts
│   ├── user/
│   │   └── profile.spec.ts
│   └── smoke/
│       └── critical-path.spec.ts   ← full E2E happy path, tagged @smoke
│
└── .github/
    └── workflows/
        └── playwright.yml     ← smoke job → full matrix job (parallel browsers)

── playwright.config.ts RULES ────────────────────────────────────────────────

- fullyParallel: true
- workers: process.env.CI ? 4 : '50%'
- retries: process.env.CI ? 2 : 0
- reporters: html (reports/html), junit (reports/junit), list,
  github (CI only)
- use.trace: 'on-first-retry'
- use.screenshot: 'only-on-failure'
- use.video: 'retain-on-failure'
- use.actionTimeout: 15_000
- use.navigationTimeout: 30_000
- Projects:
    setup          → testMatch: '**/global.setup.ts'
    chromium:auth  → Desktop Chrome  + storageState + dep: setup
    firefox:auth   → Desktop Firefox + storageState + dep: setup
    mobile:auth    → Pixel 7         + storageState + dep: setup
    auth-tests     → Desktop Chrome  + testMatch: '**/auth/**' (no dep)

── TEST WRITING RULES ─────────────────────────────────────────────────────────

- Every test file imports: import { test, expect } from '../../fixtures'
- describe blocks group by feature + operation (e.g., 'Activity - Create')
- test names follow: 'should [behaviour] when [condition]'
- Smoke tests tagged @smoke inline: test('should ... @smoke', ...)
- NEVER hardcode test data in tests — always use factories
- NEVER navigate inside tests if a *Ready fixture does it
- NEVER use page.waitForTimeout() — use proper waits
- Parallel-safe: each test creates/deletes its own data

── CI WORKFLOW RULES ──────────────────────────────────────────────────────────

- Two jobs: smoke (Chromium only, fast) → full (matrix: 3 browsers, parallel)
- full job has needs: [smoke] so it only runs if smoke passes
- Browsers installed with --with-deps
- All secrets via ${{ secrets.* }}
- Artifacts uploaded on: always() with 14-day retention

════════════════════════════════════════════════
OUTPUT FORMAT
════════════════════════════════════════════════

Output EVERY file in full. For each file:
1. Start with a comment block: // filepath: relative/path/to/file.ts
2. Full file content, no placeholders, no TODOs
3. Separate files with a horizontal rule (---)

Do not summarise. Do not skip files. Generate all [N] files completely.
```

---

## ──────────────────────────────────────────────
## SECTION 2 — FRAMEWORK REFERENCE
## ──────────────────────────────────────────────

> This section explains **why** every decision was made.
> Use it to onboard new engineers, extend the framework, or feed back into AI for follow-up generation.

---

### 2.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         TEST FILE                               │
│  import { test, expect } from '../../fixtures'                  │
│  test('...', async ({ activityPageReady, activityFactory }) =>  │
└───────────────────────┬─────────────────────────────────────────┘
                        │ Dependency Injection via test.extend<T>
        ┌───────────────┼────────────────────────┐
        ▼               ▼                        ▼
  Page Objects     API Helper             Data Factories
  (pages/*.ts)  (helpers/api.ts)       (data/*.factory.ts)
        │
        ▼
   Base Page
 (pages/base.ts)
 shared helpers,
 assertions, waits
```

The test file **never** imports a page directly. It declares what it needs,
and the fixture system provides pre-constructed, pre-navigated instances.
This means zero setup code in tests.

---

### 2.2 Page Object Model Rules

| Rule | Reason |
|------|--------|
| Locators as class properties | Evaluated lazily; no stale element refs |
| `getByTestId()` only | Immune to CSS/text/layout changes |
| Compound methods (`createAndExpectSuccess`) | Tests read like requirements |
| Assertions inside POM methods | One place to fix when UI changes |
| `BasePage` for shared logic | No duplication across 10+ page classes |

**Locator naming convention:**

```
[element][Description][Type]
submitBtn         ✅
activityTitleInput ✅
btn               ❌  (too generic)
el                ❌  (meaningless)
```

---

### 2.3 Fixture System — The Core Pattern

```typescript
// fixtures/index.ts

export const test = base.extend<{
  loginPage: LoginPage;          // raw page object
  loginPageReady: LoginPage;     // navigated to /login
  api: ApiHelper;                // API seeding
  activityFactory: ActivityDataFactory;
  withActivity: { page: ActivityPage; title: string }; // lifecycle fixture
}>({

  // Page object — just construction
  loginPage: async ({ page }, use) => use(new LoginPage(page)),

  // Pre-navigated — construction + goto
  loginPageReady: async ({ loginPage }, use) => {
    await loginPage.navigate();
    await use(loginPage);
  },

  // Lifecycle fixture — seed → yield → cleanup
  withActivity: async ({ api, activityPage, activityFactory }, use) => {
    const activity = activityFactory.create();
    const { id } = await api.createActivity(activity);   // API seed
    await activityPage.navigate();
    await use({ page: activityPage, title: activity.title }); // yield
    await api.deleteActivity(id).catch(() => {});         // cleanup
  },
});
```

**Why fixtures instead of `beforeEach`?**
- Composable: declare only what you need
- Auto-cleanup: teardown runs even when tests fail
- Lazy: fixtures only instantiate if the test uses them
- Reusable across spec files without imports

---

### 2.4 Auth Strategy — storageState

```
global.setup.ts                     (runs ONCE, before all tests)
    │
    ├── page.goto('/login')
    ├── fill email + password
    ├── click submit
    ├── waitForURL('/dashboard')
    └── context.storageState({ path: 'fixtures/.auth/user.json' })
                                                │
                              ┌─────────────────┘
                              ▼
                  playwright.config.ts
                  projects[chromium:auth].storageState = './fixtures/.auth/user.json'
                              │
                              ▼
                  Every test in chromium:auth project starts
                  with cookies + localStorage already set.
                  No login step in tests. ✅
```

**Auth test files** (`tests/auth/**`) run under the `auth-tests` project
which has NO `storageState` — so they always get a fresh, unauthenticated
browser. This is intentional: auth tests must test the actual login flow.

---

### 2.5 API Seeding — Why It Matters

| Approach | Speed | Reliability | Coupling |
|----------|-------|-------------|----------|
| UI setup (fill form to create test data) | 🐢 Slow | ❌ Breaks when UI changes | High |
| API setup | ⚡ Fast | ✅ Stable | Low |

Rule: **Only test the UI you are actually testing.**
If you're testing the edit flow, create the item via API.
If you're testing the create flow, use the UI.

```typescript
// ❌ Anti-pattern: using UI to set up for an edit test
test('edit activity', async ({ activityPage }) => {
  await activityPage.createActivity(...)  // not what we're testing!
  await activityPage.editActivity(...)
});

// ✅ Correct: API seeds, UI tests the edit
test('edit activity', async ({ withActivity }) => {
  await withActivity.page.editActivityAndExpectSuccess(withActivity.title, {...});
});
```

---

### 2.6 Data Factory Pattern

```typescript
// Never hardcode test data in tests
❌  title: 'My Test Activity'       // collides across parallel runs
✅  title: activityFactory.create().title   // unique per run

// Factories accept overrides for targeted scenarios
activityFactory.create({ priority: 'high' })
activityFactory.createMany(5)
activityFactory.createWithSpecialChars()   // edge case testing
```

Factories use `@faker-js/faker` v9. Every field is unique per call,
preventing data collisions when tests run in parallel.

---

### 2.7 Selector Strategy (data-testid)

```html
<!-- App code — add testids to interactive elements -->
<button data-testid="create-activity-btn">Create</button>
<input  data-testid="activity-title-input" />
<div    data-testid="activity-row">...</div>
<span   data-testid="toast-success">Saved!</span>
```

```typescript
// Playwright — resilient selectors
this.page.getByTestId('create-activity-btn')   ✅ immune to CSS/text changes
this.page.locator('.btn-primary')              ❌ breaks on style refactor
this.page.getByText('Create')                  ❌ breaks on copy change
```

**Testid naming convention:** `[page/feature]-[element]-[type]`
- `activity-title-input`
- `create-activity-btn`
- `toast-success`
- `pagination-next`

---

### 2.8 Test Tagging & Running Strategy

```
@smoke  ──→  Critical happy paths. Run on every commit. <2 min target.
(none)  ──→  Full regression. Run on every PR + nightly schedule.
```

```bash
# Dev workflow
npm run test:ui                    # Interactive mode with time-travel
npm run test:debug                 # Step-through debugger
npm test -- --grep "Activity"      # Run matching tests only

# CI
npm run test:smoke                 # Fast feedback: every push
npm test -- --project=chromium:auth  # Specific project
ENV=staging npm test               # Run against staging
```

---

### 2.9 CI Pipeline Design

```
Push / PR
    │
    ▼
┌──────────┐     fails     ┌─────────────────────────────────┐
│  smoke   │──────────────▶│  STOP (don't run full suite)    │
│ (chrome) │               └─────────────────────────────────┘
└────┬─────┘
     │ passes
     ▼
┌────────────────────────────────────────────────┐
│            Full Suite (parallel matrix)        │
│  chromium:auth │ firefox:auth │ mobile:auth    │
└────────────────────────────────────────────────┘
     │
     ▼
┌──────────┐
│ Reports  │  HTML + JUnit uploaded as artifacts (14 days)
└──────────┘
```

Benefits:
- Fast feedback loop (smoke fails fast before wasting 10min on full suite)
- Cross-browser coverage without sequential bottleneck
- Artifacts always uploaded even when tests fail

---

### 2.10 Extending the Framework

**Adding a new page:**
1. Create `pages/settings.page.ts` extending `BasePage`
2. Add `settingsPage` fixture to `fixtures/index.ts`
3. Add `settingsPageReady` convenience fixture
4. Create `tests/settings/settings.spec.ts`

**Adding a new API method:**
1. Add method to `helpers/api.helper.ts`
2. Use it directly via the `api` fixture in tests or create a lifecycle fixture

**Adding a new environment:**
1. Create `.env.staging` with the correct `BASE_URL` and credentials
2. Run with `ENV=staging npm test`

**Adding a new browser:**
1. Add project in `playwright.config.ts` with `storageState` + `dep: setup`
2. Add to the matrix in `.github/workflows/playwright.yml`

---

### 2.11 Common Mistakes to Avoid

| ❌ Don't | ✅ Do instead |
|---------|--------------|
| `page.waitForTimeout(2000)` | `page.waitForSelector(...)` or use fixture waits |
| Import page classes in test files | Import only from `fixtures/index.ts` |
| Hardcode test data strings | Use factory methods |
| UI setup for non-UI tests | Seed via `api` fixture |
| Share state between tests | Each test owns its data lifecycle |
| Assert on CSS classes | Assert on `data-testid` content/visibility |
| Use `page.locator('button')` alone | Use scoped: `row.locator('[data-testid="edit-btn"]')` |

---

### 2.12 Folder Responsibilities (quick reference)

| Folder | Owns | Does NOT own |
|--------|------|--------------|
| `pages/` | UI interactions, locators, page assertions | Test data, test flow |
| `fixtures/` | Wiring, DI, auth state | Business logic |
| `helpers/` | API calls | UI interactions |
| `data/` | Test data generation | Network calls |
| `tests/` | Test scenarios, assertions | Setup logic |
| `config/` | Global setup/teardown hooks | Test execution |
| `types/` | Shared TypeScript interfaces | Implementation |

---

### 2.13 Dependencies

```json
{
  "@playwright/test": "^1.50.0",
  "@faker-js/faker": "^9.0.0",
  "typescript": "^5.7.0",
  "dotenv": "^16.4.0"
}
```

Node.js: **22 LTS** (minimum 18)
Playwright browsers: Chromium, Firefox, WebKit (install with `npx playwright install`)

---

*Framework version: 2026.1 — maintained for Playwright ≥ 1.50*
