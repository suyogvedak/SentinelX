"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { animate } from "animejs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SignupPage() {
  const { signup, googleLogin } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    animate(".auth-input", {
      scale: [0.95, 1],
      opacity: [0, 1],
      delay: (_el, i) => i * 120,
      easing: "easeOutExpo",
    });
  }, []);

  const successTransition = () => {
    animate(".auth-card", {
      scale: [1, 1.05, 1],
      duration: 700,
      easing: "easeOutExpo",
      complete: () => router.push("/main"),
    });
  };

  const handleSignup = async () => {
    try {
      await signup(email, password);
      successTransition();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-card w-[360px] rounded-2xl bg-white/10 p-8 backdrop-blur-xl border border-white/20 shadow-2xl">
      <h1 className="text-2xl font-bold text-white mb-4">
        Create User Account
      </h1>

      {/* Google Signup */}
      <button
        onClick={async () => {
          await googleLogin();
          successTransition();
        }}
        className="mb-4 w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg"
      >
        <img src="/google.svg" className="h-5" />
        Continue with Google
      </button>

      <input
        className="auth-input w-full mb-3 rounded-lg bg-white/10 px-4 py-3 text-white"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="auth-input w-full mb-4 rounded-lg bg-white/10 px-4 py-3 text-white"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSignup}
        className="w-full bg-red-500 py-3 rounded-lg text-white font-semibold"
      >
        Sign Up
      </button>

      <p className="mt-4 text-center text-white/60 text-sm">
        Already a user?{" "}
        <Link href="/auth/login" className="text-red-400">
          Login
        </Link>
      </p>
    </div>
  );
}
