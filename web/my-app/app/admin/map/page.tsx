"use client";

import dynamic from "next/dynamic";

const AdminMapClient = dynamic(
  () => import("./MapClient"),
  { ssr: false }
);

export default function AdminMapPage() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <AdminMapClient />
    </div>
  );
}
