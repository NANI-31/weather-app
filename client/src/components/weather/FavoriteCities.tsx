import { useState, useEffect } from "react";
import { useWeather } from "@hooks/useWeather";
import { Heart, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentWeather } from "@api/weatherAPI";
import WeatherIcon from "./WeatherIcon";
import type { WeatherData } from "@api/types";

const FavoriteCityCard = ({
  city,
  onRemove,
  onSelect,
}: {
  city: string;
  onRemove: () => void;
  onSelect: (lat: number, lon: number) => void;
}) => {
  const { convertTemp, tempUnit } = useWeather();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getCurrentWeather(city)
      .then((data) => {
        if (mounted) {
          setWeather(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [city]);

  if (loading) {
    return (
      <div className="glass-card p-4 min-w-[200px] h-[88px] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-card/80 rounded-2xl shadow-md p-5 relative group cursor-pointer hover:bg-white/70 dark:hover:bg-white/5 transition-all min-w-[280px]"
      onClick={() => onSelect(weather.lat, weather.lon)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/20 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-3">
        <WeatherIcon code={weather.icon} size="md" />
        <div>
          <span className="font-semibold block text-md leading-none">
            {weather.city}
          </span>
          <span className="font-semibold text-gray-400 text-xs leading-none">
            {weather.country}
          </span>
        </div>
        <div>
          <span className="text-xl font-bold block font-space-grotesk leading-none">
            {convertTemp(weather.temp)}
            {tempUnit}
          </span>
          <span className="text-xs text-gray-400 capitalize">
            {weather.description}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export const FavoriteCities = () => {
  const { favoriteCities, toggleFavorite, fetchWeather } = useWeather();

  if (!favoriteCities.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <Heart className="w-5 h-5 text-accent" />
        <h3 className="font-semibold font-space-grotesk">Favorite Cities</h3>
      </div>

      <div className="w-full whitespace-nowrap overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-4">
          <AnimatePresence mode="popLayout">
            {favoriteCities.map((city) => (
              <FavoriteCityCard
                key={city}
                city={city}
                onRemove={() => toggleFavorite(city)}
                onSelect={fetchWeather}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default FavoriteCities;
