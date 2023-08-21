import { AppCard } from "@/helpers/appCards";
import { useRouter } from "next/navigation";
import React from "react";
import { FaArrowRight } from "react-icons/fa";


const AppCard = ({ title, description, path }: AppCard) => {
  const router = useRouter();
  return (
    <div className="bg-white dark:bg-slate-800 w-full md:w-[400px] rounded-lg shadow-lg overflow-hidden min-w-[300px] min-h-16">
      <div className="p-4">
        <h2 className="text-xl font-medium">{title}</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-200">{description}</p>
      </div>
      <div className="bg-gray-200 dark:bg-slate-800 p-4">
        <button
          className="flex justify-center items-center w-full text-center font-bold bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md duration-300 ease-in-out transform hover:-translate-y-1 transition-transform"
          onClick={() => router.push(path)}
        >
          Explore <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default AppCard;
