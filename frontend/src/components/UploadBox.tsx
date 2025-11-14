import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import WaveformPlayer from "./WaveformPlayer";

interface StemResult {
  vocals: string;
  instrumental: string;
  bpm?: number;
}

export default function UploadBox() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultStems, setResultStems] = useState<StemResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) setPreviewUrl(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return toast.error("🎵 Please select an audio file first!");
    setProcessing(true);
    setProgress(0);
    setResultStems(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/separate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) =>
          setProgress(Math.round((e.loaded * 100) / (e.total || 1))),
      });

      const stems: StemResult = {
        vocals: `http://127.0.0.1:8000${res.data.vocals}`,
        instrumental: `http://127.0.0.1:8000${res.data.instrumental}`,
        bpm: res.data.bpm,
      };

      setResultStems(stems);
      toast.success("✅ Separation complete!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload or processing failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0] || null;
    setFile(f);
    if (f) setPreviewUrl(URL.createObjectURL(f));
  };

  return (
    <div className="max-w-3xl w-full mx-auto p-4 sm:p-8">
      <Toaster />

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-10 border border-white/20 text-gray-900 dark:text-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl pointer-events-none" />

        <h1 className="relative text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-800 dark:text-white">
          🎧 Vocal & Instrumental Remover 
        </h1>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 mb-6 text-center cursor-pointer transition-all duration-300 ${
            dragOver
              ? "border-blue-500 bg-blue-50/50 scale-105"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50/30"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="audio/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          <p className="text-gray-600 text-lg">
            {file
              ? `🎵 Selected: ${file.name}`
              : "Drag & drop your song or click to upload"}
          </p>
        </div>

        {/* Preview Waveform */}
        {previewUrl && (
          <div className="mb-6">
            <WaveformPlayer audioUrl={previewUrl} />
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={processing}
          className={`w-full py-4 text-white rounded-xl font-semibold mb-6 text-lg shadow-lg ${
            processing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-300"
          }`}
        >
          {processing ? "Processing..." : "Upload & Extract"}
        </button>

        {/* Progress Bar */}
        {processing && (
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-6">
            <div
              className="bg-blue-600 h-3 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Results */}
        {resultStems && (
          <div className="relative mt-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
              🎶 Separated Stems
            </h2>

            {/* BPM Display */}
            {resultStems.bpm && (
              <div className="flex flex-col items-center mb-8">
                <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-2xl animate-pulse shadow-lg">
                  {resultStems.bpm} <span className="text-sm ml-1">BPM</span>
                </div>
                <p className="mt-3 text-gray-700 dark:text-gray-300 font-semibold">
                  Detected Tempo
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Vocals */}
              <div className="bg-white/50 dark:bg-gray-800/60 rounded-xl p-4 shadow-md backdrop-blur-md">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">
                  🎤 Vocals
                </h3>
                <WaveformPlayer audioUrl={resultStems.vocals} />
                <a
                  href={resultStems.vocals}
                  download="vocals.wav"
                  className="mt-2 inline-block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Download Vocals
                </a>
              </div>

              {/* Instrumental */}
              <div className="bg-white/50 dark:bg-gray-800/60 rounded-xl p-4 shadow-md backdrop-blur-md">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">
                  🎹 Instrumental
                </h3>
                <WaveformPlayer audioUrl={resultStems.instrumental} />
                <a
                  href={resultStems.instrumental}
                  download="instrumental.wav"
                  className="mt-2 inline-block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Download Instrumental
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
