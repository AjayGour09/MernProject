import React from "react";
import { AuthContext } from "../contexts/AuthContext";
import bgImage from '../assets/background.png'

export default function Authentication() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  let handleAuth = async () => {
    try {
      if (formState === 0) {
        await handleLogin(username, password);
      }

      if (formState === 1) {
        let result = await handleRegister(name, username, password);
        setUsername("");
        setPassword("");
        setName("");
        setMessage(result);
        setOpen(true);
        setError("");
        setFormState(0);
      }
    } catch (err) {
      let message = err.response?.data?.message || "Something went wrong";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* Left Image Section */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:{bgImage},
        }}
      ></div>

      {/* Right Form Section */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-br from-orange-50 to-white px-6">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            {formState === 0 ? "Welcome Back" : "Create Account"}
          </h2>

          {/* Toggle Buttons */}
          <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setFormState(0)}
              className={`w-1/2 py-2 rounded-lg font-semibold transition ${
                formState === 0
                  ? "bg-orange-500 text-white shadow"
                  : "text-gray-600"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setFormState(1)}
              className={`w-1/2 py-2 rounded-lg font-semibold transition ${
                formState === 1
                  ? "bg-orange-500 text-white shadow"
                  : "text-gray-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {formState === 1 && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            )}

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="button"
              onClick={handleAuth}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition duration-300"
            >
              {formState === 0 ? "Login" : "Register"}
            </button>
          </div>

          {/* Snackbar Message */}
          {open && (
            <div className="mt-4 text-green-600 text-center font-medium">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
