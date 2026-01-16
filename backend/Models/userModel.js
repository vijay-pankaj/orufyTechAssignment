const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  otp: {
  currentOtp: {
    type: String,
    default: ""
  },
  timeDuration: {
    type: Date,
  }
}

}, { timestamps: true });

module.exports = mongoose.model("orufyuser", userSchema);
