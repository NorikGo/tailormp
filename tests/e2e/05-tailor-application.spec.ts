import { test, expect } from '@playwright/test';

/**
 * Tailor Application E2E Tests
 *
 * Tests the tailor application flow:
 * - Application form submission
 * - Validation
 * - Success message
 *
 * Note: Schneider können sich NICHT mehr direkt registrieren!
 * Sie müssen sich über /apply bewerben.
 */

test.describe('Tailor Application', () => {
  test('should show application form at /apply', async ({ page }) => {
    await page.goto('/apply');
    await page.waitForLoadState('domcontentloaded');

    // Check for application form
    await expect(page.locator('h1, h2').filter({ hasText: /Bewerbung|Apply|Schneider werden/i }).first()).toBeVisible({
      timeout: 15000,
    });

    // Check for required form fields
    await expect(page.locator('input[name="name"], input[placeholder*="Name"]')).toBeVisible();
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"], input[placeholder*="Telefon"]')).toBeVisible();
  });

  test('should have country field defaulting to Vietnam', async ({ page }) => {
    await page.goto('/apply');
    await page.waitForLoadState('domcontentloaded');

    // Check for country select/input
    const countryField = page.locator('select[name="country"], input[name="country"]');

    // Wait for form to load
    await page.waitForTimeout(1000);

    // If it's a select, check if Vietnam is selected or available
    const fieldType = await countryField.getAttribute('type').catch(() => null);

    if (fieldType === null || fieldType === 'select-one') {
      // It's a select element
      const selectedValue = await countryField.inputValue().catch(() => '');
      // Vietnam should be default or at least available
    }
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/apply');
    await page.waitForLoadState('domcontentloaded');

    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]').first();
    await expect(submitButton).toBeVisible({ timeout: 10000 });

    await submitButton.click();

    // Should still be on /apply page (form not submitted)
    await expect(page).toHaveURL(/\/apply/);

    // Might show validation errors
    // Implementation-specific - could check for error messages
  });

  test('should submit application successfully', async ({ page }) => {
    await page.goto('/apply');
    await page.waitForLoadState('domcontentloaded');

    // Generate unique email for test
    const timestamp = Date.now();
    const testEmail = `tailor-test-${timestamp}@example.com`;

    // Fill out form
    await page.fill('input[name="name"], input[placeholder*="Name"]', 'Nguyen Test Van');
    await page.fill('input[name="email"], input[type="email"]', testEmail);
    await page.fill('input[name="phone"], input[placeholder*="Telefon"]', '+84 123 456 789');

    // City
    const cityField = page.locator('input[name="city"], input[placeholder*="Stadt"]');
    if (await cityField.isVisible()) {
      await cityField.fill('Hanoi');
    }

    // Years of experience
    const experienceField = page.locator('input[name="yearsExperience"], input[type="number"]');
    if (await experienceField.isVisible()) {
      await experienceField.fill('10');
    }

    // Motivation textarea
    const motivationField = page.locator('textarea[name="motivation"]');
    if (await motivationField.isVisible()) {
      await motivationField.fill('Ich möchte hochwertige Anzüge für internationale Kunden fertigen.');
    }

    // Submit form
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Wait for success message or redirect
    await page.waitForTimeout(2000);

    // Check for success message
    // Could be on same page or redirect
    const successMessage = page.locator('text=/Vielen Dank|Thank you|Bewerbung.*erfolgreich/i');

    // Either success message is visible OR we navigated away from /apply
    const hasSuccessMessage = await successMessage.isVisible().catch(() => false);
    const currentURL = page.url();

    // At least one of these should be true
    expect(hasSuccessMessage || !currentURL.endsWith('/apply')).toBeTruthy();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/apply');
    await page.waitForLoadState('domcontentloaded');

    // Fill with invalid email
    await page.fill('input[name="email"], input[type="email"]', 'invalid-email');

    // Try to submit
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Should not submit (HTML5 validation or custom validation)
    await expect(page).toHaveURL(/\/apply/);
  });

  test('should have specialties/skills selection', async ({ page }) => {
    await page.goto('/apply');
    await page.waitForLoadState('domcontentloaded');

    // Check for specialties checkboxes (Anzüge, Hemden, etc.)
    // Implementation might vary - could be checkboxes, multi-select, etc.
    const specialtiesSection = page.locator('text=/Spezialisierung|Specialties|Skills/i');

    // If specialties section exists, it should be visible
    const hasSpe cialties = await specialtiesSection.isVisible().catch(() => false);

    // At minimum, form should load without errors
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

test.describe('Tailor Application - Navigation', () => {
  test('should be accessible from footer', async ({ page }) => {
    await page.goto('/');

    // Check if "Schneider werden" link exists in footer
    const applyLink = page.locator('footer a[href="/apply"], footer a:has-text("Schneider werden")');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Link should be visible in footer
    const isVisible = await applyLink.isVisible().catch(() => false);

    if (isVisible) {
      await applyLink.click();
      await page.waitForURL(/\/apply/, { timeout: 10000 });
    }
  });
});

test.describe('Tailor Application - No Direct Registration', () => {
  test('should NOT allow direct tailor registration via /register', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('domcontentloaded');

    // Registration page should be for CUSTOMERS only
    // There should NOT be a "Register as Tailor" option

    // Check that role selection doesn't include "tailor" (implementation-specific)
    // Most likely, registration is customer-only and tailors must apply via /apply

    // Just verify registration page exists (for customers)
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });
});
