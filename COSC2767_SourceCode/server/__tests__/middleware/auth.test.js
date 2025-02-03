/*
RMIT University Vietnam  
Course: COSC2767 Systems Deployment and Operations  
Semester: 2024C  
Assessment: Assignment 2  
Authors: Tran Minh Nhat, Le Minh Duc
ID: s3926629, s4000577
Created  date: 18/12/2024  
Last modified: 22/12/2024  
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

// Mock User model
const User = require("../../models/user"); // Adjust the path to your User model

// Middleware under test
const auth = require("../../middleware/auth"); // Adjust the path to your auth middleware

describe("Auth Middleware Tests", () => {
  let app;
  let mongoServer;
  let validToken;

  beforeAll(async () => {
    // Start MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Initialize the Express app and configure Passport
    app = express();
    require("../../config/passport")(app);

    // Create a test user in the in-memory database
    const testUser = new User({
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
    });
    await testUser.save();

    // Generate a valid JWT for the test user
    validToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    // Set up a test route with `auth` middleware
    app.get("/test", auth, (req, res) => {
      res.status(200).send(`User authenticated: ${req.user.id}`);
    });
  });

  it("should allow access for valid JWT", async () => {
    const response = await request(app)
      .get("/test")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.text).toContain("User authenticated");
  });

  it("should deny access for invalid JWT", async () => {
    const response = await request(app)
      .get("/test")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.text).toBe("Unauthorized");
  });

  it("should deny access if no token is provided", async () => {
    const response = await request(app).get("/test");

    expect(response.status).toBe(401);
    expect(response.text).toBe("Unauthorized");
  });
});
