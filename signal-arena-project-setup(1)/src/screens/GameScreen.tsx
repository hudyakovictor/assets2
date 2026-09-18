import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TopBar from "../components/TopBar";
import { BottomNav } from "../components/ui";
import { Ambient } from "../components/fx";
import { PAGES, type PageDef, type VariantTreatment } from "../data/pages";
import { useGame } from "../game/store";
import * as O from "./Onboarding";
import * as P from "./Product";

interface Props {
  page: PageDef;
  variant: VariantTreatment;
  onNext?: () => void; // Play-mode flow
  onNav?: (k: "academy" | "arena" | "profile") => void;
  onBell?: () => void;
  onGear?: () => void;
}

/* ---------- PLAY FLOW: what follows each page in a real session ---------- */
export function nextPageId(current: string, ctx: { academyUnlocked: boolean }): string {
  const map: Record<string, string> = {
    P01: "P02", P02: "P03", P03: "P04", P04: "P05", P05: "P06", P06: "P07", P07: "P08", P08: "P09",
    P09: "P10", // заход 2
    P10: "P10b", P10b: "P10c", P10c: "P10d", P10d: "P10e", P10e: "P11",
    P11: "P12", // заход 3
    P12: "P13", P13: "P13b", P13b: "P14", P14: "P15",
    P15: "P21", // заход 4 → полный заход F
    P21: "P23", P23: "P23s", P23s: "P24", P24: "P33", P33: "P26", P26: "P20",
    P20: "P19", P19: "P21",
    P16: "P17", P17: "P18", P18: "P20", P22: "P23", P25: "P26", P27: "P20", P28: "P20", P29: "P20", P30: "P16", P31: "P17", P32: "P23", P34: "P21",
  };
  return map[current] ?? (ctx.academyUnlocked ? "P20" : "P01");
}

/* Virtual sub-steps for play flow (same screens, different run) */
const VIRTUAL: Record<string, { base: string; props: Record<string, unknown> }> = {
  P10b: { base: "P04", props: { run: 2 } },
  P10c: { base: "P05", props: { run: 2 } },
  P10d: { base: "P06", props: { run: 2 } },
  P10e: { base: "P07", props: { run: 2 } },
  P13b: { base: "P13", props: { cardId: "c01", step: 2, total: 2 } },
  P23s: { base: "P06", props: { run: 4 } },
};

export function resolvePage(id: string): { page: PageDef; extra: Record<string, unknown> } {
  const v = VIRTUAL[id];
  const baseId = v ? v.base : id;
  const page = PAGES.find((p) => p.id === baseId) ?? PAGES[0];
  return { page, extra: v?.props ?? {} };
}

export default function GameScreen({ page, variant, onNext, onNav, onBell, onGear }: Props & { extra?: Record<string, unknown> }) {
  return <Inner page={page} variant={variant} onNext={onNext} onNav={onNav} onBell={onBell} onGear={onGear} />;
}

export function Inner({ page, variant, onNext, onNav, onBell, onGear, extra = {} }: Props & { extra?: Record<string, unknown> }) {
  const { state, dispatch } = useGame();
  const next = useCallback(() => onNext?.(), [onNext]);
  const props = { ...(page.props ?? {}), ...extra };
  const inRun = /^(f0[2-7]|f1[025]|F-run|H-decision|I-reveal|G-source|P-unknown)/.test(page.screen);

  return (
    <div className="app-shell relative flex h-full flex-col overflow-hidden arena-bg" style={{ height: "100%" }}>
      <Ambient accent={variant.accent} />
      {page.hasTopBar && (
        <TopBar
          state={{ attempts: state.attempts, attemptsMax: state.attemptsMax, stars: state.stars, coins: state.coins, notifications: state.notifications, pulse: state.pulse }}
          onBell={() => { dispatch({ type: "readNotifications" }); onBell?.(); }}
          onGear={onGear}
        />
      )}
      <div className="relative flex min-h-0 flex-1 flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page.id + JSON.stringify(extra)}
            className="flex min-h-0 flex-1 flex-col"
            initial={variantMotion(variant.motion).initial}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -24, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <VariantShell variant={variant}>
              <Screen page={page} v={variant} next={next} props={props} />
            </VariantShell>
          </motion.div>
        </AnimatePresence>
      </div>
      {page.hasNav && !inRun && (
        <BottomNav
          active={page.section === "Академия" || page.section === "Карты" ? "academy" : page.section === "Профиль" ? "profile" : "arena"}
          academyLocked={!state.academyUnlocked}
          onGo={onNav}
        />
      )}
    </div>
  );
}

function VariantShell({ variant, children }: { variant: VariantTreatment; children: React.ReactNode }) {
  if (variant.layoutMode === "split") {
    return (
      <div className="flex min-h-0 flex-1">
        <div className="flex w-9 shrink-0 flex-col items-center gap-2 border-r border-[#29405b] bg-[#101a2b] pt-4">
          {[0, 1, 2, 3].map((n) => <span key={n} className="h-1.5 w-1.5 rounded-full" style={{ background: n === 0 ? "#26e6c8" : "#3b4e69" }} />)}
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
      </div>
    );
  }
  if (variant.layoutMode === "cards-focus") {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col px-1.5 pb-1.5">
        <div className="pointer-events-none absolute inset-x-8 top-4 h-20 rounded-full bg-[#26e6c8]/10 blur-3xl" />
        <div className="relative flex min-h-0 flex-1 flex-col rounded-t-[22px] border-x border-t border-[#2a405a] bg-[#0d1728]/80">{children}</div>
      </div>
    );
  }
  if (variant.layoutMode === "tactical-grid") {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col border-x-2 border-[#21364e]">
        <span className="pointer-events-none absolute left-2 top-2 z-20 h-3 w-3 border-l-2 border-t-2 border-[#26e6c8]" />
        <span className="pointer-events-none absolute right-2 top-2 z-20 h-3 w-3 border-r-2 border-t-2 border-[#26e6c8]" />
        {children}
      </div>
    );
  }
  return <div className="flex min-h-0 flex-1 flex-col">{children}</div>;
}

function variantMotion(m: VariantTreatment["motion"]) {
  switch (m) {
    case "rise": return { initial: { opacity: 0, y: 26 } };
    case "fade": return { initial: { opacity: 0 } };
    case "slide": return { initial: { opacity: 0, x: 36 } };
    case "pop": return { initial: { opacity: 0, scale: 0.94 } };
  }
}

function Screen({ page, v, next, props }: { page: PageDef; v: VariantTreatment; next: () => void; props: Record<string, unknown> }) {
  const sp = { v, next, props };
  switch (page.screen) {
    case "f01-welcome": return <O.F01Welcome {...sp} />;
    case "f02-recognize": return <O.F02Recognize {...sp} />;
    case "f03-fact": return <O.F03Fact {...sp} />;
    case "f04-decision": return <O.F04Decision {...sp} />;
    case "f05-why": return <O.F05Why {...sp} />;
    case "f06-sealed": return <O.F06Sealed {...sp} />;
    case "f07-reveal": return <O.F07Reveal {...sp} />;
    case "f08-score": return <O.ScoreScreen {...sp} props={{ run: 1, ...props }} />;
    case "f09-insight": return <O.F09Insight {...sp} />;
    case "f10-run2": return <O.RunWithSources {...sp} props={{ run: 2, ...props }} />;
    case "f11-score2": return <O.ScoreScreen {...sp} props={{ run: 2, ...props }} />;
    case "f12-conflict": return <O.RunWithSources {...sp} props={{ run: 3, ...props }} />;
    case "f13-lesson": return <O.F13Lesson {...sp} props={{ cardId: "c12", step: 1, total: 2, ...props }} />;
    case "f14-cards": return <O.F14Cards {...sp} />;
    case "f15-run4": return <O.Assembly {...sp} props={{ slots: 1, ...props }} />;

    case "A-academy": return <P.AAcademy {...sp} />;
    case "B-lesson": return <O.F13Lesson {...sp} props={{ cardId: "c02", step: 2, total: 4, ...props }} />;
    case "C-deck": return <P.CDeck {...sp} />;
    case "D-assembly": return <O.Assembly {...sp} />;
    case "E-arena": return <P.EArena {...sp} />;
    case "F-run": return <O.RunWithSources {...sp} props={{ run: 4, ...props }} />;
    case "G-source": return <P.GSource {...sp} />;
    case "H-decision": return <P.HDecision {...sp} />;
    case "I-reveal": return <O.F07Reveal {...sp} props={{ run: 4, ...props }} />;
    case "J-score": return <O.ScoreScreen {...sp} props={{ run: (props.full ? 4 : 1), ...props }} />;
    case "K-breakdown": return <P.KBreakdown {...sp} />;
    case "L-profile": return <P.LProfile {...sp} />;
    case "M-notify": return <P.MNotify {...sp} />;
    case "N-settings": return <P.NSettings {...sp} />;
    case "O-noattempts": return <P.ONoAttempts {...sp} />;
    case "P-unknown": return <P.PUnknown {...sp} />;
    default: return null;
  }
}
