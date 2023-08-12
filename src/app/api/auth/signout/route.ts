import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
        message: "Logged out successfully !",
        success: true,
        staus: 200
    });
    response.cookies.delete("token");
    return response;
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
