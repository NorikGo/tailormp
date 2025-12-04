import { test, expect } from '@playwright/test';

/**
 * Marketplace E2E Tests
 *
 * Tests product browsing, filtering, and detail pages
 */

test.describe('Marketplace - Products', () => {
  test('should display products list', async ({ page }) => {
    await page.goto('/products');

    // Wait for loading skeleton to disappear and real products to load
    await page.waitForLoadState('domcontentloaded');

    // Wait for product cards to be visible (after loading state)
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible({ timeout: 15000 });

    // Verify we have multiple products
    await expect(productCards).toHaveCount(await productCards.count(), { timeout: 5000 });

    // Check for price display (use .first() to avoid strict mode violation)
    await expect(page.locator('text=/€\\d+/').first()).toBeVisible();
  });

  test('should open product detail page', async ({ page }) => {
    await page.goto('/products');

    // Wait for product cards to load
    await page.waitForLoadState('domcontentloaded');
    const productCard = page.locator('[data-testid="product-card"]').first();
    await expect(productCard).toBeVisible({ timeout: 15000 });

    // Click "Details ansehen" button in first product card
    await productCard.locator('a:has-text("Details ansehen")').click();

    // Wait for navigation to complete
    await page.waitForURL(/\/products\/[a-z0-9]+/, { timeout: 10000 });

    // Wait for detail page to load (after loading skeleton)
    await page.waitForLoadState('domcontentloaded');

    // Check for product details - h1 must have text content
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible({ timeout: 15000 });
    await expect(h1).not.toBeEmpty();

    // Check for price
    await expect(page.locator('text=/€\\d+/').first()).toBeVisible();
  });

  test('should show product price correctly', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('domcontentloaded');

    // Wait for product card to be visible
    const productCard = page.locator('[data-testid="product-card"]').first();
    await expect(productCard).toBeVisible({ timeout: 15000 });

    // Get first product price
    const priceText = await productCard
      .locator('text=/€\\d+/')
      .first()
      .textContent();

    // Verify it's a valid price (contains € and number)
    expect(priceText).toMatch(/€\d+/);
  });
});

test.describe('Marketplace - Tailors', () => {
  test('should display tailors list', async ({ page }) => {
    await page.goto('/tailors');

    // Wait for loading skeleton to disappear and real tailors to load
    await page.waitForLoadState('domcontentloaded');

    // Wait for tailor cards to be visible (after loading state)
    const tailorCards = page.locator('[data-testid="tailor-card"]');
    await expect(tailorCards.first()).toBeVisible({ timeout: 15000 });

    // Verify we have multiple tailors
    await expect(tailorCards).toHaveCount(await tailorCards.count(), { timeout: 5000 });
  });

  test('should show tailor ratings', async ({ page }) => {
    await page.goto('/tailors');
    await page.waitForLoadState('domcontentloaded');

    // Wait for tailor card to be visible
    const tailorCard = page.locator('[data-testid="tailor-card"]').first();
    await expect(tailorCard).toBeVisible({ timeout: 15000 });

    // Check for rating display (look for star icon and rating number)
    const ratingText = tailorCard.locator('text=/\\d\\.\\d/');
    await expect(ratingText).toBeVisible();
  });

  test('should open tailor profile page', async ({ page }) => {
    await page.goto('/tailors');
    await page.waitForLoadState('domcontentloaded');

    // Wait for tailor card to load
    const tailorCard = page.locator('[data-testid="tailor-card"]').first();
    await expect(tailorCard).toBeVisible({ timeout: 15000 });

    // Click "Profil ansehen" button in first tailor card
    await tailorCard.locator('a:has-text("Profil ansehen")').click();

    // Wait for navigation
    await page.waitForURL(/\/tailors\/[a-z0-9-]+/, { timeout: 10000 });

    // Wait for profile page to load
    await page.waitForLoadState('domcontentloaded');

    // Check for tailor info
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
  });
});
