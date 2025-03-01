'use client';

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  // State to track whether the user is a doctor
  const [isDoctor, setIsDoctor] = useState(null);

  // Check if there is a userId in sessionStorage
  const userId = sessionStorage.getItem("userId");

  // If no userId is found, redirect to index page
  useEffect(() => {
    if (!userId) {
      router.push('/'); // Redirect to index if not logged in
    } else {
      // If userId exists, check if the user is a doctor
      axios
        .get(`http://localhost:5000/person/doctor/${userId}`)
        .then((response) => {
          setIsDoctor(response.data.isMedicalPractitioner); // User is a doctor
        })
        .catch((error) => {
          setIsDoctor(false); // User is not a doctor or error occurred
        });
    }
  }, [userId, router]);

  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    router.push('/'); // Redirect to index page after logout
  };

  // If isDoctor is still being checked or if there's no userId, return null (don't render the header)
  if (isDoctor === null) {
    return null; // Prevent rendering anything until we know the user's doctor status
  }

  // Navigation items to display
  const navItems = [
    { name: "Patient View", path: "/patient-view" },
    { name: "Profile View", path: "/profile-view" },
    { name: "Logout", path: "/logout", onClick: handleLogout },
  ];

  // Filter nav items based on whether the user is a doctor
  const filteredNavItems = isDoctor
    ? navItems // Show all items if user is a doctor
    : navItems.filter(item => item.name !== "Patient View"); // Remove "Patient View" if not a doctor

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-black shadow-lg z-50">
        <div className="container mx-auto px-6 py-4 flex justify-end">
          <nav className="flex space-x-4">
            {filteredNavItems.map((item) => (
              <button
                key={item.path}
                onClick={item.onClick || (() => router.push(item.path))}
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
