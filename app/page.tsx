"use client";
import { GridBackground } from "@/components/GridBackground";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, googleSignIn, logOut } = useAuth();

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <GridBackground className="flex flex-col gap-6 items-center justify-center">
        page - {user?.displayName ?? "Guest"}
        <button
          className="px-6 py-4 font-bold text-xl bg-blue-700 rounded-md"
          onClick={handleSignIn}
        >
          Sign In
        </button>
        <button
          className="px-6 py-4 font-bold text-xl bg-blue-700 rounded-md"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </GridBackground>
    </div>
  );
}
