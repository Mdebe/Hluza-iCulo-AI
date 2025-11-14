import './App.css';
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UploadBox from "./components/UploadBox";
import FAQ from "./components/FAQ";

export default function App() {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }} // Replace with your image path
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Main content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 md:px-6 lg:px-12">
        <Header />

        <main className="flex flex-col items-center justify-center w-full text-white mt-24 md:mt-28">
          {/* Hero Section */}
          <section className="max-w-3xl text-center mb-12 px-2 md:px-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Extract Vocals & Instrumentals Instantly
            </h2>
            <p className="text-base sm:text-lg md:text-xl">
              Use our free AI vocal remover to separate vocals from MP3, WAV & video — no signup required.
            </p>
          </section>

          {/* Upload Section */}
          <section id="upload" className="w-full flex justify-center mb-12">
            <UploadBox />
          </section>

          {/* Features Section */}
          <section
            id="features"
            className="max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 w-full"
          >
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-xl text-center hover:scale-105 transition-transform duration-300">
              <h3 className="font-bold text-xl mb-2">Karaoke</h3>
              <p>Create perfect backing tracks using AI vocal remover.</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-xl text-center hover:scale-105 transition-transform duration-300">
              <h3 className="font-bold text-xl mb-2">Music Production</h3>
              <p>Extract clean vocals or instrumentals for remixing and production.</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-xl text-center hover:scale-105 transition-transform duration-300">
              <h3 className="font-bold text-xl mb-2">Learning & Content</h3>
              <p>Study songs or create background music for videos and podcasts.</p>
            </div>
          </section>

          {/* FAQ Section */}
         
        </main>

        <Footer />
      </div>
    </div>
  );
}
