import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import UserProvider from "./context/userContext.jsx";

import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <App />
    <Toaster
      toastOptions={{
        className: "",
        style: {
          fontSize: "14px",
        },
      }}
    />
  </UserProvider>
);
