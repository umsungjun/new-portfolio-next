import { NextRequest, NextResponse } from "next/server";

import { revalidatePath, revalidateTag } from "next/cache";

import { MediaType, Prisma } from "@prisma/client";

import { requireAdminAuth } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

type RouteParams = { params: Promise<{ id: string }> };

function handlePrismaError(error: unknown, context: string) {
  console.error(`[${context}]`, error);
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
    const { contentKo, contentEn, mediaUrl, mediaType, isDraft } = body;

    // isDraft만 토글하는 케이스: 본문 검증 건너뛰고 isDraft만 업데이트
    const isToggleOnly =
      typeof isDraft === "boolean" &&
      contentKo === undefined &&
      contentEn === undefined &&
      mediaUrl === undefined &&
      mediaType === undefined;

    if (isToggleOnly) {
      await prisma.$executeRaw`
        UPDATE "Answer" SET "isDraft" = ${isDraft} WHERE "id" = ${Number(id)}
      `;
      revalidateTag("answers");
      revalidatePath("/");
      revalidatePath("/en");
      return NextResponse.json({ success: true });
    }

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

    // prisma.answer.update이 MediaType enum을 public.MediaType으로 타입 캐스팅하면서
    // @prisma/adapter-pg에서 PostgreSQL이 타입을 찾지 못하는 버그 우회
    if (typeof isDraft === "boolean") {
      await prisma.$executeRaw`
        UPDATE "Answer"
        SET
          "contentKo" = ${contentKo.trim()},
          "contentEn" = ${contentEn.trim()},
          "mediaUrl"  = ${mediaUrl?.trim() || null},
          "mediaType" = ${mediaType || null},
          "isDraft"   = ${isDraft}
        WHERE "id" = ${Number(id)}
      `;
    } else {
      await prisma.$executeRaw`
        UPDATE "Answer"
        SET
          "contentKo" = ${contentKo.trim()},
          "contentEn" = ${contentEn.trim()},
          "mediaUrl"  = ${mediaUrl?.trim() || null},
          "mediaType" = ${mediaType || null}
        WHERE "id" = ${Number(id)}
      `;
    }

    revalidateTag("answers");
    revalidatePath("/");
    revalidatePath("/en");

    return NextResponse.json({ success: true });
  } catch (error) {
    return handlePrismaError(error, "PUT /api/admin/answers/[id]");
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
    return handlePrismaError(error, "DELETE /api/admin/answers/[id]");
  }
}
