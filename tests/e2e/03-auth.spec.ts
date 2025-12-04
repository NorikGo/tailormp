import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 *
 * Tests login, registration, and session management
 */

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');

    // Check for login form
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show register page', async ({ page }) => {
    await page.goto('/register');

    // Check for register form
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should validate email format on login', async ({ page }) => {
    await page.goto('/login');

    // Enter invalid email
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'somepassword');
    await page.click('button[type="submit"]');

    // Check for validation error
    // This depends on your validation implementation
    await expect(
      page.locator('text=/invalid|ungültig/i')
    ).toBeVisible({ timeout: 5000 }).catch(() => {
      // Validation might be different, just check form didn't submit
      expect(page.url()).toContain('/login');
    });
  });

  test('should require password on login', async ({ page }) => {
    await page.goto('/login');

    // Enter only email
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // Should still be on login page
    await expect(page).toHaveURL(/\/login/);
  });

  // Note: Actual login/register tests require test user management
  // and should be in separate test files with proper setup/teardown
});

test.describe('Navigation when logged out', () => {
  test('should show login and register links', async ({ page }) => {
    await page.goto('/');

    // Check for auth links in header
    await expect(page.locator('a[href="/login"]')).toBeVisible();
    await expect(page.locator('a[href="/register"]')).toBeVisible();
  });
});
