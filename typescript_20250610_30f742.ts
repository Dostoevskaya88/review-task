import { test, expect, Page } from '@playwright/test';

// ===== Код с ошибками =====
class BrokenPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Ошибка 1: Селектор неверный (должен быть '.btn')
  async clickButton() {
    await this.page.click('button'); // Кликает первый button на странице, а не конкретный
  }

  // Ошибка 2: Нет await перед expect
  async checkTitle(title: string) {
    expect(await this.page.title()).toBe(title); // Должен быть await expect
  }

  // Ошибка 3: Не обрабатывается ошибка сети
  async fetchData(url: string) {
    const response = await this.page.goto(url);
    return response!.json(); // Упадет, если response === null
  }
}

// ===== Тест =====
test.describe('Broken Tests Review', () => {
  let page: Page;
  let brokenPage: BrokenPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    brokenPage = new BrokenPage(page);
    await page.goto('https://example.com');
  });

  // Тест 1: Проверка заголовка (упадет)
  test('Check page title', async () => {
    await brokenPage.checkTitle('Example Domain'); // Должен быть await
  });

  // Тест 2: Клик по кнопке (упадет, если кнопок несколько)
  test('Click button', async () => {
    await brokenPage.clickButton();
    expect(await page.url()).toContain('clicked'); // Пример проверки
  });

  // Тест 3: Запрос данных (упадет при network error)
  test('Fetch data', async () => {
    const data = await brokenPage.fetchData('https://api.example.com/data');
    expect(data).toHaveProperty('success', true);
  });
});