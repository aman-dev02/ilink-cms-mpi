import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LivePreviewProvider } from "./context/live-preview-context-provider";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <BrowserRouter>
    <LivePreviewProvider>
      <App />
    </LivePreviewProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
reportWebVitals();
