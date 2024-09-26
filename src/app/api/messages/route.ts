import { DB, Message, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const roomId = request.nextUrl.searchParams.get("roomId");

  readDB();
  //validate query parameters (if provided)
  const foundmessage = (<Message>DB).messages.find(
    (m:any) => m.roomId === roomId 
  );
  if (!foundmessage) {
  return NextResponse.json(
    {
      ok: false,
      message: `Room is not found`,
    },
    { status: 404 }
  );
  }

  let filtered = (<Message>DB).messages;

  //filter by student id here
  if (roomId !== null) {
    filtered = filtered.filter((std:any) => std.roomId === roomId);
  }
  return NextResponse.json({ 
    ok: true, 
    messages: filtered 
  });


};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  readDB();
  
  const foundmessage = (<Message>DB).messages.find(
    (m:any) => m.roomId === body.roomId 
  );
  if (!foundmessage) {
  return NextResponse.json(
    {
      ok: false,
      message: `Room is not found`,
    },
    { status: 404 }
  );
  }

  const messageId = nanoid();

  (DB as Message).messages.push({
    roomId: body.roomId,
    messageText: body.messageText,
    messageId,
  });
  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();

  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();

  const body = await request.json();

  const foundmessage = (<Message>DB).messages.findIndex(
    (m:any) => m.roomId === body.roomId 
  );
  if (!foundmessage) {
  return NextResponse.json(
    {
      ok: false,
      message: `Room is not found`,
    },
    { status: 404 }
  );
  }
  (<Message>DB).messages.splice(foundmessage, 1);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
