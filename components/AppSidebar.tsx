/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Bot, Eye, MessageSquare, LogOut, User, Trash } from "lucide-react";
import Link from "next/link";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Static menu items
const staticItems = [
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

export function AppSidebar() {
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
        console.error("Error fetching chats:", err);
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
      console.error("Failed to log out", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Sidebar className="bg-gray-900 border-r border-gray-800/40">
      <SidebarContent className="bg-black">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-500 via-blue-500 to-teal-500 bg-clip-text text-transparent">
              AcuHealth
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="p-3 space-y-2.5">
              {staticItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Button 
                      onClick={() => router.push(item.url)} 
                      className="w-full py-3 px-4 flex items-center gap-3 bg-gray-800/40 hover:bg-gray-700/60 text-gray-300 hover:text-white transition-all duration-300 rounded-xl backdrop-blur-sm"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-3 text-sm font-medium text-gray-400 uppercase tracking-wider">
            Your Chats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="p-3 space-y-2">
              {isLoading ? (
                <SidebarMenuItem>
                  <div className="text-sm text-gray-400 px-4 py-3 bg-gray-800/40 rounded-xl backdrop-blur-sm">Loading chats...</div>
                </SidebarMenuItem>
              ) : error ? (
                <SidebarMenuItem>
                  <div className="text-sm text-red-400 px-4 py-3 bg-gray-800/40 rounded-xl backdrop-blur-sm">{error}</div>
                </SidebarMenuItem>
              ) : chats.length === 0 ? (
                <SidebarMenuItem>
                  <div className="text-sm text-gray-400 px-4 py-3 bg-gray-800/40 rounded-xl backdrop-blur-sm">No chats found</div>
                </SidebarMenuItem>
              ) : (
                chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton asChild>
                      <Link 
                        href={`/chat/${chat.id}`} 
                        className="w-full py-2.5 px-4 flex items-center gap-3 bg-gray-800/40 rounded-xl hover:bg-gray-700/60 text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm group"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-medium truncate flex-1">{chat.title}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={async (e) => {
                            e.preventDefault();
                            try {
                              await deleteDoc(doc(db, "chathistory", chat.id));
                              setChats((prevChats) => prevChats.filter((c) => c.id !== chat.id));
                            } catch (err) {
                              console.error("Error deleting chat:", err);
                              setError("Failed to delete chat. Please try again.");
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all duration-300"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-black bg-black backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="ring-2 ring-gray-700/50">
              <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName || "User"} />
              <AvatarFallback className="bg-gray-800">
                <User className="w-5 h-5 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-200">{user.displayName || user.email}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-400 transition-colors duration-300"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}