# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orders.spec.ts >> Order Management >> should allow updating an order status
- Location: tests\orders.spec.ts:47:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="email"]')

```

# Page snapshot

```yaml
- main [ref=e3]:
  - paragraph [ref=e4]:
    - generic [ref=e5]:
      - strong [ref=e6]: "404"
      - text: ": NOT_FOUND"
    - generic [ref=e7]:
      - text: "Code:"
      - code [ref=e8]: "`NOT_FOUND`"
    - generic [ref=e9]:
      - text: "ID:"
      - code [ref=e10]: "`bom1::p4znc-1781544501552-e55a9e827326`"
  - link "Read our documentation to learn more about this error." [ref=e11] [cursor=pointer]:
    - /url: https://vercel.com/docs/errors/NOT_FOUND
    - generic [ref=e12]: Read our documentation to learn more about this error.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Order Management', () => {
  4  |   const customerName = `Test Customer ${Date.now()}`;
  5  |   const customerPhone = '1234567890';
  6  |   let orderId = '';
  7  | 
  8  |   test.beforeEach(async ({ page }) => {
  9  |     // Log in before each test
  10 |     await page.goto('/login');
> 11 |     await page.fill('input[name="email"]', 'admin@example.com');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  12 |     await page.fill('input[name="password"]', 'password');
  13 |     await page.click('button[type="submit"]');
  14 |     await page.waitForURL('/dashboard');
  15 |   });
  16 | 
  17 |   test('should allow creating a new order', async ({ page }) => {
  18 |     // Navigate to new order page
  19 |     await page.goto('/orders/new');
  20 |     await expect(page.locator('h1:has-text("Create New Order")')).toBeVisible();
  21 | 
  22 |     // Fill out the form
  23 |     await page.fill('input[name="customer_name"]', customerName);
  24 |     await page.fill('input[name="customer_phone"]', customerPhone);
  25 |     await page.fill('textarea[name="item_description"]', '2 test shirts');
  26 |     
  27 |     // Select the first service
  28 |     await page.locator('.grid.grid-cols-2.md\:grid-cols-3 > div').first().locator('input[type="checkbox"]').check();
  29 | 
  30 |     await page.fill('input[name="expected_delivery_date"]', '2026-12-25');
  31 | 
  32 |     // Create order
  33 |     await page.click('button:has-text("Create Order and Generate QR Code")');
  34 | 
  35 |     // Verify success
  36 |     await expect(page.locator('h2:has-text("Order Created Successfully!")')).toBeVisible();
  37 |     await expect(page.locator('img[alt="QR Code"]')).toBeVisible();
  38 | 
  39 |     // Go back to orders page
  40 |     await page.click('button:has-text("Back to Orders")');
  41 |     await page.waitForURL('/orders');
  42 | 
  43 |     // Verify the new order is in the list
  44 |     await expect(page.locator(`tr:has-text("${customerName}")`)).toBeVisible();
  45 |   });
  46 | 
  47 |   test('should allow updating an order status', async ({ page }) => {
  48 |     // Find the order created in the previous test
  49 |     await page.goto('/orders');
  50 |     const orderRow = page.locator(`tr:has-text("${customerName}")`);
  51 |     await orderRow.locator('a:has-text("View")').click();
  52 | 
  53 |     // Get order ID from URL for later verification if needed
  54 |     const url = page.url();
  55 |     orderId = url.split('/').pop()!;
  56 |     expect(orderId).not.toBe('');
  57 | 
  58 |     await expect(page.locator('h1:has-text("Order #")')).toBeVisible();
  59 |     
  60 |     // Check initial status
  61 |     await expect(page.locator('p:has-text("Received")')).toBeVisible();
  62 | 
  63 |     // Update status to "At Cleaning Plant"
  64 |     await page.click('button:has-text("At Cleaning Plant")');
  65 | 
  66 |     // Verify the status is updated on the page
  67 |     await expect(page.locator('p:has-text("At Cleaning Plant")')).toBeVisible();
  68 | 
  69 |     // Verify the history is updated
  70 |     await expect(page.locator('li:has-text("At Cleaning Plant")')).toBeVisible();
  71 |   });
  72 | });
  73 | 
```