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
const Wishlist = require("../../models/wishlist");
const {beforeAll} = require("@jest/globals"); // Adjust path

describe("Wishlist Model Tests", () => {
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
    await Wishlist.deleteMany({});
  });

  it("should create and save a Wishlist with default values", async () => {
    const wishlistData = {
      product: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
    };

    const wishlist = new Wishlist(wishlistData);
    const savedWishlist = await wishlist.save();

    expect(savedWishlist._id).toBeDefined();
    expect(savedWishlist.product.toString()).toBe(
      wishlistData.product.toString()
    );
    expect(savedWishlist.user.toString()).toBe(wishlistData.user.toString());
    expect(savedWishlist.isLiked).toBe(false); // Default value
    expect(savedWishlist.created).toBeDefined();
  });

  it("should allow setting isLiked to true", async () => {
    const wishlistData = {
      product: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
      isLiked: true,
    };

    const wishlist = new Wishlist(wishlistData);
    const savedWishlist = await wishlist.save();

    expect(savedWishlist.isLiked).toBe(true);
  });

  it("should update the updated field on modification", async () => {
    const wishlistData = {
      product: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
    };

    const wishlist = new Wishlist(wishlistData);
    const savedWishlist = await wishlist.save();

    savedWishlist.isLiked = true;
    savedWishlist.updated = new Date();

    const updatedWishlist = await savedWishlist.save();

    expect(updatedWishlist.isLiked).toBe(true);
    expect(updatedWishlist.updated).toBeDefined();
  });
});
