const { Router } = require('express');
const router = Router();

const {
  // signup,
  // signin
  getCurrentUser,
  sendOtp,
  verifyOtp,
  googleLogin,
  refreshToken
} = require("../controllers/authController");
const authorization = require("../middlewares/authorization");

// router.post("/register", signup);
// router.post("/login", signin);
router.get("/user", authorization, getCurrentUser);
router.post('/google-login', googleLogin);       

router.post('/send-otp',sendOtp);
router.post('/verify-otp',verifyOtp);
router.post('/refresh',refreshToken);

module.exports = router;
