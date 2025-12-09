import { useWeather } from "@hooks/useWeather";
// import WeatherIcon from "./WeatherIcon";
import { motion } from "framer-motion";

export const HourlyForecast = () => {
  const { hourlyForecast, convertTemp, tempUnit } = useWeather();

  if (!hourlyForecast.length) return null;

  const formatHour = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
  };
  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold font-space-grotesk mb-4">
        Hourly Forecast
      </h3>

      <div className="w-full whitespace-nowrap overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-4">
          {hourlyForecast.map((hour, index) => (
            <motion.div
              key={hour.dt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex flex-col items-center min-w-[100px] px-4 py-2 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <p className="text-sm text-muted-foreground my-1">
                {index === 0 ? "Now" : formatHour(hour.dt)}
              </p>
              <img
                src={getWeatherIcon(hour.icon)}
                alt={hour.description}
                className="w-12 h-12 mx-auto"
              />
              <p className="text-lg font-semibold mt-2">
                {convertTemp(hour.temp)}
                {tempUnit}
              </p>
              {hour.pop > 0 && (
                <p className="text-xs text-weather-rainy mt-1">
                  {Math.round(hour.pop * 100)}%
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HourlyForecast;
