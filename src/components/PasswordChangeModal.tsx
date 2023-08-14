"use client";

import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BiLoaderAlt } from "react-icons/bi";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  username: string;
}

function PasswordChangeModal(props: PasswordChangeModalProps) {
  const [inputError, setInputError] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const onSave = async () => {
    if (password.trim().length > 0) {
      setIsSaving(true);
      try {
        const response = await axios.post("api/auth/update", {
          username: props.username,
          password: password.trim(),
        });

        if (response.data.success) {
          setPassword("");
          setIsSaving(false);
          props.onSave();
        } else {
          setIsSaving(false);
          toast.error("Error while saving password !");
        }
      } catch (error) {
        setIsSaving(false);
        toast.error("Error while saving password !");
      }
    } else {
      setInputError(true);
    }
  };

  return (
    <div
      className={`${props.isOpen ? "flex" : "hidden"} relative z-30`}
      aria-labelledby="CreateNoteModal"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-slate-800 bg-opacity-95 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Toaster />
          {!isSaving ? (
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-900 text-left shadow-xl transition-all w-full sm:my-8 sm:w-full sm:max-w-sm">
              <div className="bg-white dark:bg-slate-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex flex-col justify-center items-center gap-2">
                  {/* Content */}
                  <input
                    type="password"
                    className={`w-full p-2 rounded-lg outline-none dark:bg-gray-600 ${
                      inputError
                        ? "border-2 border-red-600"
                        : "border border-gray-400"
                    } focus:border-blue-400 focus:border-2`}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
                  onClick={onSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 sm:mt-0 sm:w-auto"
                  onClick={() => props.onClose()}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-900 shadow-xl transition-all w-full sm:my-8 sm:w-full sm:max-w-xs">
              <span className="flex flex-col justify-center items-center my-8 gap-3 text-slate-800 dark:text-white">
                <BiLoaderAlt className="animate-spin h-8 w-8" />
                <h1 className="text-xl font-semibold">
                  Updating, please wait
                </h1>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PasswordChangeModal;
