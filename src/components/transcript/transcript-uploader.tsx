"use client";

import { useState } from "react";

interface Props {
  onResult: (data: any) => void; // ✅ Veriyi üst bileşene ilet
}

export default function TranscriptUploader({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("transcript", file);

    try {
      const res = await fetch("http://localhost:5000/api/analyze-transcript", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      onResult(json); // ✅ analiz verisini parent’a gönder
    } catch (err) {
      alert("An error occurred while uploading.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded bg-white shadow">
      <label className="block text-sm font-medium text-gray-700">
        Upload Transcript (.pdf)
      </label>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="border px-2 py-1 w-full"
      />
      <button
        onClick={handleUpload}
        disabled={isUploading || !file}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
