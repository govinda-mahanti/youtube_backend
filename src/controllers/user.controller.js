import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponce } from "../utils/ApiResponce.js";

const generateAccessTokenRefereshToken = async (userId) => {
  try {
    const user = User.findById(userId);
    const refereshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    user.refereshToken = refereshToken;
    await user.save({ validateBeforeSave: false });

    return { refereshToken, accessToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong");
  }
};

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
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "the user already exist");
  }

  // check for image and avtar
  const avtarLocalPath = req.files?.avtar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
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
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "somhing went wrong while creating user");
  }

  //return responce
  return res
    .status(201)
    .json(new ApiResponce(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body - data
  // username and email
  // find the user
  // password to check
  // access and refresh token
  // send cookies

  // req body - data
  const {email, username, password} = req.body

  // username and email
  if (!email && !username) {
    throw new ApiError(400, "username or email must be ");
  }

  // find the user
  const user = User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  // password to check
  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "password is in correct");
  }

  // access and refresh token or create tokens
  const { refereshToken, accessToken } = await generateAccessTokenRefereshToken(
    user._id
  );

  // update the user
  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // send cookies
  //optinon for cookie by default it modifiable but after that it can modify only in server
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("refereshToken", refereshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponce(
        200,
        {
          user: loggedinUser,
          accessToken,
          refereshToken,
        },
        "User logedin successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // remove cookie
  // reset refresh token

  // reset refresh token
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  // remove cookie
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("refereshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponce(200, {}, "user loged out"));
});

export { registerUser, loginUser, logoutUser };
