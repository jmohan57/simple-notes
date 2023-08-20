import { connect } from "@/dbconfig/dbConfig";
import List from "@/models/listModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { _id, listTitle, displaySequence, cards } = reqBody;

    const list = await List.findById(_id);

    if (!list) {
      return NextResponse.json({
        message: "List not found !",
        status: 400,
        success: false,
      });
    }

    // Update the list details
    list.listTitle = listTitle;
    list.displaySequence = displaySequence;
    list.cards = cards;

    const updatedList = await list.save();

    // return the updated list
    return NextResponse.json({
      message: "Lists updated successfully !",
      status: 200,
      success: true,
      resultObject: updatedList,
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
