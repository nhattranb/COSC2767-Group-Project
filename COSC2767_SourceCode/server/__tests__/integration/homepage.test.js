/*
 *   RMIT University Vietnam
 *   Course: COSC2767 Systems Deployment and Operations
 *   Semester: 2024C
 *   Assessment: Assignment 2
 *   Author: Le Dinh Ngoc Quynh
 *   ID: s3791159
 *   Created  date: 25 Dec 2024
 *   Last modified: 25 Dec 2024
 */

require("expect-puppeteer");
const { it, describe, expect } = require("@jest/globals");
describe("Homepage Test", () => {
  const baseUrl = process.env.CLIENT_URL || "http://localhost:8888";

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

  it("should show homepage", async () => {
    await page.setJavaScriptEnabled(true);
    await page.goto(baseUrl, { waitUntil: "networkidle2" });

    await expect(page.title()).resolves.toMatch("RMIT Store");
  });

  it("should show the correct footer text", async () => {
    await page.setJavaScriptEnabled(true);

    await page.goto(baseUrl, { waitUntil: "networkidle2" });

    // Wait for the footer to be visible
    await page.waitForSelector("footer");

    // Check that the footer contains the correct text
    const footerText = await page.$eval("footer", (el) => el.textContent);
    expect(footerText).toContain("© 2025 RMIT Store. All rights reserved.");
  });
});
