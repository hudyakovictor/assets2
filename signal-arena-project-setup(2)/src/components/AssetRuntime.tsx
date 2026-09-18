import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ALL_REPO_ASSETS, probeAsset, type AssetRef, type AssetStatus } from "../data/assets";

type StatusMap = Record<string, AssetStatus>;

const Ctx = createContext<{ status: StatusMap; refs: AssetRef[] }>({ status: {}, refs: ALL_REPO_ASSETS });

export function AssetProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<StatusMap>(() => Object.fromEntries(ALL_REPO_ASSETS.map((a) => [a.id, "pending" as AssetStatus])));

  useEffect(() => {
    let alive = true;
    ALL_REPO_ASSETS.forEach((ref) => {
      probeAsset(ref).then((s) => {
        if (alive) setStatus((prev) => ({ ...prev, [ref.id]: s }));
      });
    });
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(() => ({ status, refs: ALL_REPO_ASSETS }), [status]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAssets() {
  return useContext(Ctx);
}

export function useAssetStatus(id: string): AssetStatus {
  return useContext(Ctx).status[id] ?? "pending";
}

/**
 * Renders a repo SVG by exact filename. If the file is not present the slot
 * shows a dashed MISSING marker of the same size — never an emoji or a
 * substitute icon from another library.
 */
export function AssetImg({
  id,
  url,
  size = 14,
  className = "",
  style,
  alt = "",
  fallback,
}: {
  id: string;
  url: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  /** Rendered ONLY when the repo file is missing. Repo file always wins. */
  fallback?: (size: number) => React.ReactNode;
}) {
  const status = useAssetStatus(id);
  if (status === "ok") {
    return <img src={url} width={size} height={size} alt={alt} draggable={false} className={className} style={{ display: "block", objectFit: "contain", ...style }} />;
  }
  if (status !== "pending" && fallback) {
    return (
      <span className={className} style={{ display: "block", ...style }} title={`fallback (repo ${id} missing)`}>
        {fallback(size)}
      </span>
    );
  }
  return (
    <span
      className={`missing ${className}`}
      title={`MISSING_ASSET: ${id}`}
      aria-label={`MISSING_ASSET ${id}`}
      style={{ width: size, height: size, opacity: status === "pending" ? 0.35 : 1, ...style }}
    >
      {size >= 20 ? "!" : ""}
    </span>
  );
}
