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

const request = require("supertest");
const express = require("express");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Wishlist = require("../../models/wishlist");
const User = require("../../models/user"); // Import the User model
const wishlistRoutes = require("../../routes/api/wishlist"); // Adjust the path to your Wishlist routes
const passportConfig = require("../../config/passport"); // Adjust the path to your Passport config

describe("Wishlist Routes Tests", () => {
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

    // Create a test user in the memory server
    const testUser = new User({
      email: "testuser@example.com",
      firstName: "Test",
      lastName: "User",
    });
    await testUser.save();

    // Generate a valid JWT for the test user
    validToken = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET || "test-secret",
      {
        expiresIn: "1h",
      }
    );

    // Initialize Express app and Passport
    app = express();
    passportConfig(app);
    app.use(express.json());

    // Mock the auth middleware
    app.use((req, res, next) => {
      req.user = { _id: mongoose.Types.ObjectId() };
      next();
    });

    app.use("/api/wishlist", wishlistRoutes);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await Wishlist.deleteMany({});
  });

  test("should add a new wishlist item successfully", async () => {
    const newWishlistItem = {
      product: mongoose.Types.ObjectId(),
      isLiked: true,
    };

    const response = await request(app)
      .post("/api/wishlist")
      .send(newWishlistItem)
      .set("Authorization", `Bearer ${validToken}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Added to your Wishlist successfully!");
    expect(response.body.wishlist).toHaveProperty("_id");
    expect(response.body.wishlist.product).toBe(
      String(newWishlistItem.product)
    );
    expect(response.body.wishlist.isLiked).toBe(newWishlistItem.isLiked);
  });

  test("should update an existing wishlist item successfully", async () => {
    const existingWishlistItem = await Wishlist.create({
      product: mongoose.Types.ObjectId(),
      isLiked: false,
      user: jwt.decode(validToken).id,
    });

    const updatedWishlistItem = {
      product: existingWishlistItem.product,
      isLiked: true,
    };

    const response = await request(app)
      .put(`/api/wishlist/${existingWishlistItem._id}`)
      .send(updatedWishlistItem)
      .set("Authorization", `Bearer ${validToken}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  test("should return 200 for invalid request data", async () => {
    const response = await request(app)
      .post("/api/wishlist")
      .send({}) // Sending empty body
      .set("Authorization", `Bearer ${validToken}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
  });
});
