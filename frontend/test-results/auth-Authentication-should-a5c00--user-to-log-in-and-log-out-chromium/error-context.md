# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication >> should allow a user to log in and log out
- Location: tests\auth.spec.ts:4:7

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /CleanTrack/
Received string:  "404: NOT_FOUND"
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    13 × unexpected value "404: NOT_FOUND"

```

```yaml
- main:
  - paragraph:
    - strong: "404"
    - text: ": NOT_FOUND Code:"
    - code: "`NOT_FOUND`"
    - text: "ID:"
    - code: "`bom1::pdxgm-1781544501551-99fe207aba60`"
  - link "Read our documentation to learn more about this error.":
    - /url: https://vercel.com/docs/errors/NOT_FOUND
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Authentication', () => {
  4  |   test('should allow a user to log in and log out', async ({ page }) => {
  5  |     // Navigate to login page
  6  |     await page.goto('/login');
> 7  |     await expect(page).toHaveTitle(/CleanTrack/);
     |                        ^ Error: expect(page).toHaveTitle(expected) failed
  8  | 
  9  |     // Fill in credentials
  10 |     await page.fill('input[name="email"]', 'admin@example.com');
  11 |     await page.fill('input[name="password"]', 'password');
  12 | 
  13 |     // Click login button
  14 |     await page.click('button[type="submit"]');
  15 | 
  16 |     // Wait for navigation and check for dashboard element
  17 |     await page.waitForURL('/dashboard');
  18 |     await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
  19 | 
  20 |     // In a real app, you'd have a logout button. We'll simulate by clearing storage and reloading.
  21 |     // This is a workaround as there is no logout button in the current UI.
  22 |     await page.evaluate(() => localStorage.clear());
  23 |     await page.reload();
  24 | 
  25 |     // Verify user is redirected to login
  26 |     await page.waitForURL('/login');
  27 |     await expect(page.locator('h1:has-text("Login")')).toBeVisible();
  28 |   });
  29 | });
  30 | 
```