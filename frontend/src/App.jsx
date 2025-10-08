/**
 * @fileoverview The root component of the application.
 * It manages the user's authentication state, handles page navigation,
 * and renders the appropriate page component.
 * @module App
 */

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import UserProfile from "./pages/UserProfile";

/**
 * A map of page names to their corresponding React components for simple routing.
 * @type {Object.<string, React.ComponentType<any>>}
 */
const PAGES = {
  home: Home,
  auth: Auth,
  profile: UserProfile,
};

/**
 * Represents the authenticated user object stored in the application state.
 * @typedef {object} User
 * @property {string} _id - The user's unique ID.
 * @property {string} username - The user's display name.
 * @property {string} email - The user's email address.
 */

/**
 * The main App component. It acts as the primary controller for the application's UI,
 * managing user authentication state and which page is currently visible.
 */
const App = () => {
  /** @type {[User | null, React.Dispatch<React.SetStateAction<User | null>>]} */
  const [user, setUser] = useState(null);

  /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
  const [page, setPage] = useState("home");

  /**
   * A memoized function to change the current page.
   * @param {keyof PAGES} targetPage - The name of the page to navigate to.
   */
  const navigate = useCallback((targetPage) => {
    setPage(targetPage);
  }, []);

  /**
   * Handles the user logout process by clearing the token and user state,
   * then navigating to the authentication page.
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("auth");
  };

  // Effect to check for an existing token on initial app load.
  // This determines the initial page (home for logged-in users, auth for guests).
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // In a real app, you would also decode the token here to get user info
      // and set it in the state.
      // For now, we just navigate. A more robust solution would be needed.
      navigate("home");
    } else {
      navigate("auth");
    }
  }, [navigate]);

  // Determine which page component to render.
  // If the user is logged in, it shows the requested page.
  // If not logged in, it defaults to the 'auth' page.
  let CurrentPage;
  if (user || page === "auth") {
    CurrentPage = PAGES[page] || PAGES.home;
  } else {
    // Redirect to login if user is not authenticated and trying to access a protected page
    CurrentPage = PAGES.auth;
  }

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} navigate={navigate} />
      <main className="min-h-[calc(100vh-64px)]">
        {/* Pass necessary props down to the currently active page component */}
        <CurrentPage user={user} setUser={setUser} navigate={navigate} />
      </main>
    </>
  );
};

export default App;