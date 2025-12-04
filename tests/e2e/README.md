# E2E Tests - TailorMarket

End-to-End tests using Playwright Test Framework.

## 🏃 Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run specific test file
```bash
npx playwright test tests/e2e/01-homepage.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Run specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 📊 View Test Reports

### After running tests, view HTML report
```bash
npx playwright show-report
```

## 🧪 Test Structure

```
tests/e2e/
├── 01-homepage.spec.ts       # Homepage and basic navigation
├── 02-marketplace.spec.ts    # Products and tailors browsing
├── 03-auth.spec.ts          # Login and registration
├── helpers/
│   ├── auth.helper.ts       # Authentication helpers
│   └── db.helper.ts         # Database setup/cleanup
└── fixtures/
    └── (test data files)
```

## 🔧 Test Helpers

### Authentication Helper
```typescript
import { login, logout, registerUser, TEST_USERS } from './helpers/auth.helper';

// Login as test customer
await login(page, TEST_USERS.customer.email, TEST_USERS.customer.password);

// Register new user
await registerUser(page, {
  email: 'newuser@test.com',
  password: 'TestPass123!',
  role: 'customer',
});

// Logout
await logout(page);
```

### Database Helper
```typescript
import { cleanupTestUsers, getUserByEmail, disconnectDB } from './helpers/db.helper';

// Cleanup test data
test.afterAll(async () => {
  await cleanupTestUsers();
  await disconnectDB();
});
```

## 📝 Writing New Tests

### Test Template
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path');

    // Your test code
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Best Practices

1. **Use data-testid attributes** for stable selectors
   ```html
   <div data-testid="product-card">...</div>
   ```
   ```typescript
   page.locator('[data-testid="product-card"]')
   ```

2. **Wait for network idle** when loading dynamic content
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

3. **Use meaningful test descriptions**
   ```typescript
   test('should display products with valid prices', ...)
   ```

4. **Clean up test data** in afterAll/afterEach
   ```typescript
   test.afterAll(async () => {
     await cleanupTestUsers();
   });
   ```

5. **Handle async operations properly**
   ```typescript
   await expect(element).toBeVisible({ timeout: 10000 });
   ```

## 🐛 Debugging Failed Tests

### 1. View trace
```bash
npx playwright show-trace trace.zip
```

### 2. View screenshot
Screenshots are saved to `test-results/` for failed tests

### 3. View video
Videos are saved to `test-results/` for failed tests

### 4. Run in headed mode
```bash
npx playwright test --headed --slowMo=1000
```

## 🔒 Testing Protected Routes

For tests that require authentication:

```typescript
import { login, TEST_USERS } from './helpers/auth.helper';

test.describe('Protected Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page, TEST_USERS.customer.email, TEST_USERS.customer.password);
  });

  test('should access protected page', async ({ page }) => {
    await page.goto('/dashboard');
    // Test protected functionality
  });
});
```

## 📦 Test Data Management

### Using test database
Set environment variable:
```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/test_db"
```

### Cleanup between tests
```typescript
import { cleanupTestUsers, cleanupTestOrders } from './helpers/db.helper';

test.afterEach(async () => {
  await cleanupTestUsers();
  await cleanupTestOrders('user-id');
});
```

## 🎯 Coverage Goals

- **Critical Paths:** 100% (Auth, Checkout, Orders)
- **Feature Pages:** 80% (Products, Tailors, Reviews)
- **Edge Cases:** 50% (Error handling, validation)

## 📚 Useful Links

- [Playwright Docs](https://playwright.dev)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
