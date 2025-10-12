import { User } from "../model/user.model.js";
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerController = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name, email, password: hashedPassword,
            role: role || 'user'
        });
        await user.save();

        const token = jwt.sign({ id: user._id,role:user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(201).json({
            success: true, message: "User registered successfully",
            user: { id: user._id, name: user.name, email: user.email },
            token
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}


// Example: login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 🚫 Blocked user check
    if (user.blocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked by the admin.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user,
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