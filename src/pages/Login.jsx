import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Determine role and redirect
      // We need to wait for the AuthProvider to update, or manually check here.
      // Manual check is safer for immediate redirect.
      let role = "guest";

      // Check Admin
      // Note: In a real app, we might use custom claims. Here we check collections.
      // We can reuse the logic from AuthProvider or just rely on AuthProvider's state update if we wait.
      // However, waiting for context update in a component can be tricky.
      // Let's do a quick check.

      // Actually, since AuthProvider listens to onAuthStateChanged, it will update.
      // But we want to redirect immediately based on the role.
      // Let's just redirect to a "dashboard" route that handles routing based on role,
      // OR we can check here.

      // Let's check here for better UX (direct redirect).
      // Import db and doc/getDoc
      const { doc, getDoc } = await import("firebase/firestore");
      const { db } = await import("../config/firebase");

      const adminDoc = await getDoc(doc(db, "admins", user.uid));
      if (adminDoc.exists()) {
        navigate("/admin", { replace: true });
        return;
      }

      const lecturerDoc = await getDoc(doc(db, "lecturers", user.uid));
      if (lecturerDoc.exists()) {
        navigate("/lecturer/dashboard", { replace: true });
        return;
      }

      const studentDoc = await getDoc(doc(db, "students", user.uid));
      if (studentDoc.exists()) {
        navigate("/", { replace: true });
        return;
      }

      // Default fallback
      navigate("/", { replace: true });

    } catch (err) {
      console.error("Login failed", err);
      setError("Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-4 py-20 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Login Portal</h1>
        <p className="text-gray-600 mt-2">Access for Students, Lecturers, and Administrators.</p>
      </div>

      <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-3xl p-8 space-y-6">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input w-full"
            required
            placeholder="user@gmail.com"

          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input w-full"
            required
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="text-center">
        <Link to="/" className="text-primary font-medium hover:underline">
          Back to Home
        </Link>
      </div>
    </section>
  );
};

export default Login;

