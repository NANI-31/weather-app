import { useDispatch, useSelector } from "react-redux";
import { Palette, Check } from "lucide-react";
import { type RootState } from "@app/store";
import { setColorTheme } from "@features/settings/settingsSlice";
import { cn } from "@lib/utils";
import { type ColorTheme } from "@features/settings/types";

const colorThemes: { id: ColorTheme; name: string; colors: string[] }[] = [
  { id: "sunset", name: "Sunset", colors: ["#FF8C00", "#FFD700", "#FF6B35"] },
  { id: "crimson", name: "Crimson", colors: ["#DC143C", "#FF6347", "#CD5C5C"] },
  { id: "ocean", name: "Ocean", colors: ["#00CED1", "#20B2AA", "#4682B4"] },
  { id: "forest", name: "Forest", colors: ["#228B22", "#32CD32", "#2E8B57"] },
  { id: "aurora", name: "Aurora", colors: ["#9370DB", "#BA55D3", "#8A2BE2"] },
];

const ColorThemeSection = () => {
  const dispatch = useDispatch();
  const { colorTheme } = useSelector((state: RootState) => state.settings);

  return (
    <div className="glass-card p-6 max-sm:p-5">
      <div className="flex items-center gap-3 mb-4">
        <Palette className="w-5 h-5 text-primary" />
        <h2 className="text-xl max-sm:text-lg font-semibold font-space-grotesk">
          Color Theme
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-sm:gap-1">
        {colorThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => dispatch(setColorTheme(theme.id))}
            className={cn(
              "relative p-4 rounded-2xl border-2 transition-all duration-300",
              colorTheme === theme.id
                ? "border-primary shadow-lg scale-105"
                : "border-transparent hover:border-muted-foreground/50"
            )}
          >
            <div className="flex items-center flex-col">
              <div className="flex gap-1 mb-2">
                {theme.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-sm text-left font-medium">{theme.name}</p>
            </div>

            {colorTheme === theme.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorThemeSection;
