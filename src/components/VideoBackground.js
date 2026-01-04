import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";
import { addTrailerVideo } from "../utils/movieSlice";

const VideoBackground = ({ movieId, isPlaying, isMuted }) => {
  const dispatch = useDispatch();
  const trailerVideo = useSelector((store) => store.movies?.trailerVideo);
  const iframeRef = useRef(null);

  useMovieTrailer({ movieId });

  useEffect(() => {
    dispatch(addTrailerVideo(null));
  }, [movieId, dispatch]);

  useEffect(() => {
    if (!iframeRef.current || !trailerVideo) return;

    // Play or pause
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: isPlaying ? "playVideo" : "pauseVideo",
        args: [],
      }),
      "*"
    );

    // Mute or unmute
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: isMuted ? "mute" : "unMute",
        args: [],
      }),
      "*"
    );
  }, [isPlaying, isMuted, trailerVideo]);

  if (!trailerVideo) return null;

  return (
    <div>
      <iframe
        ref={iframeRef}
        className="w-full aspect-video"
        src={
          "https://www.youtube.com/embed/" +
          trailerVideo.key +
          "?controls=0&autoplay=1&loop=1" +
          "&playlist=" +
          trailerVideo.key +
          "&enablejsapi=1"
        }
        title="youtube Video"
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
      ></iframe>
    </div>
  );
};

export default VideoBackground;
