import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./app";
import { ToasterProvider } from "./context/toastContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToasterProvider>
      <App />
    </ToasterProvider>
  </React.StrictMode>
);
