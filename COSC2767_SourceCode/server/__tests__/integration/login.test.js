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
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const setupDB = require("../../utils/db");
const {
  expect,
  describe,
  beforeAll,
  afterAll,
  test,
} = require("@jest/globals");
const { launch } = require("puppeteer");

describe("User Login Flow", () => {
  const baseUrl = process.env.CLIENT_URL || "http://localhost:8888";
  const testUser = {
    email: "testuser2@example.com",
    password: "SecurePassword123",
    firstName: "Test",
    lastName: "User",
  };

  beforeAll(async () => {
    // Setup test database
    await setupDB();

    // Create a test user
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(testUser.password, salt);
    await User.create({
      email: testUser.email,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      password: hash,
    });
  });

  afterAll(async () => {
    // Cleanup
    await User.deleteMany({ email: testUser.email });
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
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

  test("should log in successfully with valid credentials", async () => {
    await page.setJavaScriptEnabled(true);
    // Navigate to login page
    await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle2" });

    await page.waitForSelector(".input-box", {
      timeout: 10000,
    });

    // Fill login form
    await page.type('input[name="email"]', testUser.email);
    await page.type('input[name="password"]', testUser.password);

    // Submit form
    await page.click('.login-form button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForNavigation();

    // Verify user info is displayed
    await page.waitForSelector(".account-details");
    const accountDetails = await page.$eval(
      ".account-details",
      (el) => el.textContent
    );
    expect(accountDetails).toContain(testUser.email);
  });
});
