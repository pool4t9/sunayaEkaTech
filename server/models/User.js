const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, required: true },
    contact: { type: String },
    dob: { type: String },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    qualification: { type: String },
    hobbies: { type: Boolean },
    profile: { type: String },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
