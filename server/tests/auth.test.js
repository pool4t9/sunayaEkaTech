const request = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();
const app = require("../app");
let server;

beforeAll(async () => {
  const conn = await mongoose.connect(process.env.DATABASE);
  const { PORT, NODE_ENV } = process.env;
  server = app.listen(PORT, () => {
    console.log(`server is listing in ${NODE_ENV} on ${PORT} `);
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

    it("Validation Error, Email || Password", async () => {
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
      test("Invalid token, should be return false", async () => {
        const response = await request(app)
          .post("/api/user/reset-password")
          .send({ password: "123456789", token: "1221vdf1vdsv" });
        expect(response.statusCode).toBe(500);
        expect(response.body.success).toBe(false);
      });

      test("empty password", async () => {
        const response = await request(app)
          .post("/api/user/reset-password")
          .send({ token: "dvc4dfv5df5vd5fv156df65v" });
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test("update password", async () => {
        const response = await request(app)
          .post("/api/user/reset-password")
          .send({ token: "dvc4dfv5df5vd5fv156df65v", password: "123456" });
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
