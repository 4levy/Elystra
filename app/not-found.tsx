import React from "react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center z-10">
      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Page Not Found</p>
        <a href="/" className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">Go Home</a>
      </div>
    </div>
  );
}
