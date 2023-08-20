import { AddListItem } from "@/types/add-list-item-enum";
import React, { useState } from "react";

interface AddListOrCardProps {
  add: AddListItem;
  boardId?: string;
  listId?: string;
  onAddList?: (listTitle: string) => void;
  onAddCard?: (cardTitle: string) => void;
}

const AddListOrCard = (props: AddListOrCardProps) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [listTitle, setListTitle] = useState("");
  const [cardTitle, setCardTitle] = useState("");

  const toggleInputVisibility = () => {
    setIsInputVisible(!isInputVisible);
    setListTitle("");
    setCardTitle("");
  };

  const handleAdd = () => {
    if (props.add === AddListItem.List && listTitle.trim() !== "") {
      props.onAddList!(listTitle);
      toggleInputVisibility();
    }

    if (props.add === AddListItem.Card && cardTitle.trim() !== "") {
      props.onAddCard!(cardTitle);
      toggleInputVisibility();
    }
  };

  return (
    <div
      className={`${
        props.add === AddListItem.List ? "w-60" : "w-full"
      } flex shrink-0 h-fit bg-slate-800 text-white rounded-lg`}
    >
      {isInputVisible ? (
        <div
          className={`bg-slate-800 rounded-lg shadow w-full ${
            props.add === AddListItem.List ? "p-2" : ""
          }`}
        >
          <input
            type="text"
            placeholder={`Enter ${props.add} title...`}
            value={props.add === AddListItem.List ? listTitle : cardTitle}
            onChange={(e) =>
              props.add === AddListItem.List
                ? setListTitle(e.target.value)
                : setCardTitle(e.target.value)
            }
            className="w-full bg-slate-800 p-2 border-blue-700 border-2 focus:outline-none rounded-md"
          />
          <div className="flex justify-between items-center py-3">
            <button className="" onClick={toggleInputVisibility}>
              Cancel
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
              onClick={handleAdd}
            >
              Add {props.add}
            </button>
          </div>
        </div>
      ) : (
        <button
          className="block w-full text-left p-2 text-white bg-slate-800 hover:bg-slate-600 rounded-lg"
          onClick={toggleInputVisibility}
        >
          + Add a {props.add}
        </button>
      )}
    </div>
  );
};

export default AddListOrCard;
