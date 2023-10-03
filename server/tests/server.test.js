const request = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();
const app = require("../app");
let server;

beforeAll(async () => {
  const conn = await mongoose.connect(process.env.DATABASE);
  const { TEST_PORT, TEST_ENV } = process.env;
  server = app.listen(TEST_PORT, () => {
    console.log(`server is listing in ${TEST_ENV} on ${TEST_PORT} `);
    console.log(conn.connection.host);
  });
});

describe("Server testing", () => {
  it("is server running", async () => {
    const response = await request(app).get("/api");
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(1);
    expect(response.body.message).toBe("Server is running");
  });
  it("Not Found", async () => {
    const response = await request(app).get("/api/dcdcnjakdsnckjdc");
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(0);
    expect(response.body.message).toBe("NOT FOUND /api/dcdcnjakdsnckjdc");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
