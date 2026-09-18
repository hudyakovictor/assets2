# Signal Arena — Consolidation and 50-point readiness audit

Generated for upload to Arena. This package is a curated merge kit, not a claim that the final runtime is already approved.

## Executive decision

Use `01-canonical-workbench/` as the only implementation base. Use the other folders as read-only references. Do not merge multiple complete apps.

### Selected sources

- **Implementation base:** `signal-arena-development-setup-1`
- **Requirements and QA:** `signal-arena-motion-design/docs`
- **Asset/flow registry:** selected files from `aaa-motion-design-asset-catalog`
- **Chart/reveal gameplay reference:** selected files from `signal-arena-motion-design-1/src/game`
- **Alternative workbench references:** selected files from `aaa-game-motion-asset-catalog-4`
- **Canonical external assets:** GitHub repository listed in `06-external-assets-required/ASSETS_TO_FETCH.md`

## Non-negotiable merge rules

1. Do not merge several `App.tsx` files.
2. Do not keep two Top Bar implementations in the runtime. Use `TopBar.tsx` as the only implementation and keep `TopBarNew.tsx` out of the final build.
3. Do not treat archive extraction failure as missing assets. Use `ASSET_ARCHIVE_NOT_EXTRACTED`.
4. Do not replace the canonical Top Bar or c01–c40 with invented SVGs.
5. Keep 300×620 / 15:31 as MVP preview reference only; production must be responsive to Telegram WebView.
6. Remove tournaments, stores, referrals, founder packs and other scope drift unless they are explicitly approved in the final MVP.
7. Do not claim 95+ until the runtime build and viewport screenshots are complete.

## 50-point audit

| # | Check | Status | Evidence | Required action |
|---:|---|---|---|---|
| 01 | Source hierarchy | **PASS** | `game.html`/MVP docs are treated as product source; repo assets are separate source. | Keep one source-of-truth table; do not let a visual catalog redefine product logic. |
| 02 | Canonical implementation candidate | **PASS** | `01-canonical-workbench` is the most complete P01–P34 workbench candidate. | Use it as the only merge base; keep other apps read-only references. |
| 03 | P01–P34 inventory | **PASS** | `src/lib/pages.ts` declares P01–P34 and report checks count. | Verify page names against the final agreed MVP inventory before merge. |
| 04 | 3–4 variants per page | **PASS** | `variantsOf(page)` and asset matrix are present in `src/lib/pages.ts`. | Ensure variants differ only by approved asset/treatment fields. |
| 05 | Variant uniqueness | **PARTIAL** | Variants are generated deterministically, but code review is still needed to ensure they are not density-only duplicates. | Render a comparison sheet and reject variants with no meaningful visual/interaction difference. |
| 06 | Asset Matrix | **PASS** | `assetMatrix()` and `Report.tsx` expose page, variant, slot, source and fallback. | Keep the matrix as the merge contract. |
| 07 | Real skill-card provenance | **PARTIAL** | `src/lib/assets.tsx` points to `skill-card-icons.zip`, but the extracted SVGs are not in this package. | Fetch/extract c01–c40 before final runtime validation. |
| 08 | Real Top Bar provenance | **PARTIAL** | `TopBar.tsx` is a faithful React port and asset loader supports `topbar.zip`; real files still need mounting. | Use `topbar.html` and five SVGs as final source; port is only a temporary bridge. |
| 09 | Top Bar slot order | **PASS** | `TopBar.tsx` defines LVL/XP, attempts, stars, coins, bell and gear. | Remove any competing `TopBarNew.tsx` from the final runtime. |
| 10 | Top Bar dynamic values | **PASS** | TopBar values are typed and dynamic in `TopBar.tsx`. | Keep geometry locked; only values and badges may change. |
| 11 | Skill icon white style | **PARTIAL** | Registry expects c01–c40 and the package references them, but actual extracted files are external. | Mount real white hybrid filled-outline SVGs; no emoji or invented replacements. |
| 12 | Card color groups | **PASS** | Registry encodes green/yellow/blue/red group mapping. | Lock `#2E7F5C`, `#D0B24A`, `#4C6180`, `#C56861`. |
| 13 | MVP first-run structure | **PARTIAL** | Candidates disagree between separate tutorial cards and tutorial-as-first-runs. | Resolve this against the final `game.html`; do not merge conflicting page flows. |
| 14 | Tutorial boundary | **PARTIAL** | The workbench has tutorial kinds/progress, while the audit reference says first Arena runs teach the mechanics. | Choose one canonical narrative and keep progress explicit. |
| 15 | First action target | **PASS** | Pages and screens include `tapChart`; gameplay reference includes target and feedback logic. | Verify the player taps a real candle/zone, never empty space. |
| 16 | Facts before decision | **PASS** | Pages include fact/evidence states before decision; gameplay reference has facts. | Keep future data unavailable and facts visible first. |
| 17 | ENTER decision | **PASS** | Decision types and decision gates exist. | Test selected, disabled and sealed states. |
| 18 | WAIT decision | **PASS** | `WAIT` is explicit in flow data and page copy. | Keep it a first-class decision, not a secondary cancel action. |
| 19 | NO_TRADE decision | **PASS** | `NO_TRADE` is explicit in flow data and page copy. | Keep it equal in status to ENTER and WAIT. |
| 20 | Mandatory rationale | **PASS** | Pages include reasoning/rationale gates and evidence state. | Require an observable fact before CTA activation. |
| 21 | Invalidation | **PASS** | Pages and gameplay reference implement an invalidation step before Seal. | Ensure it cannot be entered after Reveal. |
| 22 | Seal irreversibility | **PASS** | `Seal` screen and state logic explicitly lock the decision. | Regression-test back, refresh and repeated clicks. |
| 23 | Reveal gating | **PASS** | Reveal page has `hasReveal`/sealed flags and gameplay state gates. | Reveal only after Seal; do not expose future candles earlier. |
| 24 | Fast-forward motion | **PASS** | Gameplay reference includes reveal/time progression; page variants include reveal presets. | Use motion for temporal explanation, not decoration only. |
| 25 | Key event marker | **PARTIAL** | Reference code has event/reveal elements, but visual browser validation is pending. | Verify marker appears only when relevant continuation candles exist. |
| 26 | Process score | **PASS** | Pages include process score and audit lists timing/R:R/discipline/evidence. | Do not reduce score to outcome-only success. |
| 27 | Debrief | **PASS** | P01–P34 code and reference include debrief. | Make debrief the next step after score, not an optional dead panel. |
| 28 | Unfamiliar topic no penalty | **PASS** | Page kinds include unfamiliar/unknown topic and no-penalty behavior. | Test skip path and confirm no negative score. |
| 29 | No attempts | **PASS** | Canonical workbench includes no-attempts state pointing to learning, not a shop. | Remove any coin-based recovery that conflicts with MVP. |
| 30 | Empty state | **PASS** | Service/empty states are represented in candidates. | Use no fake player history or fake completed stats. |
| 31 | Error/retry | **PASS** | P34/error and retry paths exist. | Retry must not silently advance or erase a decision. |
| 32 | Loading state | **PARTIAL** | Loading is represented, but real asset/font loading behavior is not browser-verified. | Add deterministic loading and failure states for repo assets. |
| 33 | No monetization drift | **FAIL** | Some candidate archives include tournaments, store, referrals, leaderboard and promo surfaces outside the MVP. | Exclude project-setup and generic retention screens from canonical P01–P34. |
| 34 | Navigation scope | **PARTIAL** | Candidates disagree on bottom tabs and include extra More/Tournaments modules. | Use only the navigation specified by the final MVP; remove unused routes. |
| 35 | Workbench/game separation | **PASS** | Workbench candidates have side panels and export/report concepts. | Export only the game surface; keep inspector chrome outside it. |
| 36 | MVP reference artboard | **PASS** | Candidates document 300×620 / 15:31 as reference. | Use it only for preview comparison, not production runtime. |
| 37 | Responsive production shell | **PARTIAL** | Several candidates use responsive `100dvh`, but all variants are not runtime-verified. | Use full Telegram viewport with safe areas; do not force 15:31 in production. |
| 38 | Viewport matrix | **PARTIAL** | Audits specify 320×568, 360×800, 390×844 and 412×915; actual screenshots remain runtime work. | Run all required viewports after dependencies are installed. |
| 39 | No-scroll policy | **PARTIAL** | Code has explicit internal scroll hosts, but broad scroll usage differs by candidate. | Allow scroll only for named long lists; fail page-level overflow. |
| 40 | Safe areas | **PARTIAL** | Audit documents require safe-area top/bottom; source presence differs by candidate. | Verify `env(safe-area-inset-*)` in the canonical shell and Telegram-like viewport. |
| 41 | Touch targets | **PARTIAL** | Audit specifies 44px and Top Bar hit slop; full rendered QA is pending. | Verify every CTA, Top Bar button and chart target. |
| 42 | Accessibility labels | **PARTIAL** | Top Bar has aria labels; chart/candle and page semantics need full audit. | Add labels for chart targets, current navigation and feedback regions. |
| 43 | Reduced motion | **PARTIAL** | Audit includes reduced motion and motion tokens; runtime coverage is not proven. | Disable all named motion presets, reveal beams and haptic-dependent effects. |
| 44 | Responsive typography | **PARTIAL** | Audits identify 7–9px microtype as a risk. | Reserve microtype for HUD metadata; keep gameplay copy readable at 320×568. |
| 45 | Chart data integrity | **PASS** | Gameplay reference derives candle/content state and separates past from future. | Use deterministic scenario fixtures labeled as historical data. |
| 46 | Fake data labeling | **PARTIAL** | Reports acknowledge scenario fixtures but do not label every screen consistently. | Label fixtures as historical scenario data; never show them as a real player account. |
| 47 | Motion semantics | **PASS** | Reference includes Seal, Reveal, feedback and navigation motion presets. | Keep motion tied to state change; no decorative motion that obscures actions. |
| 48 | Dead/duplicate modules | **FAIL** | Selected workbench contains both `TopBar.tsx` and `TopBarNew.tsx` plus extra screens. | Delete or quarantine duplicates before final build. |
| 49 | Build and dependency readiness | **BLOCKED** | All inspected projects lack installed Vite dependencies in this environment; offline install failed. | Install dependencies in Arena or provide a built `dist`; do not call build status PASS yet. |
| 50 | Release/merge readiness | **PARTIAL** | The source map is now defined, but runtime screenshots, real assets and conflict resolution remain. | Use the merge plan below and require a final 50-check re-run. |

## Detailed use of each source

### 1. `signal-arena-development-setup-1`

Use as the implementation base. Preserve its workbench shell, P01–P34 data model, screen routing, report, asset loader and responsive CSS. Before final merge, remove duplicate `TopBarNew.tsx`, quarantine extra tournament/more routes and verify all pages against the final MVP inventory.

Key files:

- `src/App.tsx` — application shell and routing
- `src/lib/pages.ts` — P01–P34, page kinds, gates, variants and Asset Matrix
- `src/lib/assets.tsx` — asset loading/provenance logic
- `src/components/TopBar.tsx` — locked shared Top Bar port
- `src/screens/Screen.tsx` — canonical screen renderer
- `src/screens/ArenaGameScreen.tsx` — Arena flow
- `src/screens/AcademyScreen.tsx` — Academy
- `src/screens/CollectionScreen.tsx` — skill cards
- `src/panels/Report.tsx` — inventory, provenance and QA report

### 2. `signal-arena-motion-design/docs`

Use as the audit baseline, not as a second application. It contains the most useful failure taxonomy and explicitly leaves runtime validation open. Import its checks for viewport, Top Bar, asset provenance, tutorial, Reveal, touch, reduced motion, export and reports.

### 3. `aaa-motion-design-asset-catalog` selected files

Use as the registry reference:

- `src/data/assets.ts` — asset IDs, card groups, Top Bar files and colors
- `src/data/flow.ts` — decision/rationale/invalidation/Seal/Revealed gates
- `src/data/pages.ts` — compact page metadata and variant metadata
- `src/components/TopBar.tsx` — compare geometry and dynamic values
- `src/motion/tokens.ts` — motion naming and timing reference

Do not copy its whole app over the canonical base.

### 4. `signal-arena-motion-design-1/src/game`

Use only for gameplay mechanics and chart behavior:

- `chart.tsx` — chart/candle treatment
- `content.ts` — scenario content
- `facts.tsx` — facts/evidence UI
- `state.ts` — run state and gating
- `screens-core.tsx` — core gameplay screens
- `screens-meta.tsx` — score/debrief/meta screens
- `frame.tsx` and `note.tsx` — layout and explanatory surfaces
- `sfx.ts` — feedback reference; re-check reduced-motion and Telegram support

Do not replace the canonical workbench shell with this app.

### 5. `aaa-game-motion-asset-catalog-4` selected files

Use only to compare alternative page rendering and report patterns:

- `src/data/pages.ts`
- `src/data/remoteAssets.ts`
- `src/components/TopBar.tsx`
- `src/screens/pages1.tsx`
- `src/screens/pages2.tsx`
- `src/screens/Report.tsx`

Do not import its extra product scope without explicit approval.

## Conflicts that must be resolved before final merge

### Flow conflict

`signal-arena-motion-design` models the first Arena runs as the tutorial, while some other candidates model tutorial cards as a separate initial sequence. The final `game.html`/MVP decision must win. Do not merge both interpretations into one flow.

### Top Bar conflict

Some candidates use a faithful port, others use a simplified `TopBarCanonical` or `TopBarNew`. Keep one implementation: the one matching `topbar.html` with LVL/XP, attempts, stars, coins, bell and gear.

### Page scope conflict

Some candidates add tournaments, leaderboard, shop, referrals, daily rewards and `$SIG`. These are not automatically part of MVP. Keep them outside P01–P34 unless the user explicitly approves them.

### Asset availability conflict

The source code references `skill-card-icons.zip` and `topbar.zip`, but this package does not contain the extracted binary asset folders. Arena must fetch/extract them from the repository before final visual approval.

## Final merge sequence for Arena

1. Open `README_RU.md`.
2. Use `01-canonical-workbench` as the project root.
3. Mount the real assets described in `06-external-assets-required`.
4. Delete/quarantine duplicate Top Bar and unused scope-drift screens.
5. Reconcile the tutorial/first-runs flow against the final MVP source.
6. Import only registry and gameplay logic listed above.
7. Run the build.
8. Render P01–P34 and all A/B/C/D variants.
9. Test 320×568, 360×800, 390×844 and 412×915.
10. Re-run all 50 checks.
11. Report remaining P0/P1 issues before claiming 95+.

## Status meaning

- **PASS:** code evidence exists; still run runtime QA where applicable.
- **PARTIAL:** source support exists but visual/device/runtime verification is missing.
- **FAIL:** a concrete conflict or scope defect must be fixed.
- **BLOCKED:** verification cannot be honestly completed in the current environment.
