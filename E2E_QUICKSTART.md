# E2E Testing Quick Start

**Setup Complete!** ✅ Ready to run Playwright tests.

---

## 🚀 Run Your First Test

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI (recommended for first time)
npm run test:e2e:ui

# Run in headed mode (see the browser)
npm run test:e2e:headed
```

---

## 📝 What Tests Are Available?

### 1. Homepage Tests (01-homepage.spec.ts)
```bash
npx playwright test tests/e2e/01-homepage.spec.ts
```
- ✅ Homepage loads successfully
- ✅ Navigation links work
- ✅ Can navigate to Products/Tailors pages

### 2. Marketplace Tests (02-marketplace.spec.ts)
```bash
npx playwright test tests/e2e/02-marketplace.spec.ts
```
- ✅ Products list displays
- ✅ Product detail page opens
- ✅ Prices show correctly
- ✅ Tailors list displays
- ✅ Tailor profile page opens

### 3. Authentication Tests (03-auth.spec.ts)
```bash
npx playwright test tests/e2e/03-auth.spec.ts
```
- ✅ Login page renders
- ✅ Register page renders
- ✅ Form validation works

---

## 🎯 Expected Results

**First Run:**
- Some tests may fail due to missing `data-testid` attributes
- Basic navigation tests should pass
- API-based tests (products, tailors) should pass

**To Fix Failing Tests:**
Add `data-testid` attributes to components:

```tsx
// Product Card
<div data-testid="product-card">...</div>

// Tailor Card
<div data-testid="tailor-card">...</div>

// User Menu
<button data-testid="user-menu">...</button>
```

---

## 📊 View Test Results

After running tests:

```bash
# Open HTML report
npx playwright show-report

# View specific test trace
npx playwright show-trace trace.zip
```

Reports are saved to `playwright-report/`

---

## 🐛 Debugging Failed Tests

### Option 1: Run in Headed Mode
```bash
npm run test:e2e:headed
```
See the browser in action!

### Option 2: Use Debug Mode
```bash
npm run test:e2e:debug
```
Step through tests line by line.

### Option 3: Generate New Tests
```bash
npx playwright codegen localhost:3000
```
Record interactions and generate test code.

---

## ✨ Next Steps

1. **Run the tests**
   ```bash
   npm run test:e2e:ui
   ```

2. **Add data-testid attributes** to components that fail

3. **Extend test coverage**
   - Cart & Checkout flow
   - Order management
   - Tailor product creation

4. **View documentation**
   - [PHASE8_E2E_SETUP.md](PHASE8_E2E_SETUP.md) - Full setup guide
   - [tests/e2e/README.md](tests/e2e/README.md) - Testing guide

---

## 📚 Useful Commands

```bash
# Run specific test
npx playwright test -g "should load homepage"

# Run only failed tests
npx playwright test --last-failed

# Update snapshots
npx playwright test --update-snapshots

# Show browsers
npx playwright test --list

# Slow down tests
npx playwright test --headed --slowMo=1000
```

---

**Happy Testing!** 🎉

For questions, check: [tests/e2e/README.md](tests/e2e/README.md)
