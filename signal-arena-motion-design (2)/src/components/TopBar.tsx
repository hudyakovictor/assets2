import { IconBell, IconCoin, IconGear, IconSignal, IconStar, IconTarget } from "./Icons";

/* Единый обязательный Top Bar: попытки, звёзды, монеты, уведомления, настройки */
interface Props {
  attempts: number;
  attemptsMax: number;
  stars: number;
  coins: number;
  unread: number;
  onBell: () => void;
  onGear: () => void;
  onAttempts?: () => void;
  onStars?: () => void;
}

export default function TopBar({ attempts, attemptsMax, stars, coins, unread, onBell, onGear, onAttempts, onStars }: Props) {
  const noAttempts = attempts <= 0;
  return (
    <div className="relative z-10 flex items-center gap-1.5 px-3 pt-3">
      <Bar onPress={onAttempts}>
        <span style={{ color: noAttempts ? "#ef6b62" : "#2fd4c4" }}>
          <IconTarget className="h-3.5 w-3.5" />
        </span>
        <span className="font-mono text-[11.5px] font-bold tabular-nums text-white">
          {attempts}
          <span className="text-white/55">/{attemptsMax}</span>
        </span>
        <span className="text-[9px] font-bold tracking-wider text-mist-500">ПОПЫТКИ</span>
      </Bar>

      <Bar onPress={onStars}>
        <span className="text-gold">
          <IconStar className="h-3.5 w-3.5" />
        </span>
        <span className="font-mono text-[11.5px] font-bold tabular-nums text-white">{stars}</span>
        <span className="text-[9px] font-bold tracking-wider text-mist-500">ЗВЁЗДЫ</span>
      </Bar>

      <Bar>
        <span className="text-gold">
          <IconCoin className="h-3.5 w-3.5" />
        </span>
        <span className="font-mono text-[11.5px] font-bold tabular-nums text-white">{coins}</span>
      </Bar>

      <RoundBtn onPress={onBell} badge={unread}>
        <IconBell className="h-3.5 w-3.5" />
      </RoundBtn>
      <RoundBtn onPress={onGear}>
        <IconGear className="h-3.5 w-3.5" />
      </RoundBtn>
    </div>
  );
}

export function TopBarSkeleton() {
  return (
    <div className="relative z-10 flex items-center gap-1.5 px-3 pt-3">
      {[86, 74, 58].map((w) => (
        <div key={w} className="h-8 animate-pulse rounded-full plate" style={{ width: w }} />
      ))}
      <div className="h-8 w-8 animate-pulse rounded-full plate" />
      <div className="h-8 w-8 animate-pulse rounded-full plate" />
    </div>
  );
}

export function SignalChip({ value }: { value: string }) {
  return (
    <span className="flex items-center gap-1 rounded-full plate px-2 py-1 text-[10.5px] font-bold text-white">
      <span style={{ color: "#2fd4c4" }}>
        <IconSignal className="h-3 w-3" />
      </span>
      {value}
    </span>
  );
}

function Bar({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
  return (
    <button
      onPointerDown={onPress}
      className="flex h-8 min-w-0 items-center gap-1 rounded-full plate px-2 transition-transform duration-75 active:scale-95"
    >
      {children}
    </button>
  );
}

function RoundBtn({ children, onPress, badge = 0 }: { children: React.ReactNode; onPress: () => void; badge?: number }) {
  return (
    <button
      onPointerDown={onPress}
      className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full plate text-mist-300 transition-transform duration-75 active:scale-90"
    >
      {children}
      {badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-coral px-0.5 text-[8.5px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}
