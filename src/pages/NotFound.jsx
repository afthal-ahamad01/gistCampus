import { Link } from "react-router-dom";

const NotFound = () => (
  <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
    <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
    <p className="text-lg text-gray-600 mb-8">The page you are looking for has moved or no longer exists.</p>
    <Link to="/" className="px-6 py-3 bg-primary text-white rounded-xl font-semibold">
      Go Home
    </Link>
  </section>
);

export default NotFound;

