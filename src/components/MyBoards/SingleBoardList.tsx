"use client";

import AddListOrCard from "@/components/MyBoards/AddListOrCard";
import { AddListItem } from "@/types/add-list-item-enum";
import { ICard } from "@/types/card-interface";
import { IList } from "@/types/list-interface";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface SingleBoardListProps {
  listData: IList;
}

function SingleBoardList(props: SingleBoardListProps) {
  const [cards, setCards] = useState<ICard[]>(
    props.listData.cards!.sort(
      (a, b) => a.displaySequence! - b.displaySequence!
    ) || []
  );

  const addCard = async (cardTitle: string) => {
    const cardDetails: ICard = {
      cardTitle: cardTitle.trim(),
      cardDescription: "",
      displaySequence: props.listData.cards?.length,
    };
    try {
      const response = await axios.post("/api/boards/updatelist", {
        ...props.listData,
        cards: [...cards, cardDetails],
      });

      if (response.data.success) {
        setCards(
          [...cards, cardDetails].sort(
            (a, b) => a.displaySequence! - b.displaySequence!
          )
        );
      } else {
        toast.error("Could not add card");
      }
    } catch (error) {
      toast.error("Could not add card");
    }
  };

  return (
    <div className="w-60 h-fit bg-slate-800 flex flex-col shrink-0 rounded-lg p-2 gap-2">
      <h1 className="text-white font-bold">{props.listData.listTitle}</h1>
      {cards.length > 0 &&
        cards.map((card, i) => {
          return (
            <div key={i} className="w-full p-1 bg-slate-900 rounded-lg text-white">
              {card.cardTitle}
            </div>
          );
        })}
      <AddListOrCard add={AddListItem.Card} onAddCard={addCard} />
    </div>
  );
}

export default SingleBoardList;
