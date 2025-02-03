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
const Cart = require("../../models/cart");
const Product = require("../../models/product");
const User = require("../../models/user");

// Routes under test
const cartRoutes = require("../../routes/api/cart");
const passportConfig = require("../../config/passport");

describe("Cart Routes Tests", () => {
  let app;
  let mongoServer;
  let userToken;

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
    app.use("/api/cart", cartRoutes);

    // Create test user
    const testUser = new User({
      email: "user@example.com",
      firstName: "Test",
      lastName: "User",
    });
    await testUser.save();
    userToken = jwt.sign(
      { id: testUser._id },
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
    await Cart.deleteMany({});
    await Product.deleteMany({});
  });

  it("should add a new cart with products", async () => {
    const product = new Product({
      name: "Product 1",
      quantity: 100,
      price: 10,
    });
    await product.save();

    const cartData = {
      products: [{ product: product._id, quantity: 2, purchasePrice: 10 }],
    };

    const response = await request(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${userToken}`)
      .send(cartData);

    expect(response.status).toBe(400);

    const cart = await Cart.findById(response.body.cartId);
  });

  it("should delete a cart by ID", async () => {
    const cart = new Cart({ user: mongoose.Types.ObjectId(), products: [] });
    await cart.save();

    const response = await request(app)
      .delete(`/api/cart/delete/${cart._id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const deletedCart = await Cart.findById(cart._id);
    expect(deletedCart).toBeNull();
  });

  it("should add a product to an existing cart", async () => {
    const cart = new Cart({ user: mongoose.Types.ObjectId(), products: [] });
    await cart.save();

    const product = new Product({
      name: "Product 1",
      quantity: 100,
      price: 10,
    });
    await product.save();

    const response = await request(app)
      .post(`/api/cart/add/${cart._id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        product: { product: product._id, quantity: 1, purchasePrice: 10 },
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const updatedCart = await Cart.findById(cart._id);
    expect(updatedCart.products).toHaveLength(1);
    expect(updatedCart.products[0].product.toString()).toBe(
      product._id.toString()
    );
  });

  it("should delete a product from an existing cart", async () => {
    const product = new Product({
      name: "Product 1",
      quantity: 100,
      price: 10,
    });
    await product.save();

    const cart = new Cart({
      user: mongoose.Types.ObjectId(),
      products: [{ product: product._id, quantity: 1, purchasePrice: 10 }],
    });
    await cart.save();

    const response = await request(app)
      .delete(`/api/cart/delete/${cart._id}/${product._id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const updatedCart = await Cart.findById(cart._id);
    expect(updatedCart.products).toHaveLength(0);
  });
});
