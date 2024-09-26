import { DB, Database, Room, User, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
//import { get } from "lodash";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  return NextResponse.json({
    ok: true,
    rooms: (<Room>DB).rooms ,
    totalRooms: (<Room>DB).rooms.length,
  });
};

export const POST = async (request: NextRequest) => {
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


   const body = await request.json();
   const roomName = body.roomName;

   readDB();
   const foundroom = (<Room>DB).rooms.find(
     (r:any) =>  r.roomName === roomName && r.roomId === roomId 
   );
  if (foundroom) {
    return NextResponse.json(
      {
        ok: false,
        message:  `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }



  const roomId = nanoid();

  // Add room to database
  (DB as Room).rooms.push({
    roomId: roomId,
    roomName: body,
  });

  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });

};
