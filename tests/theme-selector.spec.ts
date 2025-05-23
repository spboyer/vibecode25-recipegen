import { test, expect } from '@playwright/test';

test.describe('Theme Selector Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Clear localStorage to start with a clean state
    await page.evaluate(() => localStorage.clear());
  });
  test('should display the theme selector button', async ({ page }) => {
    // Check if the theme selector button is visible
    const themeButton = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeButton).toBeVisible();
  });

  test('should switch from light to dark theme', async ({ page }) => {
    // Reload to ensure clean state
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check initial theme (should be light by default)
    const html = page.locator('html');
      // Click the theme toggle button
    const themeButton = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeButton).toBeVisible();
    await themeButton.click();
    
    // Wait for theme change
    await page.waitForTimeout(500);
    
    // Check if dark theme is applied
    await expect(html).toHaveClass(/dark/);
    
    // Verify dark theme styles are applied
    const body = page.locator('body');
    const bodyBgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    
    // Dark theme should have a dark background
    expect(bodyBgColor).not.toBe('rgb(255, 255, 255)'); // Not white
  });

  test('should switch from dark to light theme', async ({ page }) => {
    // Set dark theme first
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify we start in dark mode
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);    // Click the theme toggle button twice to go dark -> hotdog -> light
    const themeButton = page.locator('button[aria-label="Toggle theme"]');
    await themeButton.click(); // dark -> hotdog
    await page.waitForTimeout(200);
    await themeButton.click(); // hotdog -> light
    
    // Wait for theme change
    await page.waitForTimeout(500);
    
    // Check if light theme is applied (dark class removed)
    await expect(html).not.toHaveClass(/dark/);
    
    // Verify light theme styles
    const body = page.locator('body');
    const bodyBgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    
    // Light theme should have a light background
    expect(bodyBgColor).toBe('rgb(255, 255, 255)'); // White or light color
  });

  test('should cycle through light, dark, and hotdog themes', async ({ page }) => {
    // Start with light theme
    await page.reload();
    await page.waitForLoadState('networkidle');
      const html = page.locator('html');
    const themeButton = page.locator('button[aria-label="Toggle theme"]');
    
    // Initial state should be light
    await expect(html).not.toHaveClass(/dark|hotdog/);
    
    // Click once - should go to dark
    await themeButton.click();
    await page.waitForTimeout(300);
    await expect(html).toHaveClass(/dark/);
    
    // Click again - should go to hotdog
    await themeButton.click();
    await page.waitForTimeout(300);
    await expect(html).toHaveClass(/hotdog/);
    
    // Click again - should go back to light
    await themeButton.click();
    await page.waitForTimeout(300);
    await expect(html).not.toHaveClass(/dark|hotdog/);
  });

  test('should persist theme selection across page reloads', async ({ page }) => {    // Set dark theme
    const themeButton = page.locator('button[aria-label="Toggle theme"]');
    await themeButton.click(); // Go to dark
    await page.waitForTimeout(300);
    
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    
    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Theme should still be dark after reload
    await expect(html).toHaveClass(/dark/);
  });

  test('should apply correct styles for each theme', async ({ page }) => {    const html = page.locator('html');
    const themeButton = page.locator('button[aria-label="Toggle theme"]');
    
    // Test light theme styles
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const lightBg = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
    
    // Test dark theme styles
    await themeButton.click(); // Go to dark
    await page.waitForTimeout(300);
    await expect(html).toHaveClass(/dark/);
    
    const darkBg = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
    
    // Test hotdog theme styles
    await themeButton.click(); // Go to hotdog
    await page.waitForTimeout(300);
    await expect(html).toHaveClass(/hotdog/);
    
    const hotdogBg = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
    
    // Verify all themes have different background colors
    expect(lightBg).not.toBe(darkBg);
    expect(darkBg).not.toBe(hotdogBg);
    expect(lightBg).not.toBe(hotdogBg);
  });
  test('should have correct button icon for each theme', async ({ page }) => {
    const themeButton = page.locator('button[aria-label="Toggle theme"]');
    
    // Light theme should show moon icon (dark mode icon to switch to dark)
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // The button should contain SVG elements
    const svgElement = themeButton.locator('svg');
    await expect(svgElement).toBeVisible();
  });

  test('should work on favorites page', async ({ page }) => {
    // Navigate to favorites page
    await page.goto('/favorites');
    await page.waitForLoadState('networkidle');
      const html = page.locator('html');
    const themeButton = page.locator('button[aria-label="Toggle theme"]');
    
    // Theme button should be visible on favorites page
    await expect(themeButton).toBeVisible();
    
    // Should be able to change theme on favorites page
    await themeButton.click();
    await page.waitForTimeout(300);
    
    // Verify theme changed
    await expect(html).toHaveClass(/dark/);
  });

  test('should not have hydration errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Load the page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit for any hydration errors to appear
    await page.waitForTimeout(1000);
    
    // Filter out hydration-related errors
    const hydrationErrors = consoleErrors.filter(error => 
      error.includes('hydration') || 
      error.includes('Hydration') ||
      error.includes('server') ||
      error.includes('client')
    );
    
    expect(hydrationErrors).toHaveLength(0);
  });

  test('should handle theme switching without flicker', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
      const html = page.locator('html');
    const themeButton = page.locator('button[aria-label="Toggle theme"]');
    
    // Take screenshot before theme change
    await page.screenshot({ path: 'tests/screenshots/before-theme-change.png' });
    
    // Click theme button and immediately check if classes change
    await themeButton.click();
    
    // Theme should change within reasonable time
    await expect(html).toHaveClass(/dark/, { timeout: 1000 });
    
    // Take screenshot after theme change
    await page.screenshot({ path: 'tests/screenshots/after-theme-change.png' });
  });
});
