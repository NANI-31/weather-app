import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // Added import
import { useDispatch } from "react-redux";
import { AxiosError } from "axios"; // Added import
import { login, logout } from "@features/settings/settingsSlice";
import { clearFavoriteCities } from "@features/weather/weatherSlice";
import {
  User,
  Mail,
  AlertTriangle,
  Trash2,
  LogOut,
  Save,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  updateUserProfile,
  deleteAllFavorites,
  deleteAccount,
  changePassword,
} from "@api/authAPI";

interface SettingsPanelProps {
  userName: string | null;
  userEmail: string | null;
  googleId?: string;
  onClose?: () => void;
}

export default function SettingsPanel({
  userName,
  userEmail,
  googleId,
  onClose,
}: SettingsPanelProps) {
  const dispatch = useDispatch();
  const [editName, setEditName] = useState(userName || "");
  const [editEmail, setEditEmail] = useState(userEmail || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Delete Account State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false); // Loading state

  // Prevent scrolling when modal is open
  useEffect(() => {
    const scrollContainer = document.getElementById("main-scroll-container");
    if (showDeleteConfirm && scrollContainer) {
      scrollContainer.style.overflow = "hidden";
    } else if (scrollContainer) {
      scrollContainer.style.overflow = "auto";
    }
    return () => {
      if (scrollContainer) scrollContainer.style.overflow = "auto"; // Cleanup
    };
  }, [showDeleteConfirm]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setIsChangingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updatedUser = await updateUserProfile({
        name: editName,
        email: googleId ? undefined : editEmail,
      });

      dispatch(
        login({
          name: updatedUser.name,
          email: updatedUser.email,
          image: updatedUser.picture,
          _id: updatedUser._id,
          googleId: updatedUser.googleId,
        })
      );

      toast.success("Profile updated successfully");
      if (onClose) onClose();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteFavorites = async () => {
    if (!window.confirm("Are you sure you want to delete all favorites?"))
      return;
    try {
      await deleteAllFavorites();
      dispatch(clearFavoriteCities());
      toast.success("All favorites deleted");
    } catch {
      toast.error("Failed to delete favorites");
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await deleteAccount();
      dispatch(logout());
      dispatch(clearFavoriteCities());
      toast.info("Account deleted. We're sad to see you go.");
    } catch {
      toast.error("Failed to delete account");
      setIsDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="w-full bg-card/30 border-t border-border/10 p-6 md:p-8 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Profile Details
            </h4>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-background/50 border border-primary-foreground/15 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    disabled={!!googleId}
                    className={`w-full bg-background/50 border border-primary-foreground/20 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors ${
                      googleId ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
                {googleId && (
                  <p className="text-xs text-blue-400">Managed by Google</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-primary/20 text-primary border border-primary/20 py-2 rounded-xl font-medium text-sm hover:bg-primary/30 transition-colors flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </form>
            {/* Password Change - Only for non-Google users */}
            {!googleId && (
              <div className="space-y-6 pt-6 border-t border-border/10">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-secondary" /> Security
                </h4>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-background/50 border border-border/20 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-secondary/50 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-background/50 border border-border/20 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-secondary/50 transition-colors"
                        placeholder="Min 6 chars"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Confirm
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-background/50 border border-border/20 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-secondary/50 transition-colors"
                        placeholder="Confirm new"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full bg-secondary/20 text-secondary border border-secondary/20 py-2 rounded-xl font-medium text-sm hover:bg-secondary/30 transition-colors flex items-center justify-center gap-2"
                  >
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" /> Danger Zone
            </h4>

            <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground/80">
                  Delete Favorites
                </p>
                <p className="text-xs text-muted-foreground">
                  Remove all your saved cities permanently.
                </p>
              </div>
              <button
                onClick={handleDeleteFavorites}
                className="w-full py-2 px-4 rounded-xl border border-destructive/20 text-destructive hover:bg-destructive/10 text-sm font-medium transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Clear All Favorites
                </span>
              </button>

              <div className="h-px bg-destructive/10 my-2" />

              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground/80">
                  Delete Account
                </p>
                <p className="text-xs text-muted-foreground">
                  Permanently remove your account and all data.
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="w-full py-2 px-4 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm font-medium transition-colors flex items-center justify-between shadow-lg shadow-destructive/20"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Delete Account
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Account Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteConfirm(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-popover border border-border/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl z-50 text-popover-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Delete Account?</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      This action cannot be undone. All your data including
                      favorites and settings will be permanently removed.
                    </p>
                  </div>

                  <div className="flex w-full gap-3 pt-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeletingAccount}
                      className="flex-1 py-2.5 rounded-xl border border-border/10 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteAccount}
                      disabled={isDeletingAccount}
                      className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeletingAccount ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Yes, Delete"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
