# API Flow Documentation

This document outlines the architecture and data flow of the Weather App's API, focusing on how the backend serves as a proxy for external services (OpenWeatherMap) and manages internal resources.

## Weather API Flow (Sequence Diagram)

The Server acts as a proxy to hide API keys and handle errors before forwarding data to the Client.

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server (Weather Controller)
    participant OWM as OpenWeatherMap API

    %% Current Weather
    rect rgb(230, 245, 255)
    note right of C: Current Weather
    C->>S: GET /api/weather/current?lat=X&lon=Y
    S->>S: Validate lat/lon
    S->>OWM: GET /data/2.5/weather?lat=X&lon=Y&appid=KEY
    OWM-->>S: Weather JSON
    alt Error (e.g., limit exceeded)
        S-->>C: 500/Bad Gateway
    else Success
        S-->>C: 200 OK + Weather JSON
    end
    end

    %% Forecast
    rect rgb(240, 255, 240)
    note right of C: Forecast (5-Day / 3-Hour)
    C->>S: GET /api/weather/forecast?lat=X&lon=Y
    S->>OWM: GET /data/2.5/forecast?lat=X&lon=Y&appid=KEY
    OWM-->>S: Forecast JSON List
    S-->>C: 200 OK + Forecast JSON
    end

    %% Air Pollution
    rect rgb(255, 245, 230)
    note right of C: Air Pollution
    C->>S: GET /api/weather/air_pollution?lat=X&lon=Y
    S->>OWM: GET /data/2.5/air_pollution?lat=X&lon=Y&appid=KEY
    OWM-->>S: Pollution Data
    S-->>C: 200 OK + Pollution Data
    end

    %% Geocoding
    rect rgb(255, 240, 245)
    note right of C: Geocoding (Search)
    C->>S: GET /api/weather/geo/direct?q=CityName
    S->>OWM: GET /geo/1.0/direct?q=CityName&limit=5&appid=KEY
    OWM-->>S: List of Locations
    S-->>C: 200 OK + Location List
    end
```

## API Endpoints Overview

### Weather (`/api/weather`)

These endpoints proxy requests to OpenWeatherMap.

| Endpoint         | Method | Params                     | Description                                         |
| :--------------- | :----- | :------------------------- | :-------------------------------------------------- |
| `/current`       | GET    | `lat`, `lon`, `q`, `units` | Fetches current weather conditions.                 |
| `/forecast`      | GET    | `lat`, `lon`, `units`      | Fetches 5-day forecast data with 3-hour steps.      |
| `/air_pollution` | GET    | `lat`, `lon`               | Fetches air pollution data (CO, NO, NO2, O3, etc.). |
| `/geo/direct`    | GET    | `q`, `limit`               | Searches for city coordinates by name.              |

### Auth (`/api/auth`)

_See [Data Flow Documentation](data_flow_documentation.md) for detailed auth flows._

| Endpoint           | Method | Description                          |
| :----------------- | :----- | :----------------------------------- |
| `/register`        | POST   | Register a new user.                 |
| `/login`           | POST   | Login with email/password.           |
| `/google`          | POST   | Login/Register with Google ID Token. |
| `/logout`          | POST   | Clear auth cookie.                   |
| `/forgot-password` | POST   | Request OTP email.                   |
| `/reset-password`  | POST   | Reset password with OTP.             |
