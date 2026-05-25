import { NextRequest, NextResponse } from "next/server";

import { revalidatePath, revalidateTag } from "next/cache";

import { Prisma } from "@prisma/client";

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
    const body = await req.json();
    const { contentKo, contentEn, isDraft } = body;

    // isDraft만 토글하는 케이스(발행/임시저장 되돌림)는 본문 검증을 건너뜀
    const isToggleOnly =
      typeof isDraft === "boolean" &&
      contentKo === undefined &&
      contentEn === undefined;

    if (!isToggleOnly && (!contentKo?.trim() || !contentEn?.trim())) {
      return NextResponse.json(
        { success: false, message: "한국어/영어 내용을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const data: { contentKo?: string; contentEn?: string; isDraft?: boolean } =
      {};
    if (typeof contentKo === "string") data.contentKo = contentKo.trim();
    if (typeof contentEn === "string") data.contentEn = contentEn.trim();
    if (typeof isDraft === "boolean") data.isDraft = isDraft;

    const question = await prisma.question.update({
      where: { id: Number(id) },
      data,
    });

    revalidateTag("questions");
    revalidatePath("/");
    revalidatePath("/en");

    return NextResponse.json({ success: true, data: question });
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const authError = await requireAdminAuth(req);
  if (authError) return authError;

  try {
    const { id } = await params;

    await prisma.question.delete({ where: { id: Number(id) } });

    revalidateTag("questions");
    revalidateTag("answers");
    revalidatePath("/");
    revalidatePath("/en");

    return NextResponse.json({ success: true });
  } catch (error) {
    return handlePrismaError(error);
  }
}
