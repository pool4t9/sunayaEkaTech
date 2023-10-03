const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const AuthService = {
  generateToken(data) {
    let token;
    try {
      token = JWT.sign(data, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
    } catch (e) {
      token = null;
      throw Error(e.message);
    }
    return token;
  },
  VerifyToken(token) {
    const data = JWT.decode(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return {};
      else return decoded;
    });
    return data;
  },
  async generatePassword(password) {
    let hashPassword = "NA";
    try {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
      return hashPassword;
    } catch (e) {
      throw Error(e.message);
    }
  },
  async verifyPassword(password, hashPassword) {
    let data = false;
    try {
      data = await bcrypt.compare(password, hashPassword);
      return data;
    } catch (e) {
      throw Error(e.message);
    }
  },
};

module.exports = AuthService;
