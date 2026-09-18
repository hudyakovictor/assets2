/**
 * CANONICAL TOP BAR — matches the provided reference screenshots.
 * Layout (left → right):
 *   [ gear · XP badge · progress text ]  [ coin · value ]  ($SIG on shop)
 *   spacer
 *   [ bell dot ]  [ gear ]
 * All icons are vector SVG — no emoji.
 */
import { IcCoin, IcBell, IcGear, IcSig } from "./icons";
import { useProgress, xpForLevel } from "./store";

export interface TopBarProps {
  showSig?: boolean;
  onBell?: () => void;
  onGear?: () => void;
}

export function TopBarCanonical({ showSig, onBell, onGear }: TopBarProps) {
  const p = useProgress();
  const need = xpForLevel(p.lvl);
  const xpPct = Math.min(1, p.xp / need);

  return (
    <header className="cg-topbar" data-topbar="SHARED_TOP_BAR_LOCKED">
      {/* XP capsule with embedded gear + progress fill */}
      <div className="xp-pill" title={`Уровень ${p.lvl} · ${p.xp}/${need} XP`}>
        <div className="xp-fill" style={{ width: `${xpPct * 100}%` }} />
        <span className="xp-gear">
          <IcGear size={16} />
        </span>
        <span className="xp-badge">XP</span>
        <span className="xp-text tabular-nums">
          {p.xp}/{need}
        </span>
      </div>

      {/* Coins capsule */}
      <div className="tb-pill coin" title="Монеты">
        <span className="tb-ic" style={{ color: "#ffc24a" }}>
          <IcCoin size={18} />
        </span>
        <span className="tabular-nums">{p.coins.toLocaleString("ru-RU")}</span>
      </div>

      {/* Premium $SIG — only in the shop section */}
      {showSig && (
        <div className="tb-pill" title="Премиум $SIG">
          <span className="tb-ic" style={{ color: "#b39bff" }}>
            <IcSig size={18} />
          </span>
          <span className="tb-ic-label tabular-nums">
            <span className="sig-name">$SIG</span>
            {p.sig}
          </span>
        </div>
      )}

      <div style={{ flex: 1 }} />

      <button type="button" className="icon-btn" onClick={onBell} aria-label="Уведомления" title="Уведомления">
        <IcBell size={18} />
        <span className="bell-dot" />
      </button>
      <button type="button" className="icon-btn" onClick={onGear} aria-label="Настройки" title="Настройки">
        <IcGear size={18} />
      </button>
    </header>
  );
}
