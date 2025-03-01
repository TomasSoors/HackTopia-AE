'use client';

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isDoctor, setIsDoctor] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = sessionStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        router.push('/');
      }
    }
  }, [router]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/person/doctor/${userId}`)
        .then((response) => {
          setIsDoctor(response.data.isMedicalPractitioner);
        })
        .catch(() => {
          setIsDoctor(false);
        });
    }
  }, [userId]);

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    router.push('/');
  };

  if (isDoctor === null || userId === null) {
    return null;
  }

  const navItems = [
    { name: "Patient View", path: "/patient-view" },
    { name: "Calendar", path: "/calendar" },
    { name: "Profile", path: "/profile-view" },
    { name: "Logout", path: "/logout", onClick: handleLogout }
  ];

  const filteredNavItems = isDoctor
    ? navItems
    : navItems.filter(item => item.name !== "Patient View" && item.name !== "Calendar");

  return (
    <>
      <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-black/70 shadow-md z-50 border-b border-gray-700">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Image src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="Logo" width={30} height={30} />
            <h1 className="text-xl font-bold text-white">MyHealth</h1>
          </div>
          <nav className="flex space-x-6">
            {filteredNavItems.map((item) => (
              <button
                key={item.path}
                onClick={item.onClick || (() => router.push(item.path))}
                className={`px-6 py-3 font-medium rounded-lg transition-all duration-300 shadow-md cursor-pointer 
                  ${pathname === item.path ? "bg-[#FF4B28] text-white" : "bg-[#FF8C00] text-white hover:bg-[#FF4B28] hover:scale-105"}
                `}
              >
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>
      <div className="pt-20"></div>
    </>
  );
};

export default Header;
