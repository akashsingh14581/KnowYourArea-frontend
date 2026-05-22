
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css"        // base variables + animations
import "./styles/navbar.css"   // navbar + drawer
import "./styles/landing.css"  // hero, features, etc
import "./styles/sidebar.css"  // map sidebar
import "./styles/createshop.css" // create shop form
import "./styles/LoginRegister.css"
import "./styles/AddCategory.css"
import "./styles/Auth.css"
import "./index.css";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import App from "./App.jsx";
import store from "./store/store";

createRoot(document.getElementById("root")).render(
   <Provider store={store}>
   <ThemeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </ThemeProvider>
    </Provider>
);