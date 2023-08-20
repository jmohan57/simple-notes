import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
  boardId: {
    type: String,
    required: [true, "boardId is required"],
  },
  listTitle: {
    type: String,
    required: [true, "listTitle is required"],
  },
  displaySequence: {
    type: Number,
    default: 1,
  },
  cards: {
    type: Array,
    default: [],
  },
});

const List = mongoose.models.lists || mongoose.model("lists", listSchema);

export default List;
