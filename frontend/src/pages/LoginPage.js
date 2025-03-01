export default function HomePage() {
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
                    />
                </div>

                {/* Login Button */}
                <div className="w-full">
                    <button className="px-6 py-4 bg-[#FF8C00] w-full text-white font-bold rounded-lg text-lg shadow-md hover:bg-[#FF4B28] transition cursor-pointer">
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}
