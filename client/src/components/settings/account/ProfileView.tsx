import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "@app/store";
import { logout, updateUserImage } from "@features/settings/settingsSlice";
import { clearFavoriteCities } from "@features/weather/weatherSlice";
import {
  User,
  Camera,
  MapPin,
  Calendar,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { logoutUser, uploadProfilePicture } from "@api/authAPI";
import { motion } from "framer-motion";
import SettingsPanel from "./SettingsPanel";

export default function ProfileView() {
  const dispatch = useDispatch();
  const { userName, userImage, userEmail, userId, googleId } = useSelector(
    (state: RootState) => state.settings
  );
  const { favoriteCities } = useSelector((state: RootState) => state.weather);

  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload an image file");
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image size should be less than 5MB");
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      if (!userId) {
        toast.error("User ID not found. Please log in again.");
        return;
      }

      const response = await uploadProfilePicture(formData, userId);
      dispatch(updateUserImage(response.picture));
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
    dispatch(logout());
    dispatch(clearFavoriteCities());
    toast.info("Signed out successfully");
  };

  return (
    <div className="glass-card min-h-[500px] flex flex-col items-center relative overflow-hidden transition-all duration-500">
      {/* Animated Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[250px] h-[250px] bg-secondary/20 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl z-10 p-8 flex flex-col md:flex-row gap-8 items-center"
      >
        {/* Identity Column */}
        <div className="flex-1 flex flex-col items-center space-y-6">
          <div
            className="relative group cursor-pointer"
            onClick={() => document.getElementById("profile-upload")?.click()}
          >
            <motion.div whileHover={{ scale: 1.05 }} className="relative z-10">
              <div
                className={`w-40 h-40 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl relative ${
                  isUploading ? "opacity-50" : ""
                }`}
              >
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <User className="w-16 h-16 text-primary/60" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px]">
                  <Camera className="w-8 h-8 text-white mb-1" />
                  <span className="text-xs text-white/90 font-medium">
                    Change Photo
                  </span>
                </div>
              </div>

              <div
                className="absolute bottom-3 right-3 w-6 h-6 bg-green-500 rounded-full border-4 border-[#1a1a1a] shadow-lg flex items-center justify-center"
                title="Active"
              >
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
            </motion.div>

            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-110 -z-10 group-hover:bg-primary/50 transition-all duration-500" />

            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-3xl font-bold font-space-grotesk bg-clip-text text-transparent bg-linear-to-r from-primary-foreground to-primary-foreground">
              {userName}
            </h2>
            <p className="text-muted-foreground font-medium">{userEmail}</p>
            {googleId && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                Google Account
              </span>
            )}
          </div>

          <input
            type="file"
            id="profile-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>

        {/* Stats & Actions Column */}
        <div className="flex-1 w-full space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{
                y: -2,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
              className="dark:bg-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.02)] border border-primary-foreground/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-colors cursor-default"
            >
              <MapPin className="w-6 h-6 text-primary" />
              <div className="text-center">
                <span className="text-2xl font-bold block">
                  {favoriteCities.length}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Favorites
                </span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{
                y: -2,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
              className="dark:bg-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.02)] border border-primary-foreground/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-colors cursor-default"
            >
              <Calendar className="w-6 h-6 text-secondary" />
              <div className="text-center">
                <span className="text-2xl font-bold block">Active</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Status
                </span>
              </div>
            </motion.div>
          </div>

          <div className="pt-4 space-y-3">
            {/* Account Settings Button REMOVED */}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-red-500/10 to-red-500/20 
              hover:from-red-500/20 hover:to-red-500/30 border border-red-500/20 text-red-500
              font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/5"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Inline Settings Panel (Always Visible) */}
      <SettingsPanel
        userName={userName}
        userEmail={userEmail}
        googleId={googleId}
      />
    </div>
  );
}
