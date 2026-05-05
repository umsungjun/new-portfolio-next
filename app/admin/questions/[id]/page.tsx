"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type MediaType = "IMAGE" | "VIDEO";

type Answer = {
  id: number;
  contentKo: string;
  contentEn: string;
  mediaUrl: string | null;
  mediaType: MediaType | null;
};

type QuestionWithAnswers = {
  id: number;
  contentKo: string;
  contentEn: string;
  answers: Answer[];
};

const EMPTY_FORM = {
  contentKo: "",
  contentEn: "",
  mediaUrl: "",
  mediaType: "" as MediaType | "",
};

export default function AdminAnswersPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<QuestionWithAnswers | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState(EMPTY_FORM);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  const fetchQuestion = useCallback(async () => {
    const res = await fetch("/api/admin/questions");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const json = await res.json();
    const found = (json.data as QuestionWithAnswers[]).find(
      (q) => q.id === Number(id)
    );
    setQuestion(found ?? null);
    setIsLoading(false);
  }, [id, router]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: Number(id),
        contentKo: newForm.contentKo,
        contentEn: newForm.contentEn,
        mediaUrl: newForm.mediaUrl || null,
        mediaType: newForm.mediaType || null,
      }),
    });
    if (res.ok) {
      setNewForm(EMPTY_FORM);
      setIsAdding(false);
      fetchQuestion();
    }
  }

  function startEdit(a: Answer) {
    setEditingId(a.id);
    setEditForm({
      contentKo: a.contentKo,
      contentEn: a.contentEn,
      mediaUrl: a.mediaUrl ?? "",
      mediaType: a.mediaType ?? "",
    });
  }

  async function handleUpdate(answerId: number) {
    const res = await fetch(`/api/admin/answers/${answerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentKo: editForm.contentKo,
        contentEn: editForm.contentEn,
        mediaUrl: editForm.mediaUrl || null,
        mediaType: editForm.mediaType || null,
      }),
    });
    if (res.ok) {
      setEditingId(null);
      fetchQuestion();
    }
  }

  async function handleDelete(answerId: number) {
    if (!window.confirm("이 답변을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/admin/answers/${answerId}`, {
      method: "DELETE",
    });
    if (res.ok) fetchQuestion();
  }

  if (isLoading) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <p className="text-gray-500 text-sm">불러오는 중...</p>
      </main>
    );
  }

  if (!question) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <p className="text-gray-500 text-sm">질문을 찾을 수 없습니다.</p>
        <Link href="/admin" className="text-blue-500 text-sm mt-2 block">
          ← 질문 목록으로
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <Link
        href="/admin"
        className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
      >
        ← 질문 목록으로
      </Link>

      <div className="mt-4 mb-6 p-4 bg-white rounded-xl border border-gray-200">
        <p className="font-medium text-sm">{question.contentKo}</p>
        <p className="text-gray-500 text-xs mt-0.5">{question.contentEn}</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold">
          답변 목록 ({question.answers.length}개)
        </h2>
        <button
          onClick={() => setIsAdding((v) => !v)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
        >
          + 답변 추가
        </button>
      </div>

      {isAdding && (
        <AnswerForm
          form={newForm}
          onChange={setNewForm}
          onSubmit={handleCreate}
          onCancel={() => {
            setIsAdding(false);
            setNewForm(EMPTY_FORM);
          }}
          submitLabel="추가"
        />
      )}

      <ul className="space-y-3">
        {question.answers.map((a) => (
          <li
            key={a.id}
            className="p-4 bg-white rounded-xl border border-gray-200"
          >
            {editingId === a.id ? (
              <AnswerForm
                form={editForm}
                onChange={setEditForm}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate(a.id);
                }}
                onCancel={() => setEditingId(null)}
                submitLabel="저장"
              />
            ) : (
              <div className="flex gap-3 items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-sm whitespace-pre-wrap">{a.contentKo}</p>
                  <p className="text-gray-500 text-xs mt-2 whitespace-pre-wrap">{a.contentEn}</p>
                  {a.mediaType && (
                    <p className="text-xs mt-1 text-blue-500">
                      {a.mediaType}: {a.mediaUrl}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(a)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-100 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="px-3 py-1.5 border border-red-200 text-red-500 rounded-lg text-xs hover:bg-red-50 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {question.answers.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-8">
          답변이 없습니다.
        </p>
      )}
    </main>
  );
}

type FormState = typeof EMPTY_FORM;

function AnswerForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  form: FormState;
  onChange: (f: FormState) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const inputClass =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300";

  return (
    <form
      onSubmit={onSubmit}
      className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-3"
    >
      <textarea
        placeholder="한국어 답변"
        value={form.contentKo}
        onChange={(e) => onChange({ ...form, contentKo: e.target.value })}
        className={`${inputClass} resize-y min-h-[400px]`}
        required
      />
      <textarea
        placeholder="English Answer"
        value={form.contentEn}
        onChange={(e) => onChange({ ...form, contentEn: e.target.value })}
        className={`${inputClass} resize-y min-h-[400px]`}
        required
      />
      <input
        placeholder="미디어 URL (선택, Google Drive 파일 ID 또는 YouTube URL)"
        value={form.mediaUrl}
        onChange={(e) => onChange({ ...form, mediaUrl: e.target.value })}
        className={inputClass}
      />
      <select
        value={form.mediaType}
        onChange={(e) =>
          onChange({ ...form, mediaType: e.target.value as MediaType | "" })
        }
        className={inputClass}
      >
        <option value="">미디어 없음</option>
        <option value="IMAGE">IMAGE</option>
        <option value="VIDEO">VIDEO</option>
      </select>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  );
}
