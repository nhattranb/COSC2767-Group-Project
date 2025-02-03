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
const Order = require("../../models/order"); // Adjust path

describe("Order Model Tests", () => {
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
    await Order.deleteMany({});
  });

  it("should create and save an Order with default values", async () => {
    const orderData = {
      cart: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    expect(savedOrder._id).toBeDefined();
    expect(savedOrder.cart.toString()).toBe(orderData.cart.toString());
    expect(savedOrder.user.toString()).toBe(orderData.user.toString());
    expect(savedOrder.total).toBe(0); // Default value
    expect(savedOrder.created).toBeDefined();
  });

  it("should update the updated field on modification", async () => {
    const orderData = {
      cart: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
      total: 100,
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    savedOrder.total = 200;
    savedOrder.updated = new Date();

    const updatedOrder = await savedOrder.save();

    expect(updatedOrder.total).toBe(200);
    expect(updatedOrder.updated).toBeDefined();
  });

  it("should handle missing optional fields gracefully", async () => {
    const orderData = {
      cart: new mongoose.Types.ObjectId(),
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    expect(savedOrder.cart.toString()).toBe(orderData.cart.toString());
    expect(savedOrder.user).toBeUndefined(); // Not provided
    expect(savedOrder.total).toBe(0); // Default value
  });
});