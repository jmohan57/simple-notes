"use client";

import { UserInterface } from "@/types/user-interface";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiLogin } from "react-icons/ci";

function LoginPage() {
  const router = useRouter();
  const [inputError, setInputError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserInterface>({
    username: "",
    password: "",
  });

  const login = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/auth/login", user);
      if (response.data.success) {
        router.push("/home");
      } else {
        setIsLoading(false);
        toast.error(`Login failed ! ${response.data.message}`);
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(`Login failed ! ${error.response.data.error}`);
    }
  };

  const handleLogin = () => {
    setInputError(false);
    if (user.username!.trim().length > 0 && user.password!.trim().length > 0) {
      login();
    } else {
      setInputError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 py-6 flex flex-col justify-center sm:py-12">
      <Toaster />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:px-20 sm:py-10">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Simple Apps</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="username"
                    name="username"
                    type="text"
                    className={`peer placeholder-transparent h-10 w-full border-b-2 ${
                      inputError && user.username!.trim().length === 0
                        ? "border-red-600"
                        : "border-gray-300"
                    } text-gray-900 focus:outline-none focus:borer-rose-600`}
                    placeholder="Username"
                    value={user.username}
                    onChange={(e) =>
                      setUser({ ...user, username: e.target.value })
                    }
                  />
                  <label
                    htmlFor="username"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Username
                  </label>
                </div>
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="password"
                    name="password"
                    type="password"
                    className={`peer placeholder-transparent h-10 w-full border-b-2 ${
                      inputError && user.password!.trim().length === 0
                        ? "border-red-600"
                        : "border-gray-300"
                    } text-gray-900 focus:outline-none focus:borer-rose-600`}
                    placeholder="Password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div>
                <div className="relative pt-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-1 flex justify-center items-center"
                    disabled={isLoading}
                    onClick={handleLogin}
                  >
                    {isLoading ? "Loading..." : "Login"}

                    {isLoading ? (
                      <AiOutlineLoading3Quarters className="ml-2 my-2 animate-spin" />
                    ) : (
                      <CiLogin className="pl-2 w-8 h-8" />
                    )}
                  </button>
                </div>
                <div className="text-sm pt-4">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="font-bold text-blue-500">
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
