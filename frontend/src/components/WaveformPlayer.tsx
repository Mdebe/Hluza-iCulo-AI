import { useEffect, useRef, useState } from "react"
import WaveSurfer from "wavesurfer.js"

type Props = {
  audioUrl: string
}

export default function WaveformPlayer({ audioUrl }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const waveSurferRef = useRef<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Destroy previous instance
    if (waveSurferRef.current) {
      waveSurferRef.current.destroy()
      waveSurferRef.current = null
    }

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#9ca3af",
      progressColor: "#ef4444",
      cursorColor: "#ef4444",
      height: 80,
      normalize: true,
    })

    waveSurferRef.current = ws
    ws.load(audioUrl)

    ws.on("play", () => setIsPlaying(true))
    ws.on("pause", () => setIsPlaying(false))
    ws.on("finish", () => setIsPlaying(false))

    return () => {
      ws.destroy()
      waveSurferRef.current = null
    }
  }, [audioUrl])

  const togglePlay = () => {
    if (!waveSurferRef.current) return
    waveSurferRef.current.playPause()
  }

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full mb-2" />
      <button
        onClick={togglePlay}
        className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      >
        {isPlaying ? "⏸ Pause" : "▶ Play"}
      </button>
    </div>
  )
}