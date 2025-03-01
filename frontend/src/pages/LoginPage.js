export default function HomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d1b2a] text-white">
            <div>
                <div>
                    <p className="px-6 py-y bg-[#FF8C00] rounded-lg">Username</p>
                    <input className="px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg w-full" type="text" placeholder="Enter your username" />
                </div>

                <button className="px-6 py-3 bg-[#FF8C00] w-full text-white font-bold rounded-lg text-lg shadow-md hover:bg-[#FF4B28] transition cursor-pointer">
                Login
                </button>
            </div>
            
        </div>
    );
}
  