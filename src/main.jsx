import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import { registerSW } from "virtual:pwa-register";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Base theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primeflex/themes/primeone-light.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./styles/global.scss";

import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store";
import { SocketProvider } from "./sockets/SocketContext";
import CustomConfirmDialog from "./shared/overlays/CustomConfirmDialog.jsx";
import CustomToast from "./components/CustomToast.jsx";
import SpecialAccessWindow from "./components/SpecialAccessWindow.jsx";
import SocketListener from "./sockets/SocketListener.jsx";
import { Toaster } from "react-hot-toast";

const value = {
  ripple: true,
};

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App ready to work offline");
  },
});
createRoot(document.getElementById("root")).render(
  <div className="app">
    <PrimeReactProvider value={value}>
      <Provider store={store}>
        <SocketProvider>
          <CustomConfirmDialog />
          <CustomToast />
          <Toaster />
          <SpecialAccessWindow />
          <App />
          <SocketListener />
        </SocketProvider>
      </Provider>
    </PrimeReactProvider>
  </div>,
);

function fadeOutAndHide(id, duration = 1000) {
  const element = document.getElementById(id);
  element.style.transition = `opacity ${duration}ms ease`;
  element.style.opacity = 1;
  void element.offsetWidth;
  element.style.opacity = 0;

  setTimeout(() => {
    element.style.display = "none";
  }, duration);
}
fadeOutAndHide("initial-loader", 1000);
