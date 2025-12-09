export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg: number;
  visibility: number;
  description: string;
  icon: string;
  main: string;
  clouds: number;
  sunrise: number;
  sunset: number;
  timezone: number;
  dt: number;
  lat: number;
  lon: number;
}

export interface ForecastItem {
  dt: number;
  temp: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  description: string;
  icon: string;
  main: string;
  wind_speed: number;
  pop: number;
}

export interface AirQuality {
  aqi: number;
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
}

export interface CitySearchResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

export interface Clouds {
  all: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface Sys {
  pod: string;
}

export interface ForecastListItem {
  dt: number;
  main: MainWeatherData;
  weather: WeatherCondition[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
}

export interface CityCoords {
  lat: number;
  lon: number;
}

export interface City {
  id: number;
  name: string;
  coord: CityCoords;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastListItem[];
  city: City;
}

export interface GeocodingAPIResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
