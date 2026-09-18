/* ============================================================
   ASSET REGISTRY — every assetId originates from
   github.com/hudyakovictor/assets. No emojis, no randoms.
   ============================================================ */

export type AssetId =
  // 5 Top Bar icons (icons/ in /topbar)
  | "tb-lightning" | "tb-star" | "tb-coin" | "tb-bell" | "tb-gear"
  // 40 skill card icons (skill-card-icons/)
  | "c01" | "c02" | "c03" | "c04" | "c05" | "c06" | "c07" | "c08"
  | "c09" | "c10" | "c11" | "c12" | "c13" | "c14" | "c15" | "c16"
  | "c17" | "c18" | "c19" | "c20" | "c21" | "c22" | "c23" | "c24"
  | "c25" | "c26" | "c27" | "c28" | "c29" | "c30" | "c31" | "c32"
  | "c33" | "c34" | "c35" | "c36" | "c37" | "c38" | "c39" | "c40"
  // chart treatments (procedural, generated, deterministic per variant)
  | "chart-default" | "chart-reveal" | "chart-dense" | "chart-minimal"
  // background / scene tints
  | "bg-arena" | "bg-deck" | "bg-cave" | "bg-volatility"
  // sticker (handwritten sticky note)
  | "sticker-warning" | "sticker-rule" | "sticker-pact" | "sticker-humor";

export type AssetMeta = {
  id: AssetId;
  kind: "icon" | "chart" | "bg" | "sticker";
  /** color group for skill cards (ТЗ lock: green/yellow/blue/red) */
  cardColor?: "green" | "yellow" | "blue" | "red";
  src?: string;          // svg url for icon-only assets
  label: string;         // fallback description
  tooltip: string;
};

/* groups per ТЗ: c01–c15 green · c16–c24 yellow · c25–c33 blue · c34–c40 red */
const SKILL_CARDS: AssetMeta[] = [
  ...Array.from({ length: 15 }, (_, i): AssetMeta => {
    const n = String(i + 1).padStart(2, "0");
    return {
      id: `c${n}` as AssetId, kind: "icon", cardColor: "green",
      src: `/skill-cards/c${n}_${SKILL_NAMES[i]}.svg`,
      label: SKILL_LABELS[i], tooltip: SKILL_TOOLTIPS[i],
    };
  }),
  ...Array.from({ length: 9 }, (_, i): AssetMeta => {
    const n = String(i + 16).padStart(2, "0");
    return {
      id: `c${n}` as AssetId, kind: "icon", cardColor: "yellow",
      src: `/skill-cards/c${n}_${SKILL_NAMES[i + 15]}.svg`,
      label: SKILL_LABELS[i + 15], tooltip: SKILL_TOOLTIPS[i + 15],
    };
  }),
  ...Array.from({ length: 9 }, (_, i): AssetMeta => {
    const n = String(i + 25).padStart(2, "0");
    return {
      id: `c${n}` as AssetId, kind: "icon", cardColor: "blue",
      src: `/skill-cards/c${n}_${SKILL_NAMES[i + 24]}.svg`,
      label: SKILL_LABELS[i + 24], tooltip: SKILL_TOOLTIPS[i + 24],
    };
  }),
  ...Array.from({ length: 7 }, (_, i): AssetMeta => {
    const n = String(i + 34).padStart(2, "0");
    return {
      id: `c${n}` as AssetId, kind: "icon", cardColor: "red",
      src: `/skill-cards/c${n}_${SKILL_NAMES[i + 33]}.svg`,
      label: SKILL_LABELS[i + 33], tooltip: SKILL_TOOLTIPS[i + 33],
    };
  }),
];

const TOP_BAR: AssetMeta[] = [
  { id: "tb-lightning", kind: "icon", src: "/icons/lightning.svg", label: "Lightning (XP)", tooltip: "XP icon — bolt" },
  { id: "tb-star", kind: "icon", src: "/icons/star.svg", label: "Star (Lives)", tooltip: "Lives / attempts" },
  { id: "tb-coin", kind: "icon", src: "/icons/coin.svg", label: "Coin (Currency)", tooltip: "In-game currency" },
  { id: "tb-bell", kind: "icon", src: "/icons/bell.svg", label: "Bell (Notifications)", tooltip: "Notification badge" },
  { id: "tb-gear", kind: "icon", src: "/icons/gear.svg", label: "Gear (Settings)", tooltip: "Settings menu" },
];

export const ASSETS: AssetMeta[] = [...TOP_BAR, ...SKILL_CARDS, {
  id: "chart-default", kind: "chart", label: "Default Candle Chart", tooltip: "Standard BTC/USDT 15M chart",
}, {
  id: "chart-reveal", kind: "chart", label: "Reveal Chart", tooltip: "Forward-play chart with future candles hidden until Seal",
}, {
  id: "chart-dense", kind: "chart", label: "Dense Heatmap", tooltip: "Heatmap-style volatility",
}, {
  id: "chart-minimal", kind: "chart", label: "Minimal Sparkline", tooltip: "Line-only educational view",
}, {
  id: "bg-arena", kind: "bg", label: "Arena BG", tooltip: "Brand arena gradient",
}, {
  id: "bg-deck", kind: "bg", label: "Deck BG", tooltip: "Battle deck gradient",
}, {
  id: "bg-cave", kind: "bg", label: "Vault BG", tooltip: "Vault drill gradient",
}, {
  id: "bg-volatility", kind: "bg", label: "Volatility BG", tooltip: "Volatility drift gradient",
}, {
  id: "sticker-warning", kind: "sticker", label: "Sticky Warning", tooltip: "Handwritten warning note",
}, {
  id: "sticker-rule", kind: "sticker", label: "Sticky Rule", tooltip: "Handwritten rule",
}, {
  id: "sticker-pact", kind: "sticker", label: "Sticky Pact", tooltip: "Handwritten pact",
}, {
  id: "sticker-humor", kind: "sticker", label: "Sticky Humor", tooltip: "Handwritten joke",
}];

export const ASSET_MAP: Record<string, AssetMeta> =
  Object.fromEntries(ASSETS.map((a) => [a.id, a]));

export const CARD_COLOR: Record<string, string> = {
  green: "#2E7F5C",
  yellow: "#D0B24A",
  blue: "#4C6180",
  red: "#C56861",
};

const SKILL_NAMES = [
  "market_structure","higher_timeframe","volume_confirmation","liquidity_map","volatility_context",
  "correlation_check","derivatives_pulse","news_context","social_sentiment","macro_context",
  "onchain_flow","tokenomics_review","unlock_calendar","infrastructure_risk","source_quality",
  "enter_now","wait_for_retest","define_entry_zone","define_invalidation","set_structural_stop",
  "target_liquidity","minimum_r_multiple","scale_out","no_trade_is_a_decision",
  "evidence_only","noise_quarantine","risk_first_mode","no_confirmation_no_trade","higher_timeframe_check",
  "after_a_loss","discipline_over_profit","out_of_market_is_normal","news_is_not_a_signal",
  "wait_for_stabilization","do_not_chase","avoid_revenge_trading","no_averaging_without_a_plan","risk_cap",
  "confidence_check","preserve_the_system",
];

const SKILL_LABELS = [
  "Market Structure", "Higher Timeframe", "Volume Confirmation", "Liquidity Map", "Volatility Context",
  "Correlation Check", "Derivatives Pulse", "News Context", "Social Sentiment", "Macro Context",
  "On-chain Flow", "Tokenomics Review", "Unlock Calendar", "Infrastructure Risk", "Source Quality",
  "Enter Now", "Wait for Retest", "Define Entry Zone", "Define Invalidation", "Set Structural Stop",
  "Target Liquidity", "Minimum R Multiple", "Scale Out", "No Trade is a Decision",
  "Evidence Only", "Noise Quarantine", "Risk-first Mode", "No Confirmation, No Trade", "Higher-TF Check",
  "After a Loss", "Discipline over Profit", "Out of Market is Normal", "News is Not a Signal",
  "Wait for Stabilization", "Do Not Chase", "Avoid Revenge Trading", "No Averaging without a Plan",
  "Risk Cap", "Confidence Check", "Preserve the System",
];

const SKILL_TOOLTIPS = [
  "Читай структуру рынка до того, как график тебе соврёт.",
  "Старший таймфрейм — твой судья. Младший — только подсказка.",
  "Без подтверждения объёмом — это шум, а не сигнал.",
  "Найди, где скопилась ликвидность. Туда и придёт цена.",
  "Контекст волатильности меняет смысл любой свечи.",
  "Прежде чем входить — проверь, не ходит ли актив за соседом.",
  "Пульс деривативов: ставки крупных игроков — лучший компас.",
  "Новости — это контекст, а не приказ к действию.",
  "Настроение толпы против тебя? Не ломай её, обойди.",
  "Макро решает, куда пойдёт весь рынок.",
  "On-chain потоки показывают, где настоящие деньги.",
  "Токеномика — это ДНК актива. Без неё ты слеп.",
  "Разблокировки — это не новости, а обещания.",
  "Инфраструктурный риск убивает сильнее плохого трейда.",
  "Качество источника важнее количества сигналов.",
  "Входи сейчас — когда структура и подтверждение сошлись.",
  "Подожди ретест — лучшая точка входа ещё впереди.",
  "Определи зону входа. Не входи в пустоту.",
  "Знай, при каком уровне идея мертва.",
  "Структурный стоп — там, где рынок, а не там, где удобно.",
  "Целься в ликвидность, а не в красивую цену.",
  "Сделка без минимального R — это не сделка.",
  "Сокращай — пусть рынок докажет остальное.",
  "Решение не торговать — это тоже решение.",
  "Только доказательства. Без них ты угадываешь.",
  "Шум отправить в карантин. Он заразен.",
  "Риск первым — прибыль второй. Всегда.",
  "Нет подтверждения — нет сделки.",
  "Спроси старший таймфрейм.",
  "После потери — пауза, не реванш.",
  "Дисциплина дороже прибыли.",
  "Вне рынка — нормальное состояние трейдера.",
  "Новость — это заголовок. Не сигнал.",
  "Подожди стабилизации — торопиться некуда.",
  "Не гонись за ценой. Она вернётся.",
  "Не мсти рынку. Это его территория.",
  "Усреднение без плана — это донат.",
  "Жёсткий потолок риска. Каждой сделке.",
  "Проверь уверенность. Реальную.",
  "Сначала сохрани систему. Потом — прибыль.",
];
