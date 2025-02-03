/*
RMIT University Vietnam  
Course: COSC2767 Systems Deployment and Operations  
Semester: 2024C  
Assessment: Assignment 2  
Authors: Tran Minh Nhat, Vu Tien Quang, Le Minh Duc
IDs: s3926629, s3981278, s4000577
Created  date: 20/12/2024  
Last modified: 22/12/2024  
Acknowledgement: Acknowledge the resources that you use here.
*/

jest.mock("../../models/category", () => ({
  find: jest.fn(),
}));

const request = require("supertest");
const express = require("express");
const app = express();
const Category = require("../../models/category");

app.use(express.json());
app.use("/", require("../../routes/api/category")); // Adjusted the path

describe("GET /list", () => {
  it("should return active categories", async () => {
    const mockCategories = [
      { name: "Category1", isActive: true },
      { name: "Category2", isActive: true },
    ];
    Category.find.mockResolvedValue(mockCategories);

    const res = await request(app).get("/list");

    expect(res.status).toBe(200);
    expect(res.body.categories).toEqual(mockCategories);
    expect(Category.find).toHaveBeenCalledWith({ isActive: true });
  });

  it("should return an error if the request fails", async () => {
    Category.find.mockRejectedValue(new Error("Database error"));

    const res = await request(app).get("/list");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      "Your request could not be processed. Please try again."
    );
  });
});
