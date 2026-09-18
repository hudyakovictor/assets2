import { RepoIcon, type TopbarIconFile } from "./RepoAssets";
import { haptic, sfx } from "../lib/feel";

/*
 * SHARED_TOP_BAR_LOCKED
 * 5 обязательных слотов из topbar.zip: попытки · звёзды · монеты · уведомления · настройки.
 * Все иконки берутся из архива репозитория (см. RepoAssets).
 * Меняются только динамические значения: LVL, XP, attempts, stars, coins, badge, disabled.
 */

export interface CasualTopBarProps {
  lvl?: number;
  xp?: number;
  xpMax?: number;
  attempts?: number;
  attemptsMax?: number;
  stars?: number;
  coins?: number;
  hasNotif?: boolean;
  onNotifClick?: () => void;
  onSettingsClick?: () => void;
  onAttemptsClick?: () => void;
}

function Pill({
  children,
  tone = "teal",
  disabled = false,
}: {
  children: React.ReactNode;
  tone?: "teal" | "gold";
  disabled?: boolean;
}) {
  const t =
    tone === "gold"
      ? { bg: "from-[#2c2410] to-[#1a1508]", br: "border-[#d0b24a]/50", glow: "rgba(208,178,74,.28)" }
      : { bg: "from-[#15323c] to-[#0f2430]", br: "border-[#2dd4bf]/40", glow: "rgba(45,212,191,.24)" };
  return (
    <div
      className={`tb-pill flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r ${t.bg} border ${t.br} shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]`}
      style={disabled ? { filter: "grayscale(.75) brightness(.7)" } : { boxShadow: `0 2px 8px ${t.glow}, inset 0 1px 1px rgba(255,255,255,0.18)` }}
    >
      {children}
    </div>
  );
}

function RoundBtn({
  onClick,
  title,
  children,
  badge,
}: {
  onClick?: () => void;
  title: string;
  children: React.ReactNode;
  badge?: boolean;
}) {
  return (
    <button
      onClick={() => {
        haptic("tap");
        sfx.tap();
        onClick?.();
      }}
      className="tb-round relative w-11 h-11 rounded-full bg-[#1b253b] border border-[#2b3a59] flex items-center justify-center active:bg-[#23314f] active:scale-95 transition-all shadow-md"
      title={title}
      aria-label={title}
    >
      {children}
      {badge && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#e8705f] border-2 border-[#111827]" />
      )}
    </button>
  );
}

export function CasualTopBar({
  lvl = 7,
  xp = 680,
  xpMax = 1000,
  attempts = 3,
  attemptsMax = 5,
  stars = 24,
  coins = 1240,
  hasNotif = true,
  onNotifClick,
  onSettingsClick,
  onAttemptsClick,
}: CasualTopBarProps) {
  const pct = Math.max(0, Math.min(100, (xp / Math.max(1, xpMax)) * 100));
  const noAttempts = attempts === 0;

  return (
    <div className="casual-tb w-full flex items-center gap-1.5 px-2 py-2 bg-gradient-to-b from-[#111827] to-[#0d1424] border-b border-[#1e2c47]/80 select-none z-20">
      {/* LVL + XP (геометрия из topbar.html) */}
      <button
        onClick={() => {
          haptic("select");
          sfx.select();
        }}
        className="flex items-center gap-2 min-w-0 active:scale-[.98] transition-transform"
        title={`Уровень ${lvl} · ${xp}/${xpMax} XP`}
      >
        <span className="w-8 h-8 shrink-0 rounded-xl bg-gradient-to-b from-[#5eead4] to-[#0d9488] text-[#042f2e] text-[12px] font-black grid place-items-center shadow-[0_2px_6px_rgba(45,212,191,.4),inset_0_1px_0_rgba(255,255,255,.5)]">
          {lvl}
        </span>
        <span className="min-w-0">
          <span className="flex items-baseline gap-1">
            <span className="text-[10px] font-black tracking-wider px-1 py-[1px] rounded-full bg-[#2dd4bf] text-[#042f2e]">
              XP
            </span>
            <span className="text-[12px] font-black text-white tabular-nums">
              {xp}
              <span className="text-[#64748b] font-medium">/{xpMax}</span>
            </span>
          </span>
          <span className="tb-xpbar block mt-1 h-[4px] w-[62px] rounded-full bg-[#1b253b] overflow-hidden">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-[#5eead4] to-[#d0b24a] transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </span>
        </span>
      </button>

      {/* Правый кластер: попытки · звёзды · монеты · уведомления · настройки */}
      <div className="ml-auto flex items-center gap-1.5">
        {/* попытки — lightning.svg */}
        <button
          onClick={() => {
            haptic(noAttempts ? "error" : "tap");
            sfx.tap();
            onAttemptsClick?.();
          }}
          className="active:scale-95 transition-transform"
          title={noAttempts ? "Попытки закончились" : `Попытки ${attempts}/${attemptsMax}`}
          aria-label="Попытки"
        >
          <Pill tone="teal" disabled={noAttempts}>
            <RepoIcon file={"lightning.svg" as TopbarIconFile} className="w-[15px] h-[15px] text-[#5eead4]" />
            <span className="text-[11px] font-black text-white tabular-nums">
              {attempts}
              <span className="text-[#64748b] font-medium">/{attemptsMax}</span>
            </span>
          </Pill>
        </button>

        {/* звёзды — star.svg */}
        <div className="active:scale-95 transition-transform" title={`Звёзды ${stars}`}>
          <Pill tone="gold">
            <RepoIcon file={"star.svg" as TopbarIconFile} className="w-[15px] h-[15px] text-[#f0d68a]" />
            <span className="text-[11px] font-black text-white tabular-nums">{stars}</span>
          </Pill>
        </div>

        {/* монеты — coin.svg */}
        <div className="active:scale-95 transition-transform" title={`Монеты ${coins}`}>
          <Pill tone="gold">
            <RepoIcon file={"coin.svg" as TopbarIconFile} className="w-[15px] h-[15px] text-[#f0d68a]" />
            <span className="text-[11px] font-black text-[#fef08a] tabular-nums tracking-wide">
              {coins.toLocaleString("ru-RU")}
            </span>
          </Pill>
        </div>

        {/* уведомления — bell.svg */}
        <RoundBtn onClick={onNotifClick} title="Уведомления" badge={hasNotif}>
          <RepoIcon file={"bell.svg" as TopbarIconFile} className="w-[18px] h-[18px] text-[#94a3b8]" />
        </RoundBtn>

        {/* настройки — gear.svg */}
        <RoundBtn onClick={onSettingsClick} title="Настройки">
          <RepoIcon file={"gear.svg" as TopbarIconFile} className="w-[18px] h-[18px] text-[#94a3b8]" />
        </RoundBtn>
      </div>
    </div>
  );
}
