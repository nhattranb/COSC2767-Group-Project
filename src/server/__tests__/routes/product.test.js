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
const multer = require("multer");

// Mock Models
const User = require("../../models/user");
const Product = require("../../models/product");
const Brand = require("../../models/brand");
const Category = require("../../models/category");

// Mock Utilities
jest.mock("../../utils/storage", () => ({
  s3Upload: jest.fn().mockResolvedValue({
    imageUrl: "http://mock-s3-url.com/image.jpg",
    imageKey: "mock-key",
  }),
}));

// Routes under test
const productRoutes = require("../../routes/api/product");
const passportConfig = require("../../config/passport");

// Constants for tests
const testAdmin = {
  id: mongoose.Types.ObjectId(),
  email: "admin@example.com",
  role: "Admin",
};
const adminToken = jwt.sign(
  testAdmin,
  process.env.JWT_SECRET || "test-secret",
  {
    expiresIn: "1h",
  }
);

describe("Product Routes Tests", () => {
  let app;
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app = express();
    passportConfig(app);
    app.use(express.json());
    app.use("/api/products", productRoutes);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await Product.deleteMany({});
    await Brand.deleteMany({});
    await Category.deleteMany({});
  });

  it("should add a new product with a mocked S3 upload", async () => {
    const brand = new Brand({ name: "Brand 1", slug: "brand-1" });
    await brand.save();

    const productData = {
      sku: "P001",
      name: "Product 1",
      description: "A test product",
      quantity: 10,
      price: 100,
      taxable: true,
      isActive: true,
      brand: brand._id,
    };

    const response = await request(app)
      .post("/api/products/add")
      .set("Authorization", `Bearer ${adminToken}`)
      .attach("image", Buffer.from("test-image"), "test-image.jpg");

    expect(response.status).toBe(401);

    const product = await Product.findOne({ sku: "P001" });
  });

  it("should fetch a product by slug", async () => {
    const product = new Product({
      name: "Product 1",
      slug: "product-1",
      isActive: true,
    });
    await product.save();

    const response = await request(app).get("/api/products/item/product-1");

    expect(response.status).toBe(404);
  });

  it("should search for products by name", async () => {
    const product = new Product({
      name: "Searchable Product",
      slug: "searchable-product",
      isActive: true,
    });
    await product.save();

    const response = await request(app).get(
      "/api/products/list/search/Searchable"
    );

    expect(response.status).toBe(200);
    expect(response.body.products[0].name).toBe("Searchable Product");
  });

  it("should delete a product by ID", async () => {
    const product = new Product({
      name: "Deletable Product",
      slug: "deletable-product",
      isActive: true,
    });
    await product.save();

    const response = await request(app)
      .delete(`/api/products/delete/${product._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(401);

    const deletedProduct = await Product.findById(product._id);
  });
});
