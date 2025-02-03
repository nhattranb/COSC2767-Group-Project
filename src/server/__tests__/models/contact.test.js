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
const Contact = require("../../models/contact");

describe("Contact Model Test", () => {
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
    await Contact.deleteMany({});
  });

  it("should create and save a Contact successfully", async () => {
    const contactData = {
      name: "John Doe",
      email: "john.doe@example.com",
      message: "This is a test message.",
    };

    const contact = new Contact(contactData);
    const savedContact = await contact.save();

    expect(savedContact._id).toBeDefined();
    expect(savedContact.name).toBe(contactData.name);
    expect(savedContact.email).toBe(contactData.email);
    expect(savedContact.message).toBe(contactData.message);
    expect(savedContact.created).toBeDefined();
  });

  it("should trim whitespace from name and message fields", async () => {
    const contactData = {
      name: "   Jane Smith   ",
      email: "jane.smith@example.com",
      message: "   Hello, world!   ",
    };

    const contact = new Contact(contactData);
    const savedContact = await contact.save();

    expect(savedContact.name).toBe("Jane Smith");
    expect(savedContact.message).toBe("Hello, world!");
  });

  it("should handle missing optional fields gracefully", async () => {
    const contactData = {
      name: "John Doe",
    };

    const contact = new Contact(contactData);
    const savedContact = await contact.save();

    expect(savedContact.name).toBe(contactData.name);
    expect(savedContact.email).toBeUndefined();
    expect(savedContact.message).toBeUndefined();
  });

  it("should update the updated field on modification", async () => {
    const contactData = {
      name: "John Doe",
      email: "john.doe@example.com",
      message: "This is a test message.",
    };

    const contact = new Contact(contactData);
    const savedContact = await contact.save();

    savedContact.message = "Updated message";
    savedContact.updated = new Date();

    const updatedContact = await savedContact.save();

    expect(updatedContact.message).toBe("Updated message");
    expect(updatedContact.updated).toBeDefined();
  });
});