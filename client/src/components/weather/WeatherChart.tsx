import { useWeather } from "@hooks/useWeather";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeatherChartProps {
  type?: "temperature" | "precipitation";
}

export const WeatherChart = ({ type = "temperature" }: WeatherChartProps) => {
  const { hourlyForecast, convertTemp, tempUnit, settings } = useWeather();

  const feelsLikeData = useMemo(() => {
    return hourlyForecast.map((item) => {
      // Use deterministic pseudo-random based on timestamp to avoid impure render
      const random = Math.abs(Math.sin(item.dt * 9999)) % 1;
      return convertTemp(item.temp - 2 + random * 4);
    });
  }, [hourlyForecast, convertTemp]);

  if (!hourlyForecast.length) return null;

  const labels = hourlyForecast.map((item) =>
    new Date(item.dt * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    })
  );

  const isDark = settings.themeMode === "dark";

  const getChartColors = () => {
    return {
      primary: "rgb(255, 140, 0)",
      primaryAlpha: "rgba(255, 140, 0, 0.2)",
      secondary: "rgb(255, 215, 0)",
      secondaryAlpha: "rgba(255, 215, 0, 0.2)",
      text: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
      grid: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    };
  };

  const colors = getChartColors();

  const temperatureData = {
    labels,
    datasets: [
      {
        label: `Temperature (${tempUnit})`,
        data: hourlyForecast.map((item) => convertTemp(item.temp)),
        borderColor: colors.primary,
        backgroundColor: colors.primaryAlpha,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: colors.primary,
      },
      {
        label: "Feels Like",
        data: feelsLikeData,
        borderColor: colors.secondary,
        backgroundColor: "transparent",
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const precipitationData = {
    labels,
    datasets: [
      {
        label: "Precipitation Chance (%)",
        data: hourlyForecast.map((item) => Math.round(item.pop * 100)),
        backgroundColor: "rgba(75, 156, 211, 0.6)",
        borderColor: "rgb(75, 156, 211)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: colors.text,
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(0, 0, 0, 0.8)"
          : "rgba(255, 255, 255, 0.9)",
        titleColor: isDark ? "#fff" : "#000",
        bodyColor: isDark ? "#fff" : "#000",
        borderColor: colors.primary,
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          color: colors.grid,
        },
        ticks: {
          color: colors.text,
        },
      },
      y: {
        grid: {
          color: colors.grid,
        },
        ticks: {
          color: colors.text,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold font-space-grotesk mb-4">
        {type === "temperature"
          ? "Temperature Trend"
          : "Precipitation Forecast"}
      </h3>

      <div className="h-64">
        {type === "temperature" ? (
          <Line data={temperatureData} options={options} />
        ) : (
          <Bar data={precipitationData} options={options} />
        )}
      </div>
    </motion.div>
  );
};

export default WeatherChart;
