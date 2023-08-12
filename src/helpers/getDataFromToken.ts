import { ITokenData } from "@/types/token-data-interface";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function getDataFromToken(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value || "";
    const data: ITokenData = jwt.verify(token, process.env.TOKEN_SECRET!) as ITokenData;
    return data;    
  } catch (error: any) {
    throw new Error(error);
  }
}