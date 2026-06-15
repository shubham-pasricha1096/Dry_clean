import { test, expect } from '@playwright/test';

test.describe('Order Management', () => {
  const customerName = `Test Customer ${Date.now()}`;
  const customerPhone = '1234567890';
  let orderId = '';

  test.beforeEach(async ({ page }) => {
    // Log in before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should allow creating a new order', async ({ page }) => {
    // Navigate to new order page
    await page.goto('/orders/new');
    await expect(page.locator('h1:has-text("Create New Order")')).toBeVisible();

    // Fill out the form
    await page.fill('input[name="customer_name"]', customerName);
    await page.fill('input[name="customer_phone"]', customerPhone);
    await page.fill('textarea[name="item_description"]', '2 test shirts');
    
    // Select the first service
    await page.locator('.grid.grid-cols-2.md\:grid-cols-3 > div').first().locator('input[type="checkbox"]').check();

    await page.fill('input[name="expected_delivery_date"]', '2026-12-25');

    // Create order
    await page.click('button:has-text("Create Order and Generate QR Code")');

    // Verify success
    await expect(page.locator('h2:has-text("Order Created Successfully!")')).toBeVisible();
    await expect(page.locator('img[alt="QR Code"]')).toBeVisible();

    // Go back to orders page
    await page.click('button:has-text("Back to Orders")');
    await page.waitForURL('/orders');

    // Verify the new order is in the list
    await expect(page.locator(`tr:has-text("${customerName}")`)).toBeVisible();
  });

  test('should allow updating an order status', async ({ page }) => {
    // Find the order created in the previous test
    await page.goto('/orders');
    const orderRow = page.locator(`tr:has-text("${customerName}")`);
    await orderRow.locator('a:has-text("View")').click();

    // Get order ID from URL for later verification if needed
    const url = page.url();
    orderId = url.split('/').pop()!;
    expect(orderId).not.toBe('');

    await expect(page.locator('h1:has-text("Order #")')).toBeVisible();
    
    // Check initial status
    await expect(page.locator('p:has-text("Received")')).toBeVisible();

    // Update status to "At Cleaning Plant"
    await page.click('button:has-text("At Cleaning Plant")');

    // Verify the status is updated on the page
    await expect(page.locator('p:has-text("At Cleaning Plant")')).toBeVisible();

    // Verify the history is updated
    await expect(page.locator('li:has-text("At Cleaning Plant")')).toBeVisible();
  });
});
