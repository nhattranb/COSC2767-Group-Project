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
const Brand = require("../../models/brand"); // Adjust path as needed

describe("Brand Model Test", () => {
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
    await Brand.deleteMany({});
  });

  it("should create and save a Brand with a generated slug", async () => {
    const brand = new Brand({
      name: "Test Brand",
      description: "A sample description for the brand",
    });

    const savedBrand = await brand.save();

    expect(savedBrand._id).toBeDefined();
    expect(savedBrand.slug).toBe("test-brand"); // Slug generated from the name
    expect(savedBrand.isActive).toBe(true); // Default value
    expect(savedBrand.created).toBeDefined();
    expect(savedBrand.merchant).toBeNull(); // Default value
  });

  it("should ensure the slug is unique", async () => {
    const brand1 = new Brand({ name: "Test Brand" });
    const brand2 = new Brand({ name: "Test Brand" });

    await brand1.save();

    let error;
    try {
      await brand2.save();
    } catch (err) {
      error = err;
    }
  });

  it("should associate a Brand with a Merchant", async () => {
    const merchantId = new mongoose.Types.ObjectId();

    const brand = new Brand({
      name: "Merchant Brand",
      merchant: merchantId,
    });

    const savedBrand = await brand.save();

    expect(savedBrand.merchant.toString()).toBe(merchantId.toString());
  });

  it("should handle optional fields gracefully", async () => {
    const brand = new Brand({
      name: "Minimal Brand",
    });

    const savedBrand = await brand.save();
  });

  it("should update the updated field on modification", async () => {
    const brand = new Brand({
      name: "Brand To Update",
    });

    const savedBrand = await brand.save();
    savedBrand.name = "Updated Brand";
    savedBrand.updated = new Date();

    const updatedBrand = await savedBrand.save();

    expect(updatedBrand.name).toBe("Updated Brand");
    expect(updatedBrand.updated).toBeDefined();
  });
});