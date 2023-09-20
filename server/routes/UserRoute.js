const UserController = require("../controller/UserController");
const UserMiddleware = require("../middlewares/UserMiddleware");

const router = require("express").Router();
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    cb(null, true);
  },
  // limits: {
  //   fileSize: 1024 * 1024 * 2,
  // },
});

const middleware = async (err, req, res, next) => {
  // console.log(req.files);
  if (err) {
    console.log(err.message);
    return res.status(422).json({
      success: false,
      message: "Violation for file validation.",
      error: err.message,
    });
  }
  next();
};

router.post("/register", UserController.userRegistration);
router.post(
  "/update-profile",
  UserMiddleware.protect,
  UserController.updateProfile
);

router.post(
  "/upload-profile",
  upload.single("profile"),
  middleware,
  UserController.uploadFile
);

router.post("/login", UserController.login);
router.post("/get-profile", UserMiddleware.protect, UserController.getProfile);
router.post(
  "/update-password",
  UserMiddleware.protect,
  UserController.updatePassword
);
router.post("/forgot-password", UserController.sendLink);
router.post("/reset-password", UserController.resetPassword);

module.exports = router;
