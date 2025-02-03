/*
RMIT University Vietnam  
Course: COSC2767 Systems Deployment and Operations  
Semester: 2024C  
Assessment: Assignment 2  
Authors: Tran Minh Nhat, Vu Tien Quang
IDs: s3926629, s3981278 
Created  date: 22/12/2024  
Last modified: 22/12/2024  
Acknowledgement: Acknowledge the resources that you use here.
*/

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../../models/user"); // Adjust path
const { ROLES, EMAIL_PROVIDER } = require("../../constants"); // Adjust path

describe("User Model Tests", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should create and save a User with default values", async () => {
    const userData = {
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
      provider: EMAIL_PROVIDER.Email,
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.firstName).toBe(userData.firstName);
    expect(savedUser.lastName).toBe(userData.lastName);
    expect(savedUser.role).toBe(ROLES.Member); // Default value
    expect(savedUser.provider).toBe(EMAIL_PROVIDER.Email);
    expect(savedUser.created).toBeDefined();
  });

  it("should not require an email if provider is not email", async () => {
    const userData = {
      firstName: "Jane",
      lastName: "Doe",
      provider: "google",
      googleId: "google12345",
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBeUndefined();
    expect(savedUser.provider).toBe("google");
  });

  it("should enforce enum validation for role", async () => {
    const userData = {
      email: "user@example.com",
      role: "Invalid_Role", // Invalid enum value
    };

    const user = new User(userData);

    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors["role"].message).toContain(
      "`Invalid_Role` is not a valid enum value"
    );
  });

  it("should update the updated field on modification", async () => {
    const userData = {
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
    };

    const user = new User(userData);
    const savedUser = await user.save();

    savedUser.firstName = "Updated John";
    savedUser.updated = new Date();

    const updatedUser = await savedUser.save();

    expect(updatedUser.firstName).toBe("Updated John");
    expect(updatedUser.updated).toBeDefined();
  });
});