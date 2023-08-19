import { connect } from "@/dbconfig/dbConfig";
import Board from "@/models/boardModel";
import { IBoard } from "@/types/board-interface";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { createdBy, _id } = reqBody;

    const board: IBoard | null = await Board.findById({ _id });

    // if board is not found
    if (!board) {
      return NextResponse.json({
        message: "Board not found !",
        status: 400,
        success: false,
      });
    }

    // if board is not created by the user
    if (board.createdBy !== createdBy) {
      return NextResponse.json({
        message: "Access denied !",
        status: 400,
        success: false,
      });
    }

    // return the board data
    return NextResponse.json({
      message: "Board data fetched successfully !",
      status: 200,
      success: true,
      resultObject: board,
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
