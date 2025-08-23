import React, { useState } from "react";
import { isValidEmail, useInputValidation } from "6pp";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../constants/config";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";
import { motion } from "framer-motion";
import { CircleLoader } from "react-spinners";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const email = useInputValidation("", isValidEmail);
  const password = useInputValidation("");

  const dispatch = useDispatch();

  // handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging In...");
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/auth/login`,
        { email: email.value, password: password.value },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      dispatch(userExists(data.user));
      toast.success("Login Successful", { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login Failed", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/auth/signup`,
        { name: name.value, email: email.value, password: password.value },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup Failed", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-4">
      {/* Branding Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-10 flex items-center gap-3"
      >
        <div className="text-3xl font-bold text-gray-800">Infinite Void</div>
        <CircleLoader size={"2rem"} />
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8"
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>

        {/* Form */}
        <form
          onSubmit={isLogin ? handleLogin : handleSignup}
          className="space-y-6"
        >
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                value={name.value}
                onChange={name.changeHandler}
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              value={email.value}
              onChange={email.changeHandler}
              type="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                email.error
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {email.error && (
              <p className="text-red-500 text-xs mt-2">{email.error}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              value={password.value}
              onChange={password.changeHandler}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading
              ? "Processing..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </motion.button>
        </form>

        {/* Switch Mode */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-center text-gray-600 mt-6"
        >
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleLogin}
            disabled={isLoading}
            className="text-blue-600 font-medium hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
