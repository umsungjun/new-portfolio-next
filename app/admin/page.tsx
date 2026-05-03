"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

type Question = {
  id: number;
  contentKo: string;
  contentEn: string;
  answers: { id: number }[];
};

export default function AdminPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 새 질문 추가 폼 상태
  const [newKo, setNewKo] = useState("");
  const [newEn, setNewEn] = useState("");
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
      body: JSON.stringify({ contentKo: newKo, contentEn: newEn }),
    });
    if (res.ok) {
      setNewKo("");
      setNewEn("");
      setIsAdding(false);
      fetchQuestions();
    }
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
            placeholder="한국어 질문"
            value={newKo}
            onChange={(e) => setNewKo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
          />
          <input
            placeholder="English Question"
            value={newEn}
            onChange={(e) => setNewEn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
          />
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

      <ul className="space-y-3">
        {questions.map((q) => (
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
                  <p className="font-medium text-sm truncate">{q.contentKo}</p>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">
                    {q.contentEn}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    답변 {q.answers.length}개
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
