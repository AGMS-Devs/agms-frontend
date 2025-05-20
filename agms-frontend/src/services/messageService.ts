// Basit örnek: student ID ile mesajları al
export async function fetchInboxMessages(studentId: string) {
  const res = await fetch(`/api/messages?receiverId=${studentId}`);
  if (!res.ok) throw new Error("Error fetching inbox");
  return res.json();
}
