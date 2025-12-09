import { useSelector } from "react-redux";
import { type RootState } from "@app/store";
import { useMemo } from "react";

interface Raindrop {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

interface Snowflake {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

interface Star {
  id: number;
  left: number;
  top: number;
  delay: number;
}

// Deterministic random number generator to avoid hydration mismatches
const random = (seed: number) => {
  const x = Math.sin(seed + 1234) * 10000;
  return x - Math.floor(x);
};

export const WeatherEffects = () => {
  const weatherTheme = useSelector(
    (state: RootState) => state.weather.weatherTheme
  );
  const settingsTheme = useSelector(
    (state: RootState) => state.settings.weatherTheme
  );

  const activeTheme = settingsTheme === "auto" ? weatherTheme : settingsTheme;

  const raindrops = useMemo<Raindrop[]>(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: random(i) * 100,
        delay: random(i + 50) * 2,
        duration: 0.5 + random(i + 100) * 0.5,
      })),
    []
  );

  const snowflakes = useMemo<Snowflake[]>(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: random(i + 200) * 100,
        delay: random(i + 250) * 5,
        duration: 5 + random(i + 300) * 5,
        size: 3 + random(i + 350) * 5,
      })),
    []
  );

  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: random(i + 400) * 100,
        top: random(i + 450) * 100,
        delay: random(i + 500) * 3,
      })),
    []
  );

  if (activeTheme === "sunny") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-yellow-700/20 blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl animate-float" />
      </div>
    );
  }

  if (activeTheme === "rainy") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-weather-rainy/5" />
        {raindrops.map((drop) => (
          <div
            key={drop.id}
            className="absolute w-0.5 h-4 bg-weather-rainy/40 rounded-full rain-drop"
            style={{
              left: `${drop.left}%`,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${drop.duration}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (activeTheme === "snowy") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-weather-snowy/5" />
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute rounded-full bg-weather-snowy/80 snow-flake"
            style={{
              left: `${flake.left}%`,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              animationDelay: `${flake.delay}s`,
              animationDuration: `${flake.duration}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (activeTheme === "cloudy") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-weather-cloudy/20 blur-3xl animate-float" />
        <div
          className="absolute top-1/3 -left-40 w-[400px] h-[400px] rounded-full bg-weather-cloudy/15 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-1/4 w-[300px] h-[300px] rounded-full bg-weather-cloudy/10 blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>
    );
  }

  if (activeTheme === "night") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-weather-night/30" />
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 rounded-full bg-primary-foreground/60 animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
        <div className="absolute top-10 right-20 w-20 h-20 rounded-full bg-primary-foreground/20 blur-sm" />
      </div>
    );
  }

  return null;
};

export default WeatherEffects;
