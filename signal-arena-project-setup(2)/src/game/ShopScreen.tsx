/**
 * Shop & Battle Pass screen directly matching Image 3 from the reference materials:
 * - Tabs: МАГАЗИН · БАТТЛ-ПАСС · ПОДПИСКА · ПАКИ
 * - СИГНАЛ-ПАСС · СЕЗОН 1 with crown milestones
 * - PRO СИГНАЛ subscription
 * - НАБОР НОВИЧКА & ПАК КАРТ
 * - Disclaimer: Покупки не влияют на навык · нет pay-to-win
 *
 * NO EMOJIS — all icons are pure vector SVG.
 */

import { useState } from "react";
import { PressButton } from "./ui";
import { store, useProgress } from "./store";
import { sfx } from "./fx";
import {
  IcCoin,
  IcCrown,
  IcMedal,
  IcCardStack,
  IcSig,
  IcCheck,
  IcLock,
} from "./icons";

export function ShopScreen({ say }: { say: (msg: string) => void }) {
  const p = useProgress();
  const [tab, setTab] = useState<"all" | "pass" | "sub" | "packs">("all");

  const buy = (label: string, grant?: () => void) => {
    sfx.reward();
    grant?.();
    say(`Куплено: ${label} (демо)`);
  };

  return (
    <div className="flex flex-col" style={{ flex: 1, minHeight: 0 }}>
      {/* Category Pills */}
      <div className="shop-tabs rise" style={{ marginBottom: 12 }}>
        {[
          { k: "all", l: "МАГАЗИН" },
          { k: "pass", l: "БАТТЛ-ПАСС" },
          { k: "sub", l: "ПОДПИСКА" },
          { k: "packs", l: "ПАКИ" },
        ].map((it) => (
          <button
            key={it.k}
            type="button"
            className={`shop-tab ${tab === it.k ? "on" : ""}`}
            onClick={() => {
              sfx.tap();
              setTab(it.k as any);
            }}
          >
            {it.l}
          </button>
        ))}
      </div>

      <div
        className="wb-scroll flex flex-col gap-3.5 rise d1"
        style={{ flex: 1, minHeight: 0, paddingBottom: 10 }}
      >
        {/* Battle Pass Card */}
        {(tab === "all" || tab === "pass") && (
          <div className="pass-card">
            <div className="pass-eyebrow">БАТТЛ-ПАСС</div>
            <div className="pass-title">СИГНАЛ-ПАСС · СЕЗОН 1</div>

            {/* Milestones Track with Crowns */}
            <div className="pass-track">
              {[0, 1, 2, 3, 4].map((i) => {
                const unlocked = p.passTier >= (i + 1) * 6;
                const Icons = [IcMedal, IcCoin, IcCardStack, IcCrown, IcSig];
                const NodeIcon = Icons[i];
                return (
                  <div key={i} className={`pass-node ${unlocked ? "on" : ""}`}>
                    <span
                      className="pass-crown"
                      style={{ color: unlocked ? "var(--warm)" : "#6a79a4" }}
                    >
                      <IcCrown size={16} />
                    </span>
                    <span
                      className="pass-reward"
                      style={{ color: unlocked ? "#5a3a00" : "#99a7cb" }}
                    >
                      <NodeIcon size={22} />
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pass Progress Bar */}
            <div className="bar" style={{ marginTop: 14 }}>
              <i style={{ width: `${(p.passTier / 30) * 100}%` }} />
            </div>
            <div className="cg-sub mono text-center" style={{ marginTop: 6, fontSize: 12 }}>
              {p.passTier} / 30
            </div>

            <div style={{ marginTop: 12 }}>
              <PressButton
                variant="gold"
                onClick={() =>
                  buy("Сигнал-Пасс Сезон 1", () =>
                    store.set({ sig: p.sig + 50, coins: p.coins + 1000 })
                  )
                }
                sound={null}
              >
                КУПИТЬ ЗА 490 ₽
              </PressButton>
            </div>
          </div>
        )}

        {/* 2-Column Split: PRO and Offers */}
        {(tab === "all" || tab === "sub" || tab === "packs") && (
          <div className="flex gap-3">
            {/* PRO Subscription */}
            {(tab === "all" || tab === "sub") && (
              <div className="pro-card flex-1">
                <div className="pro-title">PRO СИГНАЛ</div>
                <ul className="pro-list">
                  {[
                    "Без рекламы",
                    "×2 XP за разбор",
                    "Эксклюзивные карты",
                    "Ранний доступ",
                  ].map((f) => (
                    <li key={f}>
                      <span className="pro-check">
                        <IcCheck size={12} />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 14 }}>
                  <PressButton
                    variant="primary"
                    onClick={() => buy("PRO Сигнал 30 дней")}
                    sound={null}
                  >
                    30 ДНЕЙ · 199 ₽
                  </PressButton>
                </div>
              </div>
            )}

            {/* Beginner Pack & Card Packs */}
            {(tab === "all" || tab === "packs") && (
              <div className="flex-1 flex flex-col gap-3">
                {/* Набор новичка */}
                <div className="offer-card">
                  <div className="offer-badge">-50%</div>
                  <div className="offer-title">НАБОР НОВИЧКА</div>
                  <div className="offer-icons">
                    <span style={{ color: "#ffc24a" }}>
                      <IcCoin size={32} />
                    </span>
                    <span style={{ color: "#8b7bff" }}>
                      <IcCardStack size={32} />
                    </span>
                  </div>
                  <PressButton
                    variant="gold"
                    onClick={() =>
                      buy("Набор новичка", () => store.set({ coins: p.coins + 500 }))
                    }
                    sound={null}
                  >
                    -50% · 99 ₽
                  </PressButton>
                </div>

                {/* Пак карт */}
                <div className="offer-card">
                  <div className="offer-title">ПАК КАРТ · ×3</div>
                  <div className="offer-icons">
                    <span style={{ color: "var(--acc)" }}>
                      <IcCardStack size={36} />
                    </span>
                  </div>
                  <PressButton
                    variant="primary"
                    onClick={() => buy("Пак карт ×3")}
                    sound={null}
                  >
                    149 ₽
                  </PressButton>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div className="p2w-note">
          <IcLock size={14} />
          <span>Покупки не влияют на навык · нет pay-to-win</span>
        </div>
      </div>
    </div>
  );
}
