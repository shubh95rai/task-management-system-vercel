import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/User.js";

// generate JWT token
function generateToken(userId) {
  const tokenBody = {
    id: userId,
  };

  return jwt.sign(tokenBody, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// register a new user
// POST /api/auth/register
// public route
async function registerUser(req, res) {
  const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (!profileImageUrl) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    // check if user already exists
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    // check if admin invite token is valid, if yes, set role to admin otherwise set to member
    let role = "member";
    // if (
    //   adminInviteToken &&
    //   adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    // ) {
    //   role = "admin";
    // }

    if (adminInviteToken && adminInviteToken === "Admin") {
      role = "admin";
    }

    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role,
    });

    // return user data with JWT token
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
      },
      token: generateToken(user._id),
      message: "Registration successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// login user
// POST /api/auth/login
// public route
async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // compare password
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // return user data with JWT token
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
      },
      token: generateToken(user._id),
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// get user profile
// GET /api/auth/profile
// protected route (JWT required)
async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
      },
      message: "User profile fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// update user profile
// PUT /api/auth/profile
// protected route (JWT required)
async function updateUserProfile(req, res) {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImageUrl: updatedUser.profileImageUrl,
      },
      token: generateToken(updatedUser._id),
      message: "User profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export { registerUser, loginUser, getUserProfile, updateUserProfile };
