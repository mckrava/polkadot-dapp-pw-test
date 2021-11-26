import { Page, ChromiumBrowserContext } from 'playwright'
import {
  MatchImageSnapshotOptions,
  toMatchImageSnapshot,
} from 'jest-image-snapshot'
import {
  CLOSE_PAGES,
  initBrowserWithExtension,
} from './utils'

expect.extend({ toMatchImageSnapshot })


const aliceAccount = 'bXmPf7DcVmFuHEmzH3UX8t6AUkfNQW8pnTeXGhFhqbfngjAak';
const testAccount = 'bXn2PvP753f2YAKacPbAJo9WazQuHT5dsaNPciyQFUaEfqbpe';
const testAccountName = 'E2ETESTACC1';
const testAccountPass = 'qwerty';
const testAccountSeed = 'category city hire ramp explain duty garment mask draw submit bar appear';

let page: Page
let browserContext: ChromiumBrowserContext
let extensionURL: string

const initPolkadotDapp = async () => {
  const init = await initBrowserWithExtension()
  browserContext = init.browserContext
  extensionURL = init.extensionURL
  page = browserContext.pages()[0]
  // const newSession = await browserContext.newCDPSession(page);
  // newSession.tracing.start({ screenshots: true, snapshots: true });

  await page.goto(extensionURL);
  await page.bringToFront()

  await page.click(".Button-sc-1gyneog-0");
  await page.click(".popupMenus .popupToggle");
  await page.click('.menuItem a[href="#/account/import-seed"]');
  await page.fill('textarea[class*="TextInputs__TextArea-sc"]', testAccountSeed);
  await page.click('button[class*=Button-]');
  await page.fill('input[type=text]', testAccountName);
  await page.fill('input[type=password]', testAccountPass);
  await page.fill('//label[(text()="Repeat password for verification")]/following-sibling::input', testAccountPass);
  await page.click('//div[(text()="Add the account with the supplied seed")]/..');

}

describe('The Extension page should', async () => {
  // beforeAll(async () => {
  //   const init = await initBrowserWithExtension()
  //   browserContext = init.browserContext
  //   extensionURL = init.extensionURL
  //   page = browserContext.pages()[0]
  // })
  //
  // afterAll(async () => {
  //   await browserContext?.close()
  //   browserContext = null
  //   page = null
  //   extensionURL = ''
  // })
  //
  // beforeEach(async () => {
  //   if (!extensionURL) {
  //     console.error('Invalid extensionURL', { extensionURL })
  //   }
  //   await page.bringToFront()
  //   await page.goto(extensionURL)
  //   await page.waitForTimeout(1000)
  //   await CLOSE_PAGES(browserContext)
  // })

  await initPolkadotDapp();
  await page.waitForTimeout(2000);
  // await page.goto('https://polkadot.js.org/apps/#/explorer');
  await page.goto('https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9988#/accounts');
  console.log('>>> page ', await page.title())

  browserContext.on('page', async confPage => {
    await confPage.waitForLoadState();
    await confPage.click('//div[(text()="Yes, allow this application access")]/..');
  })

  await page.waitForTimeout(2000);
  await page.click(`//div[text()="${testAccountName} (EXTENSION)"]/ancestor-or-self::tr/descendant-or-self::button[contains(@class, "send-button")]`)
  await page.click(`//div[contains(@class, "app--accounts-Modal")]/descendant-or-self::label[text()="send to address"]/../descendant-or-self::i`)
  await page.click(`//div[contains(@class, "app--accounts-Modal")]/descendant-or-self::label[text()="send to address"]/../descendant-or-self::div[@name="alice"]/descendant-or-self::div[@class="address"]`, { force: true })
  await page.fill(`//div[contains(@class, "app--accounts-Modal")]/descendant-or-self::label[text()="amount"]/../descendant-or-self::input`, '3')
  await page.click(`//div[contains(@class, "app--accounts-Modal")]/descendant-or-self::button[text()="Make Transfer"]`)
  await page.click(`//div[@data-testid="modal"]/descendant-or-self::button[text()="Sign and Submit"]`)

  browserContext.on('page', async confPage => {
    await confPage.waitForLoadState('load');
    await confPage.fill('//body/descendant-or-self::input[@type="password"]', testAccountPass);
    await confPage.click('//body/descendant-or-self::div[(text()="Sign the transaction")]/..');
  })
  // await browserContext.tracing.stop({ path: 'trace.zip' });
})