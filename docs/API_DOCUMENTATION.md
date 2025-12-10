# API Documentation

Base URL: `/api`

## 📌 Endpoints Overview

| Method      | Endpoint                        | Description                  | Auth Required     |
| :---------- | :------------------------------ | :--------------------------- | :---------------- |
| **Auth**    |                                 |                              |                   |
| `POST`      | `/auth/register`                | Register a new user          | No                |
| `POST`      | `/auth/login`                   | Login existing user          | No                |
| `POST`      | `/auth/google`                  | Google OAuth Login           | No                |
| `POST`      | `/auth/logout`                  | Logout user                  | No                |
| `POST`      | `/auth/forgot-password`         | Send password reset OTP      | No                |
| `POST`      | `/auth/reset-password`          | Reset password with OTP      | No                |
| **User**    |                                 |                              |                   |
| `GET`       | `/users/favorites`              | Get favorite cities          | Yes               |
| `POST`      | `/users/add-favorite`           | Add a city to favorites      | Yes               |
| `POST`      | `/users/remove-favorite`        | Remove a city from favorites | Yes               |
| `DELETE`    | `/users/delete-favorites`       | Delete all favorites         | Yes               |
| `PUT`       | `/users/update-profile`         | Update name/email            | Yes               |
| `POST`      | `/users/upload-profile-picture` | Upload profile image         | Yes               |
| `PUT`       | `/users/change-password`        | Change current password      | Yes               |
| `DELETE`    | `/users/delete-account`         | Delete account permanently   | Yes               |
| **Weather** |                                 |                              |                   |
| `GET`       | `/weather/current`              | Get current weather          | No (Public Proxy) |
| `GET`       | `/weather/forecast`             | Get 5-day forecast           | No (Public Proxy) |
| `GET`       | `/weather/air_pollution`        | Get air pollution data       | No (Public Proxy) |
| `GET`       | `/weather/geo/direct`           | Geocode city name            | No (Public Proxy) |

---

## 🔐 Auth Endpoints

### 1. Register User

`POST /api/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**

```json
{
  "_id": "6750...",
  "name": "John Doe",
  "email": "john@example.com",
  "message": "User registered successfully"
}
```

_Note: Sets `token` HTTP-Only cookie._

---

### 2. Login User

`POST /api/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "_id": "6750...",
  "name": "John Doe",
  "email": "john@example.com",
  "picture": "http://...",
  "favorites": [],
  "message": "Login successful"
}
```

---

### 3. Google Login

`POST /api/auth/google`

**Request Body:**

```json
{
  "token": "eyJhbGciOiJSUzI1NiIs..."
}
```

_Token is the Google ID Token received from the frontend client._

**Response (200 OK):**

```json
{
  "_id": "6750...",
  "name": "John Doe",
  "email": "john@gmail.com",
  "picture": "https://lh3.googleusercontent.com/...",
  "googleId": "12345...",
  "favorites": []
}
```

---

## 👤 User Endpoints (Protected)

**Headers Required:**
Cookie: `token=...` (Automatically sent by browser)

### 1. Update Profile

`PUT /api/users/update-profile`

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (200 OK):**

```json
{
  "_id": "6750...",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "picture": "..."
}
```

### 2. Add Favorite

`POST /api/users/add-favorite`

**Request Body:**

```json
{
  "city": "London"
}
```

**Response (200 OK):**

```json
["New York", "London"]
```

_Returns updated list of favorite cities._

### 3. Upload Profile Picture

`POST /api/users/upload-profile-picture`

**Request Body:**
`multipart/form-data`

- `image`: File (jpg/png)
- `userId`: String

**Response (200 OK):**

```json
{
  "message": "Profile picture updated",
  "picture": "https://res.cloudinary.com/..."
}
```

---

## ☁️ Weather Proxy Endpoints

These endpoints proxy requests to OpenWeatherMap to hide API keys.

### 1. Current Weather

`GET /api/weather/current?lat={lat}&lon={lon}&units=metric`
OR
`GET /api/weather/current?q={city}&units=metric`

**Parameters:**

- `lat`, `lon`: Coordinates
- `q`: City name (optional)
- `units`: `metric` or `imperial`

**Response:**
Returns raw OpenWeatherMap JSON response.

### 2. Forecast

`GET /api/weather/forecast?lat={lat}&lon={lon}&units=metric`

**Response:**
Returns raw OpenWeatherMap 5-day forecast JSON.
