import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS, GOOGLE_GEMINI_APIKEY } from "../utils/constants";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { addGptMovieResult } from "../utils/gptSlice";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const searchText = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Validate API key format
  const validateApiKey = () => {
    if (!GOOGLE_GEMINI_APIKEY) {
      throw new Error(
        "Gemini API key is missing. Please check your constants file."
      );
    }
    if (!GOOGLE_GEMINI_APIKEY.startsWith("AIza")) {
      throw new Error(
        "Invalid API key format. Make sure you're using a key from Google AI Studio (ai.google.dev), not Google Cloud."
      );
    }
  };

  // Initialize Gemini AI
  let genAI;
  try {
    validateApiKey();
    genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_APIKEY);
  } catch (err) {
    console.error("API Key Error:", err.message);
  }

  // Search movie in TMDB
  const searchMovieTMDB = async (movie) => {
    try {
      const data = await fetch(
        "https://api.themoviedb.org/3/search/movie?query=" +
          encodeURIComponent(movie) +
          "&include_adult=false&language=en-US&page=1",
        API_OPTIONS
      );
      const json = await data.json();
      return json.results || [];
    } catch (error) {
      console.error("TMDB API Error:", error);
      return [];
    }
  };

  const handleGptSearchClick = async () => {
    const query = searchText.current.value.trim();
    if (!query) return;

    setError(null);
    setIsLoading(true);

    try {
      if (!genAI) {
        throw new Error("Gemini AI is not properly initialized");
      }

      // Use gemini-2.5-flash (current available model)
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt =
        "Act as a movie recommendation system and suggest some movies for the query: " +
        query +
        ". Only give movie names, comma separated like the example result given ahead. Example: Gadar, Sholay, Godzilla, Pathaan, 3 Idiots";

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("No response from Gemini API");
      }

      // Split the comma-separated string into an array
      const gptMovies = text
        .split(",")
        .map((movie) => movie.trim())
        .filter((movie) => movie.length > 0);

      if (gptMovies.length === 0) {
        throw new Error("No movie recommendations received");
      }

      // For each movie, call TMDB Search API
      const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));

      // Wait for all promises to resolve
      const tmdbResults = await Promise.all(promiseArray);

      dispatch(
        addGptMovieResult({
          movieNames: gptMovies,
          movieResults: tmdbResults,
        })
      );

      // Clear search input after successful search
      searchText.current.value = "";
    } catch (error) {
      const errorMessage =
        error.message || "An unexpected error occurred during search";
      console.error("Search Error:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-[40%] md:pt-[10%] flex justify-center flex-col items-center gap-4">
      {error && (
        <div className="w-[90%] md:w-1/2 bg-red-900 text-white p-4 rounded-lg text-sm">
          <strong>Error:</strong> {error}
          <br />
          <small className="mt-2 block">
            If you're hitting rate limits, you need to enable billing at{" "}
            <a
              href="https://ai.google.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              ai.google.dev
            </a>
          </small>
        </div>
      )}

      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-[90%] md:w-1/2 bg-black grid grid-cols-12 rounded-lg"
      >
        <input
          ref={searchText}
          type="text"
          className="p-4 m-4 col-span-9 rounded-md text-black disabled:opacity-50"
          placeholder="What would you like to watch today?"
          disabled={isLoading}
        />

        <button
          onClick={handleGptSearchClick}
          disabled={isLoading}
          className="col-span-3 m-4 py-2 px-4 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
