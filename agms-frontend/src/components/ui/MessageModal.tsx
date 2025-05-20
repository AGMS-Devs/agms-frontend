"use client";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: {
    receiverId: string;
    body: string;
    file?: File | null;
  }) => void;
}

export default function MessageModal({ isOpen, onClose, onSend }: Props) {
  const [receiverId, setReceiverId] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[400px] space-y-4">
        <h2 className="text-xl font-semibold">Send Message</h2>

        <input
          placeholder="Student ID"
          className="w-full border px-3 py-2 rounded"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />

        <textarea
          placeholder="Your message..."
          className="w-full border px-3 py-2 rounded"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Attachment
          </label>

          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 cursor-pointer rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            📎 Choose File
            <span className="text-xs text-gray-500">
              {file ? file.name : "No file selected"}
            </span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept=".pdf,.jpg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={() => onSend({ receiverId, body, file })}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
