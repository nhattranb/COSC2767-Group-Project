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
const Review = require("../../models/review"); // Adjust path
const { REVIEW_STATUS } = require("../../constants"); // Adjust path

describe("Review Model Tests", () => {
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
    await Review.deleteMany({});
  });

  it("should create and save a Review with default values", async () => {
    const reviewData = {
      title: "Great Product",
      rating: 5,
      review: "This product is amazing!",
    };

    const review = new Review(reviewData);
    const savedReview = await review.save();

    expect(savedReview._id).toBeDefined();
    expect(savedReview.title).toBe(reviewData.title);
    expect(savedReview.rating).toBe(reviewData.rating);
    expect(savedReview.review).toBe(reviewData.review);
    expect(savedReview.isRecommended).toBe(true); // Default value
    expect(savedReview.status).toBe(REVIEW_STATUS.Waiting_Approval); // Default value
    expect(savedReview.created).toBeDefined();
  });

  it("should enforce enum validation for status", async () => {
    const reviewData = {
      title: "Invalid Review",
      status: "Invalid_Status", // Invalid enum value
    };

    const review = new Review(reviewData);

    let error;
    try {
      await review.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors["status"].message).toContain(
      "`Invalid_Status` is not a valid enum value"
    );
  });

  it("should reference a Product correctly", async () => {
    const productId = new mongoose.Types.ObjectId();

    const reviewData = {
      title: "Product Review",
      product: productId,
    };

    const review = new Review(reviewData);
    const savedReview = await review.save();

    expect(savedReview.product.toString()).toBe(productId.toString());
  });

  it("should update the updated field on modification", async () => {
    const reviewData = {
      title: "Old Review",
      review: "Not updated yet.",
    };

    const review = new Review(reviewData);
    const savedReview = await review.save();

    savedReview.review = "Updated review content.";
    savedReview.updated = new Date();

    const updatedReview = await savedReview.save();

    expect(updatedReview.review).toBe("Updated review content.");
    expect(updatedReview.updated).toBeDefined();
  });
});