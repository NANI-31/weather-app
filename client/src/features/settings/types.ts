export type TemperatureUnit = "celsius" | "fahrenheit";
export type SpeedUnit = "kmh" | "mph";
export type ThemeMode = "light" | "dark";
export type ColorTheme = "sunset" | "crimson" | "ocean" | "forest" | "aurora";
export type WeatherTheme =
  | "sunny"
  | "rainy"
  | "cloudy"
  | "snowy"
  | "night"
  | "auto";

export interface SettingsState {
  temperatureUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  themeMode: ThemeMode;
  colorTheme: ColorTheme;
  weatherTheme: WeatherTheme;
  isLoggedIn: boolean;
  userName: string | null;
  userImage: string | null;
  userEmail: string | null;
  userId: string | null;
  googleId?: string;
}
