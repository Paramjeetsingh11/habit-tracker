// controllers/otpController.js
const { sendOTP } = require("../utils/mailer");

const otpStore = {};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
const verifyOtpLogic = (email, otp) => {
  const record = otpStore[email];   
    if (!record) return false;
    if (record.expires < Date.now()) {
        delete otpStore[email];
        return false;
    }
    if (record.otp != otp) return false;

    delete otpStore[email];
    return true;
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  const otp = generateOTP();

  otpStore[email] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000,
  };

  try {
    await sendOTP(email, otp);
    res.send("OTP sent ✅");
  } catch (err) {
    console.error("❌ MAIL ERROR:", err);
    res.status(500).send("Error sending OTP ❌");
  }
};

exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).send("Email and OTP required ❌");
  }

  const isValid = verifyOtpLogic(email, otp);

  if (!isValid) {
    return res.status(400).send("Invalid or expired OTP ❌");
  }

  res.send("OTP verified successfully ✅");
};

exports.verifyOtpLogic = verifyOtpLogic;