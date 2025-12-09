import { useEffect } from "react";
import { useWeather } from "@hooks/useWeather";
import CurrentWeather from "@components/weather/CurrentWeather";
import HourlyForecast from "@components/weather/HourlyForecast";
import DailyForecast from "@components/weather/DailyForecast";
import AirQuality from "@components/weather/AirQuality";
import UVIndex from "@components/weather/UVIndex";
import SearchBar from "@components/weather/SearchBar";
import FavoriteCities from "@components/weather/FavoriteCities";
import WeatherChart from "@components/weather/WeatherChart";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Index = () => {
  const { error } = useWeather();
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-space-grotesk text-gradient bg-clip-text text-transparent">
            Weather Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time weather updates at your fingertips
          </p>
        </div>
        <SearchBar />
      </motion.div>

      {/* Favorite Cities */}
      <FavoriteCities />

      {/* Current Weather */}
      <CurrentWeather />

      {/* Hourly Forecast */}
      <HourlyForecast />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherChart type="temperature" />
        <WeatherChart type="precipitation" />
      </div>

      {/* Daily Forecast and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DailyForecast />
        </div>
        <div className="space-y-6">
          <AirQuality />
          <UVIndex />
        </div>
      </div>
    </div>
  );
};

export default Index;
