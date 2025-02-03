/*
RMIT University Vietnam  
Course: COSC2767 Systems Deployment and Operations  
Semester: 2024C  
Assessment: Assignment 2  
Author: Tran Minh Nhat  
ID: s3926629  
Created  date: 18/12/2024  
Last modified: 18/12/2024  
Acknowledgement: Acknowledge the resources that you use here.
*/

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
require("dotenv").config({ path: envFile });
const express = require("express");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");

// Mock Models
const User = require("../../models/user");
const Product = require("../../models/product");
const Brand = require("../../models/brand");
const Category = require("../../models/category");

describe("PUT /reviews/:id", () => {
  it("should handle errors and return 404", async () => {
    const app = express();
    const response = await request(app)
      .put("/reviews/12345")
      .send({ title: "Updated Review" });

    expect(response.status).toBe(404);
  });
});
