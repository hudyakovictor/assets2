import React from "react";

export type IconProps = {
  className?: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
};

/* ------------------------------------------------------------------ *
 * CANDLESTICK + SWORD METAPHOR
 * Образ двух скрещённых японских свечей в форме клинков / мечей
 * Свеча с фитилём и телом образует клинок и эфес — ключевой символ Арены!
 * ------------------------------------------------------------------ */
export function CrossedCandlestickSwordsIcon({
  className = "",
  size = 24,
  style,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="csw-green" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67E6B2" />
          <stop offset="1" stopColor="#258E62" />
        </linearGradient>
        <linearGradient id="csw-coral" x1="32" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF8F87" />
          <stop offset="1" stopColor="#C8453E" />
        </linearGradient>
        <filter id="csw-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Меч-свеча 1 (бычья, наклон вправо) */}
      <g transform="rotate(-45 16 16)" filter="url(#csw-glow)">
        {/* Верхний фитиль / остриё клинка */}
        <line x1="16" y1="3" x2="16" y2="8" stroke="#E2FAF0" strokeWidth="2" strokeLinecap="round" />
        {/* Тело свечи / лезвие меча */}
        <rect x="13" y="8" width="6" height="13" rx="2" fill="url(#csw-green)" stroke="#E2FAF0" strokeWidth="1" />
        <line x1="16" y1="9" x2="16" y2="20" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round" />
        {/* Гарда / ограничитель */}
        <rect x="10.5" y="21" width="11" height="2" rx="1" fill="#E2A93B" stroke="#875A12" strokeWidth="0.6" />
        {/* Нижний фитиль / рукоять */}
        <line x1="16" y1="23" x2="16" y2="29" stroke="#E2A93B" strokeWidth="2.4" strokeLinecap="round" />
        {/* Навершие */}
        <circle cx="16" cy="29.5" r="1.5" fill="#FFE082" />
      </g>

      {/* Меч-свеча 2 (медвежья, наклон влево) */}
      <g transform="rotate(45 16 16)" filter="url(#csw-glow)">
        {/* Верхний фитиль / остриё клинка */}
        <line x1="16" y1="3" x2="16" y2="8" stroke="#FFE2DF" strokeWidth="2" strokeLinecap="round" />
        {/* Тело свечи / лезвие меча */}
        <rect x="13" y="8" width="6" height="13" rx="2" fill="url(#csw-coral)" stroke="#FFE2DF" strokeWidth="1" />
        <line x1="16" y1="9" x2="16" y2="20" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round" />
        {/* Гарда */}
        <rect x="10.5" y="21" width="11" height="2" rx="1" fill="#E2A93B" stroke="#875A12" strokeWidth="0.6" />
        {/* Нижний фитиль / рукоять */}
        <line x1="16" y1="23" x2="16" y2="29" stroke="#E2A93B" strokeWidth="2.4" strokeLinecap="round" />
        {/* Навершие */}
        <circle cx="16" cy="29.5" r="1.5" fill="#FFE082" />
      </g>

      {/* Центральная искра столкновения */}
      <circle cx="16" cy="16" r="2.2" fill="#FFFFFF" />
      <circle cx="16" cy="16" r="3.6" fill="#67E6B2" opacity="0.5" />
    </svg>
  );
}

/* ---------------- Японские свечи (Candlesticks) ---------------- */
export function CandlestickChartIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* 1: Зелёная свеча */}
      <line x1="6" y1="3" x2="6" y2="21" stroke="#50C890" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="4" y="6" width="4" height="9" rx="1.2" fill="#50C890" />
      {/* 2: Красная свеча */}
      <line x1="12" y1="5" x2="12" y2="20" stroke="#EB635B" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="10" y="8" width="4" height="8" rx="1.2" fill="#EB635B" />
      {/* 3: Зелёная свеча */}
      <line x1="18" y1="2" x2="18" y2="18" stroke="#50C890" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="16" y="5" width="4" height="7" rx="1.2" fill="#50C890" />
    </svg>
  );
}

/* ---------------- Газета / Новости ---------------- */
export function NewspaperIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8" />
      <rect x="6" y="7" width="5" height="5" rx="1" fill="currentColor" fillOpacity="0.8" />
      <line x1="13" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="13" y1="11" x2="18" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="6" y1="15" x2="18" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="6" y1="17.5" x2="14" y2="17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Стакан ордеров / Order Book (DOM) ---------------- */
export function OrderBookIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="5" cy="6" r="1.5" fill="#EB635B" />
      <line x1="9" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="5" cy="11" r="1.5" fill="#EB635B" />
      <line x1="9" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="5" cy="16" r="1.5" fill="#50C890" />
      <line x1="9" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="5" cy="20" r="1.5" fill="#50C890" />
      <line x1="9" y1="20" x2="14" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Кит / Whale Radar ---------------- */
export function WhaleIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M2 14C2.5 9 6.5 8 11 8C17 8 20 10.5 22 13C20.5 13.5 18 13.8 16 13C17 11.5 19 11.5 19 11.5C17.5 11 15 11 13 12C11 13 7 14 5 13.5C4 13.2 2.8 13.5 2 14Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="10.5" r="1" fill="#131B28" />
      {/* Хвост */}
      <path d="M2 14C1 12.5 0.5 11 1 9.5C2 10.5 3 11.5 4 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* Фонтанчик */}
      <path d="M9 7C9 5.5 8.5 4.5 7.5 4M10 6.5C10.5 5 11.5 4.5 12.5 4" stroke="#79D4F2" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Календарь ---------------- */
export function CalendarIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="5" width="18" height="15" rx="2.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8" />
      <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.8" />
      <line x1="7" y1="3" x2="7" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="17" y1="3" x2="17" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="7.5" cy="13" r="1.2" fill="currentColor" />
      <circle cx="12" cy="13" r="1.2" fill="currentColor" />
      <circle cx="16.5" cy="13" r="1.2" fill="currentColor" />
      <circle cx="7.5" cy="16.5" r="1.2" fill="currentColor" />
      <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
      <circle cx="16.5" cy="16.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Чат / Сообщение ---------------- */
export function ChatBubbleIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 6.5C4 4.567 5.567 3 7.5 3H16.5C18.433 3 20 4.567 20 6.5V13.5C20 15.433 18.433 17 16.5 17H8.5L4 21V6.5Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="10" r="1.2" fill="currentColor" />
      <circle cx="12" cy="10" r="1.2" fill="currentColor" />
      <circle cx="16" cy="10" r="1.2" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Плюс ---------------- */
export function PlusIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Стрелка тренда (ТРЕНД) ---------------- */
export function TrendUpIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 17L8.5 11.5L12.5 15.5L20.5 7.5M20.5 7.5H15.5M20.5 7.5V12.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------- Объём (столбцы) ---------------- */
export function VolumeBarsIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="11" width="4.5" height="10" rx="1.5" fill="currentColor" fillOpacity="0.75" />
      <rect x="10" y="4" width="4.5" height="17" rx="1.5" fill="currentColor" />
      <rect x="16" y="8" width="4.5" height="13" rx="1.5" fill="currentColor" fillOpacity="0.85" />
    </svg>
  );
}

/* ---------------- Щит (РИСК) ---------------- */
export function ShieldIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3L4 6V11C4 16.5 7.5 21 12 22C16.5 21 20 16.5 20 11V6L12 3Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M12 6.5L6.5 8.5V11C6.5 14.8 8.8 18 12 19V6.5Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  );
}

/* ---------------- Часы с замком (ЖДАТЬ) ---------------- */
export function ClockLockIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" />
      <line x1="12" y1="7" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="12" x2="15.5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Маленький замок в правом нижнем углу */}
      <g transform="translate(13, 13)">
        <rect x="0" y="2.5" width="7" height="5.5" rx="1" fill="#FFE082" stroke="#875A12" strokeWidth="0.8" />
        <path d="M1.8 2.5V1.5C1.8 0.7 2.6 0 3.5 0C4.4 0 5.2 0.7 5.2 1.5V2.5" stroke="#FFE082" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

/* ---------------- Стрелка вверх (Войти сразу) ---------------- */
export function UpArrowIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 4L5 11H9V20H15V11H19L12 4Z" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Песочные часы (Ждать ретест) ---------------- */
export function HourglassIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 3H18M6 21H18M7 3C7 9 11 12 11 12C11 12 7 15 7 21M17 3C17 9 13 12 13 12C13 12 17 15 17 21"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Песчинки */}
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      <circle cx="12" cy="18.5" r="1" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Старшие таймфреймы ---------------- */
export function MultiTimeframeIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 5.5V8L9.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="15" r="5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 12.5V15L17.5 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 14C5 16 7 18 10 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
    </svg>
  );
}

/* ---------------- Предупреждение / Риск ---------------- */
export function AlertTriangleIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3.5L21.5 20H2.5L12 3.5Z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <line x1="12" y1="9" x2="12" y2="14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.2" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Шапка магистра (Академия) ---------------- */
export function GraduationCapIcon({ className = "", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3L1 9L12 15L23 9L12 3Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M5 11.5V16.5C5 19.5 8.1 22 12 22C15.9 22 19 19.5 19 16.5V11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Кисточка */}
      <path d="M21 10.5V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="21" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Колода карт (Коллекция) ---------------- */
export function CardsDeckIcon({ className = "", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Задняя карта */}
      <rect x="7" y="2" width="13" height="17" rx="2.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.6" transform="rotate(8 13.5 10.5)" />
      {/* Передняя карта */}
      <rect x="4" y="5" width="13" height="17" rx="2.5" fill="currentColor" fillOpacity="0.45" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="10.5" cy="13.5" r="2.5" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Три точки (Ещё) ---------------- */
export function ThreeDotsIcon({ className = "", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="5" cy="12" r="2.2" fill="currentColor" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      <circle cx="19" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Золотая монета ---------------- */
export function CoinIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
      <defs>
        <radialGradient id="coin-gold" cx="40%" cy="30%" r="70%">
          <stop stopColor="#FFF2A3" />
          <stop offset="0.4" stopColor="#F5C042" />
          <stop offset="0.85" stopColor="#C98818" />
          <stop offset="1" stopColor="#7E5007" />
        </radialGradient>
      </defs>
      {/* Тень монеты */}
      <circle cx="14" cy="14" r="13" fill="url(#coin-gold)" stroke="#80530A" strokeWidth="1.2" />
      <circle cx="14" cy="14" r="10.5" stroke="#FFE98A" strokeWidth="1" strokeOpacity="0.75" />
      {/* Символ биткоина / монеты */}
      <path
        d="M13 8V10M16 8V10M13 18V20M16 18V20M11 10H15.5C16.8 10 17.8 10.8 17.8 12C17.8 12.9 17.2 13.6 16.3 13.9C17.5 14.2 18.2 15.1 18.2 16.2C18.2 17.5 17 18 15.5 18H11V10Z"
        stroke="#593902"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------- Звезда ---------------- */
export function StarIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id="star-gold" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE57F" />
          <stop offset="1" stopColor="#E2A028" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill="url(#star-gold)"
        stroke="#8F5E0C"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------- Колокольчик уведомлений ---------------- */
export function BellIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z"
        fill="currentColor"
        fillOpacity="0.85"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M10.3 21C10.7 21.6 11.3 22 12 22C12.7 22 13.3 21.6 13.7 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Шестерёнка настроек ---------------- */
export function GearIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        fill="currentColor"
      />
      <path
        d="M19.4 13C19.45 12.67 19.5 12.34 19.5 12C19.5 11.66 19.45 11.33 19.4 11L21.54 9.33C21.73 9.18 21.79 8.91 21.66 8.69L19.66 5.23C19.54 5 19.27 4.93 19.05 5.02L16.53 6.03C16 5.62 15.43 5.29 14.8 5.04L14.42 2.36C14.38 2.12 14.18 1.95 13.94 1.95H9.94C9.7 1.95 9.5 2.12 9.46 2.36L9.08 5.04C8.45 5.29 7.88 5.63 7.35 6.03L4.83 5.02C4.6 4.92 4.34 5.01 4.22 5.23L2.22 8.69C2.1 8.91 2.15 9.18 2.34 9.33L4.48 11C4.43 11.33 4.4 11.67 4.4 12C4.4 12.33 4.43 12.67 4.48 13L2.34 14.67C2.15 14.82 2.09 15.09 2.22 15.31L4.22 18.77C4.34 19 4.61 19.08 4.83 18.98L7.35 17.97C7.88 18.38 8.45 18.71 9.08 18.96L9.46 21.64C9.5 21.88 9.7 22.05 9.94 22.05H13.94C14.18 22.05 14.38 21.88 14.42 21.64L14.8 18.96C15.43 18.71 16 18.37 16.53 17.97L19.05 18.98C19.28 19.08 19.54 18.99 19.66 18.77L21.66 15.31C21.78 15.09 21.73 14.82 21.54 14.67L19.4 13Z"
        fill="currentColor"
        fillOpacity="0.75"
      />
    </svg>
  );
}

/* ---------------- Кубок турнира ---------------- */
export function TrophyIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <defs>
        <linearGradient id="trop-gold" x1="16" y1="2" x2="16" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF2A3" />
          <stop offset="0.5" stopColor="#F5BE38" />
          <stop offset="1" stopColor="#B87B14" />
        </linearGradient>
      </defs>
      {/* Чаша */}
      <path
        d="M8 5H24V14C24 18.4 20.4 22 16 22C11.6 22 8 18.4 8 14V5Z"
        fill="url(#trop-gold)"
        stroke="#80540B"
        strokeWidth="1.4"
      />
      {/* Ручки */}
      <path
        d="M8 8H4C3 8 2 9 2 10.5C2 13 4 15 7.5 15H8"
        stroke="#F5BE38"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M24 8H28C29 8 30 9 30 10.5C30 13 28 15 24.5 15H24"
        stroke="#F5BE38"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Ножка и база */}
      <rect x="14" y="22" width="4" height="4" fill="#C98818" stroke="#80540B" strokeWidth="1" />
      <path d="M10 26H22V29C22 29.5 21.5 30 21 30H11C10.5 30 10 29.5 10 29V26Z" fill="#E2A32B" stroke="#80540B" strokeWidth="1.2" />
      {/* Звезда на чаше */}
      <path d="M16 9L17.2 12.2L20.5 12.5L18 14.7L18.8 18L16 16.3L13.2 18L14 14.7L11.5 12.5L14.8 12.2L16 9Z" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

/* ---------------- Корона лидера ---------------- */
export function CrownIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 18L5 9L9.5 13.5L12 6L14.5 13.5L19 9L21 18H3Z"
        fill="#FFD54F"
        stroke="#9E6B0D"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="5" cy="8.5" r="1.5" fill="#FFE082" />
      <circle cx="12" cy="5.5" r="1.5" fill="#FFE082" />
      <circle cx="19" cy="8.5" r="1.5" fill="#FFE082" />
      <line x1="3" y1="18.5" x2="21" y2="18.5" stroke="#9E6B0D" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Аватар Сиба-ину ---------------- */
export function AvatarShibaIcon({ className = "", size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <rect width="32" height="32" rx="9" fill="#F4AF61" />
      {/* Ушки */}
      <polygon points="6,4 12,11 6,12" fill="#E08B34" />
      <polygon points="26,4 20,11 26,12" fill="#E08B34" />
      <polygon points="8,6 11,10 8,11" fill="#FFFFFF" />
      <polygon points="24,6 21,10 24,11" fill="#FFFFFF" />
      {/* Мордочка */}
      <ellipse cx="16" cy="20" rx="9" ry="8" fill="#FFF4E6" />
      {/* Глаза */}
      <circle cx="12" cy="17" r="1.6" fill="#3D2005" />
      <circle cx="20" cy="17" r="1.6" fill="#3D2005" />
      {/* Носик */}
      <ellipse cx="16" cy="19.5" rx="2" ry="1.2" fill="#3D2005" />
      {/* Ротик */}
      <path d="M14.5 21.5C15 22.2 17 22.2 17.5 21.5" stroke="#3D2005" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Аватар Рыцарь ---------------- */
export function AvatarKnightIcon({ className = "", size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <rect width="32" height="32" rx="9" fill="#5A6D85" />
      {/* Шлем */}
      <path d="M10 10C10 6 13 4 16 4C19 4 22 6 22 10V22C22 25 19 27 16 27C13 27 10 25 10 22V10Z" fill="#C5D3E3" />
      {/* Прорезь для глаз */}
      <rect x="12" y="13" width="8" height="2.5" rx="1" fill="#1C2735" />
      {/* Плюмаж */}
      <path d="M15 4V1C15 0.5 16.5 0.5 17 1V4" stroke="#EB635B" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Аватар Трейдер с бородой ---------------- */
export function AvatarTraderIcon({ className = "", size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <rect width="32" height="32" rx="9" fill="#756499" />
      {/* Лицо */}
      <circle cx="16" cy="15" r="8" fill="#F8CBA6" />
      {/* Волосы */}
      <path d="M9 13C9 9 12 7 16 7C20 7 23 9 23 13C21 11 18 10 16 10C14 10 11 11 9 13Z" fill="#3D2B1F" />
      {/* Борода */}
      <path d="M11 16C11 21 13.5 24 16 24C18.5 24 21 21 21 16H11Z" fill="#3D2B1F" />
      {/* Глаза */}
      <circle cx="13.5" cy="14" r="1.2" fill="#241810" />
      <circle cx="18.5" cy="14" r="1.2" fill="#241810" />
    </svg>
  );
}

/* ---------------- Молния / Паника ---------------- */
export function LightningZapIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Колонны / Банк / Фундамент ---------------- */
export function BankPillarsIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M2 8L12 3L22 8V10H2V8Z" fill="currentColor" />
      <rect x="4" y="11" width="2.5" height="7" rx="0.5" fill="currentColor" />
      <rect x="9" y="11" width="2.5" height="7" rx="0.5" fill="currentColor" />
      <rect x="14" y="11" width="2.5" height="7" rx="0.5" fill="currentColor" />
      <rect x="18.5" y="11" width="2.5" height="7" rx="0.5" fill="currentColor" />
      <rect x="2" y="19" width="20" height="2.5" rx="0.5" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Простые часы (без замка) ---------------- */
export function SimpleClockIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" />
      <polyline points="12,7 12,12 15,14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Галочка выполнения (Векторная) ---------------- */
export function CheckmarkIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- Крестик закрытия ---------------- */
export function CloseIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Лупа поиска ---------------- */
export function SearchIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2.2" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Стрелка вправо (CTA) ---------------- */
export function ArrowRightIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 12H20M20 12L13 5M20 12L13 19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- Замок (locked) ---------------- */
export function LockIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10.5V7.5C8 5.3 9.8 3.5 12 3.5C14.2 3.5 16 5.3 16 7.5V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="15.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Молния энергии / попыток ---------------- */
export function BoltIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M13 2L4 14H11L10 22L20 9H12.5L13 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- Повторить / Refresh ---------------- */
export function RefreshIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M20 12C20 16.4 16.4 20 12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4C15 4 17.6 5.7 19 8.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M19 3.5V8.5H14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- Скачать / Export ---------------- */
export function DownloadIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3V15M12 15L7 10M12 15L17 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Скрестие прицела ---------------- */
export function CrosshairIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="1.5" x2="12" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="18" x2="12" y2="22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="1.5" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="12" x2="22.5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Рукописный смайлик (Doodle Smiley как на референсе) ---------------- */
export function HandDrawnSmileyIcon({ className = "", size = 32 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Неровный круг от руки */}
      <path
        d="M18 3.5C26 3.2 32.5 9.5 32.8 17.5C33.1 25.8 26.2 32.8 18 32.5C9.5 32.2 3.2 25.8 3.5 17.5C3.8 9.8 10 3.8 18 3.5Z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Глаза-точки */}
      <circle cx="12.5" cy="14" r="2.2" fill="currentColor" />
      <circle cx="23.5" cy="14" r="2.2" fill="currentColor" />
      {/* Дуга улыбки от руки */}
      <path
        d="M10.5 21C13 25.8 23 25.8 25.5 21"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------------- Ползунки / Настройки параметров ---------------- */
export function SlidersIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <line x1="4" y1="21" x2="4" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="10" x2="4" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="21" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="8" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="21" x2="20" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="12" x2="20" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="4" cy="12" r="2.5" fill="currentColor" />
      <circle cx="12" cy="10" r="2.5" fill="currentColor" />
      <circle cx="20" cy="14" r="2.5" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Глаз / Просмотр ---------------- */
export function EyeIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M1 12C3 7 7 4 12 4C17 4 21 7 23 12C21 17 17 20 12 20C7 20 3 17 1 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3" />
    </svg>
  );
}

/* ---------------- Медаль пьедестала (Векторная, без эмодзи) ---------------- */
export function MedalBadgeIcon({
  className = "",
  size = 18,
  rank = 1,
}: IconProps & { rank?: 1 | 2 | 3 }) {
  const colors = {
    1: { ribbon: "#EB635B", medal: "#F5BE38", border: "#8C5E0A" },
    2: { ribbon: "#4C6B94", medal: "#D1DDEB", border: "#6D8199" },
    3: { ribbon: "#754522", medal: "#D9935F", border: "#6E3A15" },
  }[rank];

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M7 2L12 9L17 2H13.5L12 5.5L10.5 2H7Z" fill={colors.ribbon} />
      <circle cx="12" cy="14" r="7" fill={colors.medal} stroke={colors.border} strokeWidth="1.2" />
      <circle cx="12" cy="14" r="5" stroke="#FFF" strokeWidth="0.8" strokeOpacity="0.4" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fill={colors.border}
        fontSize="8.5"
        fontWeight="900"
        fontFamily="sans-serif"
      >
        {rank}
      </text>
    </svg>
  );
}
