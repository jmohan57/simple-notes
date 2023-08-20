import { connect } from "@/dbconfig/dbConfig";
import List from "@/models/listModel";
import { IList } from "@/types/list-interface";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { boardId } = reqBody;

    const lists: IList[] = await List.find({ boardId }).sort({
      displaySequence: 1,
    });

    // return the new list
    return NextResponse.json({
      message: "Lists fetched successfully !",
      status: 200,
      success: true,
      resultObject: lists,
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
