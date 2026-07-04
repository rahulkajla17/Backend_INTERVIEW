import { User } from "../models/user.model";
import { apiError } from "../utils/apierror";
import { apiResponse } from "../utils/apiresponse";
import { asynchandler } from "../utils/asynchandler";

const generateAccessRefreshToken = async (userId) => {
  try {
    const user = User.findById(userId);
    const AccessToken = user.generateAccessToken();
    const RefreshToken = user.generateRefreshToken();

    user.RefreshToken = RefreshToken;
    await user.save({ validatebeforesave: false });
    return { AccessToken, RefreshToken };
  } catch (error) {
    throw new apiError(
      400,
      "something went wrong while generate the AccessToken and RefreshToken",
    );
  }
};
const registerUser = asynchandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  if (
    [fullName, username, email, password].some((field) => field?.trim === "")
  ) {
    throw new apiError(400, "all Fiels are required");
  }

  const ExistedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (ExistedUser) {
    throw new apiError(409, "user with this username or email already exist");
  }

  const user = await User.create({
    username: username.lowercase(),
    email,
    password,
    fullName,
  });

  const usercreated = await User.findById(user._id).select(
    "-password -refreshtoken",
  );

  if (!usercreated) {
    throw new apiError(500, "something went wrong while registering the user");
  }

  return res
    .status(202)
    .json(new apiResponse(200, usercreated, "user succesfully created!!"));
});

const loginUser = asynchandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!email && !username) {
    throw new apiError(400, "email and username are required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new apiError(404, "user does not found");
  }
  const ispasswordvalid = await user.ispasswordcorrect(password);

  if (!ispasswordvalid) {
    throw new apiError(401, "password is incorrect");
  }

  const { RefreshToken, AccessToken } = await generateAccessRefreshToken(
    user._id,
  );

  const loggedinuser = await User.findById(user._id).select(
    "-password -RefreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accesstoken", AccessToken, options)
    .cookie("refreshtoken", RefreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedinuser,
          AccessToken,
          RefreshToken,
        },
        "user loggedin Successfully",
      ),
    );
});

const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshtoken: 1,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json(new apiResponse(200, {}, "user logged out succesfully"));
});

const refreshAccesstoken = asynchandler(async (req, res) => {
  const incomingrefreshtoken =
    req.body.refreshtoken || req.cookies.refreshtoken;

  if (!incomingrefreshtoken) {
    throw new apiError(400, "refresh token required");
  }

  const decodedtoken = jwt.verify(
    incomingrefreshtoken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  try {
    const user = await User.findById(decodedtoken?._id);

    if (!user) {
      throw new apiError(401, " INvalid refresh token");
    }

    if (incomingrefreshtoken !== user?.refreshtoken) {
      throw new apiError(401, "referesh token is used or expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { refreshtoken, newaccesstoken } = await generateAccessRefreshToken(
      user._id,
    );

    return res
      .status(200)
      .cookie("accesstoken", newaccesstoken)
      .cookie("refreshtoken", refreshtoken)
      .json(
        new apiResponse(
          200,
          {
            refreshtoken,
            accesstoken: newaccesstoken,
          },
          "access token refreshed",
        ),
      );
  } catch (error) {}
});
export { registerUser, loginUser, logoutUser, refreshAccesstoken };
