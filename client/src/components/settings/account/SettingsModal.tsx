import { useState } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "@features/settings/settingsSlice";
import { clearFavoriteCities } from "@features/weather/weatherSlice";
import {
  Settings,
  X,
  User,
  Mail,
  Edit2,
  AlertTriangle,
  Trash2,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  updateUserProfile,
  deleteAllFavorites,
  deleteAccount,
} from "@api/authAPI";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string | null;
  userEmail: string | null;
  googleId?: string;
}

export default function SettingsModal({
  isOpen,
  onClose,
  userName,
  userEmail,
  googleId,
}: SettingsModalProps) {
  const dispatch = useDispatch();
  const [editName, setEditName] = useState(userName || "");
  const [editEmail, setEditEmail] = useState(userEmail || "");
  const [isUpdating, setIsUpdating] = useState(false);

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
      onClose();
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

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This action is irreversible!")) return;
    try {
      await deleteAccount();
      dispatch(logout());
      dispatch(clearFavoriteCities());
      toast.info("Account deleted. We're sad to see you go.");
      onClose(); // Though usually unmounted by logout
    } catch {
      toast.error("Failed to delete account");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" /> Settings
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4 mb-8">
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
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
                    className={`w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors ${
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
                className="w-full bg-primary text-white py-2 rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  "Saving..."
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </form>

            <div className="border-t border-white/10 pt-6">
              <h4 className="text-red-400 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Danger Zone
              </h4>
              <div className="space-y-3">
                <button
                  onClick={handleDeleteFavorites}
                  className="w-full py-2 px-4 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors flex items-center justify-between"
                >
                  <span>Delete All Favorites</span>
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full py-2 px-4 rounded-xl bg-red-500 text-white hover:bg-red-600 text-sm font-medium transition-colors flex items-center justify-between shadow-lg shadow-red-500/20"
                >
                  <span>Delete Account</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
