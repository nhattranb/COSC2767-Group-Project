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

const express = require("express");
const request = require("supertest");
const { check } = require("../../middleware/role"); // Adjust the path to your role module

describe("Role Middleware Tests", () => {
  let app;

  beforeEach(() => {
    app = express();

    // Test route using the `check` middleware
    app.get(
      "/test",
      (req, res, next) => {
        // Mock user on the request object
        req.user = { role: "admin" };
        next();
      },
      check("admin", "member"),
      (req, res) => {
        res.status(200).send("Access granted");
      }
    );
  });

  it("should grant access if the user has the required role", async () => {
    const response = await request(app).get("/test");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Access granted");
  });

  it("should deny access if the user does not have the required role", async () => {
    app.get(
      "/denied",
      (req, res, next) => {
        req.user = { role: "guest" }; // Mock user with a non-matching role
        next();
      },
      check("admin", "member"),
      (req, res) => {
        res.status(200).send("Access granted");
      }
    );

    const response = await request(app).get("/denied");
    expect(response.status).toBe(403);
    expect(response.text).toBe("You are not allowed to make this request.");
  });

  it("should deny access if the user is not authenticated", async () => {
    app.get("/unauthenticated", check("admin", "member"), (req, res) => {
      res.status(200).send("Access granted");
    });

    const response = await request(app).get("/unauthenticated");
    expect(response.status).toBe(401);
    expect(response.text).toBe("Unauthorized");
  });
});