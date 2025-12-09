import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  SettingsState,
  TemperatureUnit,
  SpeedUnit,
  ThemeMode,
  ColorTheme,
  WeatherTheme,
} from "./types";

const loadSettings = (): Partial<SettingsState> => {
  try {
    const saved = localStorage.getItem("weatherAppSettings");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const savedSettings = loadSettings();

const initialState: SettingsState = {
  temperatureUnit: savedSettings.temperatureUnit || "celsius",
  speedUnit: savedSettings.speedUnit || "kmh",
  themeMode: savedSettings.themeMode || "light",
  colorTheme: savedSettings.colorTheme || "sunset",
  weatherTheme: savedSettings.weatherTheme || "auto",
  isLoggedIn: savedSettings.isLoggedIn || false,
  userName: savedSettings.userName || null,
  userImage: savedSettings.userImage || null,
  userEmail: savedSettings.userEmail || null,
  userId: savedSettings.userId || null,
  googleId: savedSettings.googleId,
};

const saveSettings = (state: SettingsState) => {
  localStorage.setItem("weatherAppSettings", JSON.stringify(state));
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTemperatureUnit: (state, action: PayloadAction<TemperatureUnit>) => {
      state.temperatureUnit = action.payload;
      saveSettings(state);
    },
    setSpeedUnit: (state, action: PayloadAction<SpeedUnit>) => {
      state.speedUnit = action.payload;
      saveSettings(state);
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
      saveSettings(state);
    },
    setColorTheme: (state, action: PayloadAction<ColorTheme>) => {
      state.colorTheme = action.payload;
      saveSettings(state);
    },
    setWeatherTheme: (state, action: PayloadAction<WeatherTheme>) => {
      state.weatherTheme = action.payload;
      saveSettings(state);
    },
    login: (
      state,
      action: PayloadAction<{
        name: string;
        image?: string;
        email: string;
        _id: string;
        googleId?: string;
      }>
    ) => {
      state.isLoggedIn = true;
      state.userName = action.payload.name;
      state.userImage = action.payload.image || null;
      state.userEmail = action.payload.email;
      state.userId = action.payload._id;
      state.googleId = action.payload.googleId;
      saveSettings(state);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userName = null;
      state.userImage = null;
      state.userEmail = null;
      state.userId = null;
      saveSettings(state);
    },
    updateUserImage: (state, action: PayloadAction<string>) => {
      state.userImage = action.payload;
      saveSettings(state);
    },
  },
});

export const {
  setTemperatureUnit,
  setSpeedUnit,
  setThemeMode,
  setColorTheme,
  setWeatherTheme,
  login,
  logout,
  updateUserImage,
} = settingsSlice.actions;

export default settingsSlice.reducer;
