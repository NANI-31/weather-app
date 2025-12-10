# Data Flow Documentation

This document outlines the data flow for key processes within the Weather App, specifically focusing on User Authentication and Management.

## Authentication Flow (Sequence Diagram)

The following sequence diagram illustrates the step-by-step interactions between the Client, Server, Database, and External Services for Registration, Login, Google Auth, and Password Reset.

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server (Auth Controller)
    participant D as DB (MongoDB)
    participant G as Google OAuth
    participant E as Email Service

    %% Registration
    rect rgb(240, 248, 255)
    note right of C: Registration Flow
    C->>S: POST /register (name, email, password)
    S->>D: Find One (email)
    D-->>S: Result (User/null)
    alt User Exists
        S-->>C: 400 User already exists
    else New User
        S->>S: Hash Password
        S->>D: Create User
        D-->>S: User Created
        S-->>C: 201 Created + Set Token Cookie
    end
    end

    %% Login
    rect rgb(255, 250, 240)
    note right of C: Login Flow
    C->>S: POST /login (email, password)
    S->>D: Find One (email)
    D-->>S: User Document
    S->>S: Compare Password (bcrypt)
    alt Invalid Creds
        S-->>C: 401 Invalid email/password
    else Success
        S-->>C: 200 OK + Set Token Cookie
    end
    end

    %% Google Auth
    rect rgb(255, 240, 245)
    note right of C: Google Auth Flow
    C->>S: POST /google (idToken)
    S->>G: Verify Token
    G-->>S: Payload (email, name, sub)
    S->>D: Find One (email)
    D-->>S: User/null
    alt User Exists
        S->>D: Update (googleId, picture, username)
    else New User
        S->>D: Create User (googleId, name, email)
    end
    S-->>C: 200 OK + Set Token Cookie
    end

    %% Forgot Password
    rect rgb(240, 255, 240)
    note right of C: Forgot Password Flow
    C->>S: POST /forgot-password (email)
    S->>D: Find One (email)
    D-->>S: User Document
    alt User Not Found
        S-->>C: 404 User not found
    else User Found
        S->>S: Generate OTP
        S->>D: Save OTP & Expiry to User
        S->>E: Send Email (OTP)
        E-->>C: Email Received
        S-->>C: 200 OTP sent
    end
    end
```

## Flow Details

#### 1. User Registration

**Endpoint**: `/api/auth/register`

1.  **Incoming Data**: Client sends `name`, `email`, `password`, and optional `username`.
2.  **Validation**: Server checks if `email` already exists in MongoDB.
3.  **Processing**:
    - Password is hashed using `bcryptjs`.
    - If `username` is missing, it is generated from `name` or `email` prefix.
4.  **Storage**: New document created in `User` collection.
5.  **Response**: Returns User JSON and sets HTTP-only `token` cookie.

#### 2. User Login

**Endpoint**: `/api/auth/login`

1.  **Incoming Data**: `email`, `password`.
2.  **Verification**: Look up user by `email`. If found, compare `password` hash.
3.  **Response**:
    - **Success**: Returns User JSON (excluding password) and sets `token` cookie.
    - **Failure**: Returns 401 Unauthorized.

#### 3. Google OAuth

**Endpoint**: `/api/auth/google`

1.  **Incoming Data**: Google `idToken`.
2.  **Verification**: Token verified against `GOOGLE_CLIENT_ID` via `google-auth-library`.
3.  **Synchronisation**:
    - Extracts `googleId` (`sub`), `email`, `name`, `picture`.
    - **Existing User**: Updates `googleId`, `picture` (if missing), and backfills `username` if missing.
    - **New User**: Creates account with verified data and generated `username`.
4.  **Response**: Returns User JSON and sets `token` cookie.

#### 4. Password Reset

**Phase 1: Request OTP (`/api/auth/forgot-password`)**

- Input: `email`.
- Effect: Generates 6-digit OTP, saves to `User.resetPasswordOtp` with 10m expiry. Sends email via Nodemailer.

**Phase 2: Reset (`/api/auth/reset-password`)**

- Input: `email`, `otp`, `newPassword`.
- Validation: Finds user matching `email` AND `otp` AND unexpired validity.
- Action: Hashes `newPassword`, clears OTP fields, updates `password`.
