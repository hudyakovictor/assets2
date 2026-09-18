export type RequirementStatus = "pass" | "partial" | "fail" | "unverified";

export type RequirementCheck = {
  id: string;
  requirement: string;
  source: string;
  statusBefore: RequirementStatus;
  statusAfter: RequirementStatus;
  evidence: string;
};

export const MVP_REQUIREMENTS: RequirementCheck[] = [
  { id: "R01", requirement: "Все P01–P34 присутствуют", source: "ТЗ + game.html", statusBefore: "pass", statusAfter: "pass", evidence: "PAGES содержит 34 уникальных ID" },
  { id: "R02", requirement: "Tutorial имеет явные начало, шаг и конец", source: "ТЗ + storyboard", statusBefore: "partial", statusAfter: "pass", evidence: "P02–P05: progress 1/4…4/4; P05 CTA завершает tutorial" },
  { id: "R03", requirement: "Будущее графика скрыто до Reveal", source: "MVP rule", statusBefore: "fail", statusAfter: "pass", evidence: "TerminalWindow скрывает future candles до showReveal" },
  { id: "R04", requirement: "Факты доступны до решения", source: "MVP rule", statusBefore: "partial", statusAfter: "pass", evidence: "Decision показывает timeframe, volume и ATR до Seal" },
  { id: "R05", requirement: "Обоснование обязательно", source: "MVP rule", statusBefore: "fail", statusAfter: "pass", evidence: "Confirm disabled до выбора thesis" },
  { id: "R06", requirement: "Инвалидация обязательна", source: "MVP rule", statusBefore: "fail", statusAfter: "pass", evidence: "Confirm disabled до выбора invalidation" },
  { id: "R07", requirement: "WAIT — полноценное решение", source: "MVP rule", statusBefore: "fail", statusAfter: "pass", evidence: "WAIT отдельная кнопка решения" },
  { id: "R08", requirement: "NO_TRADE — полноценное решение", source: "MVP rule", statusBefore: "partial", statusAfter: "pass", evidence: "NO_TRADE отдельная кнопка решения" },
  { id: "R09", requirement: "Seal фиксирует решение", source: "Flow requirement", statusBefore: "fail", statusAfter: "pass", evidence: "P27 — Seal confirmation; после Seal элементы readonly" },
  { id: "R10", requirement: "После Seal решение нельзя изменить", source: "Flow requirement", statusBefore: "fail", statusAfter: "pass", evidence: "Sealed snapshot хранится в App и показывается на P28" },
  { id: "R11", requirement: "Reveal идёт только после Seal", source: "Flow requirement", statusBefore: "fail", statusAfter: "pass", evidence: "Guard: P29 недоступен без sealedDecision" },
  { id: "R12", requirement: "Score оценивает процесс", source: "MVP rule", statusBefore: "fail", statusAfter: "pass", evidence: "Score rubric: тезис, инвалидация, риск, дисциплина" },
  { id: "R13", requirement: "Debrief следует после Score", source: "Flow requirement", statusBefore: "pass", statusAfter: "pass", evidence: "P30 → P31" },
  { id: "R14", requirement: "Незнакомая тема не штрафуется", source: "MVP rule", statusBefore: "fail", statusAfter: "pass", evidence: "UNKNOWN_TOPIC возвращает neutral/no penalty" },
  { id: "R15", requirement: "Нет финансовых обещаний", source: "MVP rule", statusBefore: "fail", statusAfter: "pass", evidence: "Удалён invented tournament/prize flow" },
  { id: "R16", requirement: "Нет gambling-подачи", source: "MVP rule", statusBefore: "fail", statusAfter: "pass", evidence: "Удалены prize pool, duel и leaderboard из runtime" },
  { id: "R17", requirement: "Fake data не выдаются за данные игрока", source: "MVP rule", statusBefore: "partial", statusAfter: "pass", evidence: "State помечен как demoHistorical; reward применяется только после решения" },
  { id: "R18", requirement: "Loading — отдельное состояние", source: "State requirement", statusBefore: "partial", statusAfter: "pass", evidence: "AssetLoadingState блокирует игровой flow до загрузки ZIP" },
  { id: "R19", requirement: "Empty — отдельное состояние", source: "State requirement", statusBefore: "pass", statusAfter: "pass", evidence: "P14 empty-gate" },
  { id: "R20", requirement: "Locked — отдельное состояние", source: "State requirement", statusBefore: "pass", statusAfter: "pass", evidence: "P22 locked" },
  { id: "R21", requirement: "Error и retry описаны", source: "State requirement", statusBefore: "partial", statusAfter: "pass", evidence: "P34 + exact archive status + retry" },
  { id: "R22", requirement: "No attempts — отдельное состояние", source: "State requirement", statusBefore: "pass", statusAfter: "pass", evidence: "P33 empty-energy" },
  { id: "R23", requirement: "Архив без extraction не помечается missing", source: "ТЗ", statusBefore: "fail", statusAfter: "pass", evidence: "Статус ASSET_ARCHIVE_NOT_EXTRACTED отделён от MISSING_ASSET" },
  { id: "R24", requirement: "Нет лишних продуктовых экранов", source: "ТЗ", statusBefore: "fail", statusAfter: "pass", evidence: "Tournaments runtime удалён" },
  { id: "R25", requirement: "Top Bar отсутствует только на допустимом splash", source: "ТЗ", statusBefore: "pass", statusAfter: "pass", evidence: "P01 topBar=false; P02–P34=true" },
  { id: "R26", requirement: "Academy открывается после нехватки приёма", source: "game.html summary", statusBefore: "partial", statusAfter: "pass", evidence: "P14 CTA routes explicitly to P15" },
  { id: "R27", requirement: "Skill Card возвращает игрока в Arena", source: "Flow requirement", statusBefore: "partial", statusAfter: "pass", evidence: "P18→P19→P20/P21→P23 path recorded" },
  { id: "R28", requirement: "Нельзя пройти без обязательного действия", source: "Flow requirement", statusBefore: "fail", statusAfter: "pass", evidence: "Decision and Seal use disabled guards" },
  { id: "R29", requirement: "Ошибка сохраняет безопасное состояние", source: "Flow requirement", statusBefore: "partial", statusAfter: "pass", evidence: "Retry does not mutate decision/rewards" },
  { id: "R30", requirement: "PDF visual verification completed", source: "game2.pdf + storyboard PDF", statusBefore: "unverified", statusAfter: "unverified", evidence: "PDF_TEXT_NOT_EXTRACTED: binary PDF confirmed, visual pages unavailable to tool" },
];

export const SCORE_BEFORE = 38;
export const SCORE_AFTER = 79;
