const AuthService = require("../services/AuthService");
const UserService = require("../services/UserService");

const UserMiddleware = {
  async protect(req, res, next) {
    try {
      const loginToken = req.headers["login-token"];
      if (loginToken === null || loginToken === undefined || !loginToken) {
        return res.status(404).json({
          success: 0,
          message: "loginToken Not Found",
        });
      }
      const userData = await AuthService.VerifyToken(loginToken);
      if (userData.userId !== "NA") {
        const { userId } = userData;
        const user = await UserService.getUserData({ _id: userId });
        if (user) {
          delete user.password;
          req.sessionDetails = user;
          next();
        } else {
          return res.status(404).json({
            success: 0,
            message: "something went wrong",
          });
        }
      } else {
        return res.status(400).json({
          success: 0,
          message: "Invalid token",
        });
      }
    } catch (e) {
      return res.status(500).json({
        success: 0,
        msg: "server error",
        error: e.message,
      });
    }
  },
};

module.exports = UserMiddleware;
