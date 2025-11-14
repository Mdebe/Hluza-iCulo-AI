import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

interface Props {
  audioUrl: string;
}

export default function WaveformPlayer({ audioUrl }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy previous instance if any
    wavesurferRef.current?.destroy();

    // Create new WaveSurfer instance
    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: 80,
      waveColor: "#CBD5E1",
      progressColor: "#3B82F6",
      cursorColor: "#3B82F6",
      barWidth: 2,
      normalize: true,
      backend: "MediaElement",
    });

    ws.load(audioUrl);

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));

    wavesurferRef.current = ws;

    // Cleanup on unmount
    return () => {
      ws.destroy();
    };
  }, [audioUrl]);

  const togglePlay = () => {
    wavesurferRef.current?.playPause();
  };

  return (
    <div className="w-full">
      <div ref={containerRef} />
      <div className="flex justify-center mt-2">
        <button
          onClick={togglePlay}
          className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
