"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  User,
  ChevronDown,
  Bot,
  Eye,
  FileText,
  Shield,
  Zap,
  Activity,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, googleSignIn, logOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-gray-100 font-sans">
      {/* Sticky, glassy navbar */}
      <header className="sticky top-0 z-30 backdrop-blur bg-gray-900/80 border-b border-gray-800 py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent tracking-tight drop-shadow-sm">AcuHealth</h1>
          <nav>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 bg-gray-800/80 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow hover:shadow-lg transition"
                >
                  <Image
                    src={user.photoURL || "https://via.placeholder.com/40"}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full border-2 border-blue-500"
                    width={40}
                    height={40}
                  />
                  <span className="font-semibold text-gray-100">{user.displayName}</span>
                  <ChevronDown size={20} />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 rounded-xl shadow-2xl py-2 ring-1 ring-blue-500/20 animate-fade-in">
                    <button
                      onClick={handleSignOut}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-600/80 hover:text-white w-full text-left rounded transition"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold py-2 px-6 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none select-none opacity-30 blur-2xl" aria-hidden>
            <div className="bg-gradient-to-tr from-blue-500/30 via-teal-400/20 to-purple-500/20 w-full h-full" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-500 via-teal-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
              Revolutionizing Healthcare with AI
            </h2>
            <p className="text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-medium">
              Empower your healthcare practice with cutting-edge AI technology for improved diagnostics, patient care, and operational efficiency.
            </p>
            <button
              onClick={user ? () => router.push("/chat") : handleSignIn}
              className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {user ? "Go to Dashboard" : "Get Started"}
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-900/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
              Our AI-Powered Features
            </h3>
            <div className="grid md:grid-cols-3 gap-10">
              {/* Feature Card 1 */}
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-blue-500/10 hover:scale-105 hover:shadow-blue-500/20 transition-transform group">
                <Bot className="text-blue-500 w-14 h-14 mb-5 group-hover:scale-110 transition-transform" />
                <h4 className="text-2xl font-semibold mb-2">AI Assistant</h4>
                <p className="text-gray-300 text-lg">
                  24/7 intelligent support for patients and healthcare providers, offering instant medical information and guidance.
                </p>
              </div>
              {/* Feature Card 2 */}
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-green-500/10 hover:scale-105 hover:shadow-green-500/20 transition-transform group">
                <Eye className="text-green-400 w-14 h-14 mb-5 group-hover:scale-110 transition-transform" />
                <h4 className="text-2xl font-semibold mb-2">Vision AI</h4>
                <p className="text-gray-300 text-lg">
                  Advanced image analysis for faster and more accurate diagnoses in radiology, dermatology, and more.
                </p>
              </div>
              {/* Feature Card 3 */}
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-yellow-500/10 hover:scale-105 hover:shadow-yellow-500/20 transition-transform group">
                <FileText className="text-yellow-400 w-14 h-14 mb-5 group-hover:scale-110 transition-transform" />
                <h4 className="text-2xl font-semibold mb-2">Document Scan</h4>
                <p className="text-gray-300 text-lg">
                  Effortlessly digitize and analyze medical records, prescriptions, and clinical notes with our intelligent scanning technology.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
              Why Choose AcuHealth?
            </h3>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="flex items-start space-x-5 bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow border border-blue-500/10">
                <Shield className="text-blue-500 w-10 h-10 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold mb-1">HIPAA Compliant</h4>
                  <p className="text-gray-300 text-base">
                    Your data is protected with state-of-the-art security measures, ensuring full compliance with healthcare regulations.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-5 bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow border border-yellow-500/10">
                <Zap className="text-yellow-400 w-10 h-10 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold mb-1">Lightning Fast</h4>
                  <p className="text-gray-300 text-base">
                    Get instant results and insights, allowing you to make quick, informed decisions for better patient care.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-5 bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow border border-green-500/10">
                <Activity className="text-green-400 w-10 h-10 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold mb-1">Improved Outcomes</h4>
                  <p className="text-gray-300 text-base">
                    Our AI-driven insights lead to better diagnoses, personalized treatment plans, and improved patient outcomes.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-5 bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow border border-purple-500/10">
                <User className="text-purple-400 w-10 h-10 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold mb-1">User-Friendly</h4>
                  <p className="text-gray-300 text-base">
                    Intuitive interface designed for healthcare professionals, ensuring a smooth integration into your existing workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Personalized Welcome Section */}
        {user && (
          <section className="py-20 bg-gradient-to-r from-blue-900/80 via-gray-900/80 to-teal-900/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 text-center">
              <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
                Welcome back, {user.displayName}!
              </h3>
              <p className="text-2xl text-gray-200 mb-10 font-medium">
                Ready to revolutionize your healthcare practice? Explore your personalized dashboard and start using our AI-powered tools today.
              </p>
              <button
                onClick={() => router.push("/chat")}
                className="bg-gradient-to-r from-teal-600 to-blue-500 hover:from-teal-700 hover:to-blue-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Go to Dashboard
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-gray-800 py-8 mt-auto bg-gray-950/90 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">&copy; 2026 AcuHealth. All rights reserved.</p>
            <div className="flex space-x-6 items-center">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
