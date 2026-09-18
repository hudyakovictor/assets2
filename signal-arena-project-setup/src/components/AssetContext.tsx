import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { loadRegistry, type AssetRegistry } from "../lib/assetLoader";

const LOADING: AssetRegistry = {
  status: "loading",
  entries: {},
  byArchive: {},
  missing: [],
  errors: [],
  skillIcons: {},
  images: [],
  assetsZipIsReferenceLibrary: false,
  archivesExtracted: {},
};
const Ctx = createContext<AssetRegistry>(LOADING);

/**
 * Загрузка ассетов репозитория с явным состоянием:
 * loading → ready | offline. Никогда не «молчит»: офлайн виден и повторяем.
 */
export function AssetProvider({ children }: { children: ReactNode }) {
  const [reg, setReg] = useState<AssetRegistry>(LOADING);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setReg(LOADING);
    loadRegistry()
      .then((r) => alive && setReg(r))
      .catch(() =>
        alive &&
        setReg({
          ...LOADING,
          status: "error",
          errors: ["ASSET_ARCHIVE_NOT_EXTRACTED: loadRegistry failed"],
        }),
      );
    return () => {
      alive = false;
    };
  }, [nonce]);

  // Пробуем снова, когда сеть вернулась.
  useEffect(() => {
    const on = () => setNonce((n) => n + 1);
    addEventListener("online", on);
    return () => removeEventListener("online", on);
  }, []);

  const value: AssetRegistry =
    reg ?? {
      status: "loading",
      entries: {},
      byArchive: {},
      missing: [],
      errors: [],
      skillIcons: {},
      images: [],
      assetsZipIsReferenceLibrary: false,
      archivesExtracted: {},
    };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAssets(): AssetRegistry {
  return useContext(Ctx);
}

/** Missing asset marker: no emoji, no invented artwork; exact filename in title. */
export function MissingSlot({
  file,
  size = 16,
  label,
}: {
  file: string;
  size?: number;
  label?: boolean;
}) {
  return (
    <span
      title={`MISSING_ASSET: ${file}`}
      aria-label={`MISSING_ASSET: ${file}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "1.5px dashed rgba(232,112,95,.8)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        color: "#e8705f",
        fontSize: Math.max(7, size * 0.4),
        fontWeight: 700,
      }}
    >
      {label ? "!" : ""}
    </span>
  );
}
