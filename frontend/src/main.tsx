import React from "react";
import { createRoot } from "react-dom/client";

import { TokenHierarchyPage } from "./pages/token-hierarchy-page";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TokenHierarchyPage />
  </React.StrictMode>,
);
