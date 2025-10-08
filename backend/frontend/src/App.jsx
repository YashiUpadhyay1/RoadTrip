import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import UserProfile from "./pages/UserProfile";
import { jwtDecode } from "jwt-decode";

const PAGES = {
  home: Home,
  auth: Auth,
  profile: UserProfile,
};

const App = () => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");

  const navigate = useCallback((targetPage) => {
    setPage(targetPage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("auth");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("home");
    } else {
      navigate("auth");
    }
  }, [navigate]);

  let CurrentPage;
  if (user || page === "auth") {
    CurrentPage = PAGES[page] || PAGES.home;
  } else {
    CurrentPage = PAGES.auth;
  }

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} navigate={navigate} />
      <main className="min-h-[calc(100vh-64px)]">
        <CurrentPage user={user} setUser={setUser} navigate={navigate} />
      </main>
    </>
  );
};
export default App;