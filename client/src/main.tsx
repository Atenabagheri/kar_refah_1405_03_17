import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { Toaster } from "react-hot-toast";
import { attachInterceptors } from "../api/createApi.ts";
attachInterceptors(store);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Toaster />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
