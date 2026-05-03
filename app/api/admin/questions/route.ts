import { NextRequest, NextResponse } from "next/server";

import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdminAuth } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

export async function GET(req: NextRequest) {
  const authError = await requireAdminAuth(req);
  if (authError) return authError;

  try {
    const questions = await prisma.question.findMany({
      include: { answers: { orderBy: { id: "asc" } } },
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ success: true, data: questions });
  } catch {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdminAuth(req);
  if (authError) return authError;

  try {
    const { contentKo, contentEn } = await req.json();

    if (!contentKo?.trim() || !contentEn?.trim()) {
      return NextResponse.json(
        { success: false, message: "한국어/영어 내용을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const question = await prisma.question.create({
      data: { contentKo: contentKo.trim(), contentEn: contentEn.trim() },
    });

    revalidateTag("questions");
    revalidatePath("/");
    revalidatePath("/en");

    return NextResponse.json({ success: true, data: question }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
