import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'brilliant-language', value: 'en', url: baseURL! }]);
  // No production analytics or delivery traffic during local verification.
  await page.route('**/*', route => new URL(route.request().url()).origin === new URL(baseURL!).origin
    ? route.continue() : route.fulfill({ status: 200, body: '{}' }));
});

test('language switch preserves calculator/form state, query/hash, translated notes and SEO', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/?utm_source=regression#roi-calculator');
  await page.getByRole('button', { name: 'ES: Español', exact: true }).first().waitFor();
  await page.locator('#contact-name').fill('Local test');
  await page.locator('#contact-email').fill('test@example.com');
  await page.locator('#contact-organization').fill('Local organization');
  await page.locator('#contact-country').selectOption('US');
  await page.locator('#contact-industry').selectOption('finance');
  await page.locator('#contact-workflow').fill('Private draft stays in browser');
  const people = page.locator('#range-people');
  await people.fill('13');
  const keywordsBefore = await page.locator('meta[name=keywords]').getAttribute('content');
  const notesBefore = await page.locator('#approach li h3').allTextContents();
  await page.getByRole('button', { name: 'ES: Español', exact: true }).first().click();
  await expect(page).toHaveURL(/\/es\?utm_source=regression#roi-calculator$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-MX');
  await expect(people).toHaveValue('13');
  await expect(page.locator('#contact-name')).toHaveValue('Local test');
  await expect(page.locator('#contact-email')).toHaveValue('test@example.com');
  await expect(page.locator('#contact-industry')).toHaveValue('finance');
  await expect(page.locator('#contact-workflow')).toHaveValue('Private draft stays in browser');
  expect(await page.locator('#approach li h3').allTextContents()).not.toEqual(notesBefore);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/es$/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/social\/es\/home.png$/);
  await expect(page.locator('meta[name=keywords]')).not.toHaveAttribute('content', keywordsBefore!);
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', await page.title());
  expect(await page.locator('meta[property="og:locale:alternate"]').evaluateAll(nodes => nodes.map(n => n.getAttribute('content')))).toEqual(['en_US', 'en_CA']);
  const graph = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(graph).toContain('es-MX');
  const cookies = await page.context().cookies();
  expect(cookies.find(c => c.name === 'brilliant-language')?.value).toBe('es');
  await page.getByRole('button', { name: 'EN: English', exact: true }).first().click();
  await expect(people).toHaveValue('13');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save estimate', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('brilliant-ai-capacity-estimate.txt');
  await page.screenshot({ path: `test-results/${info.project.name}-home.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `test-results/${info.project.name}-viewport.png` });
  expect(errors).toEqual([]);
});

test('inquiry mocked success and failure preserve fallback; no real delivery', async ({ page }) => {
  let status = 502;
  await page.route('**/api/inquiry', route => route.fulfill({ status, json: status === 200 ? { ok: true } : { ok: false, error: 'failed' } }));
  await page.goto('/');
  await page.locator('#contact-name').fill('Local test');
  await page.locator('#contact-email').fill('test@example.com');
  await page.locator('#contact-organization').fill('Local organization');
  await page.locator('#contact-country').selectOption('US');
  await page.locator('#contact-industry').selectOption('finance');
  await page.locator('#contact-workflow').fill('Mock delivery only');
  await page.getByRole('button', { name: 'Send workflow inquiry', exact: true }).click();
  await expect(page.locator('#contact [role=alert]')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Send it as an email instead' })).toHaveAttribute('href', /^mailto:.*Mock%20delivery%20only/);
  status = 200;
  await page.getByRole('button', { name: 'Send workflow inquiry', exact: true }).click();
  await expect(page.locator('#contact [role=status]')).toContainText('Got it');
});

test('blog switches complete MDX locale with query preserved; mobile layout and links intact', async ({ page }) => {
  await page.goto('/blog/why-invoice-automation-stalls?utm_source=regression#main');
  const english = await page.locator('h1').textContent();
  await page.getByRole('button', { name: 'ES: Español', exact: true }).first().click();
  await expect(page).toHaveURL(/\/es\/blog\/why-invoice-automation-stalls\?utm_source=regression#main$/);
  await expect(page.locator('h1')).not.toHaveText(english!);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-MX');
  await expect(page.locator('[data-analytics-article]')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  expect(overflow).toBe(false);
  await page.goto('/es/custom-software');
  await expect(page.locator('video source').first()).toHaveAttribute('src', /haab-calendar-demo.mp4/);
  expect(await page.locator('a[href*="wa.me"]').count()).toBeGreaterThan(0);
  expect(await page.locator('a[href*="calendar"]').count()).toBeGreaterThan(0);
});

test('FAQ keyboard disclosure and mobile menu Escape retain accessibility', async ({ page }, info) => {
  await page.goto('/');
  const summary = page.locator('details summary').first();
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(summary.locator('..')).toHaveAttribute('open', '');
  await page.keyboard.press('Enter');
  await expect(summary.locator('..')).not.toHaveAttribute('open', '');
  if (info.project.name === 'mobile') {
    const menu = page.getByRole('button', { name: 'Open navigation', exact: true });
    await menu.click();
    await expect(page.locator('#mobile-nav')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-nav')).toHaveCount(0);
    await expect(menu).toBeFocused();
  }
});

test('reduced motion and animated workflow controls still work', async ({ page }) => {
  await page.goto('/');
  const scene = page.locator('[data-focus]').first();
  await expect(scene).toHaveAttribute('data-focus', 'approve');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('button', { name: 'Replay', exact: true }).click();
  await expect(scene).toHaveAttribute('data-focus', 'collect');
  await expect(scene).toHaveAttribute('data-focus', 'approve', { timeout: 7000 });
});
