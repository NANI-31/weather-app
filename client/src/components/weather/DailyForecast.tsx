import { useWeather } from "@hooks/useWeather";
import WeatherIcon from "./WeatherIcon";
import { motion } from "framer-motion";

export const DailyForecast = () => {
  const { dailyForecast, convertTemp } = useWeather();

  if (!dailyForecast.length) return null;

  const formatDay = (timestamp: number, index: number) => {
    if (index === 0) return "Today";
    if (index === 1) return "Tomorrow";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold font-space-grotesk mb-4">
        7-Day Forecast
      </h3>

      <div className="space-y-3">
        {dailyForecast.map((day, index) => (
          <motion.div
            key={day.dt}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex max-sm:flex-col max-sm:justify-start items-center justify-evenly shadow-xs max-xs:gap-4 p-4 rounded-xl bg-muted hover:shadow-sm hover:scale-101 transition-colors"
          >
            <div className="flex w-full xs:pl-6 max-xxs:flex-col gap-4">
              <div className="flex max-xxs:flex-row max-xxs:items-center flex-col max-xxs:gap-2 w-32">
                <p className="font-medium">{formatDay(day.dt, index)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(day.dt)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <WeatherIcon code={day.icon} size="sm" />
                <p className="text-sm text-muted-foreground capitalize w-20">
                  {day.main}
                </p>
              </div>
            </div>

            <div className="flex max-xxs:grid grid-cols-3 max-md:gap-2 max-sm:grid-rows-2 w-full items-center">
              {/* {day.pop > 0 && (
                <span className="text-xs max-xxs:hidden text-weather-rainy mr-2">
                  {Math.round(day.pop * 100)}%
                </span>
              )} */}
              <span className="text-muted-foreground w-12 text-right max-xs:text-left">
                {convertTemp(day.temp_min)}°
              </span>
              <div className="w-28 max-sm:w-auto max-sm:flex-1 h-2 row-start-2 col-span-3 bg-primary/10 rounded-full overflow-hidden">
                <div
                  className="h-full weather-gradient rounded-full"
                  style={{
                    width: `${
                      ((day.temp - day.temp_min) /
                        (day.temp_max - day.temp_min)) *
                      100
                    }%`,
                    marginLeft: `${
                      ((day.temp_min - dailyForecast[0].temp_min) /
                        (dailyForecast[0].temp_max -
                          dailyForecast[0].temp_min)) *
                      50
                    }%`,
                  }}
                />
              </div>
              <span className="max-xs:justify-self-end font-medium w-12 max-xs:text-right col-start-3">
                {convertTemp(day.temp_max)}°
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DailyForecast;
