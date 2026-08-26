import { useState } from "react";

import { LandingPage } from "./Components/LandingPage";
import { AuthPanel } from "./Components/authPanel";
import { Dashboard } from "./Components/Dashboard";

type Page =
  | "landing"
  | "login"
  | "signup"
  | "dashboard";

function App() {
  const [page, setPage] = useState<Page>(() => {
    const token =
      localStorage.getItem("token");

    if (token) {
      return "dashboard";
    }

    return "landing";
  });


  // ================================
  // DASHBOARD
  // ================================

  if (page === "dashboard") {
    return <Dashboard />;
  }


  // ================================
  // LOGIN
  // ================================

  if (page === "login") {
    return (
      <AuthPanel
        initialMode="login"
        onLoginSuccess={() => {
          setPage("dashboard");
        }}
      />
    );
  }


  // ================================
  // SIGNUP
  // ================================

  if (page === "signup") {
    return (
      <AuthPanel
        initialMode="signup"
        onLoginSuccess={() => {
          setPage("dashboard");
        }}
      />
    );
  }


  // ================================
  // LANDING
  // ================================

  return (
    <LandingPage
      onLogin={() => {
        setPage("login");
      }}
      onSignup={() => {
        setPage("signup");
      }}
    />
  );
}

export default App;