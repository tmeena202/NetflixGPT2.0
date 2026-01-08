import React, { useState } from "react";

const VideoTitle = ({
  title,
  overview,
  isPlaying,
  setIsPlaying,
  onNext,
  isMuted,
  setIsMuted,
}) => {
  const [showDesc, setShowDesc] = useState(true);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleDescription = () => {
    setShowDesc((prev) => !prev);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full aspect-video pt-[15%] px-6 md:px-24 absolute text-white bg-gradient-to-r from-black z-20">
      <h1 className="text-xl md:text-3xl font-bold">{title}</h1>

      {showDesc && (
        <p className="py-4 text-sm md:text-base w-full md:w-1/3">{overview}</p>
      )}

      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={handlePlayPause}
          className="bg-gray-500 text-black px-4 py-2 rounded-lg border"
        >
          {isPlaying ? "⏸ Pause" : "▶️ Play"}
        </button>

        <button
          onClick={onNext}
          className="bg-gray-500 text-black px-4 py-2 rounded-lg border"
        >
          ⏭ Next
        </button>

        <button
          onClick={toggleDescription}
          className="bg-gray-500 bg-opacity-50 text-black px-4 py-2 rounded-lg border"
        >
          {showDesc ? "Show Less" : "Show More"}
        </button>

        <button
          onClick={handleMuteToggle}
          className="bg-gray-500 text-black px-4 py-2 rounded-lg border"
        >
          {isMuted ? "🔇 Unmute" : "🔊 Mute"}
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
