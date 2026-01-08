import Login from "./Login";
import Browse from "./Browse";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MovieDetails from "./MovieDetails";
import SearchPage from "./SearchPage";

const Body = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/browse",
      element: <Browse />,
    },
    {
      path: "/search",
      element: <SearchPage />,
    },
    {
      path: "/movie/:id",
      element: <MovieDetails />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default Body;
