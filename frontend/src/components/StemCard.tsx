import React from "react";
import WaveformPlayer from "./WaveformPlayer";

interface Props {
  stemName: string;
  audioUrl: string;
}

export default function StemCard({ stemName, audioUrl }: Props) {
  return (
    <div className="bg-gray-100 rounded-xl p-4 shadow-lg flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2 capitalize">{stemName}</h3>
      <WaveformPlayer audioUrl={audioUrl} />
      <a
        href={audioUrl}
        download={`${stemName}.wav`}
        className="mt-2 px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Download {stemName}
      </a>
    </div>
  );
}
