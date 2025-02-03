/*
 *   RMIT University Vietnam
 *   Course: COSC2767 Systems Deployment and Operations
 *   Semester: 2024C
 *   Assessment: Assignment 2
 *   Author: Le Dinh Ngoc Quynh
 *   ID: s3791159
 *   Created  date: 3 Jan 2025
 *   Last modified: 3 Jan 2025
 */

require("expect-puppeteer");
const { describe, it, expect } = require("@jest/globals");
const baseUrl = process.env.CLIENT_URL || "http://0.0.0.0:8888";
const { launch } = require("puppeteer");

describe("Shop Category Page Test", () => {
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

  it("should navigate to the baby category and check for item boxes", async () => {
    await page.setJavaScriptEnabled(true);

    await page.goto(`${baseUrl}/shop/category/baby`, {
      waitUntil: "networkidle2",
    });

    // Wait for the item boxes to be visible
    await page.waitForSelector(".item-box");

    const itemBoxes = await page.$$(".item-box");
    expect(itemBoxes.length).toBeGreaterThan(0);
  });

  it("should navigate to the baby category, click on a product, and check for product details", async () => {
    await page.setJavaScriptEnabled(true);

    await page.goto(`${baseUrl}/shop/category/baby`, {
      waitUntil: "networkidle2",
    });

    // Wait for the item boxes to be visible
    await page.waitForSelector(".item-box");

    // Click on the first product
    await page.click(".item-box a");

    await page.waitForSelector(".item-details");

    const price = await page.$eval(".price", (el) => el.textContent);
    expect(price).toBeTruthy();

    const description = await page.$eval(".item-desc", (el) => el.textContent);
    expect(description).toBeTruthy();
  });

  it("should click on an item, add to bag, and verify the bag has 1 item", async () => {
    await page.setJavaScriptEnabled(true);

    // login
    // const browser = await launch({headless: false});
    // const page = await browser.newPage();

    await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle2" });

    // Fill out the login form
    await page.type('input[name="email"]', "admin@rmit.edu.vn");
    await page.type('input[name="password"]', "mypassword");

    // Submit the login form
    await page.click('button[type="submit"]');

    // Wait for navigation to the shop page
    await page.waitForNavigation();

    await page.goto(`${baseUrl}/shop`, { waitUntil: "networkidle2" });

    // Wait for the item boxes to be visible
    await page.waitForSelector(".item-box");

    // Click on the first product
    await page.click(".item-box a");

    // Wait for the product details page to load
    await page.waitForSelector(".item-details");
    //
    // Click on the "Add To Bag" button
    await page.click(".bag-btn");
    //
    // Verify that the cart badge contains the text "1"
    await page.waitForSelector(".cart-badge");
    const cartBadgeText = await page.$eval(
      ".cart-badge",
      (el) => el.textContent
    );
    expect(cartBadgeText).toBe("1");

    // Click on the cart badge to open the pop-up
    await page.click(".btn-icon");

    // Wait for the pop-up to be visible
    await page.waitForSelector(".cart-body");

    // Click on the "Place Order" button in the pop-up
    await page.evaluate(() => {
      const spans = Array.from(document.querySelectorAll("span.btn-text"));
      const targetSpan = spans.find(
        (span) => span.textContent === "Place Order"
      );
      if (targetSpan) {
        targetSpan.click();
      }
    });

    // Wait for the order confirmation message to be visible
    await page.waitForSelector(".order-message");

    // Verify the order confirmation message
    const orderMessage = await page.$eval(
      ".order-message h2",
      (el) => el.textContent
    );
    expect(orderMessage).toBe("Thank you for your order.");
  });
});
