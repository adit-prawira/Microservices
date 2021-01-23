import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
    namespace NodeJS {
        interface Global {
            signin(id?: string): string[];
        }
    }
}
// Globally connect all test files to NATS streaming server
jest.mock("../nats-wrapper.ts");
process.env.STRIPE_KEY =
    "sk_test_51ICeoaBvc2qEGwYkFMuvbTqMSpY97t9VXdZw41g9cBmApSNPsEPg6EV7CJCgONPYsCrjEw6cCjavBuOzQJcnJma2001qyJr1GP";
let mongo: any;
beforeAll(async () => {
    process.env.JWT_SECRET = "asdf";
    process.env.Node_TLS_REJECT_UNAUTHORIZED = "0";
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    // Reset mocks data between every single test
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    //  Build a JWT payload. {id, email}
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: "test@test.com",
    };

    //  Create a JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET!);

    //  Build up session object. {jwt: MY_JWT}
    const session = { jwt: token };

    //  Turn session into JSON
    const sessionJSON = JSON.stringify(session);

    //  Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");

    //  return a string thats the cookie with the encoded data
    return [`express:sess=${base64}`];
};
