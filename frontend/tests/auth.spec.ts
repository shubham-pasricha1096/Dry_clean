import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow a user to log in and log out', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    await expect(page).toHaveTitle(/CleanTrack/);

    // Fill in credentials
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password');

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation and check for dashboard element
    await page.waitForURL('/dashboard');
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();

    // In a real app, you'd have a logout button. We'll simulate by clearing storage and reloading.
    // This is a workaround as there is no logout button in the current UI.
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Verify user is redirected to login
    await page.waitForURL('/login');
    await expect(page.locator('h1:has-text("Login")')).toBeVisible();
  });
});
