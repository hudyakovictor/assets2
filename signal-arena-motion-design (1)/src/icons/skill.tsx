/* ============================================================================
   SKILL CARD ICONS — c01…c40
   Geometry is the EXACT vector data from the repository:
   github.com/hudyakovictor/assets/skill-card-icons (preview-48.svg / cNN_*.svg).
   Rendering contract taken from the same file:
     · glyph box 48×48, group: fill=none, stroke=#fff, stroke-width=2.75,
       linecap/linejoin=round, white filled masses + white outline details;
     · negative space inside the ring is the CARD COLOR (not teal);
     · outer ring: white, 2px, concentric, identical optical scale for all 40.
   No remote loading, no emoji, no third-party icon library.
   ========================================================================== */
export const CARD_PALETTE = {
  green: "#2E7F5C",
  yellow: "#D0B24A",
  blue: "#4C6180",
  red: "#C56861",
} as const;

export type SkillGroup = keyof typeof CARD_PALETTE;

export interface SkillIconMeta {
  id: string;
  code: string;
  en: string;
  ru: string;
  group: SkillGroup;
  hint: string;
}

const G: SkillGroup = "green";
const Y: SkillGroup = "yellow";
const B: SkillGroup = "blue";
const R: SkillGroup = "red";

export const SKILL_ICONS: SkillIconMeta[] = [
  { id: "c01", code: "c01_market_structure", en: "Market Structure", ru: "СТРУКТУРА", group: G, hint: "Структура рынка: высшие максимумы и высшие минимумы." },
  { id: "c02", code: "c02_higher_timeframe", en: "Higher Timeframe", ru: "СТАРШИЙ ТФ", group: G, hint: "Контекст старшего таймфрейма важнее младшего." },
  { id: "c03", code: "c03_volume_confirmation", en: "Volume Confirmation", ru: "ОБЪЁМ", group: G, hint: "Пробой подтверждается объёмом." },
  { id: "c04", code: "c04_liquidity_map", en: "Liquidity Map", ru: "ЛИКВИДНОСТЬ", group: G, hint: "Карта ликвидности: где стоят стопы и заявки." },
  { id: "c05", code: "c05_volatility_context", en: "Volatility Context", ru: "ВОЛАТИЛЬНОСТЬ", group: G, hint: "Амплитуда расширяется — дистанция стопа считается иначе." },
  { id: "c06", code: "c06_correlation_check", en: "Correlation Check", ru: "КОРРЕЛЯЦИЯ", group: G, hint: "Активы ходят вместе — риск умножается." },
  { id: "c07", code: "c07_derivatives_pulse", en: "Derivatives Pulse", ru: "ДЕРИВАТИВЫ", group: G, hint: "Пульс деривативов: ставки финансирования и открытый интерес." },
  { id: "c08", code: "c08_news_context", en: "News Context", ru: "НОВОСТИ", group: G, hint: "Новость без объёма — просто текст." },
  { id: "c09", code: "c09_social_sentiment", en: "Social Sentiment", ru: "ТОЛПА", group: G, hint: "Настроение толпы: последний покупатель уже зашёл." },
  { id: "c10", code: "c10_macro_context", en: "Macro Context", ru: "МАКРО", group: G, hint: "Макро задаёт ветер, локальный график — парус." },
  { id: "c11", code: "c11_onchain_flow", en: "On-chain Flow", ru: "ONCHAIN", group: G, hint: "Движение монет видно до свечи." },
  { id: "c12", code: "c12_tokenomics_review", en: "Tokenomics Review", ru: "ТОКЕНОМИКА", group: G, hint: "Эмиссия и распределение токена." },
  { id: "c13", code: "c13_unlock_calendar", en: "Unlock Calendar", ru: "АНЛОКИ", group: G, hint: "Календарь разблокировок: давление предложения." },
  { id: "c14", code: "c14_infrastructure_risk", en: "Infrastructure Risk", ru: "ИНФРАСТРУКТУРА", group: G, hint: "Биржа, сеть, мост: где ломается система." },
  { id: "c15", code: "c15_source_quality", en: "Source Quality", ru: "ИСТОЧНИК", group: G, hint: "Проверяй источник до того, как верить цене." },
  { id: "c16", code: "c16_enter_now", en: "Enter Now", ru: "ВОЙТИ СРАЗУ", group: Y, hint: "Вход по рынку: быстро и без подтверждения." },
  { id: "c17", code: "c17_wait_for_retest", en: "Wait for Retest", ru: "ЖДАТЬ РЕТЕСТ", group: Y, hint: "Ждать возврата к уровню и объёма." },
  { id: "c18", code: "c18_define_entry_zone", en: "Define Entry Zone", ru: "ЗОНА ВХОДА", group: Y, hint: "Зона входа вместо одной цены." },
  { id: "c19", code: "c19_define_invalidation", en: "Define Invalidation", ru: "ИНВАЛИДАЦИЯ", group: Y, hint: "Точка, где сценарий мёртв." },
  { id: "c20", code: "c20_set_structural_stop", en: "Set Structural Stop", ru: "СТОП ПО СТРУКТУРЕ", group: Y, hint: "Стоп за структурой, а не за удобством." },
  { id: "c21", code: "c21_target_liquidity", en: "Target Liquidity", ru: "ЦЕЛЬ R", group: Y, hint: "Цель — там, где стоит чужая ликвидность." },
  { id: "c22", code: "c22_minimum_r_multiple", en: "Minimum R Multiple", ru: "МИНИМУМ R", group: Y, hint: "Сделка имеет смысл от 2R." },
  { id: "c23", code: "c23_scale_out", en: "Scale Out", ru: "ЧАСТИЧНАЯ", group: Y, hint: "Фиксируй часть — рынок не обязан держать профит." },
  { id: "c24", code: "c24_no_trade_is_a_decision", en: "No Trade Is a Decision", ru: "НЕ ВХОДИТЬ", group: Y, hint: "Отказ от входа — полноценное решение." },
  { id: "c25", code: "c25_evidence_only", en: "Evidence Only", ru: "ТОЛЬКО ФАКТЫ", group: B, hint: "Смотрим на график, а не на ожидания." },
  { id: "c26", code: "c26_noise_quarantine", en: "Noise Quarantine", ru: "ШУМ В КАРАНТИН", group: B, hint: "Шум не участвует в решении." },
  { id: "c27", code: "c27_risk_first_mode", en: "Risk First Mode", ru: "РИСК ВПЕРЁД", group: B, hint: "Сначала риск, потом потенциальная прибыль." },
  { id: "c28", code: "c28_no_confirmation_no_trade", en: "No Confirmation No Trade", ru: "НЕТ СИГНАЛА", group: B, hint: "Без подтверждения не входим." },
  { id: "c29", code: "c29_higher_timeframe_check", en: "Higher Timeframe Check", ru: "ПРОВЕРКА ТФ", group: B, hint: "Свериться со старшим ТФ перед входом." },
  { id: "c30", code: "c30_after_a_loss", en: "After a Loss", ru: "ПОСЛЕ УБЫТКА", group: B, hint: "После убытка — только наблюдение." },
  { id: "c31", code: "c31_discipline_over_profit", en: "Discipline over Profit", ru: "ДИСЦИПЛИНА", group: B, hint: "Система важнее одной сделки." },
  { id: "c32", code: "c32_out_of_market_is_normal", en: "Out of Market Is Normal", ru: "ВНЕ РЫНКА", group: B, hint: "Вне рынка — рабочее состояние." },
  { id: "c33", code: "c33_news_is_not_a_signal", en: "News Is Not a Signal", ru: "НЕ СИГНАЛ", group: B, hint: "Новость не отменяет график." },
  { id: "c34", code: "c34_wait_for_stabilization", en: "Wait for Stabilization", ru: "СТАБИЛИЗАЦИЯ", group: R, hint: "Сначала останавливается паника, потом появляется вход." },
  { id: "c35", code: "c35_do_not_chase", en: "Do Not Chase", ru: "НЕ ДОГОНЯТЬ", group: R, hint: "Не догонять улетевшую цену." },
  { id: "c36", code: "c36_avoid_revenge_trading", en: "Avoid Revenge Trading", ru: "БЕЗ ОТЫГРЫША", group: R, hint: "Месть рынку — платная услуга." },
  { id: "c37", code: "c37_no_averaging_without_a_plan", en: "No Averaging without a Plan", ru: "БЕЗ УСРЕДНЕНИЯ", group: R, hint: "Усреднение только по плану." },
  { id: "c38", code: "c38_risk_cap", en: "Risk Cap", ru: "ЛИМИТ РИСКА", group: R, hint: "Жёсткий лимит риска на раунд." },
  { id: "c39", code: "c39_confidence_check", en: "Confidence Check", ru: "САМОПРОВЕРКА", group: R, hint: "Уверенность — не аргумент." },
  { id: "c40", code: "c40_preserve_the_system", en: "Preserve the System", ru: "СОХРАНИТЬ СИСТЕМУ", group: R, hint: "Капитал — топливо системы." },
];

export const SKILL_MAP: Record<string, SkillIconMeta> = Object.fromEntries(
  SKILL_ICONS.map((s) => [s.id, s]),
);

export const groupOf = (id: string): SkillGroup => SKILL_MAP[id]?.group ?? G;

/* ---- exact vector bodies (verbatim from skill-card-icons/preview-48.svg) --- */
export const SKILL_GLYPH_MARKUP: Record<string, string> = {
  c01: `<path fill="#ffffff" stroke="none" d="M5 40h9v-9h9v-9h9v-9h7v27H5z"/><path d="M8 27 17 20l8 2 9-9 7 1" stroke-width="2"/>`,
  c02: `<rect x="6" y="8" width="28" height="35" rx="3"/><rect x="21" y="18" width="22" height="25" rx="2" fill="#ffffff" stroke="none"/>`,
  c03: `<rect x="6" y="29" width="9" height="13" rx="1" fill="#ffffff" stroke="none"/><rect x="18" y="22" width="9" height="20" rx="1" fill="#ffffff" stroke="none"/><rect x="30" y="13" width="9" height="29" rx="1" fill="#ffffff" stroke="none"/><path d="m34 10 4 4 8-8" stroke-width="2"/>`,
  c04: `<rect x="6" y="8" width="31" height="5" rx="2" fill="#ffffff" stroke="none"/><rect x="6" y="22" width="25" height="5" rx="2" fill="#ffffff" stroke="none"/><rect x="6" y="36" width="35" height="5" rx="2" fill="#ffffff" stroke="none"/><path d="M8 46c7-2 8-15 15-15 8 0 8-5 18-13M35 18h6v6" stroke-width="2"/>`,
  c05: `<path fill="#ffffff" stroke="none" d="M5 27h8l5-15 7 27 6-19 5 8 7-2v17H5z"/><path d="M6 27h7l5-15 7 27 6-19 5 8 7-2" stroke-width="2"/>`,
  c06: `<path fill="#ffffff" stroke="none" fill-rule="evenodd" d="M17 12a11 11 0 1 0 0 22 11 11 0 0 0 0-22zM17 17a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM31 12a11 11 0 1 0 0 22 11 11 0 0 0 0-22zM31 17a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/><path d="M35 39 39 43 47 33" stroke-width="2"/>`,
  c07: `<path fill="#ffffff" stroke="none" fill-rule="evenodd" d="M5 33a19 19 0 0 1 38 0H5zM11 33a13 13 0 0 1 26 0H11z"/><path fill="#ffffff" stroke="none" d="M21 33 32 19l4 4-9 13z"/><path d="M6 40h36" stroke-width="2"/>`,
  c08: `<path fill="#ffffff" stroke="none" fill-rule="evenodd" d="M6 7h32l5 5v30H6zM12 16h23v3H12zM12 23h17v3H12zM12 30h23v3H12z"/><path d="M43 22 47 26 43 30M47 26h-7" stroke-width="2"/>`,
  c09: `<path fill="#ffffff" stroke="none" d="M6 12a5 5 0 0 1 5-5h22a5 5 0 0 1 5 5v12a5 5 0 0 1-5 5H20L10 36v-7a5 5 0 0 1-4-5z"/><path d="M31 34h5a5 5 0 0 1 5 5v5H28l-6 4" stroke-width="2"/>`,
  c10: `<path fill="#ffffff" stroke="none" fill-rule="evenodd" d="M22 6a18 18 0 1 0 0 36 18 18 0 0 0 0-36zM5 24h34v3H5zM21 6h3v36h-3z"/><path d="M34 8l10 2-5 8" stroke-width="2"/>`,
  c11: `<rect x="5" y="20" width="11" height="11" rx="2" fill="#ffffff" stroke="none"/><rect x="20" y="20" width="11" height="11" rx="2" fill="#ffffff" stroke="none"/><rect x="35" y="20" width="11" height="11" rx="2" fill="#ffffff" stroke="none"/><path d="M16 25h4M31 25h4M39 14l7 0-4-4" stroke-width="2"/>`,
  c12: `<path fill="#ffffff" stroke="none" d="M24 5v19h19A19 19 0 0 0 24 5z"/><path d="M20 10a19 19 0 1 0 19 19H20z"/><path d="M24 5v19h19" stroke-width="2"/>`,
  c13: `<path fill="#ffffff" stroke="none" fill-rule="evenodd" d="M6 11h36v33H6zM6 20h36v3H6zM14 7h3v8h-3zM31 7h3v8h-3zM18 35v-4a6 6 0 0 1 12 0v4h-3v-4a3 3 0 0 0-6 0v4z"/><rect x="16" y="35" width="16" height="9" rx="2" fill="#ffffff" stroke="none"/>`,
  c14: `<path fill="#ffffff" stroke="none" fill-rule="evenodd" d="M5 7h23v34H5zM10 12h13v4H10zM10 21h13v4H10zM10 30h13v4H10z"/><path d="M28 16h5M28 25h5M28 34h5" stroke-width="2.75"/><path d="M36 13v7M36 28v7M36 13h7M36 35h7" stroke-width="2.75"/><circle cx="42" cy="13" r="3" fill="#ffffff" stroke="none"/><circle cx="42" cy="35" r="3" fill="#ffffff" stroke="none"/><path fill="#ffffff" stroke="none" d="M35 20h7l4 7-4 7h-7l-4-7zM37 24h3v5h-3zM42 24h1v5h-1z"/>`,
  c15: `<path fill="#ffffff" stroke="none" fill-rule="evenodd" d="M8 5h25l7 7v31H8zM33 5v9h7M14 20h18v2H14zM14 27h13v2H14zM14 34h8v2H14zM29 35l4 4 8-10 2 2-10 13-7-7z"/>`,
  c16: `<path d="M31 6h12v36H31" stroke-width="2"/><path fill="#ffffff" stroke="none" d="M5 24h28l-8-8h8l11 11-11 11h-8l8-8H5z"/>`,
  c17: `<rect x="5" y="12" width="38" height="5" rx="2" fill="#ffffff" stroke="none"/><path d="M8 17v19h13c8 0 8-13 16-13h6M36 23l7 0-4-4" stroke-width="2"/>`,
  c18: `<path fill="#ffffff" stroke="none" fill-rule="evenodd" d="M13 9h29v30H13zM20 18h17v12H20z"/><path d="M4 24h18M12 17l8 7-8 7" stroke-width="2"/>`,
  c19: `<path d="M5 37 15 27l8 6 8-11" stroke-width="2"/><circle cx="31" cy="22" r="4" fill="#ffffff" stroke="none"/><path fill="#ffffff" stroke="none" d="M36 29h6l4-4 2 2-4 4 4 4-2 2-4-4-4 4-2-2 4-4z"/>`,
  c20: `<rect x="5" y="34" width="30" height="6" rx="2" fill="#ffffff" stroke="none"/><path d="M9 34V25h8v9M21 34V18h8v16" stroke-width="2"/><path fill="#ffffff" stroke="none" fill-rule="evenodd" d="M36 25h7l3 3v6l-3 3h-7l-3-3v-6zM36 31h7v2h-7z"/>`,
  c21: `<path fill="#ffffff" stroke="none" fill-rule="evenodd" d="M24 5a19 19 0 1 0 0 38 19 19 0 0 0 0-38zM24 17a7 7 0 1 1 0 14 7 7 0 0 1 0-14z"/><path d="M6 43 20 29M6 29v14h14" stroke-width="2"/>`,
  c22: `<rect x="8" y="27" width="10" height="15" rx="2" fill="#ffffff" stroke="none"/><rect x="30" y="17" width="10" height="25" rx="2" fill="#ffffff" stroke="none"/><path d="M5 44h38M5 12h38M13 12v7M35 12v7" stroke-width="2"/><text x="21" y="38" fill="#ffffff" stroke="none" font-family="sans-serif" font-size="12" font-weight="700">R</text>`,
  c23: `<rect x="7" y="30" width="9" height="12" rx="1" fill="#ffffff" stroke="none"/><rect x="20" y="22" width="9" height="20" rx="1" fill="#ffffff" stroke="none"/><rect x="33" y="14" width="9" height="28" rx="1" fill="#ffffff" stroke="none"/><path d="M35 9h8l-3-3M43 9l-8 8" stroke-width="2"/>`,
  c24: `<path fill="#ffffff" stroke="none" d="M15 42V22a4 4 0 0 1 8 0v8V13a4 4 0 0 1 8 0v17-13a4 4 0 0 1 8 0v14-9a4 4 0 0 1 8 0v13c0 6-5 9-11 9H24c-5 0-9-3-9-7z"/>`,
  c25: `<path fill="#ffffff" stroke="none" fill-rule="evenodd" d="M7 12h34v25H7zM13 19h22v7H13zM13 29h10v3H13z"/><path d="M28 39 33 44 42 32" stroke-width="2.75"/>`,
  c26: `<path fill="#ffffff" stroke="none" d="M6 18h13l12-7v26l-12-7H6z"/><path d="M38 12v24M44 12v24M36 8l10 32" stroke-width="2"/>`,
  c27: `<path fill="#ffffff" stroke="none" fill-rule="evenodd" d="M24 4 42 11v13c0 11-7 18-18 21C15 42 8 35 8 24V11zM24 14v13h-2l2 5 2-5h-2V14zM24 34v2h2v-2z"/>`,
  c28: `<path fill="#ffffff" stroke="none" fill-rule="evenodd" d="M24 5a19 19 0 1 0 0 38 19 19 0 0 0 0-38zM18 17c0-5 10-6 10 0 0 4-5 5-5 9h3c0-2 5-4 5-9 0-9-15-9-15 0zM23 30v3h3v-3zM7 7l34 34-2 2L5 9z"/>`,
  c29: `<rect x="5" y="7" width="30" height="31" rx="2"/><path d="M10 13h20" stroke-width="2"/><rect x="10" y="28" width="5" height="6" rx="1" fill="#ffffff" stroke="none"/><rect x="18" y="23" width="5" height="11" rx="1" fill="#ffffff" stroke="none"/><rect x="26" y="17" width="5" height="17" rx="1" fill="#ffffff" stroke="none"/><path fill="#ffffff" stroke="none" d="M31 37h5l4-5 2 2-6 8-7-7z"/>`,
  c30: `<path d="M5 12 13 19 20 27 27 35" stroke-width="2.75"/><circle cx="27" cy="35" r="4" fill="#ffffff" stroke="none"/><path d="M27 35c6 0 7-13 15-18M36 17h7v7" stroke-width="2.75"/>`,
  c31: `<path fill="#ffffff" stroke="none" d="M21 14h6v21h-6zM8 21h32v5H8zM5 42h38v4H5z"/><path d="m10 26-6 12h12zM38 26l-6 12h12zM16 42a8 8 0 0 1 16 0" stroke-width="2"/>`,
  c32: `<rect x="11" y="7" width="23" height="35" rx="2" fill="#ffffff" stroke="none"/><path d="M31 7a6 6 0 0 1 6 6v29M6 42h36M26 24h17M37 17l7 7-7 7" stroke-width="2"/>`,
  c33: `<path fill="#ffffff" stroke="none" fill-rule="evenodd" d="M8 5h34v38H8zM14 14h22v2H14zM14 21h22v2H14zM14 28h15v2H14zM6 6l36 36 2-2L8 4z"/>`,
  c34: `<path fill="#ffffff" stroke="none" d="M5 28c6-12 12 12 18 0s12 5 18-3v12H5z"/><rect x="35" y="25" width="9" height="12" rx="2" fill="#ffffff" stroke="none"/><path d="M5 40h39" stroke-width="2"/>`,
  c35: `<path fill="#ffffff" stroke="none" d="M6 38 19 25l7 7 12-18 4 3-15 23-8-7-10 10z"/><path d="m35 14h9l-1 9M7 7l35 35" stroke-width="2"/>`,
  c36: `<path fill="#ffffff" stroke="none" d="m39 12 8 0v8l-4-4a15 15 0 1 0 3 16l4 2a19 19 0 1 1-4-22z"/><path d="M7 7l34 34" stroke-width="2.5"/>`,
  c37: `<path fill="#ffffff" stroke="none" fill-rule="evenodd" d="M7 16h9v26H7zM20 23h9v19h-9zM33 30h9v12h-9zM6 7l36 36 2-2L8 5z"/>`,
  c38: `<path fill="#ffffff" stroke="none" d="M6 7h36v6H6zM8 13h3v4H8zM37 13h3v4h-3z"/><path d="M8 18h32" stroke-width="2"/><rect x="10" y="22" width="7" height="16" rx="1" fill="#ffffff" stroke="none"/><rect x="21" y="25" width="7" height="13" rx="1" fill="#ffffff" stroke="none"/><rect x="32" y="28" width="7" height="10" rx="1" fill="#ffffff" stroke="none"/><path d="M6 41h36" stroke-width="2"/>`,
  c39: `<path fill="#ffffff" stroke="none" fill-rule="evenodd" d="M24 5a19 19 0 1 0 0 38 19 19 0 0 0 0-38zM15 24l6 6 13-14 3 3-16 17-9-9z"/>`,
  c40: `<path fill="#ffffff" stroke="none" d="M6 35h36v7H6zM11 25h7v10h-7zM21 20h7v15h-7zM31 25h7v10h-7zM9 18h30v5H9z"/><path d="M7 15a17 17 0 0 1 34 0M7 15h5M36 15h5" stroke-width="2.75"/><path d="M17 29h2M27 24h2M37 29h2" stroke="#ffffff" stroke-width="2"/>`,
};

/** Glyph with the canonical ring; negative space equals the card colour. */
export function SkillGlyph({ id, size = 46, ringColor }: { id: string; size?: number; ringColor?: string }) {
  const meta = SKILL_MAP[id];
  const markup = SKILL_GLYPH_MARKUP[id];
  if (!meta || !markup) return null;
  const fillColor = ringColor ?? CARD_PALETTE[meta.group];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" role="img">
      <circle cx="24" cy="24" r="23" fill={fillColor} stroke="#ffffff" strokeWidth="2" />
      <g
        transform="translate(24 24) scale(0.7) translate(-24 -24)"
        fill="none"
        stroke="#ffffff"
        strokeWidth={2.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </svg>
  );
}

export interface SkillCardProps {
  id: string;
  picked?: boolean;
  locked?: boolean;
  matched?: boolean | null;
  showCornerStar?: boolean;
  compact?: boolean;
  onClick?: () => void;
  label?: string;
}

export function SkillCard({
  id, picked, locked, matched, showCornerStar, compact, onClick, label,
}: SkillCardProps) {
  const meta = SKILL_MAP[id];
  if (!meta) return null;
  const base = CARD_PALETTE[meta.group];
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "skillcard no-select",
        picked ? "is-picked" : "",
        locked ? "is-locked" : "",
        matched === true ? "anim-pop" : "",
      ].join(" ")}
      style={{ background: `linear-gradient(180deg, ${shade(base, 1.16)} 0%, ${base} 100%)` }}
      aria-pressed={picked}
    >
      {showCornerStar && (
        <span className="corner-star">
          <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l3 6.6 7 .9-5.2 4.8 1.4 7-6.2-3.4L5.8 21.3l1.4-7L2 9.5l7-.9z" fill="#3a2600" />
          </svg>
        </span>
      )}
      <SkillGlyph id={id} size={compact ? 40 : 48} />
      <span className="label">{label ?? meta.ru}</span>
    </button>
  );
}

export function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * k));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * k));
  const b = Math.min(255, Math.round((n & 255) * k));
  return `rgb(${r},${g},${b})`;
}
