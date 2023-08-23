"use client";

import { formatDateTime } from "@/helpers/formatDateTime";
import { ICardComments } from "@/types/card-interface";
import React, { useState } from "react";

interface CardCommentProps {
  comment: ICardComments;
  onDelete: (commentId: number) => void;
}

function CardComment(props: CardCommentProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  return (
    <div
      key={props.comment.id}
      className="w-full relative flex flex-col p-4 rounded-lg shadow shadow-slate-400 gap-2"
    >
      <p className="text-black dark:text-white text-sm">
        {props.comment.comment}
      </p>
      <span className="w-full flex gap-6 items-center">
        <p className="text-gray-600 dark:text-gray-200 text-xs">
          {formatDateTime(props.comment.editedOn)}
        </p>
        <p
          className="text-red-600 dark:text-red-500 text-xs font-semibold cursor-pointer"
          onClick={() => setShowConfirmDialog(true)}
        >
          Delete
        </p>
        {showConfirmDialog && (
          <div className="absolute top-0 left-0 mt-[-40px] p-4 w-fit text-center text-sm bg-white dark:bg-slate-950 border border-black dark:border-white rounded-lg shadow-lg shadow-gray-400">
            <p>
              Are you sure you want to
              <br />
              delete this comment?
            </p>
            <button
              className="bg-red-500 text-white p-1 rounded mt-2 mr-2"
              onClick={() => {
                setShowConfirmDialog(false);
                props.onDelete(props.comment.id);
              }}
            >
              Confirm
            </button>
            <button
              className="bg-gray-300 text-gray-700 p-1 rounded mt-2"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </span>
    </div>
  );
}

export default CardComment;
