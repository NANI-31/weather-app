import { useState, useEffect, useMemo } from "react";
import { useWeather } from "./useWeather";

export type TimeRange = "week" | "month";

export interface HistoricalData {
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  wind: number;
  precipitation: number;
}

export const useHistoricalData = (timeRange: TimeRange) => {
  const { currentWeather } = useWeather();
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  useEffect(() => {
    const days = timeRange === "week" ? 7 : 30;
    const baseTemp = currentWeather?.temp || 20;
    const baseHumidity = currentWeather?.humidity || 50;
    const baseWind = currentWeather?.wind_speed || 5;

    const newData = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));

      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        temp: baseTemp + (Math.random() - 0.5) * 10,
        tempMin: baseTemp - 5 + (Math.random() - 0.5) * 6,
        tempMax: baseTemp + 5 + (Math.random() - 0.5) * 6,
        humidity: Math.max(
          20,
          Math.min(95, baseHumidity + (Math.random() - 0.5) * 30)
        ),
        wind: Math.max(0, baseWind + (Math.random() - 0.5) * 8),
        precipitation: Math.random() * 100,
      };
    });

    const timer = setTimeout(() => {
      setHistoricalData(newData);
    }, 0);
    return () => clearTimeout(timer);
  }, [timeRange, currentWeather]);

  const averages = useMemo(() => {
    const sum = historicalData.reduce(
      (acc, d) => ({
        temp: acc.temp + d.temp,
        humidity: acc.humidity + d.humidity,
        wind: acc.wind + d.wind,
      }),
      { temp: 0, humidity: 0, wind: 0 }
    );

    const count = historicalData.length || 1;

    return {
      temp: sum.temp / count,
      humidity: sum.humidity / count,
      wind: sum.wind / count,
    };
  }, [historicalData]);

  return { historicalData, averages };
};
