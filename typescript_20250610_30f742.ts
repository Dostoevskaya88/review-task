import { test, expect, Page } from '@playwright/test';

class BrokenPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickButton() {
    await this.page.click('button');
  }

  async waitForElement() {
    await this.page.waitForTimeout(3000);
    await this.page.click('.start');
  }

    async checkHeadingText(expected: string) {
    const heading = this.page.locator('h1');
    expect(heading.textContent()).toBe(expected);
  }
}

test.describe('Broken Tests Review', () => {
  let page: Page;
  let brokenPage: BrokenPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();// почему не импортировать  пейджд
    brokenPage = new BrokenPage(page); 
    await page.goto('https://example.com');
  });

  test('Check page title', async () => {
    await brokenPage.checkTitle('Example Domain');
  });

  test('Click button', async () => {
    await brokenPage.clickButton();
    expect(await page.url()).toContain('clicked'); //не нравится проверка
  });

    test('Load data from API', async () => {
    const result = await brokenPage.loadData('https://api.example.com/data');
    expect(result).toBe('ok');
  });
});
