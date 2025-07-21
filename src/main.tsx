import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./style.module.css";
import Profile from "./pages/Profile";
import Story from "./pages/Story";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Menu from "./components/Menu";
import Auth from "./components/Auth";

import { AuthProvider } from "./hooks/useAuth";
import { GlobalProvider } from "./context/context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/profile/:profileId" element={<Profile />} />
          <Route path="/profile/:profileId/:storyId" element={<Story />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="/" element={<Home />} />
        </Routes>
        <Menu />
      </BrowserRouter>
    </GlobalProvider>
  </StrictMode>
);
