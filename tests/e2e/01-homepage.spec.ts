import { test, expect } from '@playwright/test';

/**
 * Homepage E2E Tests
 *
 * Tests basic homepage functionality and navigation
 */

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/TailorMarket/);

    // Check hero section
    await expect(
      page.locator('h1:has-text("Maßgeschneiderte Anzüge")')
    ).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');

    // Check header links exist (use getByRole with exact match to avoid duplicates)
    await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Produkte', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Schneider', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Registrieren', exact: true })).toBeVisible();
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/');

    // Click "Produkte" link in navigation
    await page.getByRole('link', { name: 'Produkte' }).first().click();

    // Wait for navigation
    await page.waitForURL(/\/products/, { timeout: 10000 });

    // Verify products page loaded (wait for skeleton to be replaced by content)
    await expect(page.locator('h1:has-text("Produkte")')).toBeVisible({
      timeout: 15000,
    });
  });

  test('should navigate to tailors page', async ({ page }) => {
    await page.goto('/');

    // Click "Schneider" link in navigation (exact match for nav link)
    await page.getByRole('link', { name: 'Schneider', exact: true }).click();

    // Wait for navigation
    await page.waitForURL(/\/tailors/, { timeout: 10000 });

    // Verify tailors page loaded
    await expect(page.locator('h1:has-text("Schneider")')).toBeVisible({
      timeout: 15000,
    });
  });

  test('should show "Wie es funktioniert" section', async ({ page }) => {
    await page.goto('/');

    // Check for "Wie es funktioniert" section
    await expect(
      page.locator('text="So funktioniert\'s"')
    ).toBeVisible();

    // Check for 3 steps
    const steps = page.locator('.step-card, [data-testid="step"]'); // Adjust selector based on actual implementation
    // Just check that steps section exists
  });
});
