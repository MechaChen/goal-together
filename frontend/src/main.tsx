import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import goalTogetherFavicon from "./assets/images/goal-together-favicon.png";

import { App } from "./app";
import "./index.css";

function applyFavicon(href: string) {
  const existing = document.querySelector(
    "link[rel='icon']",
  ) as HTMLLinkElement | null;
  if (existing) {
    existing.href = href;
    return;
  }
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = href;
  document.head.appendChild(link);
}

applyFavicon(goalTogetherFavicon);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
