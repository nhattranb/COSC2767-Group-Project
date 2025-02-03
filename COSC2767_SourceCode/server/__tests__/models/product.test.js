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
const Product = require("../../models/product"); // Adjust path

describe("Product Model Tests", () => {
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
    await Product.deleteMany({});
  });

  it("should create and save a Product with default values", async () => {
    const productData = {
      sku: "12345",
      name: "Test Product",
      price: 100,
      quantity: 10,
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe(productData.name);
    expect(savedProduct.slug).toBe("test-product"); // Slug generated from name
    expect(savedProduct.price).toBe(productData.price);
    expect(savedProduct.quantity).toBe(productData.quantity);
    expect(savedProduct.taxable).toBe(false); // Default value
    expect(savedProduct.isActive).toBe(true); // Default value
    expect(savedProduct.created).toBeDefined();
  });

  //   it("should enforce unique slug", async () => {
  //     const product1 = new Product({ name: "Unique Product" });
  //     const product2 = new Product({ name: "Unique Product" });

  //     await product1.save();

  //     let error;
  //     try {
  //       await product2.save();
  //     } catch (err) {
  //       error = err;
  //     }

  //     expect(error).toBeDefined();
  //     expect(error.code).toBe(11000); // MongoDB duplicate key error
  //   });

  it("should reference a Brand correctly", async () => {
    const brandId = new mongoose.Types.ObjectId();

    const productData = {
      name: "Branded Product",
      brand: brandId,
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    expect(savedProduct.brand.toString()).toBe(brandId.toString());
  });

  it("should update the updated field on modification", async () => {
    const productData = {
      name: "Old Product",
      price: 50,
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    savedProduct.price = 100;
    savedProduct.updated = new Date();

    const updatedProduct = await savedProduct.save();

    expect(updatedProduct.price).toBe(100);
    expect(updatedProduct.updated).toBeDefined();
  });
});