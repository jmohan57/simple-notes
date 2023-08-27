import React from "react";
import { BiLoaderAlt } from "react-icons/bi";
import "@/components/KTest/Custom CSS/animate-fade-in.css";

interface ConfirmModalProps {
  isEnding: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal = (props: ConfirmModalProps) => {
  return (
    <div
      className={`fixed inset-0 ${
        props.isOpen ? "flex" : "hidden"
      } items-center justify-center z-50`}
    >
      <div className="fixed inset-0 bg-slate-800 opacity-90"></div>
      <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-md z-10 zoom-in">
        {!props.isEnding ? (
          <>
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
              Confirm
            </h2>
            <p className="text-gray-700 dark:text-white mb-6">
              Are you sure you want to end this quiz?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded mr-2"
                onClick={props.onClose}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={props.onConfirm}
              >
                End Quiz
              </button>
            </div>
          </>
        ) : (
          <span className="flex flex-col justify-center items-center gap-3 text-slate-800 dark:text-white">
            <BiLoaderAlt className="animate-spin h-8 w-8" />
            <h1 className="text-xl font-semibold">Ending Quiz, please wait</h1>
          </span>
        )}
      </div>
    </div>
  );
};

export default ConfirmModal;
