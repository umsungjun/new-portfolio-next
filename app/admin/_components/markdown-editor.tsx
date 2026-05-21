"use client";

import dynamic from "next/dynamic";

// @uiw/react-md-editor는 navigator/window에 직접 의존하므로 SSR 비활성화
// CSS는 admin layout에서 import (글로벌 CSS는 layout 진입점에서 로드)
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface AdminMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export default function AdminMarkdownEditor({
  value,
  onChange,
  placeholder,
  height = 400,
}: AdminMarkdownEditorProps) {
  return (
    <div
      data-color-mode="light"
      className="rounded-lg overflow-hidden border border-gray-200"
    >
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? "")}
        height={height}
        preview="live"
        textareaProps={{ placeholder }}
      />
    </div>
  );
}
