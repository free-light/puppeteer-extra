//const puppeteer = require('puppeteer');



(async () => {
  // puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
  puppeteer.use(StealthPlugin())
  
// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: false }))

puppeteer.use(require('puppeteer-extra-plugin-user-data-dir')( {
  deleteTemporary: false,
  deleteExisting: false,
  files: []
}))

  
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  })
  const page = await browser.newPage()


  const navigationPromise = page.waitForNavigation()
  //const url = "https://accounts.google.com/signin/v2/identifier?service=youtube&uilel=3&passive=true&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Den%26next%3Dhttps%253A%252F%252Fwww.youtube.com%252F&hl=en&ec=65620&flowName=GlifWebSignIn&flowEntry=ServiceLogin";
  const url = 'https://accounts.google.com/'
  await page.goto(url)

  await navigationPromise

  await page.waitForSelector('input[type="email"]')
  await page.click('input[type="email"]')

  await navigationPromise

  //TODO : change to your email 
  await page.type('input[type="email"]', 'stargatesvpn@gmail.com')

  await page.waitForSelector('#identifierNext')
  await page.click('#identifierNext')

  await page.waitFor(500);

  await page.waitForSelector('input[type="password"]')
  await page.click('input[type="email"]')
  await page.waitFor(1500);

  //TODO : change to your password
  await page.type('input[type="password"]', 'AKIAJI2XTVECEZW7YSQQ')

  await page.waitForSelector('#passwordNext')
  
  await page.click('#passwordNext')
  await page.waitFor(3000);
  await navigationPromise

  

  await page.goto('https://www.youtube.com/')
  await navigationPromise

  const fs = require('fs').promises;

// ... puppeteer code
  const cookies = await page.cookies();
  await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2));




  //await browser.close()
})()

