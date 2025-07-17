/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Bot, Eye, MessageSquare, LogOut, User, Trash } from "lucide-react";
import Link from "next/link";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  {
    title: "AI Assistant",
    url: "/chat",
    icon: Bot,
  },
  {
    title: "Vision AI",
    url: "/vision-ai",
    icon: Eye,
  },
];

export function AppSidebar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const { user, logOut } = useAuth();
  const [chats, setChats] = useState<Array<{ id: string; title: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChats() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const chatsRef = collection(db, "chathistory");
        const q = query(chatsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedChats = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || "Untitled Chat",
        }));
        setChats(fetchedChats);
      } catch (err) {
        setError("Failed to load chats. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchChats();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      // handle error
    }
  };

  if (!user) return null;

  return (
    <aside className={`hidden md:flex h-screen w-72 flex-col justify-between bg-black/80 backdrop-blur-2xl shadow-2xl rounded-r-3xl px-3 md:px-5 py-4 md:py-6 ${className}`}>
      {/* Logo */}
      <div>
        <div className="flex flex-col items-start mb-8 mt-2">
          <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 via-teal-400 to-purple-400 bg-clip-text text-transparent tracking-tight select-none">
            AcuHealth
          </span>
        </div>
        {/* Navigation */}
        <nav className="flex flex-col gap-5 mb-8">
          {navItems.map((item) => (
            <button
              key={item.title}
              onClick={() => router.push(item.url)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#181b20] shadow text-gray-100 font-semibold text-base transition-all duration-200 hover:bg-[#23262b] focus:bg-[#23262b] focus:outline-none"
            >
              <item.icon className="w-5 h-5 text-gray-300" />
              <span className="font-semibold">{item.title}</span>
            </button>
          ))}
        </nav>
        {/* Chats Section */}
        <div className="mt-6">
          <div className="px-1 pb-2 text-xs font-bold bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent uppercase tracking-widest">
            Your Chats
          </div>
          <div className="flex flex-col gap-3 mt-2">
            {isLoading ? (
              <div className="px-4 py-3 rounded-2xl bg-[#181b20] text-gray-400 font-medium shadow">Loading chats...</div>
            ) : error ? (
              <div className="px-4 py-3 rounded-2xl bg-[#181b20] text-red-400 font-medium shadow">{error}</div>
            ) : chats.length === 0 ? (
              <div className="px-4 py-3 rounded-2xl bg-[#181b20] text-gray-400 font-medium shadow">No chats found</div>
            ) : (
              chats.map((chat) => (
                <div key={chat.id} className="relative group">
                  <Link
                    href={`/chat/${chat.id}`}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#181b20] text-gray-100 font-medium shadow hover:bg-[#23262b] transition-all duration-200"
                  >
                    <MessageSquare className="w-5 h-5 text-gray-300" />
                    <span className="truncate flex-1">{chat.title}</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        await deleteDoc(doc(db, "chathistory", chat.id));
                        setChats((prevChats) => prevChats.filter((c) => c.id !== chat.id));
                      } catch (err) {
                        setError("Failed to delete chat. Please try again.");
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all duration-200"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Footer/User Info */}
      <footer className="border-t border-[#23262b] bg-[#181b20] mt-6 px-3 py-4 rounded-2xl shadow flex items-center gap-3">
        <Avatar className="ring-2 ring-blue-500/40 shadow-md flex-shrink-0">
          <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName || 'User'} />
          <AvatarFallback className="bg-gray-800">
            <User className="w-6 h-6 text-gray-400" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-gray-100 truncate">{user.displayName || user.email}</p>
          <a href={`mailto:${user.email}`} className="text-xs text-blue-300 hover:underline transition-colors truncate block">{user.email}</a>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-400 transition-colors duration-200 flex-shrink-0"
        >
          <LogOut className="w-6 h-6" />
        </Button>
      </footer>
    </aside>
  );
}