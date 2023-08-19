"use client";

import { Color } from "@/types/color-enum";
import React, { useEffect, useState } from "react";

interface BoardColorSelectorProps {
  colorName: string;
  onSelect: () => void;
  isSelected: boolean;
}

function BoardColorSelector(props: BoardColorSelectorProps) {
  const [bgColor, setBgColor] = useState("");

  useEffect(() => {
    switch (props.colorName) {
        case Color.Blue:
        setBgColor("bg-gradient-to-b from-blue-200 to-blue-600 text-black dark:text-black");
        break;
      case Color.Green:
        setBgColor("bg-gradient-to-b from-green-200 to-green-600 text-black dark:text-black");
        break;
      case Color.Purple:
        setBgColor("bg-gradient-to-b from-purple-300 to-purple-600 text-black dark:text-black");
        break;
      case Color.Red:
        setBgColor("bg-gradient-to-b from-red-100 to-red-400 text-black dark:text-black");
        break;
      case Color.Yellow:
        setBgColor("bg-gradient-to-b from-yellow-200 to-yellow-500 text-black dark:text-black");
        break;
      default:
        setBgColor("bg-white dark:bg-slate-800");
    }
  }, [props]);

  return (
    <div
      className={`h-8 w-8 mx-2 rounded-md ${bgColor} ${
        props.isSelected
          ? "border-4 border-blue-500 scale-125"
          : "border border-black"
      } cursor-pointer`}
      title={props.colorName}
      onClick={() => {
        props.onSelect();
      }}
    />
  );
}

export default BoardColorSelector;
