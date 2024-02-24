import mongoose from "mongoose";
import jwt from "jsonwebtoken";
// Corrected import statement for jsonwebtoken
import bcrypt from "bcrypt";

const { Schema } = mongoose; // Destructuring Schema from mongoose

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      // Corrected typo from passowrd to password
      type: String,
      required: [true, "Password is required"],
    },
    fullName: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // Cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // Cloudinary
    },
    refreshToken: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId, // Corrected to Schema.Types.ObjectId
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

// encrypt password
userSchema.pre("save", async function (next) {
  // Changed to regular function to access 'this'
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); // Corrected to this.password and added await
  next();
});

// compare passwords
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); // Corrected parameter order
};

// jwt session token

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // Corrected to expiresIn
    }
  );
};

// refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id, // Corrected to this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // Corrected to expiresIn
    }
  );
};

export const User = mongoose.model("User", userSchema);
