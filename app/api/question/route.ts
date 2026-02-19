import { NextResponse } from "next/server";

import { prisma } from "@/lib/server/prisma";

export const revalidate = 86400; // 1일 캐싱

export async function GET() {
  try {
    const data = await prisma.question.findMany({
      orderBy: {
        id: "asc",
      },
    });

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, message: "데이터가 존재하지 않습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `서버 내부 오류가 발생했습니다. ${error}` },
      { status: 500 }
    );
  }
}
