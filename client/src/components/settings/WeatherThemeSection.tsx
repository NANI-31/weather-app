import { useDispatch, useSelector } from "react-redux";
import { Sun, CloudRain, Cloud, CloudSnow, Moon, Sunrise } from "lucide-react";
import { type RootState } from "@app/store";
import { setWeatherTheme } from "@features/settings/settingsSlice";
import { cn } from "@lib/utils";
import { type WeatherTheme } from "@features/settings/types";
import { type LucideIcon } from "lucide-react";

const weatherThemes: {
  id: WeatherTheme;
  name: string;
  icon: LucideIcon;
  gradient: string;
}[] = [
  {
    id: "auto",
    name: "Auto",
    icon: Cloud,
    gradient: "from-black to-black",
  },
  {
    id: "sunny",
    name: "Sunny",
    icon: Sun,
    gradient: "from-yellow-400 to-yellow-500",
  },
  {
    id: "rainy",
    name: "Rainy",
    icon: CloudRain,
    gradient: "from-blue-400 to-blue-600",
  },
  {
    id: "cloudy",
    name: "Cloudy",
    icon: Cloud,
    gradient: "from-gray-700 to-gray-600",
  },
  {
    id: "snowy",
    name: "Snowy",
    icon: CloudSnow,
    gradient: "from-slate-200 to-slate-400",
  },
  {
    id: "night",
    name: "Night",
    icon: Moon,
    gradient: "from-indigo-600 to-purple-800",
  },
];

const WeatherThemeSection = () => {
  const dispatch = useDispatch();
  const { weatherTheme } = useSelector((state: RootState) => state.settings);

  return (
    <div className="glass-card p-6 max-sm:p-5">
      <div className="flex items-center gap-3 mb-4">
        <Sunrise className="w-5 h-5 text-primary" />
        <div>
          <h2 className="text-xl max-sm:text-lg font-semibold font-space-grotesk">
            Weather Theme
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose weather effects and atmosphere
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 gap-3">
        {weatherThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => dispatch(setWeatherTheme(theme.id))}
            className={cn(
              "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
              weatherTheme === theme.id
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/10 hover:border-muted-foreground/50"
            )}
          >
            <div
              className={cn(
                "shrink-0 w-8 h-8 rounded-full bg-linear-to-br flex items-center justify-center",
                theme.gradient
              )}
            >
              <theme.icon className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-sm">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeatherThemeSection;
