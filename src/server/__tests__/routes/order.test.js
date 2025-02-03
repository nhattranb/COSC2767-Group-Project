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
const Order = require("../../models/order");
const Cart = require("../../models/cart");
const Product = require("../../models/product");
const User = require("../../models/user");

// Routes under test
const orderRoutes = require("../../routes/api/order");
const passportConfig = require("../../config/passport");

jest.mock("../../services/mailgun", () => ({
  sendEmail: jest.fn(() => Promise.resolve(true)),
}));

describe("Order Routes Tests", () => {
  let app;
  let mongoServer;
  let userToken;

  beforeAll(async () => {
    jest.setTimeout(40000);

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
    app.use("/api/order", orderRoutes);

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
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Product.deleteMany({});
    jest.clearAllMocks();
  });

  it("should add a new order", async () => {
    const product = new Product({
      name: "Product 1",
      quantity: 100,
      price: 10,
    });
    await product.save();

    const cart = new Cart({
      user: mongoose.Types.ObjectId(),
      products: [{ product: product._id, quantity: 2, purchasePrice: 10 }],
    });
    await cart.save();

    const orderData = {
      cartId: cart._id,
      total: 20,
    };

    const response = await request(app)
      .post("/api/order/add")
      .set("Authorization", `Bearer ${userToken}`)
      .send(orderData);

    expect(response.status).toBe(400);
  });

  it("should fetch user orders", async () => {
    const cart = new Cart({
      user: mongoose.Types.ObjectId(),
      products: [],
    });
    await cart.save();

    const order = new Order({
      user: mongoose.Types.ObjectId(),
      cart: cart._id,
      total: 50,
    });
    await order.save();

    const response = await request(app)
      .get("/api/order/me")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.orders).toHaveLength(0);
  });

  it("should cancel an order", async () => {
    const product = new Product({
      name: "Product 1",
      quantity: 100,
      price: 10,
    });
    await product.save();

    const cart = new Cart({
      user: mongoose.Types.ObjectId(),
      products: [{ product: product._id, quantity: 2, purchasePrice: 10 }],
    });
    await cart.save();

    const order = new Order({
      user: mongoose.Types.ObjectId(),
      cart: cart._id,
      total: 20,
    });
    await order.save();

    const response = await request(app)
      .delete(`/api/order/cancel/${order._id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const deletedOrder = await Order.findById(order._id);
    expect(deletedOrder).toBeNull();

    const deletedCart = await Cart.findById(cart._id);
    expect(deletedCart).toBeNull();
  });

  it("should fetch a specific order by ID", async () => {
    const product = new Product({
      name: "Product 1",
      quantity: 100,
      price: 10,
    });
    await product.save();

    const cart = new Cart({
      user: mongoose.Types.ObjectId(),
      products: [{ product: product._id, quantity: 2, purchasePrice: 10 }],
    });
    await cart.save();

    const order = new Order({
      user: mongoose.Types.ObjectId(),
      cart: cart._id,
      total: 20,
    });
    await order.save();

    const response = await request(app)
      .get(`/api/order/${order._id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(404);
  });
});
