import { NextResponse } from "next/server";

import { getQuestions } from "@/lib/server/qna";

export async function GET() {
  const data = getQuestions();

  if (data.length === 0) {
    return NextResponse.json(
      { success: false, message: "데이터가 존재하지 않습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data });
}
