const AuthService = require("../services/AuthService");
const UserServices = require("../services/UserService");
const EmailService = require("../services/EmailService");
const fs = require("fs");

const UserController = {
  userRegistration: async function (req, res) {
    try {
      const formData = {
        email: req.body.email,
        password: await AuthService.generatePassword(req.body.password),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
      };
      const isExists = await UserServices.getUserData({
        email: req.body.email,
      });
      if (!isExists) {
        const user = await UserServices.addUser(formData);
        const token = AuthService.generateToken({ userId: user._id });
        if (user) {
          return res.status(201).json({
            success: true,
            message: "User registred succesfully",
            data: { token },
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "something went wrong, please try again",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "server error, please try again",
        error: e.message,
      });
    }
  },
  updateProfile: async function (req, res) {
    try {
      const formData = {};
      const {
        first_name,
        last_name,
        contact,
        dob,
        gender,
        qualification,
        hobbies,
        profile,
      } = req.body;
      if (first_name) formData.first_name = first_name;
      if (last_name) formData.last_name = last_name;
      if (contact) formData.contact = contact;
      if (dob) formData.dob = dob;
      if (gender) formData.gender = gender;
      if (qualification) formData.qualification = qualification;
      if (hobbies) formData.hobbies = hobbies;
      if (profile) formData.profile = profile;
      const data = await UserServices.updateUser(
        { email: req.sessionDetails.email },
        formData
      );
      if (data) {
        return res.status(201).json({
          success: true,
          message: "User profile updated succesfully",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "something went wrong, please try again",
        });
      }
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "server error, please try again",
        error: e.message,
      });
    }
  },
  login: async function (req, res) {
    try {
      const user = await UserServices.getUserData({
        email: req.body.email,
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      const isMatched = await AuthService.verifyPassword(
        req.body.password,
        user.password
      );
      if (isMatched) {
        const token = await AuthService.generateToken({ userId: user._id });
        let profileCompleted = true;
        if (!user.contact || !user.dob || !user.gender || !user.qualification) {
          profileCompleted = false;
        }
        return res.status(200).json({
          success: true,
          message: "User logged in successfully",
          data: { user, token, profileCompleted },
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Password not matched",
        });
      }
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "server error, please try again",
        error: e.message,
      });
    }
  },
  getProfile: async function (req, res) {
    try {
      const profile = await UserServices.getUserData({
        _id: req.sessionDetails._id,
      });
      delete profile.password;
      return res.status(200).json({
        success: true,
        message: "User profile",
        data: { profile },
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "server error, please try again",
        error: e.message,
      });
    }
  },
  updatePassword: async function (req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await UserServices.getUserData({
        _id: req.sessionDetails._id,
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      const isMatched = await AuthService.verifyPassword(
        oldPassword,
        user.password
      );
      if (isMatched) {
        const newP = await AuthService.generatePassword(newPassword);
        await UserServices.updateUser(
          { _id: req.sessionDetails._id },
          { password: newP }
        );
        return res.status(200).json({
          success: false,
          message: "Password Updated successfully",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Password not matched",
        });
      }
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "server error, please try again",
        error: e.message,
      });
    }
  },
  sendLink: async function (req, res) {
    try {
      const { email } = req.body;
      const isExists = await UserServices.getUserData({
        email,
      });
      if (isExists) {
        const token = await AuthService.generateToken({ email });
        const subject = "Reset Password Link";
        const textPart = `Dear ${isExists.first_name}, don't worry we are here.`;
        const link = `http://localhost:5173/reset-password?token=${token}`;
        const html = `Please click on link for reset password <br/><br/> ${link}`;
        await EmailService.sendEmail(email, subject, textPart, html);
        return res.status(200).json({
          success: true,
          message: "Email is sended to your registred email",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "server error, please try again",
        error: e.message,
      });
    }
  },
  resetPassword: async function (req, res) {
    try {
      const { token, password } = req.body;
      const userData = AuthService.VerifyToken(token);
      if (!userData) {
        return res.status(400).json({
          success: false,
          message: "Invalid token",
        });
      }
      const data = await UserServices.updateUser(
        { email: userData.email },
        { password: await AuthService.generatePassword(password) }
      );
      if (data) {
        return res.status(200).json({
          success: true,
          message: "Password Updated successfully",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid token, something went wrong",
        });
      }
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "server error, please try again",
        error: e.message,
      });
    }
  },
  uploadFileUsingBuffer: async function (req, res) {
    try {
      const img = fs.readFileSync(req.file.path);
      const base64String = Buffer.from(img).toString("base64");

      const withPrefix = "data:image/png;base64," + base64String;
      return res.status(201).json({
        success: true,
        data: { imageUrl: req.file.path, url: withPrefix },
        message: "Image Uploaded successfully",
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "server error, please try again",
        error: e.message,
      });
    }
  },
  uploadFile: async function (req, res) {
    try {
      return res.status(201).json({
        success: true,
        data: { imageUrl: req.file.path },
        message: "Image Uploaded successfully",
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "server error, please try again",
        error: e.message,
      });
    }
  },
};

module.exports = UserController;
