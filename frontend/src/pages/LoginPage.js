'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    window.onload = function() {
        sessionStorage.setItem("userId", null)
    }
    useEffect(() => {
        const userId = sessionStorage.getItem("userId");
        if (userId) {
          // If user is logged in, redirect to profile-view
          router.push("/profile-view");
        }
      }, [router]);

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/person/login",
                { username, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                // Store user.id in sessionStorage
                sessionStorage.setItem("userId", response.data.user.id);
                window.location.href = "/profile-view";
            }
        } catch (error) {
            alert(`Login failed: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d1b2a] text-white">
            <div className="w-80">
                {/* Username Input */}
                <div className="relative w-full mb-12">
                    <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF8C00] text-white px-31 py-2 rounded-lg text-center shadow-md">
                        Username
                    </p>
                    <input
                        className="w-full px-6 py-8 bg-gray-200 text-gray-700 border-2 border-gray-300 rounded-lg focus:outline-none"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {/* Password Input */}
                <div className="relative w-full mb-6">
                    <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF8C00] text-white px-31.5 py-2 rounded-lg text-center shadow-md">
                        Password
                    </p>
                    <input
                        className="w-full px-6 py-8 bg-gray-200 text-gray-700 border-2 border-gray-300 rounded-lg focus:outline-none"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Login Button */}
                <div className="w-full">
                    <button 
                        className="px-6 py-4 bg-[#FF8C00] w-full text-white font-bold rounded-lg text-lg shadow-md hover:bg-[#FF4B28] transition cursor-pointer"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}
