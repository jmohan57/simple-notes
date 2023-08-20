import { connect } from "@/dbconfig/dbConfig";
import List from "@/models/listModel";
import { IList } from "@/types/list-interface";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { boardId, listTitle, displaySequence } = reqBody;

    // Create a new list
    const newList = new List({
      boardId,
      listTitle,
      displaySequence,
      cards: [],
    });

    // Save the new list to the database
    const savedList: IList = await newList.save();

    // return the new list
    return NextResponse.json({
      message: "New list saved successfully !",
      status: 200,
      success: true,
      resultObject: savedList,
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
