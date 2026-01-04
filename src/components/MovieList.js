import React from "react";
import MovieCard from "./MovieCard";

const MovieList = ({ title, movies }) => {
  if (!movies) return null;

  return (
    <div className="px-6">
      <h1 className="text-lg md:text-3xl py-6 text-white">{title}</h1>

      <div className="flex overflow-x-scroll no-scrollbar scroll-smooth movie-scroll">
        <div className="flex gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              posterPath={movie.poster_path}
              movieId={movie.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
