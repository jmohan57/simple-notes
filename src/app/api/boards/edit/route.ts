import { connect } from "@/dbconfig/dbConfig";
import Board from "@/models/boardModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { boardName, boardDescription, boardBackground, _id } = reqBody;

    // Find the board by id
    const board = await Board.findById(_id);

    if (!board) {
      return NextResponse.json({
        message: "Board not found !",
        status: 400,
        success: false,
      });
    }

    // Update the board
    board.boardName = boardName;
    board.boardDescription = boardDescription;
    board.boardBackground = boardBackground;
    board.lastEditedOn = Date.now();
    const updatedBoard = await board.save();

    // return the updated board
    return NextResponse.json({
      message: "Board updated successfully !",
      status: 200,
      success: true,
      resultObject: updatedBoard,
    });
  } catch (error) {
    return NextResponse.json({
      error: error,
      message: "Sorry, something went wrong !",
      status: 500,
      success: false,
    });
  }
}
