/*
RMIT University Vietnam  
Course: COSC2767 Systems Deployment and Operations  
Semester: 2024C  
Assessment: Assignment 2  
Authors: Tran Minh Nhat, Vu Tien Quang, Le Minh Duc
IDs: s3926629, s3981278, s4000577
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
const Address = require("../../models/address");
const User = require("../../models/user");
const addressRoutes = require("../../routes/api/address");

const mockUserId = mongoose.Types.ObjectId(); // Generate a valid ObjectId

jest.mock("../../middleware/auth", () => (req, res, next) => {
  req.user = { _id: mockUserId }; // Use the valid ObjectId
  next();
});

describe("Address Routes Tests", () => {
  let app;
  let mongoServer;
  let validToken;
  let server;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const testUser = new User({
      _id: mockUserId, // Ensure the test user matches the mock user
      email: "testuser@example.com",
      password: "password123",
    });
    await testUser.save();

    validToken = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET || "test-secret",
      { expiresIn: "1h" }
    );

    app = express();
    app.use(express.json());
    app.use("/api/address", addressRoutes);
    server = app.listen(0);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    server.close();
  });

  afterEach(async () => {
    await Address.deleteMany({});
  });

  it("should add a new address", async () => {
    const addressData = {
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
    };

    const response = await request(server)
      .post("/api/address/add")
      .set("Authorization", `Bearer ${validToken}`)
      .send(addressData);

    console.error("Response body:", response.body); // Debugging response

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("address");
    expect(response.body.address).toHaveProperty("_id");
    expect(response.body.address.city).toBe("Anytown");
  });

  it("should fetch all addresses for the authenticated user", async () => {
    const address = new Address({
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      user: mockUserId, // Use the valid ObjectId
    });
    await address.save();

    const response = await request(server)
      .get("/api/address")
      .set("Authorization", `Bearer ${validToken}`);

    console.error("Response body:", response.body); // Debugging response

    expect(response.status).toBe(200);
    expect(response.body.addresses).toHaveLength(1);
    expect(response.body.addresses[0].city).toBe("Anytown");
  });

  it("should fetch a single address by ID", async () => {
    const address = new Address({
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
      user: mockUserId, // Use the valid ObjectId
    });
    const savedAddress = await address.save();

    const response = await request(server)
      .get(`/api/address/${savedAddress._id}`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.address.city).toBe("Anytown");
  });

  it("should update an address", async () => {
    const address = new Address({
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
      user: mockUserId, // Use the valid ObjectId
    });
    const savedAddress = await address.save();

    const updatedData = { city: "Newtown" };

    const response = await request(server)
      .put(`/api/address/${savedAddress._id}`)
      .set("Authorization", `Bearer ${validToken}`)
      .send(updatedData);

    expect(response.status).toBe(200);

    const updatedAddress = await Address.findById(savedAddress._id);
    expect(updatedAddress.city).toBe("Newtown");
  });

  it("should delete an address", async () => {
    const address = new Address({
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
      user: mockUserId, // Use the valid ObjectId
    });
    const savedAddress = await address.save();

    const response = await request(server)
      .delete(`/api/address/delete/${savedAddress._id}`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);

    const deletedAddress = await Address.findById(savedAddress._id);
    expect(deletedAddress).toBeNull();
  });
});
