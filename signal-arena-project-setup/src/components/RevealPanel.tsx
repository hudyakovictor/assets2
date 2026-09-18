import { RepoSkillIcon } from "./RepoAssets";
import { IconCheck } from "./StudioIcons";

export type RevealStage = "scrub" | "event" | "score" | "debrief";
export type Verdict = "wait" | "notrade" | "wrong" | "none";

interface Props {
  stage: RevealStage;
  verdict: Verdict;
  scoreRows: { label: string; ok: boolean; note: string }[];
  unknownAsset: boolean;
  tutorialDone: boolean;
  onAdvance: () => void;
}

/**
 * Разбор захода после Seal. Каждая стадия — одна мысль и одна CTA,
 * чтобы игрок всегда понимал, что происходит и что делать дальше.
 */
export function RevealPanel({ stage, verdict, scoreRows, unknownAsset, tutorialDone, onAdvance }: Props) {
  const earned = scoreRows.filter((r) => r.ok).length;

  return (
    <div className="w-full rounded-[20px] bg-[#162036] border-2 border-[#253352] p-2.5 flex flex-col gap-2 max-h-[240px] overflow-y-auto thin-scroll">
      {/* Стадийный индикатор */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#5eead4]">
          {stage === "scrub" && "Перематываем историю"}
          {stage === "event" && "Ключевое событие"}
          {stage === "score" && "Оценка процесса"}
          {stage === "debrief" && "Разбор захода"}
        </span>
        <div className="flex gap-1">
          {(["scrub", "event", "score", "debrief"] as RevealStage[]).map((s, i) => {
            const cur = ["scrub", "event", "score", "debrief"].indexOf(stage);
            return (
              <span
                key={s}
                className="w-4 h-1 rounded-full"
                style={{ background: i <= cur ? "#5eead4" : "#243553" }}
              />
            );
          })}
        </div>
      </div>

      {/* 1. TIME-SCRUB */}
      {stage === "scrub" && (
        <div className="py-3">
          <div className="h-1.5 rounded-full bg-[#0d1424] overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#2dd4bf] to-[#D0B24A] reveal-scrub-bar" />
          </div>
          <p className="text-[11.5px] text-slate-300 mt-2">
            Решение запечатано и не меняется. Историческое продолжение графика дорисовывается…
          </p>
        </div>
      )}

      {/* 2. КЛЮЧЕВОЕ СОБЫТИЕ */}
      {stage === "event" && (
        <div>
          <div
            className="rounded-[14px] p-2.5 border"
            style={{
              background: verdict === "wrong" ? "rgba(197,104,97,.14)" : "rgba(46,127,92,.14)",
              borderColor: verdict === "wrong" ? "#C5686155" : "#2E7F5C66",
            }}
          >
            <div className="text-[12.5px] font-black text-white leading-snug">
              {verdict === "wait" && "Цена вернулась к ретесту $67 800 и отскочила вверх"}
              {verdict === "notrade" &&
                (unknownAsset
                  ? "Незнакомый актив ушёл в боковик — сигналов на сделку так и не появилось"
                  : "Пробой не получил объём — цена сползла ниже точки t0")}
              {verdict === "wrong" && "Пробой не удержался: объём упал, цену вернули под уровень — стоп сработал"}
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug">
              Объём на импульсе не подтвердил движение (c03). Это видно только после Seal — раньше будущее было закрыто.
            </p>
          </div>
          <button
            onClick={onAdvance}
            className="mt-2.5 w-full min-h-[46px] rounded-[13px] bg-gradient-to-b from-[#2dd4bf] to-[#0d9488] text-[#042f2c] text-[13px] font-black active:scale-[.99] transition-transform"
          >
            Показать оценку
          </button>
        </div>
      )}

      {/* 3. ОЦЕНКА ПРОЦЕССА */}
      {stage === "score" && (
        <div>
          <div className="flex flex-col gap-1.5">
            {scoreRows.map((r) => (
              <div key={r.label} className="flex items-center gap-2 rounded-[12px] bg-[#0d1424] px-2.5 py-2">
                <span
                  className="w-5 h-5 rounded-full grid place-items-center shrink-0"
                  style={{ background: r.ok ? "#2E7F5C" : "#3a4760" }}
                >
                  {r.ok ? <IconCheck className="w-3 h-3" /> : <span className="w-2 h-[2px] bg-slate-400 rounded" />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[11.5px] font-black text-white leading-tight">{r.label}</span>
                  <span className="block text-[10px] text-slate-400">{r.note}</span>
                </span>
                <span className="text-[12px] font-black" style={{ color: r.ok ? "#8fe6bd" : "#94a3b8" }}>
                  {r.ok ? "+1★" : "0★"}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-[12px] bg-[#0f2e2e] px-3 py-2 mt-1.5">
            <span className="text-[11px] font-black text-[#5eead4]">
              {unknownAsset && verdict !== "wrong" ? "Незнакомый актив — без штрафа (c32)" : "Оценка за процесс, а не за угадывание"}
            </span>
            <span className="text-[14px] font-black text-[#E7D18C]">{earned}★</span>
          </div>
          <button
            onClick={onAdvance}
            className="mt-2.5 w-full min-h-[46px] rounded-[13px] bg-gradient-to-b from-[#2dd4bf] to-[#0d9488] text-[#042f2c] text-[13px] font-black active:scale-[.99] transition-transform"
          >
            К разбору
          </button>
        </div>
      )}

      {/* 4. ДЕБРИФ */}
      {stage === "debrief" && (
        <div>
          <div className="flex flex-col gap-1.5">
            <DebriefRow id="c03" tone="#2E7F5C" title="Ты увидел" text="Пробой без роста объёма — движение не подтверждено." />
            <DebriefRow id="c19" tone="#C56861" title="Можно усилить" text="Перед входом задавай уровень инвалидации и структурный стоп." />
            <DebriefRow id="c17" tone="#4C6180" title="Что применить" text="Жди ретест уровня и подтверждение объёмом — это следующий заход." />
          </div>
          {!tutorialDone && (
            <div className="mt-2 rounded-[12px] bg-[#2E7F5C]/20 border border-[#2E7F5C]/60 px-3 py-2 text-[11.5px] font-black text-[#8fe6bd]">
              Обучение завершено! Дальше Академия открывается, только когда упрёшься в нехватку приёма.
            </div>
          )}
          <button
            onClick={onAdvance}
            className="mt-2.5 w-full min-h-[48px] rounded-[13px] bg-gradient-to-b from-[#3f9c74] via-[#2E7F5C] to-[#226247] text-white text-[13px] font-black active:scale-[.99] transition-transform"
          >
            Следующий сценарий
          </button>
        </div>
      )}
    </div>
  );
}

function DebriefRow({ id, tone, title, text }: { id: string; tone: string; title: string; text: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-[12px] bg-[#0d1424] px-2.5 py-2">
      <RepoSkillIcon id={id} size={34} />
      <span className="min-w-0">
        <span className="block text-[9px] font-black uppercase tracking-wider" style={{ color: tone }}>
          {title}
        </span>
        <span className="block text-[11px] text-slate-200 leading-snug">{text}</span>
      </span>
    </div>
  );
}
