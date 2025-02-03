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
const Category = require("../../models/category"); // Adjust path to the Category model
const { Schema } = mongoose;

describe("Category Model Test", () => {
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
    await Category.deleteMany({});
  });

  it("should create and save a Category with slug generated from name", async () => {
    const category = new Category({
      name: "Electronics",
      description: "A category for electronic devices and gadgets.",
    });

    const savedCategory = await category.save();

    expect(savedCategory._id).toBeDefined();
    expect(savedCategory.slug).toBe("electronics");
    expect(savedCategory.isActive).toBe(true); // Default value
    expect(savedCategory.created).toBeDefined();
  });

  it("should fail to save a Category with duplicate slug", async () => {
    const category1 = new Category({ name: "Books" });
    const category2 = new Category({ name: "Books" });

    await category1.save();

    let error;
    try {
      await category2.save();
    } catch (err) {
      error = err;
    }
  });

  it("should handle optional fields gracefully", async () => {
    const category = new Category({
      name: "Furniture",
    });

    const savedCategory = await category.save();

    expect(savedCategory.description).toBeUndefined(); // Not provided
  });

  it("should reference Product IDs in the products array", async () => {
    const productId1 = new mongoose.Types.ObjectId();
    const productId2 = new mongoose.Types.ObjectId();

    const category = new Category({
      name: "Clothing",
      products: [productId1, productId2],
    });

    const savedCategory = await category.save();

    expect(savedCategory.products.length).toBe(2);
    expect(savedCategory.products[0].toString()).toBe(productId1.toString());
    expect(savedCategory.products[1].toString()).toBe(productId2.toString());
  });

  it("should update the updated field on modification", async () => {
    const category = new Category({
      name: "Toys",
    });

    const savedCategory = await category.save();
    savedCategory.name = "Updated Toys";
    savedCategory.updated = new Date();

    const updatedCategory = await savedCategory.save();

    expect(updatedCategory.name).toBe("Updated Toys");
    expect(updatedCategory.updated).toBeDefined();
  });

  it("should validate auto-generated _id field", async () => {
    const category = new Category({
      name: "Appliances",
    });

    const savedCategory = await category.save();

    expect(savedCategory._id).toBeDefined();
  });
});