import { boardBgColors } from "@/helpers/colorArray";
import { IBoard } from "@/types/board-interface";
import { Color } from "@/types/color-enum";
import { useRouter } from "next/navigation";
import React from "react";
import { AiFillPushpin, AiOutlinePushpin } from "react-icons/ai";

interface BoardCardProps {
  boardData: IBoard;
  onTogglePin: (value: boolean, boardId: string) => void;
}

function BoardCard(props: BoardCardProps) {
  const router = useRouter();

  return (
    <div
      className={`${props.boardData.boardBackground} w-full md:w-[350px] rounded-lg shadow-lg overflow-hidden min-w-[300px]`}
    >
      <div className="p-4">
        <span className="flex justify-between items-center">
          <h2
            className="text-xl font-bold cursor-pointer w-[90%]"
            onClick={() => router.push(`/viewboard/${props.boardData._id}`)}
            title={props.boardData.boardName}
          >
            {props.boardData.boardName.length > 40
              ? props.boardData.boardName.slice(0, 40) + " ..."
              : props.boardData.boardName}
          </h2>
          {props.boardData.pinned ? (
            <AiFillPushpin
              className="h-6 w-6 cursor-pointer"
              onClick={() => props.onTogglePin(false, props.boardData._id!)}
            />
          ) : (
            <AiOutlinePushpin
              className="h-6 w-6 cursor-pointer"
              onClick={() => props.onTogglePin(true, props.boardData._id!)}
            />
          )}
        </span>

        <p
          className={`mt-4 text-black cursor-pointer ${
            boardBgColors.find(
              (color) => color.color === props.boardData.boardBackground
            )?.name === Color.Default
              ? "dark:text-white"
              : ""
          }`}
          title={props.boardData.boardDescription}
          onClick={() => router.push(`/viewboard/${props.boardData._id}`)}
        >
          {props.boardData.boardDescription.length > 180
            ? props.boardData.boardDescription.slice(0, 180) + " ..."
            : props.boardData.boardDescription}
        </p>
      </div>
    </div>
  );
}

export default BoardCard;
