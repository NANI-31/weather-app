import { useWeather } from "@hooks/useWeather";
import WeatherIcon from "./WeatherIcon";

import {
  Heart,
  MapPin,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
} from "lucide-react";
import { cn } from "@lib/utils";
import { motion } from "framer-motion";

export const CurrentWeather = () => {
  const {
    currentWeather,
    convertTemp,
    convertSpeed,
    tempUnit,
    speedUnit,
    toggleFavorite,
    favoriteCities,
  } = useWeather();

  if (!currentWeather) return null;

  const isFavorite = favoriteCities.includes(currentWeather.city);

  const formatTime = (timestamp: number, timezone: number) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* Main Weather Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold font-space-grotesk">
              {currentWeather.city}, {currentWeather.country}
            </h2>
            <button
              onClick={() => toggleFavorite(currentWeather.city)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-all",
                  isFavorite
                    ? "fill-accent text-accent"
                    : "text-muted-foreground"
                )}
              />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <WeatherIcon code={currentWeather.icon} size="xl" />
            <div>
              <p className="text-6xl md:text-7xl font-bold text-gradient bg-clip-text text-transparent font-space-grotesk">
                {convertTemp(currentWeather.temp)}
                {tempUnit}
              </p>
              <p className="text-lg text-muted-foreground capitalize mt-1">
                {currentWeather.description}
              </p>
              <p className="text-sm text-muted-foreground">
                Feels like {convertTemp(currentWeather.feels_like)}
                {tempUnit}
              </p>
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 max-xxs:grid-cols-1 gap-3 md:w-80">
          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-muted">
            <Droplets className="w-5 h-5 text-blue-500 flex-[30%]" />
            <div className="flex-[70%]">
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="font-semibold">{currentWeather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-muted">
            <Wind className="w-5 h-5 text-blue-500 flex-[30%]" />
            <div className="flex-[70%]">
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="font-semibold">
                {convertSpeed(currentWeather.wind_speed)} {speedUnit}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-muted">
            <Eye className="w-5 h-5 text-blue-500 flex-[30%]" />
            <div className="flex-[70%]">
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="font-semibold">
                {(currentWeather.visibility / 1000).toFixed(1)} km
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-muted">
            <Gauge className="w-5 h-5 text-blue-500 flex-[30%]" />
            <div className="flex-[70%]">
              <p className="text-xs text-muted-foreground">Pressure</p>
              <p className="font-semibold">{currentWeather.pressure} hPa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sunrise/Sunset */}
      <div className="mt-6 pt-6 border-t border-primary/20 flex items-center max-xxs:flex-col justify-center max-xs:gap-4 gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
            <span className="text-lg">
              <Sunrise className="w-6 h-6 text-orange-500" />
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Sunrise</p>
            <p className="font-medium">
              {formatTime(currentWeather.sunrise, currentWeather.timezone)}
            </p>
          </div>
        </div>
        <div className="w-px h-8 max-xxs:h-px max-xxs:w-8 bg-primary" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-lg">
              <Sunset className="w-6 h-6 text-orange-600" />
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Sunset</p>
            <p className="font-medium">
              {formatTime(currentWeather.sunset, currentWeather.timezone)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentWeather;
