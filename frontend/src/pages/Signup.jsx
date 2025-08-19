
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useStore from "../store/useStore";
import { registerUser } from "../utils/auth";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(name, email, password);
      setUser(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/auth/google"; 
    // 👆 same as login — backend will handle new/existing users
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
        <input
          type="text"
          placeholder="Name"
          className="border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-green-500 text-white p-2 rounded" type="submit">
          Sign Up
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>

      {/* Google Signup */}
      <button
        onClick={handleGoogleSignup}
        className="bg-red-500 text-white p-2 rounded w-72 mt-4"
      >
        Sign Up with Google
      </button>

      <p className="mt-3">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
