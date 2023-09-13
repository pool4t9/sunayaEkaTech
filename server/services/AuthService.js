const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const AuthService = {
  async generateToken(data) {
    let token;
    try {
      token = JWT.sign(data, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      return token;
    } catch (e) {
      console.log(e);
      throw Error(e.message);
    }
  },
  async VerifyToken(token) {
    let decode;
    try {
      decode = JWT.verify(token, process.env.JWT_SECRET);
      return decode;
    } catch (e) {
      console.log(e);
      throw Error(e.message);
    }
  },
  async generatePassword(password) {
    let hashPassword = "NA";
    try {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
      return hashPassword;
    } catch (e) {
      console.log(e);
      throw Error(e.message);
    }
  },
  async verifyPassword(password, hashPassword) {
    let data = false;
    try {
      data = await bcrypt.compare(password, hashPassword);
      return data;
    } catch (e) {
      console.log(e);
      throw Error(e.message);
    }
  },
};

module.exports = AuthService;
