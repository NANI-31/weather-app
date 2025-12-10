import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";
import { AuthRequest } from "../middleware/authMiddleware";

// @desc    Upload profile picture
// @route   POST /api/users/profile-picture
// @access  Private
export const uploadProfilePicture = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const userId = req.body.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // 1. Delete old image if it exists and is a Cloudinary image
    if (user.picture && user.picture.includes("cloudinary")) {
      const parts = user.picture.split("/");
      const fileName = parts[parts.length - 1];
      const publicId = fileName.split(".")[0];

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(`weatherApp/${publicId}`);
        } catch (err) {
          console.error("Failed to delete old profile picture", err);
        }
      }
    }

    // 2. Upload new image to Cloudinary using stream
    const streamUpload = (req: Request) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "weatherApp",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file!.buffer).pipe(stream);
      });
    };

    const result = (await streamUpload(req)) as any;

    // 3. Update User in DB
    user.picture = result.secure_url;
    await user.save();

    res.json({
      message: "Profile picture updated",
      picture: user.picture,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error during upload" });
  }
};

// @desc    Add favorite city
// @route   POST /api/users/favorites
// @access  Private
export const addFavorite = async (req: AuthRequest, res: Response) => {
  const { city } = req.body;
  const userId = req.user?.id;

  try {
    const user = await User.findById(userId);

    if (user) {
      if (!user.favorites.includes(city)) {
        user.favorites.push(city);
        await user.save();
      }
      res.status(200).json(user.favorites);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Remove favorite city
// @route   DELETE /api/users/favorites
// @access  Private
export const removeFavorite = async (req: AuthRequest, res: Response) => {
  const { city } = req.body;
  const userId = req.user?.id;

  try {
    const user = await User.findById(userId);

    if (user) {
      user.favorites = user.favorites.filter((fav) => fav !== city);
      await user.save();
      res.status(200).json(user.favorites);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get user's favorite cities
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const user = await User.findById(userId);

    if (user) {
      res.status(200).json(user.favorites);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { name, email } = req.body;

  try {
    const user = await User.findById(userId);

    if (user) {
      user.name = name || user.name;
      user.username = name || user.username;

      // Only allow email update if not a Google account, OR if we want to allow it (usually google accounts email is fixed)
      if (!user.googleId) {
        user.email = email || user.email;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name || updatedUser.username,
        email: updatedUser.email,
        googleId: updatedUser.googleId,
        picture: updatedUser.picture,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete all favorite cities
// @route   DELETE /api/users/favorites/all
// @access  Private
export const deleteAllFavorites = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const user = await User.findById(userId);

    if (user) {
      user.favorites = [];
      await user.save();
      res.status(200).json({ message: "All favorites removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
export const deleteAccount = async (req: AuthRequest, res: Response) => {
  console.log("deleteAccount controller hit");
  const userId = req.user?.id;
  console.log("deleteAccount userId:", userId);

  try {
    const user = await User.findById(userId);
    console.log("User found:", user ? user.email : "No user found");

    if (user) {
      // 1. Delete Cloudinary Image
      if (user.picture && user.picture.includes("cloudinary")) {
        console.log(
          "Attempting to delete Cloudinary image for user:",
          user.email
        );
        const parts = user.picture.split("/");
        const fileName = parts[parts.length - 1];
        const publicId = fileName.split(".")[0];
        console.log("Cloudinary Public ID:", publicId);

        // If your images are in 'weatherApp' folder, you might need 'weatherApp/publicId'
        // But earlier we saw `folder: "weatherApp"`. Cloudinary usually needs 'folder/id' for destroy.
        // Let's protect against errors here.
        if (publicId) {
          try {
            const result = await cloudinary.uploader.destroy(
              `weatherApp/${publicId}`
            );
            console.log("Cloudinary destroy result:", result);
          } catch (err) {
            console.error("Failed to delete cloudinary image", err);
          }
        }
      }

      // 2. Delete User
      console.log("Deleting user from DB...");
      await User.findByIdAndDelete(userId);
      console.log("User deleted from DB");

      // Clear cookie
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      res.status(200).json({ message: "Account deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Change user password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id;

  try {
    const user = await User.findById(userId);

    if (user && user.password) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid current password" });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } else {
      // If user has no password (e.g. Google auth only) but tried to change it, or user not found
      res.status(404).json({ message: "User not found or password not set" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
