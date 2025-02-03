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

const puppeteerPreset = require("jest-puppeteer");

module.exports = {
  ...puppeteerPreset,
  testMatch: ["**/__tests__/integration/**/*.test.js"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
  testTimeout: 60000,
};
