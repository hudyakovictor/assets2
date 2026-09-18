# Assets required before final merge

Source repository:

https://github.com/hudyakovictor/assets/tree/main

Fetch/extract these exact sources before declaring the UI final:

- `skill-card-icons.zip` → `skill-card-icons/c01…c40.svg` and preview SVGs
- `topbar.zip` → `topbar/topbar.html` and `topbar/icons/{lightning,star,coin,bell,gear}.svg`
- `assets.zip` → only the assets explicitly referenced by the final Asset Matrix

The current package intentionally does not recreate these assets. If the runtime cannot unpack an archive, use `ASSET_ARCHIVE_NOT_EXTRACTED`; do not call the files `MISSING_ASSET` and do not replace the canonical Top Bar or skill icons with invented SVGs.

Locked skill card colors:

```css
--card-green:  #2E7F5C;
--card-yellow: #D0B24A;
--card-blue:   #4C6180;
--card-red:    #C56861;
```
