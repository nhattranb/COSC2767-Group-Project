/*
RMIT University Vietnam  
Course: COSC2767 Systems Deployment and Operations  
Semester: 2024C  
Assessment: Assignment 2  
Authors: Tran Minh Nhat, Vu Tien Quang
IDs: s3926629, s3981278 
Created  date: 20/12/2024  
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

// Mock Models
const Merchant = require("../../models/merchant");
const User = require("../../models/user");

// Routes under test
const merchantRoutes = require("../../routes/api/merchant");
const passportConfig = require("../../config/passport");

jest.mock("../../services/mailgun", () => ({
  sendEmail: jest.fn(() => Promise.resolve(true)),
}));

const { ROLES, MERCHANT_STATUS } = require("../../constants");

describe("Merchant Routes Tests", () => {
  let app;
  let mongoServer;
  let adminToken;

  beforeAll(async () => {
    jest.setTimeout(30000);

    // Start MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Initialize Express app
    app = express();
    passportConfig(app);
    app.use(express.json());
    app.use("/api/merchant", merchantRoutes);

    // Create test admin user
    const adminUser = new User({
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      role: ROLES.Admin,
    });
    await adminUser.save();
    adminToken = jwt.sign(
      { id: adminUser._id, role: ROLES.Admin },
      process.env.JWT_SECRET || "test-secret",
      {
        expiresIn: "1h",
      }
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Merchant.deleteMany({});
    jest.clearAllMocks();
  });

  it("should add a new merchant", async () => {
    const merchantData = {
      name: "Test Merchant",
      email: "merchant@example.com",
      business: "Test Business",
      phoneNumber: "123456789",
      brandName: "Test Brand",
    };

    const response = await request(app)
      .post("/api/merchant/add")
      .send(merchantData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.merchant.name).toBe(merchantData.name);
  });

  it("should fetch all merchants as Admin", async () => {
    await new Merchant({
      name: "Merchant 1",
      email: "merchant1@example.com",
      business: "Business 1",
      phoneNumber: "123456789",
      brandName: "Brand 1",
    }).save();

    const response = await request(app)
      .get("/api/merchant")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.merchants).toHaveLength(1);
  });

  it("should update merchant status to approved", async () => {
    const merchant = await new Merchant({
      name: "Merchant 2",
      email: "merchant2@example.com",
      business: "Business 2",
      phoneNumber: "987654321",
      brandName: "Brand 2",
    }).save();

    const response = await request(app)
      .put(`/api/merchant/approve/${merchant._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const updatedMerchant = await Merchant.findById(merchant._id);
    expect(updatedMerchant.status).toBe(MERCHANT_STATUS.Approved);
  });

  it("should reject a merchant application", async () => {
    const merchant = await new Merchant({
      name: "Merchant 3",
      email: "merchant3@example.com",
      business: "Business 3",
      phoneNumber: "987654321",
      brandName: "Brand 3",
    }).save();

    const response = await request(app)
      .put(`/api/merchant/reject/${merchant._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const rejectedMerchant = await Merchant.findById(merchant._id);
    expect(rejectedMerchant.status).toBe(MERCHANT_STATUS.Rejected);
  });
});
