const User = require("../models/user");
const jwt = require("jsonwebtoken");
const fast2sms = require("fast-two-sms");
const { OAuth2Client } = require("google-auth-library");

const dotenv = require("dotenv");
dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports.getCurrentUser = async (req, res) => {
  try {
    const _id = req.decoded._id;
    const currentUser = await User.findOne({ _id });
    if (!currentUser) {
      return res.status(400).json({ message: "user does not exists" });
    }
    return res
      .status(200)
      .json({
        data: currentUser,
        message: "user details fetched successfully",
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: err?.message ?? "Something went wrong" });
  }
};

let otpStore = {};

module.exports.sendOtp = async (req, res) => {
  const { number } = req.body;
  console.log("number", number);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("otp", otp);
  otpStore[number] = otp;

  const options = {
    authorization: process.env.FAST2SMS_API_KEY,
    message: `Your OTP is: ${otp}`,
    numbers: [number],
  };
  try {
    await fast2sms.sendMessage(options);
    res.status(200).json({ message: `OTP sent successfully. Your OTP is: ${otp}` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

module.exports.verifyOtp = async (req, res) => {
  const { number, otp } = req.body;
  console.log("number, otp", number, otp);

  if (otpStore[number] !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  let user = await User.findOne({ phone: number });
  let newUser = false;
  if (!user) {
    user = new User({ phone: number });
    await user.save();  
    newUser = true;
  }
  //    else{
  //     console.log('userCoupons-',user.coupons);
  //   }

  const accessToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRY,
    }
  );

  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRY,
    }
  );

  res.status(200).json({
    message: "Login successful",
    data: { token: { accessToken, refreshToken }, user,newUser },
  });
};

module.exports.googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email } = ticket.getPayload();

    let user = await User.findOne({ email });
    // console.log('user',user);
    if (!user) {
      // const encryptedPassword = await bcrypt.hash(email + process.env.JWT_ACCESS_SECRET, 10);
      // console.log('encryptedPassword',encryptedPassword);
      user = await User.create({
        email,
        // password: encryptedPassword,
      });
    }

    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRY,
      }
    );

    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRY,
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token: { accessToken, refreshToken },
      user,
    });
  } catch (error) {
    console.log(error?.message);
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};

module.exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  console.log("token", token);
  let _id
  if (!token) {
    throw new Error("Token not found");
  }
  jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET,
    (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: err?.message });
      }
      if (decoded) {
        _id = decoded?._id;
      }
    }
  );

  const user = await User.findOne({ _id });
  if (!user) {
    throw new Error("Invalid Token");
  }
  const accessToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRY,
    }
  );

  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRY,
    }
  );

  res.status(200).json({
    message: "Token generated successfully",
    data: { token: { accessToken, refreshToken }, user },
  });
};
