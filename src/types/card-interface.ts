export interface ICardComments {
  id: number;
  comment: string;
  editedOn: Date;
}

export interface ICard {
  id?: number;
  cardTitle?: string;
  cardDescription?: string;
  displaySequence?: number;
  comments?: ICardComments[];
}
