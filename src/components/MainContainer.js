import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import VideoBackground from "./VideoBackground";
import VideoTitle from "./VideoTitle";

const MainContainer = () => {
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // NEW state for mute

  // Set initial random movie ONCE
  useEffect(() => {
    if (!movies || movies.length === 0) return;
    const randomIndex = Math.floor(Math.random() * Math.min(movies.length, 19));
    setCurrentIndex(randomIndex);
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const { original_title, overview, id } = currentMovie;

  const handleNext = () => {
    setIsPlaying(true);
    setCurrentIndex((prev) => (prev + 1 < movies.length ? prev + 1 : 0));
  };

  return (
    <div className="pt-[35%] bg-black md:pt-0 relative">
      <VideoTitle
        title={original_title}
        overview={overview}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onNext={handleNext}
        isMuted={isMuted} // pass mute state
        setIsMuted={setIsMuted} // pass setter
      />

      <VideoBackground movieId={id} isPlaying={isPlaying} isMuted={isMuted} />
    </div>
  );
};

export default MainContainer;
