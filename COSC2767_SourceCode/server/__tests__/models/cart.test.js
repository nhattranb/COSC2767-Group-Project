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
const Cart = require("../../models/cart"); // Adjust path
const { CART_ITEM_STATUS } = require("../../constants"); // Adjust path

describe("Cart and CartItem Model Tests", () => {
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
    await Cart.deleteMany({});
  });

  it("should create and save a CartItem with default values", async () => {
    const cartItem = {
      product: new mongoose.Types.ObjectId(),
      quantity: 2,
      purchasePrice: 100,
      totalPrice: 200,
      priceWithTax: 220,
      totalTax: 20,
      status: CART_ITEM_STATUS.Processing,
    };

    const cart = new Cart({
      products: [cartItem],
      user: new mongoose.Types.ObjectId(),
    });

    const savedCart = await cart.save();

    expect(savedCart._id).toBeDefined();
    expect(savedCart.products.length).toBe(1);
    const savedCartItem = savedCart.products[0];
    expect(savedCartItem.purchasePrice).toBe(100);
    expect(savedCartItem.totalPrice).toBe(200);
    expect(savedCartItem.priceWithTax).toBe(220);
    expect(savedCartItem.totalTax).toBe(20);
    expect(savedCartItem.status).toBe(CART_ITEM_STATUS.Processing);
  });

  it("should create a CartItem with default status if not provided", async () => {
    const cartItem = {
      product: new mongoose.Types.ObjectId(),
      quantity: 1,
      purchasePrice: 50,
      totalPrice: 50,
    };

    const cart = new Cart({
      products: [cartItem],
      user: new mongoose.Types.ObjectId(),
    });

    const savedCart = await cart.save();
    const savedCartItem = savedCart.products[0];

    expect(savedCartItem.status).toBe(CART_ITEM_STATUS.Not_processed);
  });

  it("should fail to save a CartItem with an invalid status", async () => {
    const cartItem = {
      product: new mongoose.Types.ObjectId(),
      quantity: 1,
      purchasePrice: 50,
      totalPrice: 50,
      status: "Invalid_Status", // Invalid status
    };

    const cart = new Cart({
      products: [cartItem],
      user: new mongoose.Types.ObjectId(),
    });

    let error;
    try {
      await cart.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
  });

  it("should create and save a Cart with multiple CartItems", async () => {
    const cartItems = [
      {
        product: new mongoose.Types.ObjectId(),
        quantity: 1,
        purchasePrice: 100,
        totalPrice: 100,
        priceWithTax: 110,
        totalTax: 10,
        status: CART_ITEM_STATUS.Shipped,
      },
      {
        product: new mongoose.Types.ObjectId(),
        quantity: 2,
        purchasePrice: 50,
        totalPrice: 100,
        priceWithTax: 110,
        totalTax: 10,
        status: CART_ITEM_STATUS.Delivered,
      },
    ];

    const cart = new Cart({
      products: cartItems,
      user: new mongoose.Types.ObjectId(),
    });

    const savedCart = await cart.save();

    expect(savedCart.products.length).toBe(2);
    expect(savedCart.products[0].status).toBe(CART_ITEM_STATUS.Shipped);
    expect(savedCart.products[1].status).toBe(CART_ITEM_STATUS.Delivered);
  });

  it("should update the updated field on modification", async () => {
    const cart = new Cart({
      products: [
        {
          product: new mongoose.Types.ObjectId(),
          quantity: 1,
          purchasePrice: 100,
        },
      ],
      user: new mongoose.Types.ObjectId(),
    });

    const savedCart = await cart.save();
    savedCart.products[0].quantity = 3;
    savedCart.updated = new Date();

    const updatedCart = await savedCart.save();

    expect(updatedCart.updated).toBeDefined();
    expect(updatedCart.products[0].quantity).toBe(3);
  });
});