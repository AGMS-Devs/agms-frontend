"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: { receiverId: string; body: string; file?: File }) => void;
}

export default function MessageModal({ isOpen, onClose, onSend }: Props) {
  const [receiverId, setReceiverId] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [error, setError] = useState("");

  const resetState = () => {
    setReceiverId("");
    setBody("");
    setFile(null);
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("File format not supported");
      return;
    }

    if (selectedFile.size > maxSize) {
      setError("File size not supported");
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleSend = () => {
    if (!receiverId || !body) {
      setError("Please fill all fields.");
      return;
    }

    // Eğer bir dosya varsa ve hata varsa → gönderme
    if (error) {
      return; // ❌ dosya hatası varsa mesaj gönderme
    }

    onSend({ receiverId, body, file: file || undefined });
    resetState();
    onClose();
  };

  const handleCancel = () => {
    setShowDraftPrompt(true); // Show draft/discard modal
  };

  const confirmDiscard = () => {
    resetState();
    setShowDraftPrompt(false);
    onClose();
  };

  const saveAsDraft = () => {
    console.log("Saving draft: ", { receiverId, body, file });
    setShowDraftPrompt(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="space-y-4">
          <DialogHeader>Send Message</DialogHeader>

          <div>
            <Input
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              placeholder="Student ID"
            />
          </div>

          <div>
            <Label>Message</Label>
            <textarea
              className="w-full border rounded p-2 text-sm"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div>
            <Label>Attachment (optional)</Label>
            <Input type="file" onChange={handleFileChange} />
            {file && (
              <p className="text-xs text-gray-500">Selected: {file.name}</p>
            )}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-sm"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-1 rounded bg-blue-600 text-white text-sm"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Draft/Discard Modal */}
      <Dialog open={showDraftPrompt} onOpenChange={setShowDraftPrompt}>
        <DialogContent className="text-center space-y-4">
          <DialogHeader>Do you want to save this message?</DialogHeader>
          <div className="flex justify-center gap-4">
            <button
              onClick={saveAsDraft}
              className="px-4 py-1 bg-yellow-400 rounded text-sm"
            >
              Save as Draft
            </button>
            <button
              onClick={confirmDiscard}
              className="px-4 py-1 bg-red-500 text-white rounded text-sm"
            >
              Discard
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
