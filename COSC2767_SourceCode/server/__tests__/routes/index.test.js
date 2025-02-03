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

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const express = require("express");
const request = require("supertest");

describe("User API", () => {
  let server;
  let token;
  let app;

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const testUser = new User({
      email: "user5@rmit.edu.vn",
      password: "password123",
    });
    await testUser.save();

    token = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET || "test-secret",
      { expiresIn: "1h" }
    );

    app = express();
    app.use(express.json());
    app.post("/api/user/register", (req, res) => {
      if (!req.body.email) {
        return res
          .status(400)
          .json({ error: "You must enter an email address." });
      }
      res.status(200).json({ success: true });
    });

    server = app.listen(0); // Use dynamic port
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  it("should return 400 if email is missing", async () => {
    const response = await request(server)
      .post("/api/user/register")
      .send({ password: "password123" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("You must enter an email address.");
  });
});
