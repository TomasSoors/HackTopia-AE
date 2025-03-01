'use client';

import { usePathname, useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Check if there is a userId in sessionStorage
  const userId = sessionStorage.getItem("userId");

  // If no userId is found, return null to render nothing
  if (!userId) {
    return null;
  }

  const navItems = [
    { name: "Patient View", path: "/patient-view" },
    { name: "Profile View", path: "/profile-view" },
    { name: "Logout", path: "/logout" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-black shadow-lg z-50">
        <div className="container mx-auto px-6 py-4 flex justify-end">
          <nav className="flex space-x-4">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 shadow-md cursor-pointer
                  ${
                    pathname === item.path
                      ? "bg-[#FF4B28] text-white"
                      : "bg-[#FF8C00] text-white hover:bg-[#FF4B28] hover:scale-105"
                  }
                `}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="pt-16"></div>
    </>
  );
};

export default Header;
