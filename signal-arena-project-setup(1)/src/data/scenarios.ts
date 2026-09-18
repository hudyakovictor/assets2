export interface Candle { o: number; h: number; l: number; c: number }

export interface FieldLabel { from: number; to: number; text: string; side?: "top" | "bottom" }

export interface Source { id: string; title: string; body: string; lean: "up" | "down" | "neutral" }

export interface Option { id: string; text: string; quality: "good" | "weak" | "random" }

export interface Scenario {
  run: number;
  name: string; // everyday, no latin
  period: string;
  candles: Candle[]; // full history, visible = 0..t0
  t0: number; // last visible index
  labels: FieldLabel[]; // everyday captions on the field
  fallZone: [number, number]; // for frame 2 recognition
  fact: string; // frame 3 one-line fact
  sources: Source[]; // run 2+
  choices: [string, string]; // кадр 4 онбординга: выше/ниже
  reasons: Option[]; // "На что вы опирались"
  wrongIf: Option[]; // "Я пойму, что ошибся, если…"
  outcome: "up" | "down" | "flat"; // что было дальше
  eventText: string; // бытовое объяснение
  cardHint?: string; // run 4 — какой приём помогает
  // Полный продуктовый заход: WAIT / NO_TRADE как равноправные действия.
  decisions?: DecisionOption[];
}

export interface DecisionOption {
  id: "buy" | "sell" | "wait" | "no-trade";
  text: string; // бытовая формулировка, без цифр
  // С точки зрения исторического исхода: выигрышно / нейтрально / ошибочно.
  // Но оценка ставится за РАССУЖДЕНИЕ, а не за попадание.
  aligns: boolean;
}

/* build OHLC from close sequence, deterministic wicks */
function ohlc(closes: number[], seed = 1): Candle[] {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return closes.map((c, i) => {
    const o = i === 0 ? c - 1 : closes[i - 1];
    const span = Math.abs(c - o) || 1;
    const h = Math.max(o, c) + r() * span * 0.55 + 0.3;
    const l = Math.min(o, c) - r() * span * 0.55 - 0.3;
    return { o, h, l, c };
  });
}

/* ---------- Заход 1 — «угадал не значит понял» ----------
   Цена долго росла, всё остановилось, немного упала. Дальше — выросла. */
const s1 = ohlc(
  [50, 52, 55, 57, 61, 64, 66, 70, 73, 75, 78, 79, 79, 80, 79, 80, 79, 78, 76, 73, 71, 70, 69, 70,
   /* hidden */ 72, 75, 79, 83, 86, 88, 91, 93],
  11,
);

/* ---------- Заход 2 — «рассуждал верно, исход неудачный» ----------
   Цена падала, потом всё остановилось, сделок мало. Дальше — резко вверх. */
const s2 = ohlc(
  [90, 88, 85, 83, 80, 76, 74, 71, 69, 66, 64, 63, 62, 62, 63, 62, 62, 61, 62, 62, 61, 62, 62, 61,
   /* hidden */ 63, 70, 78, 84, 88, 90, 93, 95],
  23,
);

/* ---------- Заход 3 — противоречие источников ---------- */
const s3 = ohlc(
  [60, 62, 61, 64, 66, 65, 68, 70, 69, 72, 74, 73, 76, 75, 78, 77, 79, 78, 80, 79, 81, 80, 82, 81,
   /* hidden */ 79, 74, 68, 62, 58, 55, 53, 52],
  37,
);

/* ---------- Заход 4 — первое применение карты ---------- */
const s4 = ohlc(
  [40, 42, 45, 49, 52, 58, 63, 70, 76, 84, 90, 97, 103, 108, 110, 109, 111, 110, 108, 109, 107, 105, 106, 104,
   /* hidden */ 100, 94, 86, 80, 76, 74, 71, 70],
  51,
);

export const SCENARIOS: Scenario[] = [
  {
    run: 1,
    name: "Биткоин",
    period: "весна, три недели",
    candles: s1,
    t0: 23,
    labels: [
      { from: 1, to: 9, text: "здесь цена росла", side: "top" },
      { from: 11, to: 16, text: "здесь всё остановилось", side: "top" },
      { from: 18, to: 22, text: "здесь цена падала", side: "bottom" },
    ],
    fallZone: [17, 23],
    fact: "За последнюю неделю сделок стало вдвое меньше.",
    sources: [],
    choices: ["Цена пойдёт выше", "Цена пойдёт ниже"],
    reasons: [
      { id: "r1", text: "Цена долго росла — рост продолжится", quality: "weak" },
      { id: "r2", text: "Сделок стало меньше — падение выдыхается", quality: "good" },
      { id: "r3", text: "Просто кажется", quality: "random" },
    ],
    wrongIf: [],
    outcome: "up",
    eventText: "Падение остановилось: продавать было почти некому, и цена спокойно вернулась к росту.",
  },
  {
    run: 2,
    name: "Эфир",
    period: "лето, месяц",
    candles: s2,
    t0: 23,
    labels: [
      { from: 0, to: 9, text: "здесь цена падала", side: "top" },
      { from: 12, to: 22, text: "здесь всё остановилось", side: "bottom" },
    ],
    fallZone: [0, 10],
    fact: "Крупные держатели всю неделю переводили монеты на биржи.",
    sources: [
      { id: "src1", title: "Крупные держатели", body: "Крупные держатели всю неделю переводили монеты на биржи. Обычно так делают перед продажей.", lean: "down" },
      { id: "src2", title: "Число сделок", body: "Сделок очень мало. Рынок будто ждёт чего-то.", lean: "neutral" },
    ],
    choices: ["Цена пойдёт выше", "Цена пойдёт ниже"],
    reasons: [
      { id: "r1", text: "Держатели готовятся продавать — цена пойдёт ниже", quality: "good" },
      { id: "r2", text: "Цена долго стояла — значит, пора расти", quality: "weak" },
      { id: "r3", text: "Просто кажется", quality: "random" },
    ],
    wrongIf: [
      { id: "w1", text: "цена закрепится выше зоны остановки", quality: "good" },
      { id: "w2", text: "пройдёт неделя", quality: "weak" },
      { id: "w3", text: "не знаю", quality: "random" },
    ],
    outcome: "up",
    eventText: "Вышла неожиданная новость об обновлении сети. Цена резко пошла вверх — этого нельзя было прочитать по графику.",
  },
  {
    run: 3,
    name: "Солана",
    period: "осень, месяц",
    candles: s3,
    t0: 23,
    labels: [
      { from: 2, to: 20, text: "здесь цена росла ступеньками", side: "top" },
    ],
    fallZone: [0, 3],
    fact: "",
    sources: [
      { id: "src1", title: "Кошельки", body: "Число активных кошельков растёт третью неделю подряд. Людей становится больше.", lean: "up" },
      { id: "src2", title: "Приток на биржи", body: "Биржи получили рекордный приток монет на продажу за месяц.", lean: "down" },
    ],
    choices: ["Цена пойдёт выше", "Цена пойдёт ниже"],
    reasons: [
      { id: "r1", text: "Людей больше — цена пойдёт выше", quality: "weak" },
      { id: "r2", text: "Монеты несут продавать — цена пойдёт ниже", quality: "weak" },
      { id: "r3", text: "Не знаю, как выбрать между фактами", quality: "random" },
    ],
    wrongIf: [
      { id: "w1", text: "цена уйдёт ниже последней ступеньки", quality: "good" },
      { id: "w2", text: "пройдёт неделя", quality: "weak" },
      { id: "w3", text: "не знаю", quality: "random" },
    ],
    outcome: "down",
    eventText: "Продажи с бирж перевесили приток новых людей. Здесь помогает приём «Сколько сделок».",
  },
  {
    run: 4,
    name: "Догикоин",
    period: "весна, месяц",
    candles: s4,
    t0: 23,
    labels: [
      { from: 3, to: 12, text: "здесь цена росла очень быстро", side: "top" },
      { from: 14, to: 22, text: "здесь всё остановилось", side: "bottom" },
    ],
    fallZone: [18, 23],
    fact: "",
    sources: [
      { id: "src1", title: "Число сделок", body: "На остановке сделок стало втрое меньше, чем во время роста.", lean: "down" },
      { id: "src2", title: "Разговоры", body: "О монете говорят везде. Новых покупателей всё меньше.", lean: "down" },
    ],
    choices: ["Цена пойдёт выше", "Цена пойдёт ниже"],
    decisions: [
      { id: "buy", text: "Купить сейчас", aligns: false },
      { id: "wait", text: "Подождать и не входить", aligns: true },
      { id: "no-trade", text: "В этой ситуации нет сделки", aligns: true },
    ],
    reasons: [
      { id: "r1", text: "Сделок стало меньше — покупатели кончились", quality: "good" },
      { id: "r2", text: "Все говорят — значит, вырастет ещё", quality: "weak" },
      { id: "r3", text: "Просто кажется", quality: "random" },
    ],
    wrongIf: [
      { id: "w1", text: "цена выйдет выше зоны остановки с большим числом сделок", quality: "good" },
      { id: "w2", text: "пройдёт неделя", quality: "weak" },
      { id: "w3", text: "не знаю", quality: "random" },
    ],
    outcome: "down",
    eventText: "Быстрый рост без новых покупателей закончился: цена медленно сползла вниз.",
    cardHint: "c12",
  },
];

export const scenarioOf = (run: number) => SCENARIOS[Math.min(SCENARIOS.length, Math.max(1, run)) - 1];

/* ---------- Оценка: 4 типа итога, 4 цвета ---------- */
export type Verdict = "reasoned-good" | "reasoned-bad" | "random-good" | "random-bad";

export const VERDICT: Record<Verdict, { color: string; title: string; note: string }> = {
  "reasoned-good": { color: "#35E0C8", title: "Рассуждали верно, и всё сложилось", note: "" },
  "reasoned-bad": { color: "#5B8DEF", title: "Рассуждали верно, но вышло иначе", note: "Так бывает. Это не ошибка." },
  "random-good": { color: "#D0A24A", title: "Угадали", note: "повезло" },
  "random-bad": { color: "#B6605A", title: "Не угадали, и объяснения не было", note: "" },
};

export interface ScoreLine { text: string; good: boolean | null }

export function evaluate(
  sc: Scenario,
  choice: number | null,
  reason: string | null,
  wrongIf: string | null,
  decisionId?: string | null,
) {
  // Попадание: либо направление (онбординг, кадр 4), либо действие (продуктовый заход).
  let hit: boolean;
  if (sc.decisions && decisionId != null) {
    const d = sc.decisions.find((x) => x.id === decisionId);
    hit = !!d?.aligns; // WAIT / NO_TRADE при исходе вниз считаются верным прочтением
  } else {
    const chosenDir = choice === 0 ? "up" : "down";
    hit = choice !== null && chosenDir === sc.outcome;
  }
  const r = sc.reasons.find((x) => x.id === reason);
  const w = sc.wrongIf.find((x) => x.id === wrongIf);
  const reasoned = r?.quality === "good";
  // WAIT/NO_TRADE с обоснованием тоже считается рассуждением, даже без «попадания».

  const lines: ScoreLine[] = [];
  lines.push({
    text: `Решение: «${choice === null ? "—" : sc.choices[choice]}» — ${hit ? "совпало с тем, что было" : "не совпало с тем, что было"}`,
    good: hit,
  });
  lines.push({
    text: r
      ? r.quality === "random"
        ? "Почему: «просто кажется» — объяснения не было"
        : r.quality === "good"
          ? `Почему: учли главное — «${r.text.toLowerCase()}»`
          : `Почему: «${r.text.toLowerCase()}» — это не учитывало факт`
      : "Почему: не выбрано",
    good: r ? r.quality === "good" : null,
  });
  if (sc.wrongIf.length) {
    lines.push({
      text: w
        ? w.quality === "good"
          ? `Когда пойму, что ошибся: «${w.text}» — точное условие`
          : `Когда пойму, что ошибся: «${w.text}» — условие размытое`
        : "Когда пойму, что ошибся: не выбрано",
      good: w ? w.quality === "good" : null,
    });
  }
  if (sc.run >= 4) {
    lines.push({ text: "Приём «Сколько сделок» применён к месту", good: reasoned });
    lines.push({ text: "Оба источника учтены", good: true });
    lines.push({ text: "Спешки не было — решение после фактов", good: true });
  }

  const verdict: Verdict = reasoned ? (hit ? "reasoned-good" : "reasoned-bad") : hit ? "random-good" : "random-bad";
  const stars = reasoned ? (w && w.quality === "good" ? 3 : 2) : hit ? 1 : 0;
  return { lines, verdict, hit, reasoned, stars };
}
