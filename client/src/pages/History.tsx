import { useState } from "react";
import { useWeather } from "@hooks/useWeather";

import HistoryHeader from "@components/history/HistoryHeader";
import StatCards from "@components/history/StatCards";
import TemperatureChart from "@components/history/TemperatureChart";
import HumidityChart from "@components/history/HumidityChart";
import PrecipitationChart from "@components/history/PrecipitationChart";
import { useHistoricalData, type TimeRange } from "@hooks/useHistoricalData";

const History = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const { convertTemp, tempUnit, settings } = useWeather();

  const isDark = settings.themeMode === "dark";
  const { historicalData, averages } = useHistoricalData(timeRange);

  const chartColors = {
    primary: "rgb(255, 140, 0)",
    primaryAlpha: "rgba(255, 140, 0, 0.2)",
    blue: "rgb(75, 156, 211)",
    blueAlpha: "rgba(75, 156, 211, 0.3)",
    text: isDark ? "white" : "black",
    grid: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
  };

  const temperatureChartData = {
    labels: historicalData.map((d) => d.date),
    datasets: [
      {
        label: "Average",
        data: historicalData.map((d) => convertTemp(d.temp)),
        borderColor: chartColors.primary,
        backgroundColor: chartColors.primaryAlpha,
        fill: true,
        tension: 0.4,
      },
      {
        label: "High",
        data: historicalData.map((d) => convertTemp(d.tempMax)),
        borderColor: "rgba(255, 100, 100, 0.8)",
        backgroundColor: "transparent",
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 2,
      },
      {
        label: "Low",
        data: historicalData.map((d) => convertTemp(d.tempMin)),
        borderColor: "rgba(100, 150, 255, 0.8)",
        backgroundColor: "transparent",
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const humidityChartData = {
    labels: historicalData.map((d) => d.date),
    datasets: [
      {
        label: "Humidity (%)",
        data: historicalData.map((d) => d.humidity),
        borderColor: chartColors.blue,
        backgroundColor: chartColors.blueAlpha,
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const precipitationChartData = {
    labels: historicalData.map((d) => d.date),
    datasets: [
      {
        label: "Precipitation (%)",
        data: historicalData.map((d) => d.precipitation),
        borderColor: chartColors.blue,
        backgroundColor: chartColors.blueAlpha,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: chartColors.text,
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(0, 0, 0, 0.8)"
          : "rgba(255, 255, 255, 0.9)",
        titleColor: isDark ? "#fff" : "#000",
        bodyColor: isDark ? "#fff" : "#000",
        borderColor: chartColors.primary,
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { color: chartColors.grid },
        ticks: { color: chartColors.text },
      },
      y: {
        grid: { color: chartColors.grid },
        ticks: { color: chartColors.text },
      },
    },
  };

  return (
    <div className="space-y-6">
      <HistoryHeader timeRange={timeRange} setTimeRange={setTimeRange} />
      <StatCards averages={averages} />

      <TemperatureChart
        data={temperatureChartData}
        options={chartOptions}
        tempUnit={tempUnit}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HumidityChart data={humidityChartData} options={chartOptions} />
        <PrecipitationChart
          data={precipitationChartData}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default History;
