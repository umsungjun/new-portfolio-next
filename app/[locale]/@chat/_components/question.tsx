import { LOCALE_KO } from "@/lib/client/constants";

import { Question as QuestionType } from "@prisma/client";

interface QuestionProps {
  showMark?: boolean;
  locale: string;
  chat: QuestionType;
}

export default function Question({
  showMark = true,
  locale,
  chat,
}: QuestionProps) {
  return (
    <div className="questionWrapper">
      {showMark && <div className="questionMark">Q</div>}
      <p>{locale === LOCALE_KO ? chat.contentKo : chat.contentEn}</p>
    </div>
  );
}
