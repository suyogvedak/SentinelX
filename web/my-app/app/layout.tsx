import "./globals.css";
import Navbar from "./components/Navbar";
import ChatBot from "./components/ChatBot";
import { AuthProvider } from "./context/AuthContext";

export const metadata = {
  title: "SentinelX",
  description: "Smart Incident & Disaster Monitoring System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>

      <body className="min-h-screen bg-black-950 text-white">
        {/* ✅ AuthProvider MUST wrap everything that uses auth */}
        <AuthProvider>
          <Navbar />
          {children}
          <ChatBot />
        </AuthProvider>
      </body>
    </html>
  );
}
