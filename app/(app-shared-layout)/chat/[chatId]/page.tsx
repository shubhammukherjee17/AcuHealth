import Chat from "@/components/Chat";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dynamic = "force-dynamic";

export default function ChatPage({ params }: { params: { chatId: string } }) {
  return <Chat chatId={params.chatId} />;
}
