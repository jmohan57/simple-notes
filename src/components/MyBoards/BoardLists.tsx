"use client";

import AddListOrCard from "@/components/MyBoards/AddListOrCard";
import "@/components/MyBoards/Custom CSS/scrollbar.css";
import SingleBoardList from "@/components/MyBoards/SingleBoardList";
import { boardBgColors } from "@/helpers/colorArray";
import { AddListItem } from "@/types/add-list-item-enum";
import { IBoard } from "@/types/board-interface";
import { Color } from "@/types/color-enum";
import { IList } from "@/types/list-interface";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { FaSpinner } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { toast } from "react-toastify";

interface BoardListsProps {
  boardData: IBoard;
}

function BoardLists(props: BoardListsProps) {
  const [lists, setLists] = useState<IList[]>();
  const [listsLoading, setListsLoading] = useState(false);

  useEffect(() => {
    getLists();
  }, [props.boardData._id]);

  const getLists = async () => {
    setListsLoading(true);
    try {
      const response = await axios.post("/api/boards/fetchlists", {
        boardId: props.boardData._id,
      });

      if (response.data.success) {
        setLists(response.data.resultObject);
      } else {
        toast.error("Sorry, could not fetch lists");
      }
    } catch (error) {
      toast.error("Sorry, could not fetch lists");
    } finally {
      setListsLoading(false);
    }
  };

  const addList = async (listTitle: string) => {
    try {
      const response = await axios.post("/api/boards/addlist", {
        boardId: props.boardData._id,
        listTitle: listTitle.trim(),
        displaySequence: lists?.length,
      });

      if (response.data.success) {
        setLists([...lists!, response.data.resultObject]);
      } else {
        toast.error("Sorry, could not add list");
      }
    } catch (error) {
      toast.error("Sorry, could not add list");
    } finally {
      setListsLoading(false);
    }
  };

  const updateList = async (list: IList) => {
    try {
      const response = await axios.post("/api/boards/updatelist", list);

      if (!response.data.success) {
        toast.error("Could not update list");
      }
    } catch (error) {
      toast.error("Could not update list");
    }
  };

  const handleDragNDrop = (result: DropResult) => {
    const { draggableId, source, destination } = result;

    // Return if there's no destination or if the item is dropped back to its original position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // Dropped in same list, only change the display sequence
    if (
      destination?.droppableId === source.droppableId &&
      destination.index !== source.index
    ) {
      const updatedLists = [...lists!];
      const list = lists?.find((list) => list._id === destination.droppableId);
      const listIndex = updatedLists.indexOf(list!);
      updatedLists.splice(listIndex, 1);

      const card = list?.cards?.find(
        (card) => card.id?.toString() === draggableId
      );
      list?.cards?.splice(list.cards.indexOf(card!), 1);
      list?.cards?.splice(destination.index, 0, card!);
      list?.cards?.forEach((card, index) => (card.displaySequence = index));

      updatedLists.splice(listIndex, 0, list!);

      setLists(updatedLists);
      updateList(list!);
    }

    // Dropped in different list
    if (destination?.droppableId !== source.droppableId) {
      const updatedLists = [...lists!];

      const sourceList = lists?.find((list) => list._id === source.droppableId);
      const sourceListIndex = updatedLists?.indexOf(sourceList!);
      updatedLists.splice(sourceListIndex!, 1);

      const destinationList = lists?.find(
        (list) => list._id === destination!.droppableId
      );
      const destinationListIndex = updatedLists?.indexOf(destinationList!);
      updatedLists.splice(destinationListIndex!, 1);

      const card = sourceList?.cards?.find(
        (card) => card.id?.toString() === draggableId
      );
      sourceList?.cards?.splice(sourceList.cards.indexOf(card!), 1);
      destinationList?.cards?.splice(destination.index, 0, card!);
      destinationList?.cards?.forEach(
        (card, index) => (card.displaySequence = index)
      );
      sourceList?.cards?.forEach(
        (card, index) => (card.displaySequence = index)
      );

      // This order is important, because previous sequence of removing will be reversed when adding
      updatedLists.splice(destinationListIndex!, 0, destinationList!);
      updatedLists.splice(sourceListIndex!, 0, sourceList!);

      setLists(updatedLists);

      updateList(sourceList!);
      updateList(destinationList!);
    }
  };

  const handleListUpdate = (updatedList: IList) => {
    const newLists = [...lists!];
    const toBeRemovedIndex = newLists.indexOf(
      newLists.find((list) => list._id === updatedList._id)!
    );
    newLists.splice(toBeRemovedIndex, 1, updatedList);

    setLists(newLists);
  };

  return (
    <div className="w-full min-h-[calc(100vh-7rem)] flex p-6 justify-start overflow-x-auto gap-4">
      {!listsLoading && lists && (
        <>
          <DragDropContext onDragEnd={handleDragNDrop}>
            {lists.length > 0 &&
              lists.map((list) => {
                return (
                  <SingleBoardList
                    key={list._id}
                    boardTitle={props.boardData.boardName}
                    listData={list}
                    onUpdateList={handleListUpdate}
                    reloadList={() => getLists()}
                    showErrorToast={(message) => toast.error(message)}
                  />
                );
              })}
          </DragDropContext>
          <AddListOrCard add={AddListItem.List} onAddList={addList} />
        </>
      )}
      {listsLoading && (
        <div
          className={`w-full flex justify-center items-center ${
            props.boardData.boardBackground ===
            boardBgColors.find((color) => color.name === Color.Default)?.color
              ? "text-black dark:text-white"
              : "text-white"
          }`}
        >
          <span className="flex flex-col gap-4 items-center">
            <FaSpinner className="h-8 w-8 animate-spin" />
            <h1 className="text-2xl font-semibold">Loading Lists</h1>
          </span>
        </div>
      )}
      {!listsLoading && !lists && (
        <div
          className={`w-full flex justify-center items-center ${
            props.boardData.boardBackground ===
            boardBgColors.find((color) => color.name === Color.Default)?.color
              ? "text-black dark:text-white"
              : "text-white"
          }`}
        >
          <span className="flex flex-col gap-4 items-center">
            <h1 className="text-2xl font-semibold">Could not load lists</h1>
            <button
              className="px-4 py-1 bg-green-600 hover:bg-green-700 rounded-md shadow-md flex items-center justify-center"
              onClick={() => window.location.reload()}
            >
              Reload
              <TfiReload className="ml-2" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

export default BoardLists;
