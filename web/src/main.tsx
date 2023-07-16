import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/global.css";
import { StyleWrapper } from "./components/ThemeProvider.tsx";
import { Provider } from "react-redux";
import store from "./store/index.tsx";
// import "/node_modules/react-grid-layout/css/styles.css";
// import "/node_modules/react-resizable/css/styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StyleWrapper>
      <Provider store={store}>
        <App />
      </Provider>
    </StyleWrapper>
  </React.StrictMode>,
);
