import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/store/index"; // Adjust path if needed
import { ToastContainer } from "react-toastify"; 

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles

import App from "@/App.tsx"; // Ensure alias is set up
import "@/components/pageSettings/ToggleSwitch.css"
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer /> {/* Add ToastContainer here */}
      <App />
    </Provider>
  </StrictMode>
);

