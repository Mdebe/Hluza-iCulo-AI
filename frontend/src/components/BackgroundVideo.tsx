import React from "react";

export default function BackgroundVideo() {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      poster="/background.jpg" // fallback image
      className="absolute inset-0 w-full h-full object-cover -z-10"
    >
      <source src="/background.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
