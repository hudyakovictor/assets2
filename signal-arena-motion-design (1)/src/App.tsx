import Studio from "./studio/Studio";

/**
 * SIGNAL ARENA — production entry.
 * The studio workspace wraps the real Telegram Mini App runtime:
 *   · centre = the live game screen at true CSS viewport sizes (no phone shell)
 *   · left   = Page Inventory P01…P34 + variants A/B/C/D
 *   · right  = Asset Inspector / QA / Docs
 * Panels are studio chrome and are never part of the exported game screen.
 */
export default function App() {
  return <Studio />;
}
