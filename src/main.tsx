import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CapacitorSwipeBackPlugin} from 'capacitor-swipe-back-plugin';
import App from "./App.tsx";
import "./index.css";

CapacitorSwipeBackPlugin.enable();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
