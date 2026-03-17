 
import WaveformPlayer from "./WaveformPlayer";

export default function StemCard({
  title,
  audio,
  downloadName,
}: {
  title: string;
  audio: string;
  downloadName: string;
}) {
  return (
    <div className="bg-white/50 dark:bg-gray-800/60 rounded-xl p-4 shadow-md backdrop-blur-md">
      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">{title}</h3>
      <WaveformPlayer audioUrl={audio} />
      <a
        href={audio}
        download={downloadName}
        className="mt-3 inline-block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
      >
        Download
      </a>
    </div>
  );
}