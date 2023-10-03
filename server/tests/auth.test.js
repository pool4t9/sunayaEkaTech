const request = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();
const app = require("../app");
let server;

const validToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTA5MjIxODEzNTNiYmJlYjIzOTM5ZmMiLCJpYXQiOjE2OTYzMTE2MDgsImV4cCI6MTY5ODkwMzYwOH0.01sR7-Grm9AHjH7TnqwNFQt1isjOZuPwbgVD96CfJbw";
const inValidToken = "fds4v5f4v8sf4v56fv1sf8v48f9v";
beforeAll(async () => {
  const conn = await mongoose.connect(process.env.DATABASE);
  const { TEST_PORT, TEST_ENV } = process.env;
  server = app.listen(TEST_PORT, () => {
    console.log(`server is listing in ${TEST_ENV} on ${TEST_PORT} `);
    console.log(conn.connection.host);
  });
});

describe("Authentication Tests", () => {
  /**
   * Registration Testing
   */
  describe("Registration /api/user/register", () => {
    test("New User should be registred", async () => {
      const response = await request(app)
        .post("/api/user/register")
        .send({ email: "abhinavg90834@gmail.com", password: "123456789" });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).any(String);
    });

    test("Exists User, success should be false", async () => {
      const response = await request(app)
        .post("/api/user/register")
        .send({ email: "abhinavg90834@gmail.com", password: "123456789" });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test("Validation Error, Email || Password", async () => {
      const response = await request(app)
        .post("/api/user/register")
        .send({ password: "123456789" });

      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  /**
   * Login testing
   */
  describe("Login /api/user/login", () => {
    test("Exists User, User should be logged In", async () => {
      const response = await request(app)
        .post("/api/user/login")
        .send({ email: "abhinavg90834@gmail.com", password: "123456789" });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test("New User, User should not be logged In", async () => {
      const response = await request(app)
        .post("/api/user/login")
        .send({ email: "abhinavg90834@gmail", password: "123456789" });

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User not found");
    });

    test("Password Not Matched", async () => {
      const response = await request(app)
        .post("/api/user/login")
        .send({ email: "abhinavg90834@gmail.com", password: "1234" });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Password not matched");
    });
  });
  describe("Forgot password", () => {
    describe("Send Link for reset password /api/user/forgot-password", () => {
      // test("Send link for registred user", async () => {
      //   const response = await request(app)
      //     .post("/api/user/forgot-password")
      //     .send({ email: "abhinavg90834@gmail.com" });
      //   expect(response.statusCode).toBe(200);
      //   expect(response.body.success).toBe(true);
      //   expect(response.body.message).toBe(
      //     "Email is sended to your registred email"
      //   );
      // });

      test("send Link for unregistred user", async () => {
        const response = await request(app)
          .post("/api/user/forgot-password")
          .send({ email: "abhi@gmail.com" });
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("User not found");
      });
    });

    describe("Update new Password (reset password) /api/user/reset-password", () => {
      test("with Invalid token and valid password", async () => {
        const response = await request(app)
          .post("/api/user/reset-password")
          .send({ password: "123456789", token: inValidToken });
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test("valid token and without password", async () => {
        const response = await request(app)
          .post("/api/user/reset-password")
          .send({ token: validToken });
        expect(response.statusCode).toBe(500);
        expect(response.body.success).toBe(false);
      });

      test("with valid token and password", async () => {
        const response = await request(app)
          .post("/api/user/reset-password")
          .send({ token: validToken, password: "123456" });
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });
  });
  describe("Update Password", () => {
    test("inValid token or invalid user", async () => {
      const response = await request(app)
        .post("/api/user/update-password")
        .send({ newPassword: "789456123", oldPassword: "789456213" })
        .set({ "login-token": inValidToken });
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test("Invalid or mismatched old password", async () => {
      const response = await request(app)
        .post("/api/user/update-password")
        .send({ newPassword: "789456123" })
        .set({ "login-token": validToken });

      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
    });

    test("valid token and old password", async () => {
      const response = await request(app)
        .post("/api/user/update-password")
        .send({ newPassword: "123456789", oldPassword: "12345678" })
        .set({ "login-token": validToken });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(false);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
