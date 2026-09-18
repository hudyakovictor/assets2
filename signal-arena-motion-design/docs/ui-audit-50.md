# Signal Arena UI Audit: 50 checks, 80/20 method

Second-pass correction: the previous implementation was functionally broad but visually too flat,
too technical and insufficiently faithful to asset provenance. This pass replaces recreated skill and
Top Bar artwork with the actual files from the allowed GitHub repository, strengthens premium casual
2D depth, increases gameplay typography, removes the pre-seal future rectangle and adds a dedicated
320×568 compaction policy that removes secondary decoration before touching primary actions.

The first 30 items are the highest-impact defects. They affect most screens and were fixed first.

| # | Area | Finding | Impact | Fix |
|---|---|---|---|---|
| 1 | Runtime | Preview dimensions could clamp height without proportional width scaling | Critical | Use a real viewport container; never apply independent max-height distortion |
| 2 | Runtime | Workbench and production game were visually mixed | Critical | Separate workbench chrome from export-only game surface |
| 3 | Runtime | Small 320x568 viewport could clip content silently | Critical | Add compact viewport mode and measured overflow status |
| 4 | Top Bar | Too many equal-weight HUD elements | Critical | Restore clear XP anchor, compact resource slots, secondary icon buttons |
| 5 | Top Bar | Tiny icon and value geometry reduced legibility | High | Increase resource icons and value contrast; preserve locked slot order |
| 6 | Top Bar | Interactive icons were below 44px | High | Give buttons 44px hit areas while preserving 32px visual shape |
| 7 | Navigation | Bottom labels were below comfortable mobile size | High | Increase label size and active contrast |
| 8 | Navigation | Bottom tabs changed visual weight too weakly | High | Add active turquoise platform, light rail and stronger icon state |
| 9 | Hierarchy | Most screens looked like repeated utility cards | Critical | Reduce boxes and use one dominant scene per screen |
| 10 | Hierarchy | Headings competed with the chart | High | Tighten headings and reserve the largest area for data/action |
| 11 | Chart | Candles were too small and visually flat | Critical | Increase candle width, wick contrast, volume integration and t0 emphasis |
| 12 | Chart | Hidden-future zone still read as a blocked rectangle | Critical | Replace with a narrow t0 boundary and empty continuation plane |
| 13 | Chart | Reveal was only incremental rendering without event emphasis | High | Add time-scrub beam, event marker and final explanation state |
| 14 | Chart | First tutorial action lacked a pointer label | Critical | Add target halo, instruction rail and correct/incorrect feedback |
| 15 | Decision | Four decisions had equal visual weight | High | Use one selected decision as focal action, others remain subordinate |
| 16 | Decision | Seal did not feel irreversible enough | Critical | Add press lock, ring closure, copy change and haptic-ready state |
| 17 | Tutorial | Visual could exceed 42% available height | High | Cap tutorial visual and preserve 64px CTA area |
| 18 | Tutorial | Progress and lesson identity were separated | Medium | Combine lesson title and 1/4 progress into one top rail |
| 19 | Tutorial | Body copy was dense at 320x568 | High | Use compact secondary copy, never scale type below readable threshold |
| 20 | Score | Score ring and bars looked like a generic dashboard | High | Make grade the single hero; reveal diagnostics after grade |
| 21 | Variants | Variant difference sometimes meant density only | Critical | Define Stack, Split, Focus and Tactical layouts with distinct interaction emphasis |
| 22 | Variants | Layout labels were visible near game preview | Medium | Keep them in workbench caption only, never game export |
| 23 | Asset system | Skill medallions inherited group colour | Critical | Card owns group colour; icon remains white with turquoise negative space |
| 24 | Asset system | Old unused replacement icon files remained | High | Delete stale component and icon implementations |
| 25 | Asset system | Missing archives could be mistaken for missing extracted files | High | Distinguish MISSING_ASSET archive from available extracted directories |
| 26 | Typography | Too many 7-9px labels in game UI | Critical | Raise body/action typography; reserve microtype for dense HUD metadata only |
| 27 | Typography | Uppercase tracking was overused | Medium | Restrict uppercase to labels and state rails |
| 28 | Motion | Motion presets were mostly decorative entrances | High | Tie motion to seal, reveal, feedback and navigation state changes |
| 29 | Touch | Some secondary controls had sub-44px hit targets | Critical | Add hit slop or 44px container to every game interaction |
| 30 | QA | Overflow could be measured only after manually opening each viewport | Critical | Persist a QA matrix and report exact dimensions per checked combination |
| 31 | Brand | Candle/blade motif was inconsistent between emblem and UI | Medium | Use crossed-candle emblem only at identity moments |
| 32 | Brand | Handwriting risked becoming a decorative sticker clone | Medium | Use English handwritten marginalia without a paper sticker container |
| 33 | Colour | Gold competed with turquoise in common actions | Medium | Turquoise remains primary; gold only rewards and score |
| 34 | Colour | Red appeared in neutral screens | Medium | Reserve red for invalidation, loss and error |
| 35 | Surfaces | Excess glass blur weakened game readability | Medium | Use opaque navy surfaces with restrained highlights |
| 36 | Surfaces | Border radius varied without hierarchy | Medium | Standardize 10/14/18/26 radius scale |
| 37 | Content | English and Russian interface copy mixed arbitrarily | Medium | Russian gameplay copy; English only handwritten brand notes and system IDs |
| 38 | Content | Some source references were generalized | Medium | Keep exact source in Inventory and Asset Matrix |
| 39 | Evidence | Evidence cards lacked an explicit false-signal test | Medium | Expose weight and preserve one false item |
| 40 | Leaderboard | Podium consumed too much vertical space | Low | Dense variant prioritizes rows; focus variant keeps podium |
| 41 | Collection | Dense skill cards hid names | Medium | Dense mode still exposes ID/tier; larger modes expose names |
| 42 | Economy | Store resembled a standard promo card | Medium | Keep purchase as one controlled screen with verified benefits |
| 43 | Errors | Error copy did not show cache age consistently | Medium | Include cache age and useful retry action |
| 44 | Empty | Empty state had too much unused decorative space | Low | Keep one chart ghost and one CTA |
| 45 | Safe area | Safe-area logic was split across components | High | Apply safe top in Top Bar and safe bottom in Bottom Nav/export shell |
| 46 | Accessibility | Focus states existed but labels were incomplete | Medium | Add aria labels to chart candles and nav/current page semantics |
| 47 | Accessibility | Reduced motion covered only selected animations | Medium | Disable all shipped named animation classes under reduced motion |
| 48 | Workbench | Inspector was too dense before core controls | Medium | Put asset identity first, live treatment second, QA third |
| 49 | Reports | Final deliverables were scattered | Medium | Consolidate Inventory, Matrix, assets, QA, missing files and 3-variant pages |
| 50 | Build | Old dead modules increased confusion | Low | Remove unused legacy files and verify single-file production build |

## 80/20 conclusion

The main quality loss came from five systems: viewport geometry, global chrome, card-heavy hierarchy, undersized typography/touch targets, and weak chart/decision drama. Fixing those systems improves every page more than adding isolated decoration.