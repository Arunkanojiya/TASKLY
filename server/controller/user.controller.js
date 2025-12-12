import { User } from "../model/user.model.js";
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateOtp, sendEmail } from "../utils/mail.js";

// ---------------------------
// SEND OTP DURING REGISTER
// ---------------------------
export const sendRegisterOtpController = async (req, res) => {
  try {
    console.log("OTP Controller hit", req.body.email);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    // If user already verified → stop
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = generateOtp();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
    const hashedPassword = await bcrypt.hash(password, 10);

    // CASE 1 → User exists but not verified (Resend OTP)
    if (existingUser && !existingUser.isVerified) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;

      await existingUser.save();

      // Respond immediately to frontend
      res.status(200).json({
        message: "OTP resent successfully!",
        userId: existingUser._id,
      });

      // Send email asynchronously
      sendEmail(
        email,
        "Your Registration OTP",
        `Your OTP is: ${otp}\nThis OTP is valid for 10 minutes.`
      ).catch(console.error);

      return; // exit function
    }

    // CASE 2 → New user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    });

    await newUser.save();

    // Respond immediately to frontend
    res.status(200).json({
      message: "OTP sent successfully!",
      userId: newUser._id,
    });

    // Send email asynchronously
    sendEmail(
      email,
      "Your Registration OTP",
      `Your OTP is: ${otp}\nThis OTP is valid for 10 minutes.`
    ).catch(console.error);

  } catch (error) {
    console.log("Send OTP Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// ---------------------------
// VERIFY REGISTER OTP
// ---------------------------
export const verifyRegisterOtpController = async (req, res) => {
  try {
    console.log("Verify OTP Controller hit →", req.body);
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    // SUCCESS: Verify user
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      message: "Account verified successfully!",
      userId: user._id,
    });
  } catch (error) {
    console.log("Verify OTP Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Example: login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.blocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked by the admin.',
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email first',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};




export const getCurrentUserController = async (req, res) => {
  try {
    const Id = req.user?.id;
    if (!Id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Include id and role in response
    const user = await User.findById(Id).select('_id name email role');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const updateProfileController = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email || !validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid details" });
    }

    const exists = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }
    const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true }).select('name email');
    return res.status(200).json({ success: true, message: "Profile updated", user });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


export const updatePasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Invalid details" });
    }
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(200).json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}