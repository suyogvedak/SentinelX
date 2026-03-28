"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";

/**
 * Navbar rules:
 * - Admin Login (/admin) → no navbar
 * - Admin routes (/admin/*) → Admin Navbar
 * - User routes → User Navbar
 * - ONE Logout button, different logic based on route
 */
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin";

  /* ================= NO NAVBAR ================= */
  if (isAdminLogin) {
    return null;
  }

  /* ================= LOGOUT HANDLER ================= */
  const handleLogout = async () => {
    // ADMIN logout
    if (isAdminRoute) {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin");
      return;
    }

    // USER logout
    await signOut(auth);
    router.push("/");
  };

  /* ================= ADMIN NAVBAR ================= */
  if (isAdminRoute) {
    return (
      <nav className="w-full border-b border-white/10 bg-black/80 backdrop-blur px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Admin Logo */}
          <Link
            href="/admin/dashboard"
            className="text-xl font-bold text-red-500"
          >
            SentinelX <span className="text-white">Admin</span>
          </Link>

          {/* Admin Links */}
          <div className="flex items-center gap-4 text-sm">
            <Link href="/admin/dashboard" className="hover:text-red-400">
              Dashboard
            </Link>

            <Link href="/admin/sos" className="hover:text-red-400">
              SOS Monitor
            </Link>

            <Link href="/admin/map" className="hover:text-red-400">
              Live Map
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/10 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }

  /* ================= USER NAVBAR ================= */
  return (
    <nav className="w-full border-b border-white/10 bg-black/80 backdrop-blur px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* User Logo */}
        <Link href="/" className="text-xl font-bold text-white">
          Sentinel<span className="text-red-500">X</span>
        </Link>

        {/* User Links */}
        <div className="flex items-center gap-4 text-sm">
          <Link href="/main" className="hover:text-red-400">
            Home
          </Link>

          <Link href="/map" className="hover:text-red-400">
            Live Map
          </Link>

          <Link href="/helpline" className="hover:text-red-400">
            Helpline
          </Link>

          {!user ? (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10"
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
