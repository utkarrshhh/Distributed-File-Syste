import { useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";

import { login, signup } from "../api/auth.api";

const benefits = [
  "One secure place for your work",
  "Simple tools that stay out of your way",
  "Private by design, always",
];

interface AuthPanelProps {
  initialMode?: "login" | "signup";
  onLoginSuccess?: () => void;
}

export function AuthPanel({
  initialMode = "login",
  onLoginSuccess,
}: AuthPanelProps) {
  const [mode, setMode] = useState<"login" | "signup">(
    initialMode
  );

  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isLogin = mode === "login";

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        // =========================
        // LOGIN
        // =========================

        const result = await login({
          email,
          password,
        });

        // Store JWT
        localStorage.setItem(
          "token",
          result.user.token
        );

        // Store basic user information
        localStorage.setItem(
          "user",
          JSON.stringify({
            userId: result.user.userId,
            name: result.user.name,
            email: result.user.email,
          })
        );

        console.log(
          "Login successful:",
          result.user
        );

        // Tell App.tsx to move to dashboard
        onLoginSuccess?.();

      } else {
        // =========================
        // SIGNUP
        // =========================

        const result = await signup({
          name,
          email,
          password,
        });

        console.log(
          "Signup successful:",
          result
        );

        setSuccess(
          "Account created successfully. Please log in."
        );

        // Switch to login
        setMode("login");

        // Keep email so user doesn't have to type it again
        setPassword("");
        setName("");
      }

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-10">

      <div className="auth-card mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col overflow-hidden border border-border sm:min-h-[calc(100vh-4rem)] lg:flex-row">

        {/* =====================================
            LEFT SIDE
        ====================================== */}

        <section className="auth-panel relative flex min-h-[280px] flex-1 flex-col justify-between overflow-hidden p-7 text-white sm:p-10 lg:min-h-0 lg:p-14">

          {/* Logo */}

          <div className="relative z-10 flex items-center gap-3 text-sm font-semibold tracking-tight">

            <span className="flex size-9 items-center justify-center rounded-full bg-white text-primary">

              <Sparkles
                className="size-4"
                aria-hidden="true"
              />

            </span>

            lumen

          </div>


          {/* Main message */}

          <div className="relative z-10 mt-10 max-w-md lg:mt-0">

            <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-white/60">
              A quieter way forward
            </p>

            <h1 className="max-w-lg text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Make room for what matters.
            </h1>

            <p className="mt-6 max-w-sm text-pretty text-sm leading-6 text-white/70 sm:text-base">
              Your focused workspace for securely
              storing and managing your files.
            </p>

            <ul className="mt-8 grid gap-3 text-sm text-white/80 sm:grid-cols-3 lg:grid-cols-1">

              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2"
                >
                  <Check
                    className="size-4 text-white"
                    aria-hidden="true"
                  />

                  {benefit}
                </li>
              ))}

            </ul>

          </div>


          {/* Footer */}

          <div className="relative z-10 mt-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 lg:mt-0">

            <span>
              Built for clarity
            </span>

            <span>
              01 / 02
            </span>

          </div>


          {/* Decorations */}

          <div
            className="auth-grid absolute inset-0 opacity-20"
            aria-hidden="true"
          />

          <div
            className="auth-orbit absolute -bottom-28 -right-24 size-72 rounded-full border border-white/20 sm:size-96"
            aria-hidden="true"
          />

        </section>


        {/* =====================================
            RIGHT SIDE
        ====================================== */}

        <section className="flex w-full flex-1 items-center bg-background p-6 sm:p-10 lg:max-w-[520px] lg:p-14">

          <div className="w-full">

            {/* Heading */}

            <div className="mb-9">

              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Welcome to lumen
              </p>

              <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                {isLogin
                  ? "Good to see you."
                  : "Start with clarity."}
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {isLogin
                  ? "Sign in to pick up where you left off."
                  : "Create your account and find your flow."}
              </p>

            </div>


            {/* Login / Signup */}

            <div
              className="mb-8 grid grid-cols-2 border-b border-border"
              role="tablist"
              aria-label="Authentication mode"
            >

              {(["login", "signup"] as const).map(
                (tab) => (

                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={
                      mode === tab
                    }
                    onClick={() => {
                      setMode(tab);
                      setError("");
                      setSuccess("");
                    }}
                    className={`relative pb-3 text-left text-sm font-medium transition-colors ${
                      mode === tab
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >

                    {tab === "login"
                      ? "Log in"
                      : "Sign up"}

                    {mode === tab && (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" />
                    )}

                  </button>

                )
              )}

            </div>


            {/* FORM */}

            <form
              className="space-y-5"
              onSubmit={handleSubmit}
            >

              {/* Name */}

              {!isLogin && (
                <div className="space-y-2">

                  <label
                    htmlFor="name"
                    className="text-sm font-medium"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Alex Morgan"
                    className="auth-input"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>
              )}


              {/* Email */}

              <div className="space-y-2">

                <label
                  htmlFor="email"
                  className="text-sm font-medium"
                >
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    className="auth-icon"
                    aria-hidden="true"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className="auth-input pl-12"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                  />

                </div>

              </div>


              {/* Password */}

              <div className="space-y-2">

                <div className="flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-sm font-medium"
                  >
                    Password
                  </label>

                  {isLogin && (
                    <button
                      type="button"
                      className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}

                </div>


                <div className="relative">

                  <LockKeyhole
                    className="auth-icon"
                    aria-hidden="true"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete={
                      isLogin
                        ? "current-password"
                        : "new-password"
                    }
                    required
                    placeholder="••••••••••••"
                    className="auth-input px-12"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (visible) =>
                          !visible
                      )
                    }
                    className="auth-password-toggle"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (
                      <EyeOff
                        className="size-4"
                        aria-hidden="true"
                      />
                    ) : (
                      <Eye
                        className="size-4"
                        aria-hidden="true"
                      />
                    )}

                  </button>

                </div>

              </div>


              {/* Error */}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}


              {/* Success */}

              {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                  {success}
                </div>
              )}


              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="auth-button group flex w-full items-center justify-center gap-2"
              >

                {loading
                  ? isLogin
                    ? "Signing in..."
                    : "Creating account..."
                  : isLogin
                    ? "Continue to workspace"
                    : "Create your account"}

                {!loading && (
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                )}

              </button>

            </form>


            {/* Terms */}

            <p className="mt-8 text-center text-xs leading-5 text-muted-foreground">

              By continuing, you agree to our{" "}

              <a
                href="#terms"
                className="text-foreground underline underline-offset-4"
              >
                Terms
              </a>

              {" "}and{" "}

              <a
                href="#privacy"
                className="text-foreground underline underline-offset-4"
              >
                Privacy Policy
              </a>

              .

            </p>

          </div>

        </section>

      </div>

    </main>
  );
}


