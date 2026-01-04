import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO } from "../utils/constants";
import { toggleGptSearchView } from "../utils/gptSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      console.log("Searching for:", searchTerm);
      // navigate(`/search?query=${searchTerm}`) // optional
    }
  };

  return (
    <div className="absolute flex justify-between items-center w-screen px-8 py-2 bg-gradient-to-b from-black z-30">
      <img className="w-44" alt="netflix logo" src={LOGO} />

      {user && (
        <div className="flex items-center gap-4">
          {/* Search bar visible on black background */}
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
