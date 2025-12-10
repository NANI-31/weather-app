# UML Documentation

## 🏗️ Class Diagram

This diagram represents the core data structures used in both the Client (interfaces) and Server (Mongoose schema).

```mermaid
classDiagram
    class User {
        +String _id
        +String username
        +String email
        +String password
        +String googleId
        +String picture
        +String[] favorites
        +Date createdAt
        +void register()
        +void login()
    }

    class WeatherData {
        +String city
        +String country
        +Number temp
        +Number feels_like
        +Number humidity
        +Number wind_speed
        +String description
        +String icon
        +Number dt
    }

    class AuthResponse {
        +String _id
        +String name
        +String email
        +String token
        +String picture
        +String[] favorites
    }

    class ForecastItem {
        +Number dt
        +Number temp
        +Number temp_min
        +Number temp_max
        +String description
        +String icon
    }

    User "1" --> "*" String : favorites
    AuthResponse --|> User : partial match
    WeatherData ..> ForecastItem : related
```

## 🧩 Component Diagram

This diagram visualizes the React component hierarchy, showing how the application is structured from the root `App` down to individual widgets.

```mermaid
graph TD
    App["App.tsx"] --> Providers["Providers (Redux, GoogleOAuth)"]
    Providers --> Router["BrowserRouter"]
    Router --> Layout["Layout.tsx (Navbar)"]

    Layout --> Routes{"Routes"}

    Routes --> Index["Index.tsx (Dashboard)"]
    Routes --> History["History.tsx"]
    Routes --> Settings["Settings.tsx"]

    subgraph Dashboard ["Dashboard Components"]
        Index --> Search["SearchBar"]
        Index --> Favs["FavoriteCities"]
        Index --> Current["CurrentWeather"]
        Index --> Hourly["HourlyForecast"]
        Index --> Daily["DailyForecast"]
        Index --> Charts["WeatherCharts"]
        Index --> Details["AirQuality / UVIndex"]
    end

    subgraph SettingsComp ["Settings Components"]
        Settings --> Account["AccountSection"]
        Settings --> Theme["ThemeModeSection"]
        Settings --> Units["UnitSection"]
        Account --> AuthForms["AuthForms"]
        Account --> Profile["ProfileView"]
    end
```

## 🚀 Deployment Diagram

This diagram shows the physical deployment architecture of the application services and their interactions with external cloud providers.

```mermaid
graph TD
    ClientNode[("User Device")]

    subgraph Cloud ["Cloud Infrastructure"]
        Vercel["Vercel (Frontend Hosting)"]
        Render["Render (Backend API)"]
        Mongo[("MongoDB (Database)")]
    end

    subgraph Services ["External Services"]
        GoogleAuth["Google OAuth 2.0"]
        Cloudinary["Cloudinary (Images)"]
        WeatherAPIs["OpenWeatherMap / Open-Meteo"]
    end

    ClientNode -- "HTTPS / React App" --> Vercel
    Vercel -- "REST API Calls (Axios)" --> Render

    Render -- "Mongoose Driver" --> Mongo
    Render -- "SMTP / Auth" --> GoogleAuth
    Render -- "Upload Stream" --> Cloudinary
    Render -- "Weather Data Proxy" --> WeatherAPIs

    ClientNode -- "Direct Auth (Optional)" --> GoogleAuth
```

## 📦 Object Diagram

This diagram shows a specific runtime instance of the application entities, illustrating how a `User` typically relates to their `Auth` session and cached `WeatherData` at a moment in time (e.g., after logging in and viewing "London").

```mermaid
classDiagram
    class UserInstance {
        _id = "6750abc123..."
        username = "JohnDoe"
        email = "john@example.com"
        favorites = ["London", "Paris"]
        picture = "https://lh3.google..."
    }

    class AuthSession {
        token = "eyJhbGciOiJIUz..."
        expiresIn = "30d"
        isAuthenticated = true
        user = UserInstance
    }

    class WeatherCache_London {
        city = "London"
        temp = 15.5
        description = "cloudy"
        timestamp = "14:30:00"
    }

    UserInstance -- AuthSession : owns
    UserInstance ..> WeatherCache_London : views
```

## 📚 Package Diagram

This diagram organizes the system elements into logical groupings (packages/namespaces) to show specific dependencies between high-level modules in the application architecture.

```mermaid
graph LR
    subgraph Client ["Client (Frontend)"]
        Components["Components"]
        Pages["Pages"]
        ReduxStore["Redux Store"]
        API_Client["API Services"]

        Pages --> Components
        Components --> ReduxStore
        ReduxStore --> API_Client
    end

    subgraph Server ["Server (Backend)"]
        Controllers["Controllers"]
        Routes["Routes"]
        Models["Mongoose Models"]
        AuthMiddleware["Middleware"]

        Routes --> Controllers
        Routes --> AuthMiddleware
        Controllers --> Models
    end

    subgraph External ["External Libraries"]
        ReactLibs["React / Vite / Tailwind"]
        NodeLibs["Express / JWT / Bcrypt"]
    end

    API_Client -. "HTTP / JSON" .-> Routes
    Components -.-> ReactLibs
    Controllers -.-> NodeLibs
```

## 🏷️ Profile Diagram

The Profile Diagram defines custom stereotypes used throughout the architecture, extending standard UML elements to fit the React/Express domain.

```mermaid
classDiagram
    direction TB
    class Class["UML::Class"] {
    }
    class Interface["UML::Interface"] {
    }

    class WeatherAppProfile {
        <<profile>>
    }

    class ReactComponent {
        <<stereotype>>
        +boolean isStateful
        +boolean isHoC
    }

    class Service {
        <<stereotype>>
        +String baseURL
        +int timeout
    }

    class RESTEndpoint {
        <<stereotype>>
        +String method
        +String path
    }

    WeatherAppProfile -- ReactComponent
    WeatherAppProfile -- Service
    WeatherAppProfile -- RESTEndpoint

    ReactComponent --|> Class : extends
    Service --|> Class : extends
    RESTEndpoint --|> Interface : extends
```

## 🧱 Composite Structure Diagram

This diagram details the internal structure of the main `WeatherDashboard` page (the `Index` component), illustrating how it connects to the Redux Store port and manages its internal parts (widgets).

```mermaid
graph TD
    subgraph WeatherDashboard ["WeatherDashboard (Index.tsx)"]
        direction TB

        Port[("Redux Store Port")]

        WSearch["Search Widget"]
        WCurrent["Current Weather"]
        WForecast["Forecast Widget"]

        Port -- "Selects city" --> WSearch
        Port -- "Provides data" --> WCurrent
        Port -- "Provides data" --> WForecast

        WSearch -- "Dispatches action" --> Port
    end

    API[("Weather API Interface")]

    Port -. "Async Thunks" .-> API
```

## 👤 Use Case Diagram

This diagram identifies the different types of users (Actors) and their possible interactions (Use Cases) with the Weather App system.

```mermaid
graph TD
    Visitor(["Visitor"])
    User(["Registered User"])

    System["Weather App System"]

    subgraph System
        UC1("Search Locations")
        UC2("View Current Weather")
        UC3("View 5-Day Forecast")
        UC4("Register / Login")
        UC5("Save Favorite Cities")
        UC6("Manage User Profile")
        UC7("View Search History")
    end

    Visitor --> UC1
    Visitor --> UC2
    Visitor --> UC3
    Visitor --> UC4

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC5
    User --> UC6
    User --> UC7

    User -.-> Visitor
```

## 🏃 Activity Diagram

### User Search Flow

This diagram illustrates the step-by-step workflow for a typical user session: searching for a city and viewing details, with an optional login branch.

```mermaid
graph TD
    Start((Start)) --> OpenApp[Open Weather App]
    OpenApp --> CheckAuth{Is Logged In?}

    CheckAuth -- No --> LoadVisitor[Load Guest View]
    CheckAuth -- Yes --> LoadUser[Load User Dashboard]

    LoadVisitor --> SearchCity[Search for City]
    LoadUser --> SearchCity

    SearchCity --> Validate{Valid City?}
    Validate -- No --> ShowError[Show Error Toast]
    ShowError --> SearchCity

    Validate -- Yes --> FetchData[Fetch Weather Data]
    FetchData --> Display[Display Current Weather]

    Display --> MoreActions{More Actions?}

    MoreActions -- View Forecast --> Forecast[Show 5-Day Forecast]
    MoreActions -- Save City --> CheckAuth2{Is Logged In?}

    CheckAuth2 -- No --> PromptLogin[Prompt Login]
    CheckAuth2 -- Yes --> Save[Save to Favorites]

    PromptLogin --> End((End))
    Save --> End
    Forecast --> End
```

### User Registration Flow

This diagram details the user registration, validation, and auto-login process.

```mermaid
graph TD
    Guest((Guest)) --> ClickSignUp[Click Register Button]
    ClickSignUp --> FillForm[Fill Name Email Password]
    FillForm --> Submit{Submit Form}

    Submit --> ClientVal{Client Validation}
    ClientVal -- Invalid --> ShowFormError[Show Input Error]
    ShowFormError --> FillForm

    ClientVal -- Valid --> PostReq[POST Register API]
    PostReq --> ServerCheck{User Exists?}

    ServerCheck -- Yes --> ReturnErr[Return 400 Error]
    ReturnErr --> ShowToast[Show User Exists Toast]
    ShowToast --> FillForm

    ServerCheck -- No --> CreateUser[Create User and Hash Pass]
    CreateUser --> GenToken[Generate JWT Token]
    GenToken --> ReturnSuccess[Return 201 and User Data]

    ReturnSuccess --> AutoLogin[Auto-Login Action]
    AutoLogin --> UpdateRedux[Update Redux State]
    UpdateRedux --> Redirect[Redirect to Dashboard]
    Redirect --> End((End))
```

## 🔄 State Machine Diagram

This diagram models the life cycle of the "Weather Data Fetching" process, illustrating how the UI transitions between Idle, Loading, Success, and Error states based on user actions and API responses.

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> Loading : User searches city

    state Loading {
        [*] --> FetchGeocode
        FetchGeocode --> FetchWeather : Coordinates Found
        FetchWeather --> [*]
    }

    Loading --> Success : API returns 200 OK
    Loading --> Error : API returns 4xx/5xx

    Success --> Idle : Clear Search / Refresh
    Success --> Loading : Search New City

    Error --> Loading : Retry Action
    Error --> Idle : Dismiss Error
```

## ⏱️ Sequence Diagram

### Weather Search Flow

This diagram details the time-ordered interactions between the System Actors (User, Client) and the Backend Services (Server, Database, External APIs) during a full "Weather Search" operation.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React Client
    participant Server as Express Server
    participant DB as MongoDB
    participant WeatherAPI as OpenWeatherMap

    User->>Client: Enters "London" & Hits Search
    Client->>Client: Validates Input
    Client->>Server: GET /api/weather/search?city=London
    activate Server

    Server->>WeatherAPI: Request Geocoding (London)
    activate WeatherAPI
    WeatherAPI-->>Server: Return Coordinates {lat, lon}
    deactivate WeatherAPI

    Server->>WeatherAPI: Request Weather Data {lat, lon}
    activate WeatherAPI
    WeatherAPI-->>Server: Return Weather JSON
    deactivate WeatherAPI

    Server-->>Client: Return Unified Weather Response
    deactivate Server

    Client->>Client: Update Redux State
    Client-->>User: Render Weather Dashboard

    opt Save to Favorites (If Logged In)
        User->>Client: Clicks "Heart" Icon
        Client->>Server: POST /api/user/favorites {city: "London"}
        activate Server
        Server->>DB: Update User Document
        activate DB
        DB-->>Server: Success
        deactivate DB
        Server-->>Client: Updated User Profile
        deactivate Server
        Client-->>User: Show Success Toast
    end
```

### Forgot Password Flow

This diagram details the flow for resetting a forgotten password via email OTP.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React Client
    participant Server as Express Server
    participant DB as MongoDB
    participant Email as Gmail SMTP

    User->>Client: Clicks "Forgot Password"
    User->>Client: Enters Email & Submits
    Client->>Server: POST /api/auth/forgot-password

    activate Server
    Server->>DB: Find User by Email

    rect rgb(200, 255, 200)
        note right of Server: Ideal Success Path
        DB-->>Server: User Found
        Server->>Server: Generate OTP & Store
        Server->>Email: Send OTP Email
        activate Email
        Email-->>User: Delivers OTP
        deactivate Email
        Server-->>Client: 200 OK (OTP Sent)
    end

    deactivate Server
    Client-->>User: Show OTP Input Form

    User->>Client: Enters OTP & New Password
    Client->>Server: POST /api/auth/reset-password
    activate Server

    Server->>DB: Verify OTP & Expiry
    DB-->>Server: OTP Valid
    Server->>Server: Hash New Password
    Server->>DB: Update Password
    DB-->>Server: Success
    Server-->>Client: 200 OK (Password Reset)
    deactivate Server

    Client-->>User: Redirect to Login
```

## 📡 Communication Diagram

This diagram simulates a Communication Diagram (Collaboration Diagram) illustrating the structural relationships and message flow for the **User Login** process. The numbered edges correspond to the order of operations.

```mermaid
graph LR
    User((User))
    Client[React Client]
    Server[Auth Controller]
    DB[("MongoDB")]

    User -- "1: Enter Credentials" --> Client
    Client -- "2: POST /login" --> Server
    Server -- "3: Find User by Email" --> DB
    DB -- "4: Return Hash" --> Server
    Server -- "5: Validate & Sign JWT" --> Server
    Server -- "6: Return 200 OK + Token" --> Client
    Client -- "7: Update Auth State" --> User
```

## 🧭 Interaction Overview Diagram

This diagram provides a high-level view of the control flow between different interaction sequences, linking the Login, Search, and Logout behaviors.

```mermaid
graph TD
    Start((Start)) --> CheckState{User Session Active?}

    CheckState -- No --> LoginSeq[ref: Login Sequence]
    CheckState -- Yes --> SearchSeq[ref: Search Sequence]

    LoginSeq --> Decision{Success?}
    Decision -- Yes --> SearchSeq
    Decision -- No --> Error[Show Error]

    SearchSeq --> More{Continue?}
    More -- Yes --> SearchSeq
    More -- No --> LogoutSeq[ref: Logout Sequence]

    LogoutSeq --> End((End))
    Error --> End
```

## ⏲️ Timing Diagram (Gantt)

This diagram visualizes the critical timing of the "Search Debounce & API Request" flow, showing how character input events trigger a debounce timer before the actual network request is sent.

```mermaid
gantt
    title Search Debounce & API Latency (500ms Debounce)
    dateFormat x
    axisFormat %Lms

    section User Input
    Type L       : 0, 100
    Type o       : 100, 200
    Type n       : 200, 300

    section Debounce
    Timer Active : 0, 300
    Trigger Wait : active, 300, 800

    section Network
    API Request  : 800, 1500
    Update UI    : 1500, 1600
```
