/*
RMIT University Vietnam  
Course: COSC2767 Systems Deployment and Operations  
Semester: 2024C  
Assessment: Assignment 2  
Authors: Tran Minh Nhat, Vu Tien Quang
IDs: s3926629, s3981278 
Created  date: 21/12/2024  
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
const Category = require("../../models/category");
const User = require("../../models/user");
const Product = require("../../models/product");

// Routes under test
const categoryRoutes = require("../../routes/api/category");
const passportConfig = require("../../config/passport");

const { ROLES } = require("../../constants");

describe("Category Routes Tests", () => {
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
    app.use("/api/category", categoryRoutes);

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
    await Category.deleteMany({});
    await Product.deleteMany({});
  });

  it("should add a new category as Admin", async () => {
    const categoryData = {
      name: "Test Category",
      description: "A test category description",
      isActive: true,
    };

    const response = await request(app)
      .post("/api/category/add")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(categoryData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.category.name).toBe(categoryData.name);
  });

  it("should fetch all active categories", async () => {
    await new Category({
      name: "Active Category",
      description: "Active",
      isActive: true,
    }).save();
    await new Category({
      name: "Inactive Category",
      description: "Inactive",
      isActive: false,
    }).save();

    const response = await request(app).get("/api/category/list");

    expect(response.status).toBe(200);
    expect(response.body.categories).toHaveLength(1);
    expect(response.body.categories[0].name).toBe("Active Category");
  });

  it("should fetch all categories", async () => {
    await new Category({
      name: "Category 1",
      description: "First category",
    }).save();
    await new Category({
      name: "Category 2",
      description: "Second category",
    }).save();

    const response = await request(app).get("/api/category/");

    expect(response.status).toBe(200);
    expect(response.body.categories).toHaveLength(2);
  });

  it("should fetch a category by ID", async () => {
    const category = await new Category({
      name: "Specific Category",
      description: "Fetch by ID",
      isActive: true,
    }).save();

    const response = await request(app).get(`/api/category/${category._id}`);

    expect(response.status).toBe(200);
    expect(response.body.category.name).toBe("Specific Category");
  });

  it("should update a category as Admin", async () => {
    const category = await new Category({
      name: "Category to Update",
      description: "Update me",
      isActive: true,
    }).save();

    const updateData = {
      category: {
        name: "Updated Category",
        description: "Updated Description",
      },
    };

    const response = await request(app)
      .put(`/api/category/${category._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const updatedCategory = await Category.findById(category._id);
    expect(updatedCategory.name).toBe(updateData.category.name);
  });

  it("should delete a category as Admin", async () => {
    const category = await new Category({
      name: "Category to Delete",
      description: "Delete me",
    }).save();

    const response = await request(app)
      .delete(`/api/category/delete/${category._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const deletedCategory = await Category.findById(category._id);
    expect(deletedCategory).toBeNull();
  });
});
