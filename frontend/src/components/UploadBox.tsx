import React, { useState } from "react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import WaveformPlayer from "./WaveformPlayer"

interface StemResult {
  vocals: string
  drums?: string
  bass?: string
  other?: string
  bpm?: number
}

const BASE_URL = "http://127.0.0.1:8000" // backend URL

export default function UploadBox() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resultStems, setResultStems] = useState<StemResult | null>(null)
  const [stemMode, setStemMode] = useState<"2stems" | "4stems">("4stems")
  const [dragOver, setDragOver] = useState(false)

  /* --- File selection --- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    setFile(f)
    if (f) setPreviewUrl(URL.createObjectURL(f))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0] || null
    setFile(f)
    if (f) setPreviewUrl(URL.createObjectURL(f))
  }

  /* --- Download helper --- */
  const downloadFile = async (url: string, filename: string) => {
    const res = await fetch(url)
    const blob = await res.blob()
    const link = document.createElement("a")
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /* --- Upload & Process --- */
  const handleUpload = async () => {
    if (!file) return toast.error("🎵 Please select an audio file!")
    setProcessing(true)
    setProgress(0)
    setResultStems(null)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("mode", stemMode)

    try {
      const res = await axios.post(`${BASE_URL}/separate`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) =>
          setProgress(Math.round((e.loaded * 100) / (e.total || 1))),
      })

      const data = res.data
      const stems: StemResult = {
        vocals: `${BASE_URL}${data.vocals}`,
        drums: data.drums ? `${BASE_URL}${data.drums}` : undefined,
        bass: data.bass ? `${BASE_URL}${data.bass}` : undefined,
        other: data.other ? `${BASE_URL}${data.other}` : undefined,
        bpm: data.bpm,
      }

      setResultStems(stems)
      toast.success(
        `✅ ${stemMode === "2stems" ? "2-Stem" : "4-Stem"} Separation Complete!`
      )
    } catch (err) {
      console.error(err)
      toast.error("❌ Upload or processing failed")
    } finally {
      setProcessing(false)
    }
  }

  /* --- Stem Card --- */
  const StemCard = ({
    title,
    audio,
    downloadName,
  }: {
    title: string
    audio: string
    downloadName: string
  }) => (
    <div className="bg-white/50 dark:bg-gray-800/60 rounded-xl p-4 shadow-md backdrop-blur-md">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 text-center">
        {title}
      </h3>
      <WaveformPlayer audioUrl={audio} />
      <button
        onClick={() => downloadFile(audio, downloadName)}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        ⬇ Download
      </button>
    </div>
  )

  return (
    <div className="max-w-3xl w-full mx-auto p-4 sm:p-8">
      <Toaster />
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-10 border border-white/20 text-gray-900 dark:text-gray-100 relative overflow-hidden">
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl pointer-events-none" />

        <h1 className="relative text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-800 dark:text-white">
          🎧 Audio Stem Splitter
        </h1>

        {/* Stem Mode */}
        <div className="flex justify-center mb-6 gap-4">
          <button
            className={`px-6 py-2 rounded-xl font-semibold ${
              stemMode === "2stems" ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setStemMode("2stems")}
          >
            2 Stems
          </button>
          <button
            className={`px-6 py-2 rounded-xl font-semibold ${
              stemMode === "4stems" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setStemMode("4stems")}
          >
            4 Stems
          </button>
        </div>

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
            {file ? `🎵 Selected: ${file.name}` : "Drag & drop your song or click to upload"}
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
              : "bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-300"
          }`}
        >
          {processing ? "Processing..." : "Process Audio"}
        </button>

        {/* Progress */}
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

            {/* Stem Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StemCard title="🎤 Vocals" audio={resultStems.vocals} downloadName="vocals.wav" />
              {stemMode === "4stems" && resultStems.drums && (
                <StemCard title="🥁 Drums" audio={resultStems.drums} downloadName="drums.wav" />
              )}
              {stemMode === "4stems" && resultStems.bass && (
                <StemCard title="🎸 Bass" audio={resultStems.bass} downloadName="bass.wav" />
              )}
              {stemMode === "4stems" && resultStems.other && (
                <StemCard title="🎧 Other" audio={resultStems.other} downloadName="other.wav" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}