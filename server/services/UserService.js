const User = require("../models/User");

const UserServices = {
  getUserData: async function (filter) {
    let data;
    try {
      data = await User.findOne(filter);
      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  },
  addUser: async function (formData) {
    let user;
    try {
      const data = new User(formData);
      user = await data.save();
      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  },
  updateUser: async function (filter, updatedValue) {
    let data;
    try {
      data = await User.findOneAndUpdate(
        filter,
        { $set: updatedValue },
        { multi: false, new: true }
      );
      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  },
};


module.exports=UserServices;