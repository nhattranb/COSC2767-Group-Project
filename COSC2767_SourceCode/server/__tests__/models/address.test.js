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
const Address = require("../../models/address"); // Adjust path as needed

describe("Address Model Test", () => {
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
    await Address.deleteMany({});
  });

  it("should create and save an Address successfully", async () => {
    const validAddress = new Address({
      user: new mongoose.Types.ObjectId(),
      address: "123 Test Street",
      city: "Test City",
      state: "Test State",
      country: "Test Country",
      zipCode: "12345",
      isDefault: true,
    });

    const savedAddress = await validAddress.save();

    expect(savedAddress._id).toBeDefined();
    expect(savedAddress.address).toBe("123 Test Street");
    expect(savedAddress.city).toBe("Test City");
    expect(savedAddress.state).toBe("Test State");
    expect(savedAddress.country).toBe("Test Country");
    expect(savedAddress.zipCode).toBe("12345");
    expect(savedAddress.isDefault).toBe(true);
    expect(savedAddress.created).toBeDefined();
    expect(savedAddress.updated).toBeUndefined();
  });

  //   it("should fail if a required field is missing", async () => {
  //     const invalidAddress = new Address({
  //       city: "Test City",
  //     });

  //     let err;
  //     try {
  //       await invalidAddress.save();
  //     } catch (error) {
  //       err = error;
  //     }

  //     expect(err).toBeDefined();
  //     expect(err.name).toBe("ValidationError");
  //   });

  it("should update the updated field when modifying the document", async () => {
    const address = new Address({
      user: new mongoose.Types.ObjectId(),
      address: "123 Test Street",
      city: "Test City",
      state: "Test State",
      country: "Test Country",
      zipCode: "12345",
      isDefault: false,
    });

    const savedAddress = await address.save();
    savedAddress.isDefault = true;
    savedAddress.updated = new Date();

    const updatedAddress = await savedAddress.save();

    expect(updatedAddress.updated).toBeDefined();
    expect(updatedAddress.isDefault).toBe(true);
  });
});