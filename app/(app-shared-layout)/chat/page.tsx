import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
export default function ChatPage() {
  const chatId = uuidv4();
  return redirect(`/chat/${chatId}`);
}
