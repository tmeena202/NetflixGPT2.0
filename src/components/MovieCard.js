import React from "react";
import { IMG_CDN_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ posterPath, movieId }) => {
  const navigate = useNavigate();

  if (!posterPath) return null;

  const handleClick = () => {
    navigate("/movie/" + movieId);
  };

  return (
    <div className="w-36 md:w-48 pr-4 cursor-pointer" onClick={handleClick}>
      <img
        className="rounded-lg"
        src={IMG_CDN_URL + posterPath}
        alt="movie card"
      />
    </div>
  );
};

export default MovieCard;
