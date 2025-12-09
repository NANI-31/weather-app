import { createRoot } from "react-dom/client";
import "./index.css";
import "./lib/chartSetup";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  // StrictMode disabled to prevent Google Login popup issues in development
  <App />
);
