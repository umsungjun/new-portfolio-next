"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

type Question = {
  id: number;
  contentKo: string;
  contentEn: string;
  isDraft: boolean;
  answers: { id: number; isDraft: boolean }[];
};

type FilterMode = "all" | "published" | "draft";

export default function AdminPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("all");

  // 새 질문 추가 폼 상태
  const [newKo, setNewKo] = useState("");
  const [newEn, setNewEn] = useState("");
  const [newIsDraft, setNewIsDraft] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // 인라인 수정 상태
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editKo, setEditKo] = useState("");
  const [editEn, setEditEn] = useState("");

  const fetchQuestions = useCallback(async () => {
    const res = await fetch("/api/admin/questions");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const json = await res.json();
    setQuestions(json.data ?? []);
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentKo: newKo,
        contentEn: newEn,
        isDraft: newIsDraft,
      }),
    });
    if (res.ok) {
      setNewKo("");
      setNewEn("");
      setNewIsDraft(true);
      setIsAdding(false);
      fetchQuestions();
    }
  }

  async function handleToggleDraft(q: Question) {
    const res = await fetch(`/api/admin/questions/${q.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDraft: !q.isDraft }),
    });
    if (res.ok) fetchQuestions();
  }

  function startEdit(q: Question) {
    setEditingId(q.id);
    setEditKo(q.contentKo);
    setEditEn(q.contentEn);
  }

  async function handleUpdate(id: number) {
    const res = await fetch(`/api/admin/questions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentKo: editKo, contentEn: editEn }),
    });
    if (res.ok) {
      setEditingId(null);
      fetchQuestions();
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("이 질문과 모든 답변을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    if (res.ok) fetchQuestions();
  }

  if (isLoading) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <p className="text-gray-500 text-sm">불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-semibold">질문 관리</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAdding((v) => !v)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
          >
            + 질문 추가
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="mb-6 p-4 bg-white rounded-xl border border-gray-200 flex flex-col gap-3"
        >
          <input
            placeholder="한국어 토픽 라벨 (예: [2025] 오픈소스 기여 경험)"
            value={newKo}
            onChange={(e) => setNewKo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
          />
          <input
            placeholder="English Topic Label"
            value={newEn}
            onChange={(e) => setNewEn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
          />
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={newIsDraft}
              onChange={(e) => setNewIsDraft(e.target.checked)}
            />
            임시저장으로 추가 (체크 해제 시 즉시 공개)
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            >
              취소
            </button>
          </div>
        </form>
      )}

      <div className="flex gap-2 mb-3 text-xs">
        {(["all", "published", "draft"] as FilterMode[]).map((mode) => {
          const counts = {
            all: questions.length,
            published: questions.filter((q) => !q.isDraft).length,
            draft: questions.filter((q) => q.isDraft).length,
          };
          const label = { all: "전체", published: "공개됨", draft: "임시저장" }[
            mode
          ];
          return (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === mode
                  ? "bg-gray-900 text-white"
                  : "border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {label} ({counts[mode]})
            </button>
          );
        })}
      </div>

      <ul className="space-y-3">
        {questions
          .filter((q) => {
            if (filter === "published") return !q.isDraft;
            if (filter === "draft") return q.isDraft;
            return true;
          })
          .map((q) => (
          <li
            key={q.id}
            className="p-4 bg-white rounded-xl border border-gray-200"
          >
            {editingId === q.id ? (
              <div className="flex flex-col gap-3">
                <input
                  value={editKo}
                  onChange={(e) => setEditKo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                <input
                  value={editEn}
                  onChange={(e) => setEditEn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(q.id)}
                    className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-700 transition-colors"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-100 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {q.isDraft && (
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-medium shrink-0">
                        임시저장
                      </span>
                    )}
                    <p className="font-medium text-sm truncate">
                      {q.contentKo}
                    </p>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">
                    {q.contentEn}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    답변 {q.answers.length}개
                    {q.answers.filter((a) => a.isDraft).length > 0 && (
                      <span className="text-amber-600 ml-1">
                        (임시저장 {q.answers.filter((a) => a.isDraft).length}개)
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/admin/questions/${q.id}`}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100 transition-colors"
                  >
                    답변 관리
                  </Link>
                  <button
                    onClick={() => handleToggleDraft(q)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      q.isDraft
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    {q.isDraft ? "공개" : "임시저장으로"}
                  </button>
                  <button
                    onClick={() => startEdit(q)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-100 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
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

      {questions.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-12">
          질문이 없습니다.
        </p>
      )}
    </main>
  );
}
