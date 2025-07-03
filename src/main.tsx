import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./style.module.css";
import Author from "./pages/Author";
import Story from "./pages/Story";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Menu from "./components/Menu";
import Auth from "./components/Auth";

import { AuthProvider } from "./context/auth";
import { GlobalProvider } from "./context/context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalProvider>
      <BrowserRouter>
        <AuthProvider>
          <Auth>
            <Routes>
              <Route path="/Author/:authorId" element={<Author />} />
              <Route path="/Author/:authorId/:storyId" element={<Story />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="/" element={<Home />} />
            </Routes>
            <Menu />
          </Auth>
        </AuthProvider>
      </BrowserRouter>
    </GlobalProvider>
  </StrictMode>
);
