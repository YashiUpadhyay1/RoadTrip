import React, { useState } from "react";
import { loginUser, signupUser } from "../services/api";
import { Lock, UserPlus } from "lucide-react";

const Auth = ({ setUser, navigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      let userData;
      if (isLogin) {
        userData = await loginUser({
          email: formData.email,
          password: formData.password,
        });
      } else {
        userData = await signupUser(formData);
      }
      setUser(userData);
      navigate("home");
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.response?.data?.error || "Authentication failed.");
    }
  };

  return (
<div
  className="flex justify-center items-center min-h-screen bg-cover bg-no-repeat"
  style={{
    backgroundImage:
      "url('https://clipart-library.com/2023/young-people-together-planning-trip-europe-top-view-empty-white-space-notebook-where-you-time-plan-text-travel-concept_292052-1627.jpg')",
    
  }}
>

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          {isLogin ? (
            <Lock className="w-12 h-12 text-indigo-600 mb-3" />
          ) : (
            <UserPlus className="w-12 h-12 text-indigo-600 mb-3" />
          )}
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? "Welcome Back" : "Join Trip Planner"}
          </h2>
          <p className="text-grey-500 mt-2">
            {isLogin
              ? "Login to continue your journey"
              : "Create your account to start exploring!"}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your username"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-semibold hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;

