import React, { useState } from "react";
import { isValidEmail, useInputValidation } from "6pp";
import toast from "react-hot-toast";
import axios from "axios"
import { server } from "../constants/config";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const toggleLogin = () => setIsLogin((prev) => !prev);

    const name = useInputValidation("");
    const email = useInputValidation("", isValidEmail);
    const password = useInputValidation("");

    // handle Login
    const dispatch = useDispatch();
    const handleLogin = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Logging In...");
        setIsLoading(true);
        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        }
        const payload = { email: email.value, password: password.value };
        try {
            const { data } = await axios.post(`${server}/api/auth/login`, payload, config)
            dispatch(userExists(data.user))
            toast.success("Login Successful", { id: toastId });

        } catch (error) {
            toast.error(error?.response?.data?.message || 'Login Failed', { id: toastId });
        }
        finally {
            setIsLoading(false)
        }
    };

    // handle Signup
    const handleSignup = async (e) => {
        e.preventDefault()
        const toastId = toast.loading("Signing Up...");
        setIsLoading(true);
        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        }

        const payload = {
            name: name.value,
            email: email.value,
            password: password.value,
        };
        try {
            const { data } = await axios.post(`${server}/api/auth/signup`, payload, config)
            dispatch(userExists(data.user))
            toast.success(data.message, { id: toastId });

        } catch (error) {
            toast.error(error?.response?.data?.message || 'Signup Failed', { id: toastId });
        }
        finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
                {/* Title */}
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    {isLogin ? "Welcome Back 👋" : "Create an Account ✨"}
                </h2>

                {/* Form */}
                <form
                    onSubmit={isLogin ? handleLogin : handleSignup}
                    className="space-y-6"
                >
                    {!isLogin && (
                        <div>
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
                        </div>
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
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${email.error
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isLoading
                            ? "Processing..."
                            : isLogin
                                ? "Login"
                                : "Sign Up"}
                    </button>
                </form>

                {/* Switch Mode */}
                <p className="text-sm text-center text-gray-600 mt-6">
                    {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
                    <button
                        onClick={toggleLogin}
                        disabled={isLoading}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
