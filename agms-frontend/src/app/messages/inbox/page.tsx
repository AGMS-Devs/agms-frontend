// 📄 src/app/messages/inbox/page.tsx

"use client";

import { useEffect, useState } from "react";
import { fetchInboxMessages } from "@/services/messageService";
import { authService } from "@/services/auth.service";

export default function InboxPage() {
  const user = authService.getCurrentUser();
  const studentId = user?.id;
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!studentId) return;
    fetchInboxMessages(studentId).then(setMessages);
  }, [studentId]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Inbox</h2>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li key={msg.id} className="border p-3 rounded bg-white shadow-sm">
              <p className="text-sm font-medium">From: {msg.senderId}</p>
              <p className="text-gray-700">{msg.body}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
