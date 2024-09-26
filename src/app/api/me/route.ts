import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Natapon Phairin",
    studentId: "660610749",
  });
};
