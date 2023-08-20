import { ICard } from "@/types/card-interface";

export interface IList {
  _id?: string;
  boardId?: string;
  listTitle?: string;
  displaySequence?: number;
  cards?: ICard[];
}
