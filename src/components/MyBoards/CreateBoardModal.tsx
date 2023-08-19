"use client";

import { boardBgColors } from "@/helpers/colorArray";
import { IBoard } from "@/types/board-interface";
import { Color } from "@/types/color-enum";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BiLoaderAlt } from "react-icons/bi";
import BoardColorSelector from "./BoardColorSelector";

interface CreateBoardModalProps {
  editBoard: IBoard | null;
  isDeleting: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newlyAddedBoard: IBoard) => void;
  username: string;
}

function CreateBoardModal(props: CreateBoardModalProps) {
  const [inputError, setInputError] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [boardData, setBoardData] = useState<IBoard>({
    boardName: "",
    boardDescription: "",
    boardBackground: boardBgColors.find((color) => color.name === Color.Default)
      ?.color!,
    createdBy: props.username,
  });

  const onSaveBoard = () => {
    if (
      boardData.boardName!.trim().length > 0 &&
      boardData.boardDescription!.trim().length > 0
    ) {
      setInputError(false);
      const cleanedBoardData: IBoard = {
        ...boardData,
        boardName: boardData.boardName?.trim(),
      };
      addOrUpdateBoard(cleanedBoardData);
    } else {
      setInputError(true);
    }
  };

  const addOrUpdateBoard = async (cleanedBoardData: IBoard) => {
    setIsSaving(true);
    setBoardData({
      ...boardData,
      boardName: "",
      boardDescription: "",
    });
    try {
      let response;
      if (props.editBoard) {
        response = await axios.post("api/boards/edit", {
          ...cleanedBoardData,
          _id: props.editBoard._id,
        });
      } else {
        response = await axios.post("api/boards/add", cleanedBoardData);
      }

      if (response.data.success) {
        props.onSave(response.data.resultObject);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Sorry, there was an error !");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`${props.isOpen ? "flex" : "hidden"} relative z-30`}
      aria-labelledby="CreateNoteModal"
      role="dialog"
      aria-modal="true"
    >
      <Toaster />
      <div className="fixed inset-0 bg-slate-800 bg-opacity-95 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          {!isSaving && !props.isDeleting ? (
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:text-white text-black text-left shadow-xl transition-all w-full sm:my-8 sm:w-full sm:max-w-2xl">
              <div className="bg-white dark:bg-slate-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex flex-col justify-center items-center gap-2">
                  {/* Content */}
                  <input
                    type="text"
                    maxLength={100}
                    className={`w-full p-2 dark:bg-gray-600 rounded-lg outline-none ${
                      inputError && boardData.boardName.trim().length === 0
                        ? "border-2 border-red-600"
                        : "border border-gray-400"
                    } focus:border-blue-400 focus:border-2 font-bold`}
                    placeholder="Board Name"
                    value={boardData.boardName}
                    onChange={(e) =>
                      setBoardData({ ...boardData, boardName: e.target.value })
                    }
                  ></input>

                  <span className="flex flex-col w-full">
                    <textarea
                      className={`w-full p-2 dark:bg-gray-600 rounded-lg outline-none ${
                        inputError &&
                        boardData.boardDescription.trim().length === 0
                          ? "border-2 border-red-600"
                          : "border border-gray-400"
                      } focus:border-blue-400 focus:border-2 resize-none`}
                      placeholder="Description"
                      rows={5}
                      maxLength={300}
                      value={boardData.boardDescription}
                      onChange={(e) =>
                        setBoardData({
                          ...boardData,
                          boardDescription: e.target.value,
                        })
                      }
                    />
                    <h6 className="text-xs italic text-right">
                      {boardData.boardDescription.length}/300
                    </h6>
                  </span>
                  <div className="flex flex-col sm:flex-row w-full justify-start items-center my-2">
                    <label className="text-sm mr-2 my-2">
                      Select a board background:
                    </label>
                    <span className="flex">
                      {boardBgColors.map((color) => {
                        return (
                          <BoardColorSelector
                            key={color.name}
                            colorName={color.name}
                            isSelected={
                              color.color === boardData.boardBackground
                            }
                            onSelect={() =>
                              setBoardData({
                                ...boardData,
                                boardBackground: color.color,
                              })
                            }
                          />
                        );
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
                  onClick={onSaveBoard}
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
                  {`${
                    isSaving && !props.isDeleting ? "Saving" : "Deleting"
                  }, please wait`}
                </h1>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateBoardModal;
