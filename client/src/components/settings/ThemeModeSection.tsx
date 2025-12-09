import { useDispatch, useSelector } from "react-redux";

import { Sun, Moon } from "lucide-react";
import { type RootState } from "@app/store";
import { setThemeMode } from "@features/settings/settingsSlice";

const ThemeModeSection = () => {
  const dispatch = useDispatch();
  const { themeMode, weatherTheme } = useSelector(
    (state: RootState) => state.settings
  );
  const currentWeatherTheme = useSelector(
    (state: RootState) => state.weather.weatherTheme
  );
  const activeWeatherTheme =
    weatherTheme === "auto" ? currentWeatherTheme : weatherTheme;
  const isNightTheme = activeWeatherTheme === "night";

  return (
    <div className="glass-card p-6 max-sm:p-4">
      <div className="flex items-center justify-between max-sm:items-start max-sm:gap-4">
        <div className="flex items-center gap-3 max-sm:gap-2">
          {themeMode === "dark" ? (
            <Moon className="w-5 h-5 text-primary" />
          ) : (
            <Sun className="w-5 h-5 text-primary" />
          )}
          <div>
            <h2 className="text-xl font-semibold font-space-grotesk max-sm:text-lg">
              Dark Mode
            </h2>
            <p className="text-sm text-muted-foreground">
              {isNightTheme
                ? "Dark mode enforced by Night theme"
                : "Toggle between light and dark theme"}
            </p>
          </div>
        </div>

        <button
          disabled={isNightTheme}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer max-sm:w-10 max-sm:h-5 ${
            themeMode === "dark" ? "bg-primary" : "bg-gray-300/50"
          } ${isNightTheme ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() =>
            dispatch(setThemeMode(themeMode === "dark" ? "light" : "dark"))
          }
        >
          <span
            className={`block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform max-sm:h-4 max-sm:w-4 ${
              themeMode === "dark"
                ? "translate-x-5 bg-background"
                : "translate-x-1 bg-gray-500"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default ThemeModeSection;
