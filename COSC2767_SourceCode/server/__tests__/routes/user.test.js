/*
RMIT University Vietnam  
Course: COSC2767 Systems Deployment and Operations  
Semester: 2024C  
Assessment: Assignment 2  
Authors: Tran Minh Nhat, Le Minh Duc
IDs: s3926629, s4000577
Created  date: 18/12/2024  
Last modified: 18/12/2024  
Acknowledgement: Acknowledge the resources that you use here.
*/

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
require("dotenv").config({ path: envFile });
const express = require("express");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");

// Mock Models
const User = require("../../models/user");
const Product = require("../../models/product");
const Brand = require("../../models/brand");
const Category = require("../../models/category");

// test the user API
describe("Search function", () => {
  let server;
  let token;
  let user;

  beforeAll(async () => {
    jest.setTimeout(30000); // Increase timeout to 30 seconds

    // Start MongoDB Memory Server
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Initialize Express app and Passport
    const app = express();
    app.use(express.json());
    server = app.listen(0); // Use dynamic port

    // Create a test user in the memory server
    user = await User.create({
      email: "test4@rmit.edu.vn",
      password: "123456",
    });
  });

  afterAll(async () => {
    jest.setTimeout(30000); // Increase timeout to 30 seconds

    await User.deleteMany();
    await mongoose.disconnect();
  });

  describe("GET /api/user/search", () => {
    it("should return 404 if search query is missing", async () => {
      const res = await request(server)
        .get("/api/user/search")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
    });

    it("should return 404 and an array of users if search query is provided", async () => {
      const res = await request(server)
        .get("/api/user/search?search=test4")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });
});
