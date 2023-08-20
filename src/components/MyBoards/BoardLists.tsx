"use client";

import AddListOrCard from "@/components/MyBoards/AddListOrCard";
import "@/components/MyBoards/Custom CSS/scrollbar.css";
import SingleBoardList from "@/components/MyBoards/SingleBoardList";
import { AddListItem } from "@/types/add-list-item-enum";
import { IList } from "@/types/list-interface";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";

interface BoardListsProps {
  boardId: string;
}

function BoardLists(props: BoardListsProps) {
  const [lists, setLists] = useState<IList[]>();
  const [listsLoading, setListsLoading] = useState(false);

  useEffect(() => {
    getLists();
  }, [props.boardId]);

  const getLists = async () => {
    setListsLoading(true);
    try {
      const response = await axios.post("/api/boards/fetchlists", {
        boardId: props.boardId,
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
        boardId: props.boardId,
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

  return (
    <div className="w-full min-h-[calc(100vh-7rem)] flex p-6 justify-start overflow-x-auto gap-4">
      <Toaster />
      {!listsLoading && lists && (
        <>
          {lists.length > 0 &&
            lists.map((list) => {
              return <SingleBoardList key={list._id} listData={list} />;
            })}
          <AddListOrCard add={AddListItem.List} onAddList={addList} />
        </>
      )}
      {listsLoading && (
        <div className="w-full flex justify-center items-center">
          <span className="flex flex-col gap-4 items-center">
            <FaSpinner className="h-8 w-8 text-white animate-spin" />
            <h1 className="text-2xl text-white font-semibold">Loading Lists</h1>
          </span>
        </div>
      )}
      {!listsLoading && !lists && (
        <div className="w-full flex justify-center items-center">
          <span className="flex flex-col gap-4 items-center">
            <h1 className="text-2xl text-white font-semibold">
              Could not load lists
            </h1>
            <button className="px-4 py-1 bg-green-600 text-white hover:bg-green-700 rounded-md shadow-md flex items-center justify-center">
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
