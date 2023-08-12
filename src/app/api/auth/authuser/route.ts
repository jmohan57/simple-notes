import { connect } from "@/dbconfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token') || null;
    const userId = getDataFromToken(request)?.id;
    const user = await User.findById(userId).select("-password");

    if (user) {
      return NextResponse.json({
        message: "User Details Found",
        success: true,
        data: user,
      });
    } else {
      // Remove token from cookies
      const deleteCookie = request.cookies.clear();
      if (deleteCookie) {
        return NextResponse.json({
          message: "Invalid Token",
          success: false,
          userId: userId || null,
          token: token
        });
      } else {
        return NextResponse.json({
          message: "Sorry, some error occurred",
          success: false,
          userId: userId || null
        });
      }
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
