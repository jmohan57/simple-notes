import React from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { TbNotes } from "react-icons/tb";

function MainScreenLoader() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-800 text-white text-2xl font-bold">
      <TbNotes className="h-20 w-20 pb-4 animate-pulse" />
      <span className="animate-pulse text-center pb-4">Simple Apps</span>
      <AiOutlineLoading className="animate-spin h-10 w-10" />
    </main>
  );
}

export default MainScreenLoader;
