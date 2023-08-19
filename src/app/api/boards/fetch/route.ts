import { connect } from "@/dbconfig/dbConfig";
import Board from "@/models/boardModel";
import { IBoard } from "@/types/board-interface";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { createdBy } = reqBody;

    const boards: IBoard[] = await Board.find({ createdBy }).sort({ lastEditedOn: -1 });

    // return the new note
    return NextResponse.json({
      message: "Boards fetched successfully !",
      status: 200,
      success: true,
      resultObject: boards,
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
