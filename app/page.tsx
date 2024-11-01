'use client'

import { useAuth } from "@/context/AuthContext"
import { GridBackground } from "@/components/GridBackground"
import { useState } from "react"
import { ChevronDown, Bot, Eye, Book } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  const { user, googleSignIn, logOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignIn = async () => {
    try {
      await googleSignIn()
    } catch (error) {
      console.log(error)
    }
  }

  const handleSignOut = async () => {
    try {
      await logOut()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <GridBackground className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <header className="border-b border-gray-800 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">VitaeAI</h1>
          <nav>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 bg-gray-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Image
                    src={user.photoURL ?? "https://via.placeholder.com/40"}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full"
                    width={40}
                    height={40}
                  />
                  <span>{user.displayName}</span>
                  <ChevronDown size={20} />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
                    <button
                      onClick={handleSignOut}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Welcome to VitaeAI
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            The next-generation platform for health and wellness.
          </p>
          {!user && (
            <button
              onClick={handleSignIn}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Get Started
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <Bot className="text-blue-500 w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
            <p className="text-gray-400">
              Leverage the power of artificial intelligence to enhance your health and wellness journey.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <Eye className="text-yellow-500 w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Vision AI</h3>
            <p className="text-gray-400">
              Analyze and interpret medical images with cutting-edge computer vision technology.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <Book className="text-green-500 w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Document Analyzer</h3>
            <p className="text-gray-400">
              Extract and analyze health data from medical records and documents with ease.
            </p>
          </div>
        </div>

        {user && (
          <div className="mt-12 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Welcome back, {user.displayName}!</h3>
            <p className="text-gray-400 mb-4">
              Ready to continue your journey? Explore your dashboard or start a new chat.
            </p>
            <Link href={'/chat'} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500">
              Go to Dashboard
            </Link>
          </div>
        )}
      </main>
    </GridBackground>
  )
}