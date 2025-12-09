import { useSelector } from "react-redux";
import { type RootState } from "@app/store";
import LoadingScene from "../3d/LoadingScene";
import AuthForms from "./account/AuthForms";
import ProfileView from "./account/ProfileView";

export default function AccountSettings() {
  const { isLoggedIn } = useSelector((state: RootState) => state.settings);

  if (isLoggedIn) {
    return <ProfileView />;
  }

  return (
    <div className="glass-card flex min-h-[500px]">
      {/* Left Side (Loading Scene) */}
      <div className="flex-2 border-r border-white/10 max-sm:hidden relative">
        <div className="h-full w-full overflow-hidden rounded-l-2xl relative">
          <LoadingScene isEmbedded={true} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <p className="text-white/80 font-medium text-lg bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl">
              Unlock Premium Features
            </p>
          </div>
        </div>
      </div>

      {/* Right Side (Auth Forms) */}
      <div className="flex-3">
        <AuthForms />
      </div>
    </div>
  );
}
