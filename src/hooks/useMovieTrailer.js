import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addTrailerVideo } from "../utils/movieSlice";

const useMovieTrailer = ({ movieId }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!movieId) return;

    const getMovieVideos = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
          API_OPTIONS
        );
        const data = await response.json();
        const filterData = data.results.filter(
          (video) => video.type === "Trailer"
        );
        const trailer = filterData[0] || null;
        dispatch(addTrailerVideo(trailer));
      } catch (error) {
        console.error("Failed to fetch trailer:", error);
      }
    };

    getMovieVideos();
  }, [movieId, dispatch]);
};

export default useMovieTrailer;
