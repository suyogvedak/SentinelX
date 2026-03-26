"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { animate } from "animejs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { login, googleLogin, resetPassword } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestGoogle, setSuggestGoogle] = useState(false);

  const isFormValid = email.includes("@") && password.length >= 6;

  // 🔹 Animate inputs
  useEffect(() => {
    animate(".auth-input", {
      translateX: [-20, 0],
      opacity: [0, 1],
      delay: (_el, i) => i * 120,
      easing: "easeOutQuad",
    });

    // 🔹 Restore last login method
    const lastMethod = localStorage.getItem("sentinelx-login-method");
    if (lastMethod === "google") {
      setSuggestGoogle(true);
    }
  }, []);

  const successTransition = () => {
    animate(".auth-card", {
      scale: [1, 1.05, 1],
      duration: 700,
      easing: "easeOutExpo",
      complete: () => router.push("/main"),
    });
  };

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    setSuggestGoogle(false);

    try {
      await login(email, password);
      localStorage.setItem("sentinelx-login-method", "password");
      successTransition();
    } catch (err: any) {
      const msg = err.message || "Login failed";

      // 🔹 If email exists but password login fails → suggest Google
      if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("google")) {
        setSuggestGoogle(true);
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      await googleLogin();
      localStorage.setItem("sentinelx-login-method", "google");
      successTransition();
    } catch {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    try {
      await resetPassword(email);
      setError("Password reset email sent. Check your inbox.");
    } catch (err: any) {
      setError(err.message || "Enter a valid email to reset password.");
    }
  };

  return (
    <div className="auth-card w-[360px] rounded-2xl bg-white/10 p-8 backdrop-blur-xl border border-white/20 shadow-2xl">
      <h1 className="text-2xl font-bold text-white mb-1">
        Welcome Back
      </h1>
      <p className="text-white/60 mb-6">
        User Login – SentinelX
      </p>

      {/* 🔐 Google Login */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="mb-4 w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg disabled:opacity-60"
      >
        <img src="/google.svg" className="h-5" />
        Continue with Google
      </button>

      {/* Email */}
      <input
        className="auth-input w-full mb-3 rounded-lg bg-white/10 px-4 py-3 text-white outline-none"
        placeholder="Email"
        onFocus={() => window.dispatchEvent(new Event("auth-focus"))}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password */}
      <input
        type="password"
        className="auth-input w-full mb-2 rounded-lg bg-white/10 px-4 py-3 text-white outline-none"
        placeholder="Password"
        onFocus={() => window.dispatchEvent(new Event("auth-focus"))}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Forgot Password */}
      <button
        type="button"
        onClick={handleForgotPassword}
        className="mb-3 text-sm text-red-400 hover:underline text-left"
      >
        Forgot password?
      </button>

      {/* Inline Error / Info */}
      {error && (
        <div className="mb-3 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Google Suggestion */}
      {suggestGoogle && (
        <div className="mb-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 px-3 py-2 text-sm text-yellow-300">
          This email may be linked to Google. Try logging in with Google.
        </div>
      )}

      {/* Login Button */}
      <button
        onClick={handleLogin}
        disabled={!isFormValid || loading}
        className="w-full bg-red-500 py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="mt-4 text-center text-white/60 text-sm">
        New user?{" "}
        <Link href="/auth/signup" className="text-red-400">
          Create account
        </Link>
      </p>
    </div>
  );
}
