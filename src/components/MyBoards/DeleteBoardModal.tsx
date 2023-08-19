import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BiLoaderAlt } from "react-icons/bi";
import { ImCheckmark } from "react-icons/im";

interface DeleteBoardModalProps {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteBoardModal = (props: DeleteBoardModalProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteComplete, setDeleteComplete] = useState(false);

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.post("/api/boards/delete", {
        _id: props.boardId,
      });

      if (response.data.success) {
        setIsDeleting(false);
        setDeleteComplete(true);
      } else {
        setIsDeleting(false);
        toast.error("Sorry, some error occurred while deleting");
      }
    } catch (error) {
      setIsDeleting(false);
      toast.error("Sorry, some error occurred while deleting");
    }
  };

  return (
    <div
      className={`fixed inset-0 ${
        props.isOpen ? "flex" : "hidden"
      } items-center justify-center z-50`}
    >
      <Toaster />
      <div className="fixed inset-0 bg-slate-800 opacity-90"></div>
      <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-md z-10">
        {!isDeleting && !deleteComplete ? (
          <>
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="text-gray-700 dark:text-white mb-6">
              Are you sure you want to delete this board?
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
                onClick={onDelete}
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <span className="flex flex-col justify-center items-center gap-3 text-slate-800 dark:text-white">
            {isDeleting && !deleteComplete ? (
              <>
                <BiLoaderAlt className="animate-spin h-8 w-8" />
                <h1 className="text-xl font-semibold">Deleting, please wait</h1>
              </>
            ) : (
              <>
                <ImCheckmark className="h-8 w-8" />
                <h1 className="text-xl font-semibold mx-4">Board Deleted</h1>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white rounded-md px-3 py-1"
                  onClick={() => router.push("/myboards")}
                >
                  My Boards
                </button>
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default DeleteBoardModal;
