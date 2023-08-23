"use client";

import AddListOrCard from "@/components/MyBoards/AddListOrCard";
import { AddListItem } from "@/types/add-list-item-enum";
import { ICard } from "@/types/card-interface";
import { IList } from "@/types/list-interface";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { MdDelete } from "react-icons/md";
import DeleteModal from "@/components/MyBoards/DeleteModal";
import CardModal from "./CardModal";
import { BiComment } from "react-icons/bi";

interface SingleBoardListProps {
  listData: IList;
  onUpdateList: (updatedListData: IList) => void;
  reloadList: () => void;
  showErrorToast: (message: string) => void;
}

function SingleBoardList(props: SingleBoardListProps) {
  const [cards, setCards] = useState<ICard[]>([]);
  const [listTitle, setListTitle] = useState<string>();
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isCardModal, setIsCardModal] = useState(false);
  const [cardModalData, setCardModalData] = useState<ICard | null>(null);

  useEffect(() => {
    if (props.listData) {
      const updatedCards = props.listData.cards!.sort(
        (a, b) => a.displaySequence! - b.displaySequence!
      );
      setCards(updatedCards);
      setListTitle(props.listData.listTitle);
    }
  }, [props]);

  const addCard = async (cardTitle: string) => {
    const cardDetails: ICard = {
      id: Date.now(),
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
        props.onUpdateList(response.data.resultObject);
      } else {
        props.showErrorToast("Could not add card");
      }
    } catch (error) {
      props.showErrorToast("Could not add card");
    }
  };

  const updateList = async (list: IList) => {
    try {
      const response = await axios.post("/api/boards/updatelist", list);

      if (!response.data.success) {
        props.showErrorToast("Could not sync data to server");
      }
    } catch (error) {
      props.showErrorToast("Could not sync data to server");
    }
  };

  const onChangeListTitle = async () => {
    if (
      listTitle!.trim().length > 0 &&
      listTitle !== props.listData.listTitle
    ) {
      const updatedListData = {
        ...props.listData,
        listTitle: listTitle!.trim(),
      };
      props.onUpdateList(updatedListData);
      updateList(updatedListData);
    } else {
      setListTitle(props.listData.listTitle);
    }
  };

  const onUpdateCardDetails = (updatedCard: ICard) => {
    const list = { ...props.listData };
    const card = list.cards?.find((card) => card.id === updatedCard.id);
    list.cards?.splice(list.cards.indexOf(card!), 1, updatedCard);
    props.onUpdateList(list);
    updateList(list);
  };

  const onDeleteCard = (deletedCard: ICard) => {
    const list = { ...props.listData };
    const card = list.cards?.find((card) => card.id === deletedCard.id);
    list.cards?.splice(list.cards.indexOf(card!), 1);
    list.cards?.forEach((card, index) => (card.displaySequence = index));
    props.onUpdateList(list);
    updateList(list);
  };

  return (
    <div className="w-60 h-fit bg-slate-800 dark:bg-gray-600 shadow-lg flex flex-col shrink-0 rounded-lg p-2 gap-2">
      <span className="w-full flex justify-between items-center">
        <textarea
          rows={listTitle && listTitle!.length > 18 ? 2 : 1}
          wrap="soft"
          maxLength={34}
          className="w-[90%] h-auto text-white bg-transparent outline-none font-bold text-lg resize-none"
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          onBlur={onChangeListTitle}
        />
        <MdDelete
          title="Delete List"
          className="text-white text-xl cursor-pointer"
          onClick={() => setIsDeleteModal(true)}
        />
      </span>

      <DeleteModal
        listId={props.listData._id}
        delete={AddListItem.List}
        isOpen={isDeleteModal}
        onClose={(reload) => {
          reload && props.reloadList();
          setIsDeleteModal(false);
        }}
      />

      <CardModal
        card={cardModalData!}
        listTitle={props.listData.listTitle!}
        isOpen={cardModalData !== null && isCardModal}
        onDeleteCard={onDeleteCard}
        onUpdateCardDetails={onUpdateCardDetails}
        closeModal={() => {
          setIsCardModal(false);
          setCardModalData(null);
        }}
      />

      <Droppable droppableId={props.listData._id!}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {provided.placeholder}
            {cards.length > 0 &&
              cards.map((card, i) => {
                return (
                  <Draggable
                    key={card.id}
                    draggableId={card.id?.toString()!}
                    index={i}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="w-full p-3 bg-slate-900 rounded-lg text-white mb-2"
                        onClick={() => {
                          setCardModalData(card);
                          setIsCardModal(true);
                        }}
                      >
                        {card.cardTitle}
                        {card.comments && card.comments?.length > 0 && (
                          <span
                            className="w-full flex items-center text-sm gap-1"
                            title="Comments"
                          >
                            <BiComment />
                            {card.comments?.length}
                          </span>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}

            <AddListOrCard add={AddListItem.Card} onAddCard={addCard} />
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default SingleBoardList;
