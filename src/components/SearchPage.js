import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_OPTIONS, IMG_CDN_URL } from "../utils/constants";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL is the source of truth
  const query = searchParams.get("q") || "";

  const [input, setInput] = useState(query);
  const [results, setResults] = useState([]);

  // Sync input when header search changes URL
  useEffect(() => {
    setInput(query);
  }, [query]);

  // Fetch search results
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${query}`,
        API_OPTIONS
      );
      const data = await res.json();
      setResults(data.results || []);
    };

    fetchResults();
  }, [query]);

  // Search from page input
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    navigate(`/search?q=${encodeURIComponent(input)}`);
  };

  return (
    <div className="bg-black min-h-screen text-white px-6 pt-16">
      {/* Back Button (floating, does not affect layout) */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-0 left-6 z-50
                   w-9 h-9 rounded-full
                   flex items-center justify-center
                   bg-gray-500 text-white
                   hover:bg-black"
      >
        ←
      </button>

      {/* Search input on page */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search movies..."
          className="w-full p-3 rounded bg-gray-800
                     text-white placeholder-gray-400
                     focus:outline-none"
        />
      </form>

      {/* Results */}
      <div className="space-y-4">
        {results.map((movie) => {
          if (!movie.poster_path) return null;

          return (
            <div
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="flex gap-4 bg-gray-900 p-4 rounded-lg
                         cursor-pointer hover:bg-gray-800
                         transition"
            >
              <img
                src={IMG_CDN_URL + movie.poster_path}
                alt={movie.title}
                className="w-28 rounded"
              />

              <div>
                <h2 className="text-xl font-semibold">{movie.title}</h2>
                <p className="text-sm text-gray-400 mt-1 line-clamp-3">
                  {movie.overview}
                </p>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {query && results.length === 0 && (
          <p className="text-gray-400">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
