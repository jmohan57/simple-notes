export interface IBoard {
    _id?: string;
    boardName: string;
    boardDescription: string;
    boardBackground: string;
    createdBy: string;
    lastEditedOn?: string;
    pinned?: boolean;
}