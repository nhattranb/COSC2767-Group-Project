/*
RMIT University Vietnam  
Course: COSC2767 Systems Deployment and Operations  
Semester: 2024C  
Assessment: Assignment 2  
Authors: Tran Minh Nhat, Vu Tien Quang
IDs: s3926629, s3981278 
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

// Mock Models
const Brand = require("../../models/brand");
const Product = require("../../models/product");
const Merchant = require("../../models/merchant");
const User = require("../../models/user");

// Routes under test
const brandRoutes = require("../../routes/api/brand");
const passportConfig = require("../../config/passport");

const { ROLES } = require("../../constants");

describe("Brand Routes Tests", () => {
  let app;
  let mongoServer;
  let adminToken;
  let merchantToken;

  beforeAll(async () => {
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
    app.use("/api/brand", brandRoutes);

    // Create test users
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

    const merchantUser = new User({
      email: "merchant@example.com",
      firstName: "Merchant",
      lastName: "User",
      role: ROLES.Merchant,
    });
    await merchantUser.save();
    merchantToken = jwt.sign(
      {
        id: merchantUser._id,
        role: ROLES.Merchant,
        merchant: merchantUser._id,
      },
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
    await Brand.deleteMany({});
    await Product.deleteMany({});
    await Merchant.deleteMany({});
  });

  it("should add a new brand as Admin", async () => {
    const brandData = {
      name: "Test Brand",
      description: "A test brand description",
      isActive: true,
    };

    const response = await request(app)
      .post("/api/brand/add")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(brandData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.brand.name).toBe(brandData.name);
  });

  it("should fetch all active brands", async () => {
    // Add a brand
    await new Brand({
      name: "Active Brand",
      description: "Active",
      isActive: true,
    }).save();
    await new Brand({
      name: "Inactive Brand",
      description: "Inactive",
      isActive: false,
    }).save();

    const response = await request(app).get("/api/brand/list");

    expect(response.status).toBe(200);
    expect(response.body.brands).toHaveLength(1);
    expect(response.body.brands[0].name).toBe("Active Brand");
  });

  it("should fetch brands for Admin", async () => {
    // Add a brand
    await new Brand({
      name: "Brand for Admin",
      description: "Admin only",
      isActive: true,
    }).save();

    const response = await request(app)
      .get("/api/brand/")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.brands).toHaveLength(1);
    expect(response.body.brands[0].name).toBe("Brand for Admin");
  });

  it("should fetch a brand by ID", async () => {
    const brand = await new Brand({
      name: "Specific Brand",
      description: "Fetch by ID",
      isActive: true,
    }).save();

    const response = await request(app).get(`/api/brand/${brand._id}`);

    expect(response.status).toBe(200);
    expect(response.body.brand.name).toBe("Specific Brand");
  });

  it("should update a brand as Admin", async () => {
    const brand = await new Brand({
      name: "Brand to Update",
      description: "Update me",
      isActive: true,
    }).save();

    const updateData = {
      brand: { name: "Updated Brand", description: "Updated Description" },
    };

    const response = await request(app)
      .put(`/api/brand/${brand._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const updatedBrand = await Brand.findById(brand._id);
    expect(updatedBrand.name).toBe(updateData.brand.name);
  });

  it("should delete a brand as Admin", async () => {
    const brand = await new Brand({
      name: "Brand to Delete",
      description: "Delete me",
      isActive: true,
    }).save();

    const response = await request(app)
      .delete(`/api/brand/delete/${brand._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const deletedBrand = await Brand.findById(brand._id);
    expect(deletedBrand).toBeNull();
  });
});
