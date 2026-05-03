"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="p-8 border border-white/10 rounded-xl w-80">
        <h1 className="text-2xl mb-4">Admin Login</h1>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <input
          className="w-full mb-3 p-2 bg-black border border-white/20 rounded"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-2 bg-black border border-white/20 rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-red-500 py-2 rounded"
        >
          Login
        </button>
      </div>
    </main>
  );
}
