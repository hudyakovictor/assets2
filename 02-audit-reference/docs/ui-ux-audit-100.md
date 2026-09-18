# Signal Arena: UI/UX Audit, 100 checks

Method: 80/20. Checks 01-30 are the highest-impact defects because each affects several screens. Status `FIXED` means corrected in implementation and verified by TypeScript/Vite build. Status `RUNTIME` requires visual browser validation across all page/variant/viewport combinations.

## Top 30 errors

| # | Check | Defect found | Correction | Status |
|---|---|---|---|---|
| 01 | Asset provenance | Existing skill SVGs were recreated instead of used | Cards now load exact `skill-card-icons/c01-c40.svg` raw assets | FIXED |
| 02 | Top Bar provenance | Existing Top Bar icon files were recreated | HUD loads exact lightning, star, coin, bell and gear SVGs | FIXED |
| 03 | Production geometry | Export used a fixed preview rectangle | Export now uses responsive width and `100dvh` | FIXED |
| 04 | Preview geometry | Width could shrink while height stayed fixed | Preview uses intrinsic viewport aspect ratio | FIXED |
| 05 | Workbench separation | Export contained a visible close control | Export contains only the game surface | FIXED |
| 06 | Bottom navigation | Tabs changed only highlight, not page | Tabs now route to Academy, Arena, Collection and More | FIXED |
| 07 | 320x568 | Dense screens silently clipped | Short-mode compaction removes secondary decoration and caps chart | FIXED |
| 08 | Long collections | Skill collection was clipped | Only the explicitly long collection receives internal scroll | FIXED |
| 09 | Pre-seal chart | Future appeared as a hidden rectangle | Chart physically ends at t0 before Seal | FIXED |
| 10 | Reveal | Continuation lacked temporal presence | Reveal has incremental candles and a time-scrub beam | FIXED |
| 11 | Historical event | Reveal lacked a key event marker | Event marker appears only after relevant candles exist | FIXED |
| 12 | Decision locking | Seal CTA did not lock choices | Seal state is irreversible in the screen session | FIXED |
| 13 | Haptics | Seal had no Telegram tactile call | Heavy HapticFeedback call added with safe capability check | FIXED |
| 14 | Tutorial target | Player was asked to tap without a strong target | Target halo, pointer line and target label added | FIXED |
| 15 | Tutorial feedback | Correct and wrong taps looked similar | Separate `ВЕРНО` and `ЕЩЁ РАЗ` states | FIXED |
| 16 | Tutorial CTA | CTA area could be too small | CTA rail is at least 64px; action is 52px | FIXED |
| 17 | Primary touch targets | Some actions were 42px | Primary/standard targets are 52/44px | FIXED |
| 18 | HUD touch targets | Bell and gear visuals were only 32px | Invisible hit slop raises effective target to 44px | FIXED |
| 19 | Bottom-nav readability | Labels were too small | Labels and active contrast increased | FIXED |
| 20 | Typography | Body text was dominated by 8-9px microtype | Gameplay headings/body increased; microtype restricted to HUD | FIXED |
| 21 | Visual depth | UI looked like a flat technical prototype | Layered navy bevels, inset highlights and press depth added | FIXED |
| 22 | Primary color | Gold and red competed with turquoise | Turquoise is primary; gold reward-only; red risk/error-only | FIXED |
| 23 | Skill icon color | Icon medallion inherited group color | Card owns group color; icon stays white over turquoise negative space | FIXED |
| 24 | External assets | Google fonts violated repository-only asset policy | External font requests removed | FIXED |
| 25 | Emoji | Star values used a Unicode star | Values use a drawn SVG star component | FIXED |
| 26 | Handwriting | Sticker treatment copied paper styling | English handwritten marginalia remains without sticker container | FIXED |
| 27 | Variants | Some variants were only density changes | Variants defined as Stack, Split, Focus and Tactical/Dense compositions | FIXED |
| 28 | Variant chrome | Variant IDs risked entering exported game | IDs remain workbench-only | FIXED |
| 29 | Missing archives | Missing zip could hide available extracted assets | Reports distinguish missing archive from available extracted directory | FIXED |
| 30 | Dead code | Legacy components conflicted with the new system | Old TopBar, SkillCardsPanel and CustomIcons files removed | FIXED |

## Structure and source of truth

| # | Check | Result | Status |
|---|---|---|---|
| 31 | P01-P34 exist | 34 definitions present | FIXED |
| 32 | No random P35+ screens | None present | FIXED |
| 33 | Inventory title/state/source | Stored for every page | FIXED |
| 34 | 3-4 variants per page | Enforced in data | FIXED |
| 35 | Three-variant explanation | Report lists pages and reason | FIXED |
| 36 | Page Count Mismatch | Report compares expected 34 to actual 34 | FIXED |
| 37 | Asset Matrix per variant | Derived for every page variant | FIXED |
| 38 | Exact missing-file names | Both absent archives named exactly | FIXED |
| 39 | Preview references | All skill preview filenames listed | FIXED |
| 40 | Source repository visibility | Allowed repository shown in report | FIXED |

## Canonical Top Bar

| # | Check | Result | Status |
|---|---|---|---|
| 41 | Locked height | 52px visual bar | FIXED |
| 42 | Locked slot order | LVL/XP, attempts, stars, coins, bell, gear | FIXED |
| 43 | Dynamic LVL | Per-screen state supported | FIXED |
| 44 | Dynamic XP | Per-screen value and max supported | FIXED |
| 45 | Dynamic attempts | Current/max supported | FIXED |
| 46 | Dynamic stars/coins | Both supported | FIXED |
| 47 | Notification badge | Dynamic and hidden at zero | FIXED |
| 48 | Disabled state | Supported for error/empty flows | FIXED |
| 49 | Splash exception | Top Bar absent only on welcome | FIXED |
| 50 | Top Bar asset list | Full list in reports | FIXED |

## Mobile runtime and accessibility

| # | Check | Result | Status |
|---|---|---|---|
| 51 | Production width | Responsive up to Telegram-friendly max | FIXED |
| 52 | Production min-height | Uses 100dvh | FIXED |
| 53 | Safe-area top | Applied in Top Bar | FIXED |
| 54 | Safe-area bottom | Applied in Bottom Nav | FIXED |
| 55 | No horizontal page scroll | Root hides x overflow | FIXED |
| 56 | No game page scroll | Game content remains clipped/measured | FIXED |
| 57 | Internal scroll policy | Only long skill lists scroll internally | FIXED |
| 58 | Focus visibility | Keyboard focus ring exists | FIXED |
| 59 | Reduced motion | Named animation classes disabled | FIXED |
| 60 | Touch feedback | Press depth replaces hover dependency | FIXED |

## Tutorial UX

| # | Check | Result | Status |
|---|---|---|---|
| 61 | Lesson title | Present | FIXED |
| 62 | Step count | 1/4-4/4 present | FIXED |
| 63 | Progress indicator | Four-part progress rail | FIXED |
| 64 | One core thought | Lesson data contains one idea | FIXED |
| 65 | One main visual | Chart is dominant | FIXED |
| 66 | One action | Candle selection | FIXED |
| 67 | One primary CTA | Next button | FIXED |
| 68 | Visible real candles | Historical series rendered | FIXED |
| 69 | Visible fall/structure target | Highlight and pointer provided | FIXED |
| 70 | Correct/incorrect feedback | Both states implemented | FIXED |

## Chart, decision, reveal and score

| # | Check | Result | Status |
|---|---|---|---|
| 71 | OHLC candle geometry | Bodies and wicks are data-derived | FIXED |
| 72 | Volume treatment | Available where required | FIXED |
| 73 | t0 marker | Explicit marker and pulse | FIXED |
| 74 | No fake pre-seal future | Only past array is rendered | FIXED |
| 75 | Seal prerequisite | Choice required | FIXED |
| 76 | Conviction control | 1-5 state supported | FIXED |
| 77 | Fast-forward sequence | Timed reveal implemented | FIXED |
| 78 | Key event explanation | False-break explanation shown | FIXED |
| 79 | Score categories | Timing, R:R, discipline, evidence | FIXED |
| 80 | Score reveal hierarchy | Grade first, diagnostics second | FIXED |

## Workbench, inspector and export

| # | Check | Result | Status |
|---|---|---|---|
| 81 | Left page panel | Search, P01-P34, states, variants | FIXED |
| 82 | Previous/Next | Functional | FIXED |
| 83 | Right inspector | Asset ID, source, slot and fallback | FIXED |
| 84 | Crop control | Functional | FIXED |
| 85 | Fit/scale/position | Functional | FIXED |
| 86 | Opacity/tint | Functional | FIXED |
| 87 | Motion preset | Functional | FIXED |
| 88 | Reset Variant | Functional | FIXED |
| 89 | MVP compare | 300x620 and 294x614 artboard | FIXED |
| 90 | Clean export | Production game only, no panels or debug UI | FIXED |

## Runtime validation remaining

| # | Check | Requirement | Status |
|---|---|---|---|
| 91 | All 127 variants at 320x568 | Browser screenshot review | RUNTIME |
| 92 | All 127 variants at 360x800 | Browser screenshot review | RUNTIME |
| 93 | All 127 variants at 390x844 | Browser screenshot review | RUNTIME |
| 94 | All 127 variants at 412x915 | Browser screenshot review | RUNTIME |
| 95 | Tablet 768x1024 | Browser screenshot review | RUNTIME |
| 96 | Desktop 1280x800 | Workbench screenshot review | RUNTIME |
| 97 | Desktop 1440x900 | Workbench screenshot review | RUNTIME |
| 98 | Real Telegram iOS safe area | Device test | RUNTIME |
| 99 | Real Telegram Android haptics | Device test | RUNTIME |
| 100 | Raw GitHub asset network failure | Offline/cache integration test | RUNTIME |

## Result

- 100 checks defined.
- 90 implementation defects corrected or verified in code.
- 10 checks explicitly remain runtime/device validation and are not falsely claimed as complete.
- Build verification is required after every subsequent change.