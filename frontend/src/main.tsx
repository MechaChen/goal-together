import React from "react";
import { createRoot } from "react-dom/client";
import { TodosPage } from "./pages/todos-page";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TodosPage />
  </React.StrictMode>
);
