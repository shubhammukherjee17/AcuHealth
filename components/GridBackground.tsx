import { cn } from "@/lib/utils";
import React from "react";

export function GridBackground({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-full min-h-screen bg-gray-900 bg-grid-white/[0.1] relative overflow-hidden",
        className
      )}
    >
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-gray-900 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      {/* Gradient blobs for dynamic background effect */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-violet-500/20 to-blue-500/20 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-teal-500/20 to-blue-500/20 blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
