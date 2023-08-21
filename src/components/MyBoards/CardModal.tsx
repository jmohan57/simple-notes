"use client";

import { ICard } from "@/types/card-interface";
import React, { useEffect, useState } from "react";
import {
  AiFillDelete,
  AiOutlineClose,
  AiOutlineCreditCard,
} from "react-icons/ai";
import { BsTextParagraph } from "react-icons/bs";

interface CardModalProps {
  card: ICard;
  listTitle: string;
  isOpen: boolean;
  onDeleteCard: (card: ICard) => void;
  onUpdateCardDetails: (card: ICard) => void;
  closeModal: () => void;
}

function CardModal(props: CardModalProps) {
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [editDescription, setEditDescription] = useState<boolean>(false);
  const [sureDelete, setSureDelete] = useState<boolean>(false);

  useEffect(() => {
    if (props.card) {
      setCardTitle(props.card.cardTitle!);
      setCardDescription(props.card.cardDescription!);
      setEditDescription(props.card.cardDescription!.length === 0);
    }
  }, [props.card]);

  const onSaveDescription = () => {
    if (cardDescription.trim().length === 0) return;
    if (cardDescription === props.card.cardDescription) {
      setEditDescription(false);
      return;
    }

    let updatedCard;
    if (
      cardTitle.trim().length > 0 &&
      cardTitle !== props.card.cardDescription
    ) {
      updatedCard = { ...props.card, cardTitle, cardDescription };
    } else {
      updatedCard = { ...props.card, cardTitle };
    }

    props.onUpdateCardDetails(updatedCard);
    setEditDescription(false);
  };

  const onUpdateTitle = () => {
    if (cardTitle.trim().length === 0) {
      setCardTitle(props.card.cardTitle!);
      return;
    }
    if (cardTitle === props.card.cardTitle) return;

    let updatedCard;
    if (
      cardDescription.trim().length > 0 &&
      cardDescription !== props.card.cardDescription &&
      !editDescription
    ) {
      updatedCard = { ...props.card, cardTitle, cardDescription };
    } else {
      updatedCard = { ...props.card, cardTitle };
    }

    props.onUpdateCardDetails(updatedCard);
  };

  const onClose = () => {
    setCardTitle("");
    setCardDescription("");
    setEditDescription(false);
    setSureDelete(false);
    props.closeModal();
  };

  return (
    props.card !== null && (
      <div
        className={`fixed inset-0 ${
          props.isOpen ? "flex" : "hidden"
        } items-center justify-center bg-gray-800 bg-opacity-80`}
      >
        <div className="bg-white dark:bg-slate-800 w-[95%] sm:w-5/6 md:w-2/3 lg:w-1/2 p-4 rounded-lg shadow-md transform transition-transform ease-in-out duration-300">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            onClick={onClose}
          >
            <AiOutlineClose className="w-6 h-6" title="Close" />
          </button>

          <span className="flex flex-col w-[90%] gap-1 text-black dark:text-white">
            {/* Title Section */}
            <span className="flex w-full justify-start items-center gap-2">
              <AiOutlineCreditCard className="w-6 h-6" />
              <input
                className="text-xl font-semibold bg-white dark:bg-slate-800 text-black dark:text-white"
                maxLength={34}
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                onBlur={onUpdateTitle}
              />
            </span>
            <h5 className="text-sm ml-8">
              in list <b>{props.listTitle}</b>
            </h5>

            {/* Description */}
            <span className="flex w-full justify-start items-center gap-2 mt-6">
              <BsTextParagraph className="w-6 h-6" />
              <h2 className="font-semibold">Description</h2>
            </span>
            {editDescription && (
              <span className="flex flex-col w-full">
                <textarea
                  rows={4}
                  maxLength={300}
                  className="w-[70%] border border-blue-500 p-2 outline-none resize-none ml-8 rounded-md dark:bg-gray-600"
                  placeholder="Write a meaningful description"
                  value={cardDescription}
                  onChange={(e) => setCardDescription(e.target.value)}
                />
                <span className="flex w-[70%] justify-between ml-8">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white mt-1 px-3 py-1 rounded-md w-fit"
                    onClick={onSaveDescription}
                  >
                    Save
                  </button>
                  <p className="text-xs italic">{cardDescription.length}/300</p>
                </span>
              </span>
            )}
            {!editDescription && (
              <p
                className="ml-8 w-[70%] text-black dark:text-white cursor-pointer"
                onClick={() => setEditDescription(true)}
              >
                {cardDescription}
              </p>
            )}
            {!sureDelete && (
              <button
                className="bg-red-500 text-white px-3 py-2 w-fit rounded-md mt-6 ml-8 hover:bg-red-700 flex justify-center items-center gap-2"
                onClick={() => setSureDelete(true)}
              >
                Delete Card
                <AiFillDelete className="w-5 h-5" />
              </button>
            )}
            {sureDelete && (
              <span className="ml-8 flex justify-start items-center gap-2 mt-6">
                <button
                  className="bg-slate-300 hover:bg-slate-400 text-black p-2 w-fit rounded-md"
                  onClick={() => setSureDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white p-2 w-fit rounded-md"
                  onClick={() => {
                    props.onDeleteCard(props.card);
                    onClose();
                  }}
                >
                  Confirm Delete
                </button>
              </span>
            )}
          </span>
        </div>
      </div>
    )
  );
}

export default CardModal;
