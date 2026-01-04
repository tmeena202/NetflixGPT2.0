import React, { useState, useRef } from "react";
import Header from "./Header";
import { checkValidData } from "../utils/validate";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { USER_AVATAR } from "../utils/constants";

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const handleButtonOnCLick = () => {
    const message = checkValidData(
      isSignInForm ? null : name.current.value,
      email.current.value,
      password.current.value
    );

    setErrorMessage(message);

    if (message) return;

    // sign in sign up logic
    if (!isSignInForm) {
      // sign up logic
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current.value,
            photoURL: USER_AVATAR,
          })
            .then(() => {
              const { uid, email, displayName, photoURL } = auth.currentUser;
              dispatch(
                addUser({
                  uid: uid,
                  email: email,
                  displayName: displayName,
                  photoURL: photoURL,
                })
              );
            })
            .catch((error) => {
              setErrorMessage(error.message);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    } else {
      //sign in logic
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMessage(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Header />

      {/* Background Image */}
      <div className="absolute">
        <img
          alt="netflix wallpaper"
          src="https://assets.nflxext.com/ffe/siteui/vlv3/f86b16bf-4c16-411c-8357-22d79beed09c/web/IN-en-20251222-TRIFECTA-perspective_d4acb127-f63f-4a98-ad0b-4317b0b3e500_medium.jpg"
        />
      </div>

      {/* Login / Signup Form */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-3/12 absolute p-4 bg-black my-36 mx-auto right-0 left-0 text-white rounded-lg bg-opacity-80"
      >
        <h1 className="font-bold text-3xl py-4">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>

        {/* Name field */}
        {!isSignInForm && (
          <input
            ref={name}
            type="text"
            placeholder="Name"
            className="p-4 my-2 w-full bg-gray-700"
          />
        )}

        <input
          ref={email}
          type="text"
          placeholder="Email Address"
          className="p-4 my-2 w-full bg-gray-700"
        />

        {/* Password with Eye Button */}
        <div className="relative">
          <input
            ref={password}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="p-4 my-2 w-full bg-gray-700 pr-12"
          />

          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 font-bold text-lg">{errorMessage}</p>
        )}

        <button
          onClick={handleButtonOnCLick}
          className="p-4 my-6 bg-red-700 w-full rounded-lg"
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>

        <p
          className="cursor-pointer font-bold text-white text-sm md:text-base hover:text-purple-500 transition-colors mt-4"
          onClick={toggleSignInForm}
        >
          {isSignInForm
            ? "👉 New to Netflix? Sign Up Now"
            : "Already registered? Sign In Now"}
        </p>
      </form>
    </div>
  );
};

export default Login;
