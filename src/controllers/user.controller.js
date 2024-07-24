import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponce } from "../utils/ApiResponce.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user deails from frontend
  // validation - no empty
  // check if user already exist - username
  // check for image and avtar
  // and upload them to cloudinary
  // create user object and user entry in db
  // remove password and refrash token field
  // check for user creation
  // return user

  // get data from frontent or user
  const { username, email, fullname, password } = req.body;
  console.log("username: ", username);
  console.log("email: ", email);
  console.log("fullname: ", fullname);
  console.log("password: ", password);

  // validation
  if (
    [username, email, fullname, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required");
  }

  // check if user already exist - username
  existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "the user already exist");
  }

  // check for image and avtar
  const avtarLocalPath = req.files?.avtar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avtarLocalPath) {
    throw new ApiError(400, "Avtar file is required");
  }

  // and upload them to cloudinary
  const avtar = await uploadOnCloudinary(avtarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avtar) {
    throw new ApiError(400, "Avtar file is required");
  }

  // create user object and user entry in db
  const user = await User.create({
    fullname,
    avtar: avtar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password and refrash token field
  createdUser = User.findById(user._id).select("-password -refreshToken");

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "somhing went wrong while creating user");
  }

  //return responce
  return res
    .status(201)
    .json(new ApiResponce(201, createdUser, "user registerd succesfuly"));
});

export { registerUser };
