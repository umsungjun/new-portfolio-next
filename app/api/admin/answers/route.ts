import { NextRequest, NextResponse } from "next/server";

import { revalidatePath, revalidateTag } from "next/cache";

import { MediaType } from "@prisma/client";

import { requireAdminAuth } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

export async function POST(req: NextRequest) {
  const authError = await requireAdminAuth(req);
  if (authError) return authError;

  try {
    const { questionId, contentKo, contentEn, mediaUrl, mediaType, isDraft } =
      await req.json();

    if (!questionId || !contentKo?.trim() || !contentEn?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "questionId, 한국어/영어 내용을 모두 입력해주세요.",
        },
        { status: 400 }
      );
    }

    if (mediaType && !Object.values(MediaType).includes(mediaType)) {
      return NextResponse.json(
        { success: false, message: "mediaType은 IMAGE 또는 VIDEO여야 합니다." },
        { status: 400 }
      );
    }

    const answer = await prisma.answer.create({
      data: {
        questionId: Number(questionId),
        contentKo: contentKo.trim(),
        contentEn: contentEn.trim(),
        mediaUrl: mediaUrl?.trim() || null,
        mediaType: mediaType || null,
        isDraft: Boolean(isDraft),
      },
    });

    revalidateTag("answers");
    revalidatePath("/");
    revalidatePath("/en");

    return NextResponse.json({ success: true, data: answer }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
