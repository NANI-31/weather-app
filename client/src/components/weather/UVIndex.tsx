import { useWeather } from "@hooks/useWeather";
import { motion } from "framer-motion";
import { cn } from "@lib/utils";
import { Sun } from "lucide-react";

export const UVIndex = () => {
  const { uvIndex } = useWeather();

  if (uvIndex === null) return null;

  const getUVInfo = (uv: number) => {
    if (uv <= 2) {
      return {
        label: "Low",
        color: "bg-green-500",
        gradient: "from-green-400 to-green-600",
        message: "No protection needed. Safe to be outside!",
      };
    }
    if (uv <= 5) {
      return {
        label: "Moderate",
        color: "bg-yellow-500",
        gradient: "from-yellow-400 to-yellow-600",
        message: "Some protection required. Wear sunscreen.",
      };
    }
    if (uv <= 7) {
      return {
        label: "High",
        color: "bg-orange-500",
        gradient: "from-orange-400 to-orange-600",
        message: "Protection essential. Reduce time in the sun.",
      };
    }
    if (uv <= 10) {
      return {
        label: "Very High",
        color: "bg-red-500",
        gradient: "from-red-400 to-red-600",
        message: "Extra protection needed. Avoid midday sun.",
      };
    }
    return {
      label: "Extreme",
      color: "bg-purple-500",
      gradient: "from-purple-400 to-purple-600",
      message: "Maximum protection! Stay indoors if possible.",
    };
  };

  const uvInfo = getUVInfo(uvIndex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold font-space-grotesk mb-4">
        UV Index
      </h3>

      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center bg-linear-to-br",
            uvInfo.gradient
          )}
        >
          <Sun className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{uvIndex}</span>
            <span className="text-lg text-muted-foreground">of 11+</span>
          </div>
          <p className="text-sm font-medium">{uvInfo.label}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-3 rounded-full bg-linear-to-r from-green-400 via-yellow-400 via-orange-400 via-red-400 to-purple-400 relative">
          <div
            className="absolute w-4 h-4 bg-background border-2 border-foreground rounded-full -top-0.5 transition-all"
            style={{ left: `calc(${Math.min(uvIndex / 11, 1) * 100}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
          <span>Extreme</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-4">{uvInfo.message}</p>
    </motion.div>
  );
};

export default UVIndex;
