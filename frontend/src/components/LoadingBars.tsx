 

export default function LoadingBars() {
  return (
    <div className="flex items-end gap-2 h-12">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-2 sm:w-3 rounded-sm bg-gradient-to-b from-blue-400 to-indigo-600 animate-pulse"
          style={{
            animationDelay: `${i * 120}ms`,
            height: `${20 + (i % 3) * 18}px`,
          }}
        />
      ))}
    </div>
  );
}
