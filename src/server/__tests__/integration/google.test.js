/*
 *   RMIT University Vietnam
 *   Course: COSC2767 Systems Deployment and Operations
 *   Semester: 2024C
 *   Assessment: Assignment 2
 *   Author: Vu Tien Quang
 *   ID: s3981278
 *   Created  date: 25 Dec 2024
 *   Last modified: 25 Dec 2024
 */

require("expect-puppeteer");

describe("Google Homepage", () => {
  beforeAll(async () => {
    await page.setJavaScriptEnabled(true);
    await page.goto("https://google.com", { waitUntil: "networkidle2" });
  });

  afterEach(async () => {
    const testTitle = expect.getState().currentTestName.replace(/\s+/g, "_");
    const screenshotPath = `screenshots/${testTitle}-${Date.now()}.png`;

    // Ensure JavaScript is enabled
    await page.setJavaScriptEnabled(true);

    // Wait for the page to fully load before capturing
    await page.waitForSelector("body", { timeout: 10000 });

    // Take the screenshot
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot captured at: ${screenshotPath}`);
  });

  it('should display "google" text on page', async () => {
    await expect(page).toMatchTextContent(/Google/);
  });
});
