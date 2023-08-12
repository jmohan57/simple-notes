"use client";

import { colors } from "@/helpers/colorArray";
import { formatDateTime } from "@/helpers/formatDateTime";
import { Color } from "@/types/color-enum";
import { NoteInterface } from "@/types/note-interface";
import axios from "axios";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IoMdColorPalette } from "react-icons/io";

interface NoteCardProps {
  onDeleteNote: (noteId: string) => void;
  onEditNote: (note: NoteInterface) => void;
  note: NoteInterface;
}

function NoteCard(props: NoteCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [cardColor, setCardColor] = useState<string>("bg-white");

  const lastEditedOn: string = `Last edited on ${formatDateTime(
    props.note.lastEditedOn!
  )}`;

  useEffect(() => {
    setColorState(props.note.colorTheme!);
  }, [props.note]);

  const updateColorInDb = async (color: string) => {
    try {
      const response = await axios.post("api/notes/edit", {
        ...props.note,
        colorTheme: color,
      });

      if (!response.data.success) {
        toast.error("Couldn't update color in database");
      }
    } catch (error) {
      toast.error("Couldn't update color in database");
    }
  };

  const setColorState = (color: string) => {
    switch (color) {
      case Color.Blue:
        setCardColor("bg-gradient-to-b from-white to-blue-300");
        break;
      case Color.Green:
        setCardColor("bg-gradient-to-b from-white to-green-300");
        break;
      case Color.Purple:
        setCardColor("bg-gradient-to-b from-white to-purple-300");
        break;
      case Color.Red:
        setCardColor("bg-gradient-to-b from-white to-red-300");
        break;
      case Color.Yellow:
        setCardColor("bg-gradient-to-b from-white to-yellow-300");
        break;
      default:
        setCardColor("bg-white");
    }
  };

  const onChangeColor = (color: string) => {
    setIsColorMenuOpen(false);
    setColorState(color);
    updateColorInDb(color);
  };

  return (
    <div
      className={`w-full max-w-sm ${cardColor} border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700`}
    >
      <Toaster />
      <div className="w-full flex justify-between items-center">
        <h1 className="px-4 pt-4 font-bold text-xl">{props.note.noteTitle}</h1>
        {/* Dropdown Section */}
        <div className="flex justify-end px-4 pt-4 gap-2">
          <button
            id="dropdownButton"
            data-dropdown-toggle="dropdown"
            className="inline-block text-gray-500 dark:text-gray-400 hover:bg-transparent dark:hover:bg-transparent focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open dropdown</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 3"
            >
              <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
            </svg>
          </button>
          {/* Dropdown menu */}
          <div
            id="dropdown"
            className={`z-10 ${
              isOpen ? "block" : "hidden"
            } absolute mt-8 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg shadow-slate-400 w-44 dark:bg-gray-700`}
          >
            <ul className="py-2" aria-labelledby="dropdownButton">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  onClick={() => {
                    props.onEditNote(props.note);
                    setIsOpen(false);
                  }}
                >
                  Edit
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  onClick={() => {
                    props.onDeleteNote(props.note._id!);
                  }}
                >
                  Delete
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex justify-start px-4 py-6">
        <p
          className="cursor-pointer"
          onClick={() => props.onEditNote(props.note)}
        >
          {props.note.noteBody!.length > 240
            ? `${props.note.noteBody!.slice(0, 240)} ...`
            : props.note.noteBody}
        </p>
      </div>
      <div className="flex justify-between items-center px-4 py-2">
        <p className="text-xs italic">{lastEditedOn}</p>
        <button
          title="Change Color"
          onClick={() => {
            setIsOpen(false);
            setIsColorMenuOpen(!isColorMenuOpen);
          }}
        >
          <IoMdColorPalette className="w-6 h-6" />
        </button>
        {/* Color Options */}
        <div
          id="dropdown"
          className={`z-10 ${
            isColorMenuOpen ? "block" : "hidden"
          } absolute sm:ml-44 ml-32 mb-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg shadow-slate-400 w-32 dark:bg-gray-700`}
        >
          <ul className="py-2" aria-labelledby="dropdownButton">
            {colors.map((color, index) => {
              return (
                <li
                  key={index}
                  className="block px-4 py-2 text-sm cursor-pointer"
                  onClick={() => onChangeColor(color)}
                >
                  {color}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
