"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  user: any;
}

const steps = [
  "Basic Info",
  "Location",
  "Classification",
  "Impact",
  "Media",
  "Review"
];

export default function ReportForm({ user }: Props) {

  const router = useRouter();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [form, setForm] = useState<any>({
    reportId: "",
    phone: "",
    role: "",
    location: null,
    address: "",
    category: "",
    severity: "",
    description: "",
    file: null,
  });

  const [status, setStatus] = useState("");
  const totalSteps = steps.length;

  useEffect(() => {
    setForm((prev: any) => ({
      ...prev,
      reportId: "SX-" + crypto.randomUUID(),
    }));
  }, []);

  // ✅ COOLDOWN INIT
  useEffect(() => {
    const last = localStorage.getItem("lastReportTime");

    if (last) {
      const diff = Math.floor((Date.now() - Number(last)) / 1000);
      if (diff < 60) {
        setCooldown(60 - diff);
      }
    }
  }, []);

  // ✅ COOLDOWN TIMER
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // 🔹 Update helper
  const update = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  // 🔹 Save Draft
  const saveDraft = async () => {
    await fetch("/api/draft/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.uid,
        reportId: form.reportId,
        data: form,
      }),
    });
  };

 const uploadFileToBackend = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Upload error:", data);
    throw new Error("Upload failed");
  }

  return data;
};



  // 🔹 Submit
  const handleSubmit = async () => {
  if (loading || cooldown > 0) return;

  setLoading(true);

  try {
    let fileUrl = "";
    let publicId = "";

    // ✅ Upload first
    if (form.file) {
  setUploading(true);

  const uploadRes = await uploadFileToBackend(form.file);

  fileUrl = uploadRes.secure_url;
  publicId = uploadRes.public_id;

  setUploading(false);
}


    const finalReport = {
      reportId: form.reportId,
      userId: user.uid,
      phone: form.phone,
      role: form.role,
      location: form.location,
      address: form.address,
      category: form.category,
      severity: form.severity,
      description: form.description,
      fileUrl,
      publicId,
    };

    // ✅ SEND TO BACKEND (NO AI WAIT)
    const res = await fetch("/api/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalReport),
    });

    if (res.ok) {
      setStatus("SUBMITTED");

      localStorage.setItem("lastReportTime", Date.now().toString());
      setCooldown(60);

      // ✅ Redirect immediately
      setTimeout(() => {
        router.push("/reports");
      }, 1000);
    }

  } catch (err) {
    console.error(err);
  }

  setLoading(false);
};


  // 🔹 Validation
  const isValid = () => {
    switch (step) {
      case 0:
        return form.phone && form.role;
      case 1:
        return form.location || form.address;
      case 2:
        return form.category;
      case 3:
        return form.severity;
      case 5:
        return form.description;
      default:
        return true;
    }
  };

  // 🔹 Capture location
  const captureLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      update("location", {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  };

  return (
    <div className="max-w-5xl mx-auto bg-[#0B1220] text-white p-10 rounded-xl border border-gray-700">

      <h1 className="text-3xl font-bold mb-6">
        Incident Intelligence Report
      </h1>

      <div className="flex justify-between mb-10">
        {steps.map((label, i) => (
          <div key={i} className="flex-1 text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 text-sm
              ${i <= step ? "bg-red-600" : "bg-gray-600"}`}
            >
              {i + 1}
            </div>
            <p className="text-xs">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#111827] p-6 rounded-lg border border-gray-700 space-y-5">

        {step === 0 && (
          <>
            <h2 className="text-xl font-semibold">Reporter Details</h2>
            <p>User: {user.email}</p>
            <p>Report ID: {form.reportId}</p>

            <input
              placeholder="Phone Number *"
              className="w-full p-3 bg-[#1F2937] rounded"
              onChange={(e) => update("phone", e.target.value)}
            />

            <select
              className="w-full p-3 bg-[#1F2937] rounded"
              onChange={(e) => update("role", e.target.value)}
            >
              <option value="">Select Role *</option>
              <option>Citizen</option>
              <option>Journalist</option>
              <option>Authority</option>
            </select>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold">Location Details</h2>

            <button
              onClick={captureLocation}
              className="bg-blue-600 px-4 py-2 rounded"
            >
              Capture GPS
            </button>

            <input
              placeholder="Address"
              className="w-full p-3 bg-[#1F2937] rounded"
              onChange={(e) => update("address", e.target.value)}
            />
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold">Incident Type</h2>

            <select
              className="w-full p-3 bg-[#1F2937] rounded"
              onChange={(e) => update("category", e.target.value)}
            >
              <option value="">Select Category *</option>
              <option>Natural Disaster</option>
              <option>Man-Made Disaster</option>
            </select>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold">Impact Assessment</h2>

            <select
              className="w-full p-3 bg-[#1F2937] rounded"
              onChange={(e) => update("severity", e.target.value)}
            >
              <option value="">Select Severity *</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-xl font-semibold">Evidence Upload</h2>

            <input
              type="file"
              accept="image/*,video/*"
              className="w-full p-3 bg-[#1F2937] rounded"
              onChange={(e) =>
                update("file", e.target.files?.[0] || null)
              }
            />

            {uploading && (
              <p className="text-yellow-400 mt-2">
                Uploading media...
              </p>
            )}
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="text-xl font-semibold">Final Description</h2>

            <textarea
              placeholder="Describe incident *"
              className="w-full p-3 bg-[#1F2937] rounded"
              onChange={(e) => update("description", e.target.value)}
            />
          </>
        )}

      </div>

      <div className="flex justify-between mt-8">

        {step > 0 && status !== "SUBMITTED" && (
          <button
            onClick={() => setStep(step - 1)}
            className="bg-gray-600 px-6 py-2 rounded"
          >
            Back
          </button>
        )}

        {step < totalSteps - 1 ? (
          <button
            onClick={async () => {
              await saveDraft();
              setStep(step + 1);
            }}
            disabled={!isValid()}
            className="bg-red-600 px-6 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading || cooldown > 0}
            className="bg-green-600 px-6 py-2 rounded"
          >
            {loading
              ? "Submitting..."
              : cooldown > 0
              ? `Wait ${cooldown}s`
              : "Submit Report"}
          </button>
        )}

      </div>

      {status === "SUBMITTED" && (
        <div className="bg-green-700 p-4 mt-4 rounded">
          Report Submitted Successfully
        </div>
      )}
    </div>
  );
}
