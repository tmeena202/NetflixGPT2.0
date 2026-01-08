import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_OPTIONS, IMG_CDN_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const MovieDetails = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showTrailer, setShowTrailer] = useState(false);

  const navigate = useNavigate();

  // MOVIE DETAILS
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}`, API_OPTIONS)
      .then((res) => res.json())
      .then(setMovie);
  }, [id]);

  // CAST
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits`, API_OPTIONS)
      .then((res) => res.json())
      .then((data) => setCast(data.cast.slice(0, 12)));
  }, [id]);

  // VIDEOS
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, API_OPTIONS)
      .then((res) => res.json())
      .then((data) => setVideos(data.results));
  }, [id]);

  // IMAGES
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}/images`, API_OPTIONS)
      .then((res) => res.json())
      .then((data) => setImages(data.backdrops.slice(0, 10)));
  }, [id]);

  // REVIEWS
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}/reviews`, API_OPTIONS)
      .then((res) => res.json())
      .then((data) => setReviews(data.results.slice(0, 3)));
  }, [id]);

  // SIMILAR MOVIES
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}/similar`, API_OPTIONS)
      .then((res) => res.json())
      .then((data) => setSimilar(data.results.slice(0, 10)));
  }, [id]);

  if (!movie) return <div className="text-white p-10">Loading...</div>;

  const trailer = videos.find((v) => v.type === "Trailer");

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.4)), url(${IMG_CDN_URL}${movie.backdrop_path})`,
        backgroundSize: "cover",
      }}
    >
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 bg-black/70 hover:bg-black text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
      >
        ← Back
      </button>

      {/* HERO */}
      <div className="flex gap-10 p-10">
        <img
          className="w-64 rounded-xl shadow-xl"
          src={IMG_CDN_URL + movie.poster_path}
          alt={movie.title}
        />

        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold">
            {movie.title}{" "}
            <span className="text-gray-400">
              ({movie.release_date?.slice(0, 4)})
            </span>
          </h1>

          <div className="flex gap-2 mt-3">
            {movie.genres.map((g) => (
              <span key={g.id} className="border px-2 py-1 rounded text-sm">
                {g.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6 mt-6">
            <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center font-bold">
              {Math.round(movie.vote_average * 10)}%
            </div>

            {trailer && (
              <button
                onClick={() => setShowTrailer(true)}
                className="bg-white text-black px-4 py-2 rounded font-semibold"
              >
                ▶ Play Trailer
              </button>
            )}
          </div>

          <p className="italic text-gray-300 mt-4">{movie.tagline}</p>

          <p className="mt-4 text-gray-200">{movie.overview}</p>

          {/* INFO PANEL */}
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <p>
              <b>Status:</b> {movie.status}
            </p>
            <p>
              <b>Runtime:</b> {movie.runtime} min
            </p>
            <p>
              <b>Language:</b> {movie.original_language}
            </p>
            <p>
              <b>Budget:</b> ${movie.budget}
            </p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="px-10 border-b border-gray-600 flex gap-6">
        {["overview", "media", "reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize ${
              activeTab === tab ? "border-b-2 border-white" : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <>
          {/* CAST */}
          <div className="px-10 py-6">
            <h2 className="text-2xl mb-4">Series Cast</h2>
            <div className="flex gap-4 overflow-x-scroll">
              {cast.map((c) => (
                <div key={c.id} className="w-32 bg-gray-900 rounded">
                  <img
                    src={
                      c.profile_path
                        ? IMG_CDN_URL + c.profile_path
                        : "https://via.placeholder.com/300"
                    }
                    alt={c.name}
                  />
                  <div className="p-2 text-sm">
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-gray-400">{c.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIMILAR */}
          <div className="px-10 pb-10">
            <h2 className="text-2xl mb-4">More Like This</h2>
            <div className="flex gap-4 overflow-x-scroll">
              {similar.map((m) => (
                <img
                  key={m.id}
                  className="w-40 rounded"
                  src={IMG_CDN_URL + m.poster_path}
                  alt={m.title}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* MEDIA TAB */}
      {activeTab === "media" && (
        <div className="px-10 py-6">
          <h2 className="text-2xl mb-4">Videos</h2>
          <div className="flex gap-4 overflow-x-scroll">
            {videos.map((v) => (
              <iframe
                key={v.id}
                className="w-80 aspect-video"
                src={`https://www.youtube.com/embed/${v.key}`}
                title={v.name}
              />
            ))}
          </div>

          <h2 className="text-2xl mt-8 mb-4">Backdrops</h2>
          <div className="flex gap-4 overflow-x-scroll">
            {images.map((img, i) => (
              <img
                key={i}
                className="w-80 rounded"
                src={IMG_CDN_URL + img.file_path}
                alt=""
              />
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === "reviews" && (
        <div className="px-10 py-6">
          {reviews.map((r) => (
            <div key={r.id} className="mb-6 bg-gray-900 p-4 rounded">
              <p className="font-semibold">{r.author}</p>
              <p className="text-gray-300 text-sm mt-2">
                {r.content.slice(0, 400)}...
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TRAILER MODAL */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="w-full max-w-4xl aspect-video relative">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-xl"
            >
              ✕
            </button>
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
