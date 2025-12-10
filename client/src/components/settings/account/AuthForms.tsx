import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@features/settings/settingsSlice";
import { setFavoriteCities } from "@features/weather/weatherSlice";
import { toast } from "react-toastify";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import {
  loginUser,
  registerUser,
  googleAuth,
  forgotPassword,
  resetPassword,
} from "@api/authAPI";
import axios from "axios";
import { User } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthForms() {
  const dispatch = useDispatch();

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register State
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Views: 'login' | 'register' | 'forgot-email' | 'verify-otp' | 'reset-password'
  const [authView, setAuthView] = useState<
    "login" | "register" | "forgot-email" | "verify-otp" | "reset-password"
  >("login");

  // const isRegisterView = authView === "register";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword)
      return toast.error("Please fill in all fields");

    if (!emailRegex.test(loginEmail)) {
      return toast.error("Please enter a valid email address");
    }

    try {
      const data = await loginUser({
        email: loginEmail,
        password: loginPassword,
      });
      dispatch(
        login({
          name: data.username || data.name,
          email: data.email,
          _id: data._id,
          image: data.picture,
          googleId: data.googleId,
        })
      );
      if (data.favorites && Array.isArray(data.favorites)) {
        dispatch(setFavoriteCities(data.favorites));
      }
      toast.success("Successfully signed in!");
      setLoginEmail("");
      setLoginPassword("");
    } catch (error) {
      console.error("Login Error:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Failed to sign in");
      } else {
        toast.error("Failed to sign in");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !registerName ||
      !registerEmail ||
      !registerPassword ||
      !confirmPassword
    ) {
      return toast.error("Please fill in all fields");
    }
    if (registerPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (!emailRegex.test(registerEmail)) {
      return toast.error("Please enter a valid email address");
    }

    if (registerPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    try {
      await registerUser({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });

      toast.success("Registration successful! Please sign in.");
      setAuthView("login");
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Register Error:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Failed to register");
      } else {
        toast.error("Failed to register");
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return toast.error("Please enter your email");

    if (!emailRegex.test(forgotEmail)) {
      return toast.error("Please enter a valid email address");
    }

    try {
      await forgotPassword(forgotEmail);
      toast.success("OTP sent to your email!");
      setAuthView("verify-otp");
    } catch (error) {
      console.error("Forgot Password Error:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Failed to send OTP");
      } else {
        toast.error("Failed to send OTP");
      }
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtp) return toast.error("Please enter the OTP");
    if (resetOtp.length !== 6) return toast.error("OTP must be 6 digits");
    setAuthView("reset-password");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmNewPassword) {
      return toast.error("Please fill in all fields");
    }
    if (newPassword !== confirmNewPassword) {
      return toast.error("Passwords do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    try {
      await resetPassword({
        email: forgotEmail,
        otp: resetOtp,
        newPassword,
      });
      toast.success("Password reset successful! Please login.");
      setAuthView("login");
      setResetOtp("");
      setNewPassword("");
      setConfirmNewPassword("");
      setForgotEmail(""); // Clear email after success
    } catch (error) {
      console.error("Reset Password Error:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Failed to reset password");
      } else {
        toast.error("Failed to reset password");
      }
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const { credential } = credentialResponse;
      if (!credential) return;

      const data = await googleAuth(credential);

      const { name, picture, email, favorites, _id, googleId } = data;
      dispatch(login({ name, image: picture, email, _id, googleId }));
      if (favorites && Array.isArray(favorites)) {
        dispatch(setFavoriteCities(favorites));
      }
      toast.success("Successfully signed in with Google!");
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Failed to sign in with Google");
    }
  };

  return (
    <div className="flex flex-col p-8 md:pl-10 w-full justify-center">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 self-start">
        <User className="w-5 h-5 text-primary" />
        <h2 className="text-xl max-sm:text-lg font-semibold font-space-grotesk">
          Account
        </h2>
      </div>

      <div className="flex flex-col items-center w-full">
        <p className="self-start text-lg pb-4 font-medium">
          {authView === "register"
            ? "Create an Account"
            : authView === "forgot-email"
            ? "Reset Password"
            : authView === "verify-otp"
            ? "Verify OTP"
            : authView === "reset-password"
            ? "New Password"
            : "Nice to see you again"}
        </p>

        {/* Login Form */}
        {authView === "login" && (
          <form onSubmit={handleLogin} className="space-y-4 w-full">
            <div className="space-y-2">
              <label
                htmlFor="login-email"
                className="text-sm font-medium leading-none"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex h-10 w-full border border-input bg-background/50 px-3 py-2 text-base 
                  placeholder:text-muted-foreground 
                  focus-visible:outline-2 outline-primary
                  md:text-sm rounded-xl transition-all"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="login-password"
                className="text-sm font-medium leading-none"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                className="flex h-10 w-full border border-input bg-background/50 px-3 py-2 text-base
                  placeholder:text-muted-foreground focus-visible:outline-2 outline-primary
                  md:text-sm rounded-xl transition-all"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setAuthView("forgot-email")}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot Password?
              </button>>
            </div>
            <button
              type="submit"
              className="
                  inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium
                  ring-offset-background transition-colors h-10 px-4 py-2
                  w-full rounded-xl
                  bg-primary text-white hover:bg-primary/90 shadow-md
                "
            >
              Sign In
            </button>
          </form>
        )}

        {/* Register Form */}
        {authView === "register" && (
          <form
            onSubmit={handleRegister}
            className="space-y-4 w-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2"
          >
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label
                htmlFor="reg-name"
                className="text-sm font-medium leading-none"
              >
                Name
              </label>
              <input
                id="reg-name"
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="Enter your name"
                className="flex h-10 w-full border border-input bg-background/50 px-3 py-2 text-base 
                  placeholder:text-muted-foreground 
                  focus-visible:outline-2 outline-primary
                  md:text-sm rounded-xl transition-all"
              />
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label
                htmlFor="reg-email"
                className="text-sm font-medium leading-none"
              >
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex h-10 w-full border border-input bg-background/50 px-3 py-2 text-base 
                  placeholder:text-muted-foreground 
                  focus-visible:outline-2 outline-primary
                  md:text-sm rounded-xl transition-all"
              />
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label
                htmlFor="reg-password"
                className="text-sm font-medium leading-none"
              >
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Password"
                className="flex h-10 w-full border border-input bg-background/50 px-3 py-2 text-base
                  placeholder:text-muted-foreground focus-visible:outline-2 outline-primary
                  md:text-sm rounded-xl transition-all"
              />
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label
                htmlFor="reg-confirm"
                className="text-sm font-medium leading-none"
              >
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm"
                className="flex h-10 w-full border border-input bg-background/50 px-3 py-2 text-base
                  placeholder:text-muted-foreground focus-visible:outline-2 outline-primary
                  md:text-sm rounded-xl transition-all"
              />
            </div>
            <div className="col-span-2 pt-2">
              <button
                type="submit"
                className="whitespace-nowrap text-sm font-medium
                ring-offset-background transition-colors h-10 px-4 py-2
                rounded-xl w-full
                bg-primary text-white hover:bg-primary/90 shadow-md
                "
              >
                Register
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password - Step 1: Email */}
        {authView === "forgot-email" && (
          <form onSubmit={handleForgotPassword} className="space-y-4 w-full">
            <div className="space-y-2">
              <label
                htmlFor="forgot-email"
                className="text-sm font-medium leading-none"
              >
                Enter your email address
              </label>
              <input
                id="forgot-email"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex h-10 w-full border border-input bg-background/50 px-3 py-2 text-base 
                  placeholder:text-muted-foreground 
                  focus-visible:outline-2 outline-primary
                  md:text-sm rounded-xl transition-all"
              />
            </div>
            {/* Same height spacer as password field to maintain layout */}
            <div className="h-[60px] w-full hidden"></div>
            
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setAuthView("login")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Back to Login
              </button>
              <button
                type="submit"
                className="whitespace-nowrap text-sm font-medium
                ring-offset-background transition-colors h-10 px-4 py-2
                rounded-xl bg-primary text-white hover:bg-primary/90 shadow-md"
              >
                Get OTP
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password - Step 2: Verify OTP */}
        {authView === "verify-otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 w-full">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium leading-none">
                Enter OTP sent to {forgotEmail}
              </label>
              <input
                id="otp"
                type="text"
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value)}
                placeholder="6-digit code"
                className="flex h-10 w-full border border-input bg-background/50 px-3 py-2 text-base 
                  placeholder:text-muted-foreground 
                  focus-visible:outline-2 outline-primary
                  md:text-sm rounded-xl transition-all"
              />
            </div>
             {/* Same height spacer */}
             <div className="h-[60px] w-full hidden"></div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setAuthView("forgot-email")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Back
              </button>
              <button
                type="submit"
                className="whitespace-nowrap text-sm font-medium
                ring-offset-background transition-colors h-10 px-4 py-2
                rounded-xl bg-primary text-white hover:bg-primary/90 shadow-md"
              >
                Verify
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password - Step 3: New Password */}
        {authView === "reset-password" && (
          <form onSubmit={handleResetPassword} className="space-y-4 w-full">
            <div className="space-y-2">
              <label
                htmlFor="new-pass"
                className="text-sm font-medium leading-none"
              >
                New Password
              </label>
              <input
                id="new-pass"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="flex h-10 w-full border border-input bg-background/50 px-3 py-2 text-base 
                  placeholder:text-muted-foreground 
                  focus-visible:outline-2 outline-primary
                  md:text-sm rounded-xl transition-all"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirm-new-pass"
                className="text-sm font-medium leading-none"
              >
                Confirm New Password
              </label>
              <input
                id="confirm-new-pass"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm password"
                className="flex h-10 w-full border border-input bg-background/50 px-3 py-2 text-base 
                  placeholder:text-muted-foreground 
                  focus-visible:outline-2 outline-primary
                  md:text-sm rounded-xl transition-all"
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setAuthView("verify-otp")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Back
              </button>
              <button
                type="submit"
                className="whitespace-nowrap text-sm font-medium
                ring-offset-background transition-colors h-10 px-4 py-2
                rounded-xl bg-primary text-white hover:bg-primary/90 shadow-md"
              >
                Change Password
              </button>
            </div>
          </form>
        )}

        {(authView === "login" || authView === "register") && (
          <div className="pt-6 flex items-center gap-2 w-full justify-center">
            <div className="h-px flex-1 bg-border"></div>
            <div className="text-xs text-muted-foreground uppercase">or</div>
            <div className="h-px flex-1 bg-border"></div>
          </div>
        )}

        {(authView === "login" || authView === "register") && (
          <div className="flex flex-col items-center mt-6 justify-center space-y-4 w-full">
            <p className="text-muted-foreground max-sm:hidden text-center text-sm">
              Quickly access your favorites
            </p>
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  toast.error("Google Login Failed");
                }}
                theme="filled_black"
                shape="pill"
              />
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {authView === "register"
              ? "Already have an account?"
              : authView === "login"
              ? "Don't have an account?"
              : ""}
            {(authView === "login" || authView === "register") && (
              <button
                onClick={() =>
                  setAuthView(authView === "login" ? "register" : "login")
                }
                className="ml-2 text-primary hover:underline font-medium focus:outline-none"
              >
                {authView === "login" ? "Sign Up now" : "Sign In"}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
