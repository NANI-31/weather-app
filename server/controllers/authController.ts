import { Request, Response } from "express";

import User from "../models/User";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { google } from "googleapis";
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

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

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  console.log("forgotPassword Controller Hit. Body:", req.body);
  try {
    const { email } = req.body;
    if (!email) {
      console.log("Error: Email missing in body");
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const user = await User.findOne({ email });
    console.log(
      "User search result:",
      user ? `Found user: ${user.email}` : "User not found"
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = expiry;
    await user.save();
    const accessToken = await oAuth2Client.getAccessToken();
    // Send Email
    // Use explicit host and port for better reliability on cloud platforms
    console.log("passing user to email");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    } as any);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password - WeatherPro",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
            .container { max-width: 500px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
            .content { padding: 40px 30px; color: #334155; text-align: center; }
            .otp-box { background-color: #eff6ff; border: 2px dashed #bfdbfe; border-radius: 8px; padding: 20px; margin: 25px 0; font-size: 32px; font-weight: 700; color: #1d4ed8; letter-spacing: 5px; font-family: 'Courier New', monospace; }
            .text { font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
            .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
            .warning { font-size: 13px; color: #dc2626; margin-top: 20px; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>WeatherPro</h1>
            </div>
            <div class="content">
              <p class="text">Hello,</p>
              <p class="text">We received a request to reset your password. Use the verification code below to proceed.</p>

              <div class="otp-box">${otp}</div>

              <p class="text">This code will expire in 10 minutes.</p>

              <p class="warning">If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} WeatherPro. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `,
      // text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent to email");
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: (error as Error).message });
  }
};

// @desc    Reset Password - Verify OTP and Update
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() }, // Check expiry
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({
      message: "Failed to reset password",
      error: (error as Error).message,
    });
  }
};

export {
  registerUser,
  loginUser,
  googleLogin,
  logoutUser,
  forgotPassword,
  resetPassword,
};
