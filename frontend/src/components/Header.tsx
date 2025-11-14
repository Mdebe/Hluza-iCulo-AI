import React from "react";

export default function Header() {
  return (
    <header className="w-full bg-white/20 backdrop-blur-md fixed top-0 left-0 z-20">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Hluza iCulo AI</h1>
        <nav className="space-x-4">
          <a href="#upload" className="text-white hover:text-blue-400 font-medium">Upload</a>
          <a href="#features" className="text-white hover:text-blue-400 font-medium">Features</a>
          <a href="#faq" className="text-white hover:text-blue-400 font-medium">FAQ</a>
        </nav>
      </div>
    </header>
  );
}
