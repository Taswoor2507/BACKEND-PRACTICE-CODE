import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, userName, password } = req.body;
  // check field are emplty or not
  if (
    [fullName, email, userName, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "Every field is required....");
  }
  // check user is existed or not
  const userExisted = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (userExisted) {
    throw new ApiError(409, "User is already exist");
  }

  // check images are upload locally using multer or not
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  console.log("req.body----->", req.body.avatar);
  console.log("-------->", coverImageLocalPath);
  if (!avatarLocalPath) {
    throw new ApiError(400, "Upload Avatar locally first...");
  }

  // check image is upload on cloudinary or not
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Upload Avatar cloudinary first");
  }

  const user = await User.create({
    userName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    fullName,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to registering data...");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully..."));
});

export default registerUser;
