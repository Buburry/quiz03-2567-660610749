import jwt from "jsonwebtoken";

import { DB, Database, readDB } from "@lib/DB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const { username, password } = body;

  //you should do the validation here
  const user = (<Database>DB).users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        message: "Username or password is incorrect",
      },
      { status: 400 }
    );
  }

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Username or Password is incorrect",
  //   },
  //   { status: 400 }
  // );

  const secret = process.env.JWT_SECRET || "This is my special secret";

  const token = jwt.sign(
    { username, role: user.role, password: user.password },
    secret,
    { expiresIn: "8h" }
  );

  // const token = "Replace this with token creation";

  return NextResponse.json({ ok: true, token });
};
