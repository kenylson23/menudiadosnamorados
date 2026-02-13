import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Temporariamente desativado para depurar problemas de deploy no Netlify
/*
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("SW registration failed: ", err);
    });
  });
}
*/

createRoot(document.getElementById("root")!).render(<App />);
