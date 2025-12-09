import { Request, Response } from "express";

import User from "../models/User";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";

const generateToken = (res: Response, userId: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  console.log("Generating token for user:", userId);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("Secure Cookie:", process.env.NODE_ENV === "production");

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // False for local/dev (allows HTTP)
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req: Request, res: Response): Promise<void> => {
  console.log("Register Request Body:", req.body);
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      generateToken(res, user._id as unknown as string);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: "User registered successfully",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req: Request, res: Response): Promise<void> => {
  console.log("Login User Request:", req.body);
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      generateToken(res, user._id as unknown as string);
      res.json({
        _id: user._id,
        username: user?.username,
        name: user.name,
        email: user.email,
        favorites: user.favorites,
        picture: user.picture,
        message: "Login successful",
        googleId: user.googleId,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body; // Client sends 'token', not 'access_token'

    if (!token) {
      res.status(400).json({ message: "Token is required" });
      return;
    }

    // Verify the ID token using google-auth-library
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    const { name, email, picture, sub: googleId } = payload;

    if (!email) {
      res.status(400).json({ message: "Email not found in token" });
      return;
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name || email.split("@")[0],
        email,
        googleId,
        picture,
        name,
        favorites: [],
      });
    } else {
      let isModified = false;
      if (!user.googleId) {
        user.googleId = googleId;
        user.picture = user.picture || picture; // Use google pic if existing is null
        isModified = true;
      }

      // Also update picture if it's missing but available in payload (e.g. cleared manually)
      if (!user.picture && picture) {
        user.picture = picture;
        isModified = true;
      }

      if (isModified) {
        await user.save();
      }
    }

    generateToken(res, user._id as unknown as string);

    res.status(200).json({
      _id: user._id,
      name: user.name || user.username,
      email: user.email,
      picture: user.picture,
      favorites: user.favorites,
      googleId: user.googleId,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Google Authentication failed" });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req: Request, res: Response) => {
  console.log("Logged out successfully");
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export { registerUser, loginUser, googleLogin, logoutUser };
