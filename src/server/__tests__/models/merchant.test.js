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
const Merchant = require("../../models/merchant"); // Adjust path
const { MERCHANT_STATUS } = require("../../constants"); // Adjust path

describe("Merchant Model Tests", () => {
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
    await Merchant.deleteMany({});
  });

  it("should create and save a Merchant with default values", async () => {
    const merchantData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      brandName: "Doe Brand",
      business: "Retail",
    };

    const merchant = new Merchant(merchantData);
    const savedMerchant = await merchant.save();

    expect(savedMerchant._id).toBeDefined();
    expect(savedMerchant.name).toBe(merchantData.name);
    expect(savedMerchant.email).toBe(merchantData.email);
    expect(savedMerchant.phoneNumber).toBe(merchantData.phoneNumber);
    expect(savedMerchant.business).toBe(merchantData.business);
    expect(savedMerchant.isActive).toBe(false); // Default value
    expect(savedMerchant.status).toBe(MERCHANT_STATUS.Waiting_Approval); // Default value
    expect(savedMerchant.created).toBeDefined();
  });

  it("should enforce enum validation for status", async () => {
    const merchantData = {
      name: "Jane Doe",
      status: "Invalid_Status", // Invalid enum value
    };

    const merchant = new Merchant(merchantData);

    let error;
    try {
      await merchant.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors["status"].message).toContain(
      "`Invalid_Status` is not a valid enum value"
    );
  });

  it("should reference a Brand correctly", async () => {
    const brandId = new mongoose.Types.ObjectId();

    const merchantData = {
      name: "Brand Merchant",
      brand: brandId,
    };

    const merchant = new Merchant(merchantData);
    const savedMerchant = await merchant.save();

    expect(savedMerchant.brand.toString()).toBe(brandId.toString());
  });

  it("should update the updated field on modification", async () => {
    const merchantData = {
      name: "Old Merchant",
      email: "old.merchant@example.com",
    };

    const merchant = new Merchant(merchantData);
    const savedMerchant = await merchant.save();

    savedMerchant.name = "Updated Merchant";
    savedMerchant.updated = new Date();

    const updatedMerchant = await savedMerchant.save();

    expect(updatedMerchant.name).toBe("Updated Merchant");
    expect(updatedMerchant.updated).toBeDefined();
  });
});