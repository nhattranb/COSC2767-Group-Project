/*
RMIT University Vietnam  
Course: COSC2767 Systems Deployment and Operations  
Semester: 2024C  
Assessment: Assignment 2  
Authors: Tran Minh Nhat, Vu Tien Quang
IDs: s3926629, s3981278 
Created  date: 19/12/2024  
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
const bcrypt = require("bcryptjs");

// Mock Models
const User = require("../../models/user"); // Adjust the path to your User model
const passportConfig = require("../../config/passport"); // Adjust the path to your Passport config

// Routes under test
const authRoutes = require("../../routes/api/auth"); // Adjust the path to your auth routes

describe("Auth Routes Tests", () => {
  let app;
  let mongoServer;

  beforeAll(async () => {
    jest.setTimeout(30000);

    // Start MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Initialize Express app and Passport
    app = express();
    passportConfig(app);
    app.use(express.json());
    app.use("/api/auth", authRoutes);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should register a new user", async () => {
    const userData = {
      email: "testuser@example.com",
      firstName: "Test",
      lastName: "User",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe(userData.email);

    const user = await User.findOne({ email: userData.email });
    expect(user).not.toBeNull();
    expect(await bcrypt.compare(userData.password, user.password)).toBe(true);
  });

  it("should login an existing user", async () => {
    const userData = {
      email: "testuser@example.com",
      firstName: "Test",
      lastName: "User",
      password: "password123",
    };

    // Register the user first
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    await new User({ ...userData, password: hashedPassword }).save();

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toMatch(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/);

    const decoded = jwt.verify(
      response.body.token.split(" ")[1],
      process.env.JWT_SECRET || "test-secret"
    );
    expect(decoded.id).toBeTruthy();
  });

  it("should reject login with incorrect password", async () => {
    const userData = {
      email: "testuser@example.com",
      firstName: "Test",
      lastName: "User",
      password: "password123",
    };

    // Register the user first
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    await new User({ ...userData, password: hashedPassword }).save();

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: "wrongpassword" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Password Incorrect");
  });

  it("should handle forgot password", async () => {
    const userData = {
      email: "testuser@example.com",
      firstName: "Test",
      lastName: "User",
      password: "password123",
    };

    // Register the user
    await new User(userData).save();

    const response = await request(app)
      .post("/api/auth/forgot")
      .send({ email: userData.email });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain("Please check your email");
  });

  it("should handle password reset", async () => {
    const userData = {
      email: "testuser@example.com",
      firstName: "Test",
      lastName: "User",
      password: "password123",
    };

    const resetToken = "test-reset-token";
    const user = new User({
      ...userData,
      resetPasswordToken: resetToken,
      resetPasswordExpires: Date.now() + 3600000,
    });
    await user.save();

    const response = await request(app)
      .post(`/api/auth/reset/${resetToken}`)
      .send({ password: "newpassword123" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain("Password changed successfully");

    const updatedUser = await User.findOne({ email: userData.email });
    expect(await bcrypt.compare("newpassword123", updatedUser.password)).toBe(
      true
    );
  });
});
