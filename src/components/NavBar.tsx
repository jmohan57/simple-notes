"use client";

import { UserInterface } from "@/types/user-interface";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface NavBarProps {
  isSigningOut: () => void;
  onPasswordChange: () => void;
  switchPageOption?: { title: string; path: string };
  user: UserInterface;
}

function NavBar(props: NavBarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    setIsOpen(false);
    props.isSigningOut();
  };

  return (
    <>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center text-white font-bold">
                <h2 className="text-2xl cursor-pointer" onClick={() => router.push("/home")}>
                  Simple Apps
                </h2>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://cdn-icons-png.flaticon.com/64/1177/1177568.png"
                      alt=""
                    />
                  </button>
                </div>

                <div
                  className={`${
                    isOpen ? "absolute" : "hidden"
                  } right-0 z-30 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-600 dark:text-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <span className="block px-4 py-2 text-sm font-bold text-gray-700 dark:text-white">
                    Hello, {props.user.fullname}
                  </span>
                  {props.switchPageOption && (
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-white"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-0"
                      onClick={() => {
                        setIsOpen(false);
                        router.push(props.switchPageOption?.path!);
                      }}
                    >
                      {props.switchPageOption.title}
                    </a>
                  )}
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-white"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-1"
                    onClick={() => {
                      setIsOpen(false);
                      props.onPasswordChange();
                    }}
                  >
                    Change Password
                  </a>

                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-red-500 dark:text-red-500 font-bold"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-2"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
