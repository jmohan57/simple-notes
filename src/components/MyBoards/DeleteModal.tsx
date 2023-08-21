import { AddListItem } from "@/types/add-list-item-enum";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BiLoaderAlt } from "react-icons/bi";
import { ImCheckmark } from "react-icons/im";

interface DeleteModalProps {
  boardId?: string;
  delete: AddListItem;
  listId?: string;
  isOpen: boolean;
  onClose: (reload: boolean) => void;
}

const DeleteModal = (props: DeleteModalProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteComplete, setDeleteComplete] = useState(false);

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      let API_URL = "";
      if (props.delete === AddListItem.Board) {
        API_URL = "/api/boards/delete";
      } else {
        API_URL = "/api/boards/deletelist";
      }

      const response = await axios.post(API_URL, {
        _id: props.delete === AddListItem.Board ? props.boardId : props.listId,
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
              Are you sure you want to delete this {props.delete}?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded mr-2"
                onClick={() => props.onClose(false)}
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
                <h1 className="text-xl font-semibold mx-4">
                  {props.delete === AddListItem.Board ? "Board" : "List"}{" "}
                  Deleted
                </h1>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white rounded-md px-3 py-1"
                  onClick={() =>
                    props.delete === AddListItem.Board
                      ? router.push("/myboards")
                      : props.onClose(true)
                  }
                >
                  Continue
                </button>
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default DeleteModal;
