"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ImSpinner8 } from "react-icons/im";

function NotFound() {
  const router = useRouter();
  const [btnLoading, setBtnLoading] = useState(false);
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
          404
        </h1>
        <p className="text-lg text-gray-600 mb-8 dark:text-white">
          Oops! Page not found.
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={() => {
            setBtnLoading(true);
            router.push("/myboards");
          }}
        >
          {btnLoading ? <ImSpinner8 className="animate-spin w-6 h-6 mx-5" /> : "Go Back"}
        </button>
      </div>
    </div>
  );
}

export default NotFound;
