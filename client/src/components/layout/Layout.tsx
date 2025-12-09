import { type ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { type RootState } from "@app/store";
import Navbar from "./Navbar";
import WeatherEffects from "@components/weather/WeatherEffects";
import LoadingScene from "@components/3d/LoadingScene";
import { useWeather } from "@hooks/useWeather";
// import { toast } from "react-toastify";

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { themeMode, colorTheme, weatherTheme } = useSelector(
    (state: RootState) => state.settings
  );
  const { fetchWeather, currentWeather, loading } = useWeather();

  // Initialize loading state based on whether we already have weather data
  const [showLoading, setShowLoading] = useState(!currentWeather);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMinLoadTimePassed, setIsMinLoadTimePassed] = useState(false);

  const currentWeatherTheme = useSelector(
    (state: RootState) => state.weather.weatherTheme
  );
  const activeWeatherTheme =
    weatherTheme === "auto" ? currentWeatherTheme : weatherTheme;

  useEffect(() => {
    // Apply dark/light mode
    const shouldBeDark = themeMode === "dark" || activeWeatherTheme === "night";
    document.documentElement.classList.toggle("dark", shouldBeDark);

    // Remove all theme classes
    document.documentElement.classList.remove(
      "theme-sunset",
      "theme-crimson",
      "theme-ocean",
      "theme-forest",
      "theme-aurora",
      "theme-sunny",
      "theme-rainy",
      "theme-cloudy",
      "theme-snowy",
      "theme-night"
    );

    // Apply color theme
    document.documentElement.classList.add(`theme-${colorTheme}`);

    // Apply weather theme
    if (activeWeatherTheme) {
      document.documentElement.classList.add(`theme-${activeWeatherTheme}`);
    }
  }, [themeMode, colorTheme, activeWeatherTheme]);

  // Weather Fetching & Loading Logic
  useEffect(() => {
    // Only fetch if we don't have data
    if (currentWeather) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          fetchWeather(40.7128, -74.006);
          // toast.info("Using default location.");
        }
      );
    } else {
      fetchWeather(40.7128, -74.006);
    }
  }, [fetchWeather, currentWeather]);

  useEffect(() => {
    // Start loading sequence only if we need to show loading
    if (!showLoading) {
      document.body.style.overflow = "auto";
      return;
    }

    // Hide scrollbar
    document.body.style.overflow = "hidden";

    // 1. Min time timer: ensure we wait at least 5 seconds (as per original req) or 1s (user pref)
    // Using 2000ms as a safe middle ground for global load, user can adjust.
    const minTimeTimer = setTimeout(() => {
      setIsMinLoadTimePassed(true);
    }, 2000);

    // 2. Progress bar animation
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 98) {
          return prev;
        }
        return prev + 2;
      });
    }, 50); // faster update for smoother feel

    return () => {
      clearInterval(progressInterval);
      clearTimeout(minTimeTimer);
      // Ensure we reset overflow on cleanup if component unmounts
      document.body.style.overflow = "auto";
    };
  }, [showLoading]);

  useEffect(() => {
    // Finish loading when data is ready AND min time passed
    if (currentWeather && !loading && isMinLoadTimePassed) {
      const timer = setTimeout(() => {
        setLoadingProgress(100);
        setTimeout(() => setShowLoading(false), 500);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentWeather, loading, isMinLoadTimePassed]);

  return (
    <div className="h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-500 relative flex flex-col">
      <WeatherEffects />
      {showLoading && <LoadingScene progress={loadingProgress} />}
      {!showLoading && <Navbar />}

      {/* Scrollable Container */}
      <div
        id="main-scroll-container"
        className="w-full flex-1 overflow-y-auto custom-scrollbar"
      >
        <main className="pt-24 pb-10 px-4 max-w-7xl mx-auto relative z-10">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
