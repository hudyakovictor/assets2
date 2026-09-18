import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { RepoAssetsProvider } from "./lib/repoAssets";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RepoAssetsProvider>
      <App />
    </RepoAssetsProvider>
  </StrictMode>
);
