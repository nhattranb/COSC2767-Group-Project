/*
 *   RMIT University Vietnam
 *   Course: COSC2767 Systems Deployment and Operations
 *   Semester: 2024C
 *   Assessment: Assignment 2
 *   Author: Le Dinh Ngoc Quynh
 *   ID: s3791159
 *   Created  date: 3 Jan 2025
 *   Last modified: 4 Jan 2025
 */

require("expect-puppeteer");
const mongoose = require("mongoose");
const {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} = require("@jest/globals");
const User = require("../../models/user");

const baseUrl = process.env.CLIENT_URL || "http://localhost:8888";
let connection;
const setupDB = require("../../utils/db.js");
const { launch } = require("puppeteer");
beforeAll(async () => {
  try {
    await setupDB();
  } catch (e) {
    console.log(e);
  }
});

afterAll(async () => {
  await User.deleteOne({ email: "testuser@example.com" });
  await mongoose.connection.close();
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

describe("Sign Up Integration Test", () => {
  it("should sign up a new user successfully", async () => {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.setJavaScriptEnabled(true);

    // Navigate to the sign-up page
    await page.goto(`${baseUrl}/register`, {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector(".input-box", {
      timeout: 10000,
    });
    // Fill out the form
    await page.type('input[name="email"]', "testuser@example.com");
    await page.type('input[name="firstName"]', "Test");

    await page.type('input[name="lastName"]', "User");
    await page.type('input[name="password"]', "SecurePassword123");

    // Submit the form
    await page.click('button[type="submit"]');
    await page.waitForResponse((response) => {
      return (
        response.url().includes("/api/auth/register") &&
        response.status() === 200
      );
    });

    const user = await User.findOne({ email: "testuser@example.com" });

    expect(user).toBeDefined();
    expect(user?.firstName).toBe("Test");
    expect(user?.lastName).toBe("User");

    await context.close(); // clear history
  });
});
