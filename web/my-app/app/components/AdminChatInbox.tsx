"use client";
import { useEffect, useState } from "react";

export default function AdminChatInbox() {
  const [sessions, setSessions] = useState<any[]>([]);

  const load = async () => {
    const res = await fetch("/api/admin/chat");
    setSessions(await res.json());
  };

  useEffect(() => {
    load();
    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl mb-4">💬 Chat Inbox</h1>

      {sessions.map((s) => (
        <div
          key={s.sessionId}
          className={`p-4 mb-3 rounded border ${
            s.isEmergency
              ? "border-red-500 bg-red-500/10"
              : "border-gray-600"
          }`}
        >
          <div className="font-semibold">
            Session: {s.sessionId.slice(0, 8)}
          </div>
          <div className="text-sm text-gray-300">
            {s.lastMessage}
          </div>

          {s.isEmergency && (
            <span className="text-xs text-red-400">
              🚨 Emergency flagged
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
