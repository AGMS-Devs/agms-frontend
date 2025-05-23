// 📄 src/app/api/messages/route.ts

import { NextRequest, NextResponse } from "next/server";

let messages = [
  {
    id: "1",
    senderId: "advisor001",
    receiverId: "student123",
    body: "Welcome to AGMS!",
    status: "unread",
    createdAt: new Date().toISOString(),
    attachments: [],
  },
];

export async function GET(req: NextRequest) {
  const receiverId = req.nextUrl.searchParams.get("receiverId");
  if (!receiverId) {
    return NextResponse.json({ error: "Missing receiverId" }, { status: 400 });
  }
  const inbox = messages.filter((m) => m.receiverId === receiverId);
  return NextResponse.json(inbox);
}
