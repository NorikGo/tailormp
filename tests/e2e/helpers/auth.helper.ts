import { Page, expect } from '@playwright/test';

/**
 * Authentication Helper Functions for E2E Tests
 */

export interface TestUser {
  email: string;
  password: string;
  role: 'customer' | 'tailor';
}

export const TEST_USERS = {
  customer: {
    email: 'test-customer@example.com',
    password: 'TestPassword123!',
    role: 'customer' as const,
  },
  tailor: {
    email: 'test-tailor@example.com',
    password: 'TestPassword123!',
    role: 'tailor' as const,
  },
};

/**
 * Register a new user
 */
export async function registerUser(page: Page, user: TestUser) {
  await page.goto('/register');

  // Fill form
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.fill('input[name="confirmPassword"]', user.password);

  // Select role
  await page.click(`input[value="${user.role}"]`);

  // Submit
  await page.click('button[type="submit"]');

  // Wait for redirect or success message
  await page.waitForURL(/\/(login|$)/, { timeout: 10000 });
}

/**
 * Login as existing user
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');

  // Fill credentials
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  // Submit
  await page.click('button[type="submit"]');

  // Wait for redirect to home
  await page.waitForURL('/', { timeout: 10000 });

  // Verify logged in (header should show user menu)
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible({
    timeout: 5000,
  });
}

/**
 * Logout current user
 */
export async function logout(page: Page) {
  // Click user menu
  await page.click('[data-testid="user-menu"]');

  // Click logout
  await page.click('text="Abmelden"');

  // Wait for redirect to home
  await page.waitForURL('/', { timeout: 10000 });

  // Verify logged out (login button should be visible)
  await expect(page.locator('a[href="/login"]')).toBeVisible();
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    await page.locator('[data-testid="user-menu"]').waitFor({
      state: 'visible',
      timeout: 1000,
    });
    return true;
  } catch {
    return false;
  }
}
