import { connect } from "@/dbconfig/dbConfig";
import Board from "@/models/boardModel";
import { IBoard } from "@/types/board-interface";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { boardName, boardDescription, boardBackground, createdBy } = reqBody;

    // Create a new note
    const newBoard = new Board({
      boardName,
      boardDescription,
      boardBackground,
      createdBy,
      lastEditedOn: Date.now(),
      pinned: false,
    });

    // Save the new note to the database
    const savedBoard: IBoard = await newBoard.save();

    // return the new note
    return NextResponse.json({
      message: "New board saved successfully !",
      status: 200,
      success: true,
      resultObject: savedBoard,
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
