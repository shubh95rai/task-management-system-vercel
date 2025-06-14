import { Link } from "react-router-dom";
import notFoundImg from "../assets/images/not-found.svg";

// const NotFound = () => {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen text-center">
//       <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
//       <p className="text-xl text-gray-700 mb-6">Page Not Found</p>
//       <Link to="/" className="text-blue-500 underline">
//         Go back to Home
//       </Link>
//     </div>
//   );
// };

// src/pages/NotFound.jsx

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-md text-center">
        <img
          src={notFoundImg}
          alt="Page not found"
          className="w-72 mx-auto mb-8"
        />
        <h1 className="text-4xl font-bold text-gray-700 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn’t find the page you were looking for.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
