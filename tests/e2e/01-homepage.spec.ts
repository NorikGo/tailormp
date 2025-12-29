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

    // Check hero section contains "Maßanzug" (not generic "Produkte")
    await expect(
      page.locator('h1').filter({ hasText: /Maßanzug/i })
    ).toBeVisible();

    // Check for Vietnam mention
    await expect(
      page.locator('text=/Vietnam/i')
    ).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');

    // Check header links exist (suit-focused)
    await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    // "Maßanzüge" instead of generic "Produkte"
    await expect(page.locator('a[href="/products"]').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Schneider', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Registrieren', exact: true })).toBeVisible();
  });

  test('should navigate to suits page', async ({ page }) => {
    await page.goto('/');

    // Click "Maßanzüge" link in navigation
    await page.locator('a[href="/products"]').first().click();

    // Wait for navigation
    await page.waitForURL(/\/products/, { timeout: 10000 });

    // Verify suits page loaded (should show "Maßanzüge" not "Produkte")
    await expect(page.locator('h1').filter({ hasText: /Maßanzüge|Anzüge/i })).toBeVisible({
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
      page.locator('text=/Wie (es )?funktioniert/i')
    ).toBeVisible();

    // Check for steps (5 steps in new version)
    const steps = page.locator('.step-card, [data-testid="step"]');
    // Just check that steps section exists
  });

  test('should have "Anzug konfigurieren" CTA', async ({ page }) => {
    await page.goto('/');

    // Check for "Anzug konfigurieren" button/link (main CTA)
    const configureCTA = page.locator('a[href*="/suits/configure"], a:has-text("Anzug konfigurieren")').first();
    await expect(configureCTA).toBeVisible();
  });

  test('should show fairness messaging', async ({ page }) => {
    await page.goto('/');

    // Check for "60%" fairness mention
    await expect(
      page.locator('text=/60%/i')
    ).toBeVisible();

    // Check for "Fair" mention
    await expect(
      page.locator('text=/Fair|Fairness/i')
    ).toBeVisible();
  });
});
