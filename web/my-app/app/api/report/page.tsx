"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import ReportForm from "../components/ReportForm";

export default function ReportPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/auth/login");
      } else {
        setUser(firebaseUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1220] text-white">
        Checking Authentication...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0B1220] text-white p-8">
      <h1 className="text-3xl font-bold mb-8">
        Submit Intelligence Report
      </h1>

      <ReportForm user={user} />
    </div>
  );
}
