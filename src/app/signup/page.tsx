"use client";

import { UserInterface } from "@/types/user-interface";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiCircleCheck } from "react-icons/ci";

function SignupPage() {
  const router = useRouter();
  const [inputError, setInputError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserInterface>({
    fullname: "",
    username: "",
    password: "",
  });

  const createUser = async (cleanedUserData: UserInterface) => {
    setIsLoading(true);
    try {
      const response = await axios.post("api/auth/signup", cleanedUserData);

      if (response.data.success) {
        router.push("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Sorry, there was an error !");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    setInputError(false);
    if (
      user.fullname!.trim().length > 0 &&
      user.username!.trim().length > 0 &&
      user.password!.trim().length > 0
    ) {
      const cleanedUserData: UserInterface = {
        fullname: user.fullname?.trim(),
        username: user.username?.replaceAll(/\s/g, ""),
        password: user.password?.replaceAll(/\s/g, ""),
      };
      createUser(cleanedUserData);
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
                    id="fullname"
                    name="fullname"
                    type="text"
                    className={`peer placeholder-transparent h-10 w-full border-b-2 ${
                      inputError && user.fullname!.trim().length === 0
                        ? "border-red-600"
                        : "border-gray-300"
                    } text-gray-900 focus:outline-none focus:borer-rose-600`}
                    placeholder="Full name"
                    value={user.fullname}
                    onChange={(e) =>
                      setUser({ ...user, fullname: e.target.value })
                    }
                  />
                  <label
                    htmlFor="fullname"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Full name
                  </label>
                </div>
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
                    onClick={handleSignup}
                  >
                    {isLoading ? "Creating..." : "Create"}

                    {isLoading ? (
                      <AiOutlineLoading3Quarters className="ml-2 animate-spin" />
                    ) : (
                      <CiCircleCheck className="pl-2 w-8 h-8" />
                    )}
                  </button>
                </div>
                <div className="text-sm pt-4">
                  Already have an account?{" "}
                  <Link href="/login" className="font-bold text-blue-500">
                    Login
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

export default SignupPage;
