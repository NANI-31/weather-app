import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Moon,
  CloudSun,
  CloudMoon,
  Droplets,
} from "lucide-react";
import { cn } from "@lib/utils";

interface WeatherIconProps {
  code: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

export const WeatherIcon = ({
  code,
  size = "md",
  className,
  animated = true,
}: WeatherIconProps) => {
  const iconClass = cn(
    sizeClasses[size],
    "weather-icon-glow",
    animated && "transition-transform duration-300 hover:scale-110",
    className
  );

  const getIcon = () => {
    switch (code) {
      case "01d":
        return (
          <Sun
            className={cn(iconClass, "text-weather-sunny animate-spin-slow")}
          />
        );
      case "01n":
        return (
          <Moon
            className={cn(iconClass, "dark:text-white text-weather-night")}
          />
        );
      case "02d":
        return <CloudSun className={cn(iconClass, "text-secondary")} />;
      case "02n":
        return <CloudMoon className={cn(iconClass, "text-muted-foreground")} />;
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        return <Cloud className={cn(iconClass, "text-muted-foreground")} />;
      case "09d":
      case "09n":
        return <Droplets className={cn(iconClass, "text-weather-rainy")} />;
      case "10d":
      case "10n":
        return <CloudRain className={cn(iconClass, "text-weather-rainy")} />;
      case "11d":
      case "11n":
        return <CloudLightning className={cn(iconClass, "text-secondary")} />;
      case "13d":
      case "13n":
        return <CloudSnow className={cn(iconClass, "text-weather-snowy")} />;
      case "50d":
      case "50n":
        return <CloudFog className={cn(iconClass, "text-muted-foreground")} />;
      default:
        return <Sun className={cn(iconClass, "text-secondary")} />;
    }
  };

  return getIcon();
};

export default WeatherIcon;
