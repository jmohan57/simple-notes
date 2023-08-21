import { connect } from "@/dbconfig/dbConfig";
import List from "@/models/listModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { _id } = reqBody;

    // Delete the list by id
    const list = await List.deleteOne({ _id });

    if (!list) {
      return NextResponse.json({
        message: "List not found !",
        status: 400,
        success: false,
      });
    }

    // return the success message
    return NextResponse.json({
      message: "List deleted successfully !",
      status: 200,
      success: true,
      resultObject: list,
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
