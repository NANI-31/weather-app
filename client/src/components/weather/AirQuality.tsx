import { useWeather } from "@hooks/useWeather";
import { motion } from "framer-motion";
import { cn } from "@lib/utils";

export const AirQuality = () => {
  const { airQuality } = useWeather();

  if (!airQuality) return null;

  const getAQIInfo = (aqi: number) => {
    switch (aqi) {
      case 1:
        return {
          label: "Good",
          color: "bg-green-500",
          textColor: "text-green-500",
          message: "Air quality is satisfactory. Enjoy outdoor activities!",
        };
      case 2:
        return {
          label: "Fair",
          color: "bg-yellow-500",
          textColor: "text-yellow-500",
          message:
            "Air quality is acceptable. Sensitive groups should limit prolonged outdoor exertion.",
        };
      case 3:
        return {
          label: "Moderate",
          color: "bg-orange-500",
          textColor: "text-orange-500",
          message:
            "Sensitive groups may experience health effects. General public less affected.",
        };
      case 4:
        return {
          label: "Poor",
          color: "bg-red-500",
          textColor: "text-red-500",
          message:
            "Everyone may experience health effects. Limit outdoor activities.",
        };
      case 5:
        return {
          label: "Very Poor",
          color: "bg-purple-500",
          textColor: "text-purple-500",
          message: "Health alert! Avoid outdoor activities.",
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-500",
          textColor: "text-gray-500",
          message: "Unable to determine air quality.",
        };
    }
  };

  const aqiInfo = getAQIInfo(airQuality.aqi);

  const pollutants = [
    { name: "PM2.5", value: airQuality.pm2_5, unit: "μg/m³", max: 75 },
    { name: "PM10", value: airQuality.pm10, unit: "μg/m³", max: 150 },
    { name: "O₃", value: airQuality.o3, unit: "μg/m³", max: 180 },
    { name: "NO₂", value: airQuality.no2, unit: "μg/m³", max: 200 },
    { name: "SO₂", value: airQuality.so2, unit: "μg/m³", max: 350 },
    { name: "CO", value: airQuality.co / 1000, unit: "mg/m³", max: 10 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold font-space-grotesk mb-4">
        Air Quality Index
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <div
          className={cn(
            "flex items-center justify-center rounded-2xl bg-linear-to-br",
            "h-12 w-12 sm:h-16 sm:min-w-16",
            aqiInfo.color
          )}
        >
          <span className="text-lg sm:text-2xl font-bold text-white">
            {airQuality.aqi}
          </span>
        </div>
        <div className="text-center sm:text-left">
          <p
            className={cn(
              "text-lg sm:text-xl font-semibold",
              aqiInfo.textColor
            )}
          >
            {aqiInfo.label}
          </p>
          <p className="text-sm max-xs:text-left text-muted-foreground">
            {aqiInfo.message}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        {pollutants.map((pollutant) => (
          <div key={pollutant.name} className="stat-card">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                {pollutant.name}
              </p>
              <p className="text-lg font-semibold">
                {pollutant.value.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">{pollutant.unit}</p>
            </div>
            <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  pollutant.value / pollutant.max > 0.7
                    ? "bg-destructive"
                    : pollutant.value / pollutant.max > 0.4
                    ? "bg-secondary"
                    : "bg-green-500"
                )}
                style={{
                  width: `${Math.min(
                    (pollutant.value / pollutant.max) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AirQuality;
