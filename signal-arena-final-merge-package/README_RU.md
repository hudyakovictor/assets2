# Signal Arena — final merge package

## What this is

This archive contains one recommended implementation base plus carefully selected references from the other agent outputs. It is prepared for upload to Arena so the agent can build one consolidated workbench instead of choosing between multiple competing applications.

## Start here

1. Read `50_POINT_READINESS_AUDIT_RU.md`.
2. Read `06-external-assets-required/ASSETS_TO_FETCH.md`.
3. Treat `01-canonical-workbench` as the only implementation base.
4. Treat folders 02–05 as read-only references.
5. Do not merge multiple `App.tsx` files.

## Package map

- `01-canonical-workbench/` — selected full Workbench P01–P34.
- `02-audit-reference/docs/` — 50-check and 100-check audit documents.
- `03-registry-reference/` — asset registry, flow gates, page metadata and motion tokens.
- `04-gameplay-reference/` — chart, facts, state, Seal, Reveal, score and debrief reference code.
- `05-alternative-workbench-reference/` — selected report/page/asset-loader references only.
- `06-external-assets-required/` — exact repository and extraction instructions.

## Important

This package does not claim that the final runtime is complete. Build and browser validation are still required. Do not call the result 95–99 until real assets are mounted and the 50 checks plus viewport screenshots pass.
