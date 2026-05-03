import { NextRequest, NextResponse } from "next/server";

import { revalidatePath, revalidateTag } from "next/cache";

import { MediaType, Prisma } from "@prisma/client";

import { requireAdminAuth } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

type RouteParams = { params: Promise<{ id: string }> };

function handlePrismaError(error: unknown) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return NextResponse.json(
      { success: false, message: "항목을 찾을 수 없습니다." },
      { status: 404 }
    );
  }
  return NextResponse.json(
    { success: false, message: "서버 오류가 발생했습니다." },
    { status: 500 }
  );
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const authError = await requireAdminAuth(req);
  if (authError) return authError;

  try {
    const { id } = await params;
    const { contentKo, contentEn, mediaUrl, mediaType } = await req.json();

    if (!contentKo?.trim() || !contentEn?.trim()) {
      return NextResponse.json(
        { success: false, message: "한국어/영어 내용을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    if (mediaType && !Object.values(MediaType).includes(mediaType)) {
      return NextResponse.json(
        { success: false, message: "mediaType은 IMAGE 또는 VIDEO여야 합니다." },
        { status: 400 }
      );
    }

    const answer = await prisma.answer.update({
      where: { id: Number(id) },
      data: {
        contentKo: contentKo.trim(),
        contentEn: contentEn.trim(),
        mediaUrl: mediaUrl?.trim() || null,
        mediaType: mediaType || null,
      },
    });

    revalidateTag("answers");
    revalidatePath("/");
    revalidatePath("/en");

    return NextResponse.json({ success: true, data: answer });
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const authError = await requireAdminAuth(req);
  if (authError) return authError;

  try {
    const { id } = await params;

    await prisma.answer.delete({ where: { id: Number(id) } });

    revalidateTag("answers");
    revalidatePath("/");
    revalidatePath("/en");

    return NextResponse.json({ success: true });
  } catch (error) {
    return handlePrismaError(error);
  }
}
