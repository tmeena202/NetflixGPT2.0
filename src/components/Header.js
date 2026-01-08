import React, { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO } from "../utils/constants";
import { toggleGptSearchView } from "../utils/gptSlice";

// ---------------- TMDB API CONFIG ----------------
const TMDB_API_KEY = "ed3cbf7dca7c799df837fa25b584fed5"; // <-- replace with your key
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => navigate("/"))
      .catch(() => navigate("/error"));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(addUser({ uid, email, displayName, photoURL }));
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
  };

  // ---------------- TMDB SEARCH FUNCTION ----------------
  const fetchSearchSuggestions = async (query) => {
    if (!query) return [];
    try {
      const res = await fetch(
        `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          query
        )}&language=en-US&page=1&include_adult=false`
      );
      const data = await res.json();
      if (data && data.results) {
        return data.results.slice(0, 5).map((item) => ({
          id: item.id,
          title: item.title || item.name,
          media_type: item.media_type,
        }));
      }
      return [];
    } catch (err) {
      console.error("TMDB search error:", err);
      return [];
    }
  };

  // ---------------- HANDLE SEARCH INPUT ----------------
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounce API calls
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (value.trim()) {
        const results = await fetchSearchSuggestions(value);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 300); // wait 300ms after typing stops
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
    navigate(`/search?q=${encodeURIComponent(suggestion.title)}`);
    setSuggestions([]);
  };

  return (
    <div className="absolute flex justify-between items-center w-screen px-8 py-2 bg-gradient-to-b from-black z-30">
      {/* Clickable logo */}
      <img
        className="w-44 cursor-pointer"
        alt="netflix logo"
        src={LOGO}
        onClick={() => navigate("/")}
      />

      {user && (
        <div className="flex items-center gap-4 relative">
          {/* Search bar with TMDB suggestions */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search movies, shows..."
              className="bg-gray-800 text-white placeholder-gray-400 px-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bg-purple-600 px-3 py-1 rounded-full text-white font-semibold hover:bg-purple-700"
            >
              🔍
            </button>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-12 left-0 w-full bg-gray-900 border border-gray-700 rounded-md text-white z-50">
                {suggestions.map((sug) => (
                  <div
                    key={sug.id}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSuggestionClick(sug)}
                  >
                    {sug.title}{" "}
                    <span className="text-gray-400">({sug.media_type})</span>
                  </div>
                ))}
              </div>
            )}
          </form>

          <button
            onClick={handleGptSearchClick}
            className="text-white bg-purple-800 px-4 py-2 rounded-3xl"
          >
            GPT Search
          </button>

          <img
            className="w-10 h-10 rounded-lg object-cover"
            alt="user icon"
            src={user?.photoURL}
          />

          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
