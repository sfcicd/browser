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

    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
    page = await context.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should log in and navigate to /setup/home, with #setupComponent showing "Setup"', async () => {
    org = await Org.create({ aliasOrUsername: 'myOrg' })
    await page.goto(org, 'SetupPage', 'lightning/setup/SetupOneHome/home');

    // now assert the setup component is present
    const locator = page.getByRole('heading', { name: 'Setup Home' });
    await locator.waitFor({timeout: 5000});
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