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

// Routes under test
const newsletterRoutes = require("../../routes/api/newsletter");

jest.mock("../../services/mailgun", () => ({
  sendEmail: jest.fn(() => Promise.resolve(true)),
}));

jest.mock("../../services/mailchimp", () => ({
  subscribeToNewsletter: jest.fn((email) => {
    if (email === "fail@example.com") {
      return Promise.resolve({ status: 400, title: "Invalid email address" });
    }
    return Promise.resolve({ status: 200 });
  }),
}));

describe("Newsletter Routes Tests", () => {
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

    // Initialize Express app
    app = express();
    app.use(express.json());
    app.use("/api/newsletter", newsletterRoutes);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should subscribe to the newsletter successfully", async () => {
    const email = "user@example.com";

    const response = await request(app)
      .post("/api/newsletter/subscribe")
      .send({ email });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "You have successfully subscribed to the newsletter"
    );
    expect(require("../../services/mailgun").sendEmail).toHaveBeenCalledWith(
      email,
      "newsletter-subscription"
    );
    expect(
      require("../../services/mailchimp").subscribeToNewsletter
    ).toHaveBeenCalledWith(email);
  });

  it("should reject subscription with missing email", async () => {
    const response = await request(app)
      .post("/api/newsletter/subscribe")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("You must enter an email address.");
  });

  it("should handle subscription failure from Mailchimp", async () => {
    const email = "fail@example.com";

    const response = await request(app)
      .post("/api/newsletter/subscribe")
      .send({ email });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid email address");
    expect(
      require("../../services/mailchimp").subscribeToNewsletter
    ).toHaveBeenCalledWith(email);
  });
});
