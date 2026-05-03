import { NextRequest, NextResponse } from "next/server";

import {
  createSessionCookie,
  verifyAdminPassword,
} from "@/lib/server/auth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || !(await verifyAdminPassword(password))) {
      return NextResponse.json(
        { success: false, message: "비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    return createSessionCookie(response);
  } catch {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
