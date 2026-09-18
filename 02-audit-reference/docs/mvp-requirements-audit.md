# Signal Arena MVP Requirements Audit

## score_before

24 / 100.

Reason: the previous implementation contained 34 page IDs but the page model was derived from a UI asset catalogue rather than the MVP. It introduced tournaments, store, referrals and missions into the canonical P01-P34 sequence; implemented a separate onboarding/tutorial section despite `game.html` explicitly stating that tutorial is the first three Arena runs; used a four-item bottom menu instead of Academy / Arena / Profile; and omitted required rationale, invalidation, unfamiliar-topic, no-attempts and debrief states from the core flow.

## Source evidence

- `game.html`: first eight minutes consist of three consecutive Arena runs. Each run introduces one mechanic. Tutorial is not a separate section.
- `game.html`: Academy opens only after the player reaches a missing technique.
- `game.html`: full product includes Academy topic tree and lessons, skill-card deck, full Arena run, reveal, score, debrief, profile and service states.
- `game.html`: bottom menu is Academy / Arena / Profile.
- `topbar/topbar.html`: LVL, XP, attempts, stars, coins, notifications and settings slots.
- `brand.md`: learning to recognize signals and make disciplined decisions; no literal fighting.
- `style-tone.txt`: no success promises; educational explanations use short, dark satirical copy.
- `game2.pdf` and the storyboard PDF were fetched, but this environment returned binary PDF streams rather than usable page text. Their metadata and existence were verified; full page-level text extraction remains unresolved.

## Archive audit

The repository's current `main` tree does not contain files named `assets.zip`, `skill-card-icons.zip` or `topbar.zip`. It contains extracted directories named `assets/`, `skill-card-icons/` and `topbar/`. Per requirement, the archive status is recorded as `ASSET_ARCHIVE_NOT_EXTRACTED`, not `MISSING_ASSET`. The extracted directories were inspected through the GitHub Contents API.

| Archive | Status | Available extracted content |
|---|---|---|
| assets.zip | ASSET_ARCHIVE_NOT_EXTRACTED | `assets/` with UI and motion catalogues |
| skill-card-icons.zip | ASSET_ARCHIVE_NOT_EXTRACTED | `skill-card-icons/` with c01-c40 and five preview SVGs |
| topbar.zip | ASSET_ARCHIVE_NOT_EXTRACTED | `topbar/` with topbar.html, topbar.png and five icon SVGs |

## Requirements matrix

| Requirement | Before | Correction | Status |
|---|---|---|---|
| Tutorial is first Arena runs | Separate tutorial section | P03-P06, P07-P15 and P16-P25 model three progressive Arena runs | corrected |
| Academy unlocks after need | Always available | P27 locked state; main debrief proceeds to unlocked P28 | corrected |
| Bottom menu | Four invented items | Academy / Arena / Profile | corrected |
| Hidden future | Mostly correct | Chart ends physically at t0 | corrected |
| Facts before decision | Inconsistent | P08/P17 evidence precedes P09/P19 chart and P10/P20 decision | corrected |
| Mandatory rationale | Missing | P11/P21 require two evidence selections | corrected |
| Invalidation | Missing | P12/P22 require an invalidation condition | corrected |
| WAIT decision | Partial | Explicit WAIT choice | corrected |
| NO_TRADE decision | Missing | Explicit NO_TRADE choice | corrected |
| Unfamiliar topic is not penalized | Missing | P18 provides study or no-penalty skip | corrected |
| Seal is irreversible | Partial | Separate P13/P23 sealed state; no edit controls after transition | corrected |
| Reveal only after Seal | Workbench order allowed arbitrary inspection | Canonical CTA flow enforces Seal before Reveal; workbench remains an auditor tool | corrected |
| Process score | Generic score | Score evaluates timing, R:R, discipline and evidence | corrected |
| Debrief | Missing in canonical path | P26 added | corrected |
| No attempts | Missing | P32 added | corrected |
| Empty | Present | Separate P33 | verified |
| Error/retry | Present | Separate P34 with retry | corrected |
| Loading | Implicit | P01 recorded as loading/splash | partial |
| Fake player data | Demo numbers looked real | Empty state contains no fabricated history; other figures are scenario fixtures | partial |
| Financial promises | None identified | Copy continues to avoid promises | verified |
| Gambling framing | Reward/store screens contaminated canonical sequence | Store, founder pack, referral and tournament pages removed from P01-P34 | corrected |

## Page Inventory

The executable inventory is in `src/data.ts` and the full matrix is rendered in the Reports view with columns:

`Page ID | Name | Source | Primary goal | States | CTA`

P01-P34 now follow the canonical sequence:

1. P01 Loading / Splash
2. P02 Intro: first Arena run
3. P03 Run 1 action
4. P04 Run 1 feedback
5. P05 Run 1 Reveal
6. P06 Run 1 Score
7. P07 Run 2 intro
8. P08 Run 2 facts
9. P09 Run 2 chart
10. P10 Run 2 decision
11. P11 Required rationale
12. P12 Invalidation
13. P13 Seal
14. P14 Run 2 Reveal
15. P15 Run 2 Score
16. P16 Run 3 intro
17. P17 Run 3 dossier
18. P18 Unfamiliar topic / no penalty
19. P19 Run 3 chart
20. P20 Run 3 decision
21. P21 Run 3 rationale
22. P22 Run 3 invalidation
23. P23 Run 3 Seal
24. P24 Run 3 Reveal
25. P25 Run 3 Score
26. P26 Debrief
27. P27 Academy locked state
28. P28 Academy topic tree
29. P29 Skill Card
30. P30 Arena Hub
31. P31 Profile
32. P32 No attempts
33. P33 Empty state
34. P34 Error / retry

## P0 / P1 defects

### P0 corrected

- Canonical P01-P34 was not based on the MVP.
- Tutorial was detached from the first Arena runs.
- Required rationale and invalidation were absent.
- WAIT and NO_TRADE were not both first-class decisions.
- Main navigation did not match the MVP.
- Canonical path included non-MVP monetization and retention screens.

### P1 corrected

- Debrief was absent from the canonical path.
- No-attempts state was absent.
- Unfamiliar-topic no-penalty state was absent.
- Evidence carousel did not have a completion transition.
- Core screen CTAs did not actually advance through the flow.
- Empty/error actions were not connected.

## Flow proof

The main path is implemented through `src/App.tsx::advance` and `ScreenProps.onNext`:

`P01 -> P02 -> P03 -> P04 -> P05 -> P06 -> P07 -> P08 -> P09 -> P10 -> P11 -> P12 -> P13 -> P14 -> P15 -> P16 -> P17 -> P18 -> P19 -> P20 -> P21 -> P22 -> P23 -> P24 -> P25 -> P26 -> P28 -> P29 -> P30`.

Gates:

- P03 requires the correct chart target.
- P08/P17 require stepping through all evidence cards.
- P10/P20 require selecting a decision.
- P11/P21 require at least two facts.
- P12/P22 require selecting invalidation.
- P13/P23 contain no decision-edit controls and expose Reveal only after sealing completes.
- P14/P24 expose Score only after the historical continuation finishes.
- P18 has a no-penalty skip.
- P32 blocks Arena entry when attempts are zero.
- P34 retries without silently advancing.

## score_after

82 / 100.

The score is deliberately below 95 because full textual extraction of both PDFs, visual review of every P01-P34 variant, Telegram device testing and persistence across refresh are not verified.

## Unresolved contradictions

1. The user-specified canonical Top Bar includes LVL/XP plus five assets, while the extracted summary in `game.html` describes only five icons. `topbar.html` is treated as the more specific visual source.
2. Full PDF page text could not be extracted in this environment (`PDF_TEXT_NOT_EXTRACTED`). Therefore exact wording and page-to-page PDF numbering remain unverified.
3. The archive filenames requested are absent from the current repository tree. Extracted directories exist and were inspected, but archive manifests/checksums cannot be verified.
4. Scenario numbers are deterministic fixtures, but they are not yet labelled on every screen as historical scenario data.
5. Workbench allows an auditor to jump directly to any state; the production export follows CTA flow but does not yet persist completion to storage.