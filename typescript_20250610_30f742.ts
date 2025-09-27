import {test, expect, Page} from '@playwright/test';

class BrokenPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickButton() {
    await this.page.click('button');
  }

  async waitForElementAndStart() {
    await this.page.waitForTimeout(3000);
    await this.page.locator('.start').click();
  }

  async checkHeadingText(expected: string) {
    const heading = this.page.locator('h1');
    expect(heading.textContent()).toBe(expected);
  }
}

test.describe('Broken Tests Review', () => {
  let page: Page;
  let brokenPage: BrokenPage;

  test.beforeAll(async ({browser}) => {
    page = await browser.newPage();
    brokenPage = new BrokenPage(page);
    await page.goto('https://example.com');
  });

  test('Check page title', async () => {
    await brokenPage.checkHeadingText('Example Domain');
  });

  test('Click button', async () => {
    await brokenPage.clickButton();
    expect(await page.url()).toContain('clicked');
  });

  await test.step('Сheck that report is sent to recipients', async () => {
    const addReportResponse = await page.waitForResponse(
      (res) => res.url().includes('/api/send-report') && res.request().method() === 'POST' && res.status() === 200,
    );
    const {recipients} = addReportResponse.request().postDataJSON() as {recipients: string[]};
    expect(recipients).toEqual(recipients);
  });
});
