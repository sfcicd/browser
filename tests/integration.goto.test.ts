// __tests__/integration.goto.test.ts

import { Org } from '@salesforce/core';
import { chromium, BrowserContext, Browser, Page } from '../src';

jest.setTimeout(120_000);

describe('Integration: SetupPage navigation', () => {
  let org: Org;
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  beforeAll(async () => {

    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should log in and navigate to /setup/home, with #setupComponent showing "Setup"', async () => {
    await page.goto('myOrg', 'SetupPage', 'lightning/setup/SetupOneHome/home');

    // now assert the setup component is present
    await page.waitForSelector('text=Setup Home');
  });

});

describe('Integration: Navigation to some non-Salesforce site', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  beforeAll(async () => {

    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
    page = await context.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should go to a non-salesforce-site', async () => {
    await page.goto('https://www.npmjs.com/');
    await page.getByRole('combobox', { name: 'Search packages' }).click();
  });

});