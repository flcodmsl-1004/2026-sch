# Matholic Design System

A design system for **매쓰홀릭 (Matholic)** — a Korean-market math-education SaaS platform used by cram-school (학원) teachers to run worksheets, diagnostic tests, grading, and class management for their students.

![Matholic logo](./assets/logos/matholic_logo.png)

## Sources

- **Figma file:** `design_test.fig` (mounted locally; the user provided it, no external URL). One page, 8 top-level frames covering: `기본 컬러` (foundations), `테이블` (tables + pagination), `목록 화면` (list screens), component sections for `버튼` (buttons), `체크박스/토글/텍스트필드` (forms), and full application screens under `section8`.
- **No codebase was attached.** All components are reconstructed from the Figma pseudo-JSX. If/when the real codebase is provided, lift exact values over mine.
- **Reference screenshots:** `figma_assets/*.png` — copied out of the Figma for quick reference. Do not link these from production; they're development scratch.

## What Matholic is

Reading the Figma screens in order of the top nav, Matholic delivers these features to math teachers:

| Nav item | What it does |
|---|---|
| 수업 (Class) | Classroom / session management — teacher-per-student grid, class list |
| 학습지 (Worksheet) | Author and assign worksheets; grade student submissions |
| 교재채점 (Textbook grading) | Grade scanned / photographed answer sheets |
| 학습현황 (Learning status) | Per-student + per-class dashboards; correct-rate by unit & type |
| 진단평가 (Diagnostic) | Standardized diagnostic tests |
| 연산대장 (Arithmetic drills) | Drill-sheet generator for 연산 (computation) practice |
| 시험대장 (Test master) | Exam builder (mocks, level tests, weekly tests) |
| 더보기 (More) | Admin / secondary tools |

Secondary side-rail tools include student directory, chat/SMS to parents (문자 보내기), report/analytics, and a "recently-used / history" tool.

The product is **desktop-web, data-dense, bilingual-leaning-Korean** (Latin numbers & English app names mix freely with Korean labels). Visual DNA is very close to **Ant Design** — several Figma captions literally say "Ant Design과 동일" ("same as Ant Design"). That isn't laziness; it's the target aesthetic: familiar, high-density, teacher-friendly, utilitarian.

## Index — the root of this kit

```
README.md                 ← you are here
SKILL.md                  ← Agent Skills manifest (portable, Claude Code compatible)
colors_and_type.css       ← design tokens (CSS custom properties) — import everywhere
fonts/
  suit.css                ← @font-face (SUIT Variable, served from jsDelivr CDN)
assets/
  logos/                  ← matholic_logo.png + EN/KR wordmark crops
  illustrations/          ← (empty — flag to user)
figma_assets/             ← raw reference pngs cropped from the Figma file
preview/                  ← one tiny HTML card per design-system concept
                            (auto-rendered into the Design System tab)
ui_kits/
  web_dashboard/          ← the Matholic teacher web app
    README.md
    index.html            ← an interactive click-thru of the core flow
    Components.jsx        ← buttons, inputs, tags, switches, checkboxes …
    AppShell.jsx          ← header + side rail + page layout
    WorksheetList.jsx     ← 학습지 list screen with filters + pagination
    LearningStatus.jsx    ← 학습현황 dashboard screen
    SmsCompose.jsx        ← 문자 보내기 screen
```

## Components

Exported on `window.<Namespace>` from `components/`:

- **Button** — primary / sub / ghost, md + sm, disabled state
- **ButtonGroup** — row wrapper for 2+ buttons, fixed `gap: 12px`
- **IconButton** — square icon-only button, 32 × 32 or 28 × 28, outline + ghost
- **OnOffButton** — OFF/ON pair (outline + soft variants), equal-width halves, 12 px gap
- **Input** — 32 px text field, focus ring, error + disabled
- **Select** — 32 px dropdown with blue selected row
- **Checkbox** — 16 px box, checked / indeterminate / disabled
- **Toggle** — switch, `lg` 44×22 default / `sm` 28×16, optional side label or in-track text
- **Tag** — blue / red / green / orange / gray / teal chip, removable
- **ScoreChip** — correct-rate chip, colour by threshold (80 / 50)
- **Pagination** — 32 px numbered pager with arrows
- **Tooltip** — dark hover tooltip, four directions
- **Card** — white surface, 1 px #D9D9D9, 10 px radius, 20 px padding

## Content fundamentals

**Tone:** professional, neutral, teacher-as-expert. Korean copy is terse (noun-ending 체언 종결) and action-oriented — labels are action nouns, not full sentences (`학습지 생성`, not `학습지를 생성합니다`). Buttons are imperatives of 2–5 characters (`출력하기`, `선택 해제`, `초기화`, `다음으로`). Error text is declarative, neutral ("잘못 입력") — no exclamation marks, no emoji, no humour.

**Voice:** the product speaks to the *teacher* as `선생님` (teacher/sir) in secondary contexts ("원장 선생님"). Students are third-party entities (`학생`, `학부모`). The parent–teacher SMS feature uses system-voice ("문자 발송 안내", "자세한 내용은 공지사항을 참조해주시기 바랍니다") — polite, formal `-ㅂ니다` ending.

**Casing rules:**
- Korean labels: no casing to worry about; keep them flat.
- Latin UI strings: Title Case for feature names (`Primary Color`, `Foundation`, `Typo`), lowercase for small UI states (`on`, `off`, `hover`), ALL-CAPS never in body — only within the `MATHOLIC` wordmark itself.
- Numerics: Arabic digits, Latin. Units with a thin non-breaking space (`74/100점`, `25.02.03`).

**Bilingual rule of thumb:** Korean first for anything a teacher reads in flow; English OK for:
- Section titles in internal tooling (`Color`, `Typo`, `Foundation`, `Icon` in the Figma sheet itself)
- Abbreviations and product names (`MATHOLIC`, `GNB`, `bytes`, `SMS`)
- Technical categories (`primary button`, `sub button`, `on-off button`)

**Emoji: none.** There are zero emoji in the Figma file and they shouldn't appear in the product. Substitute a Lucide icon.

**Example copywriting (lifted verbatim from the design file):**
- Empty-ish confirmation: `2명에게 보내기` (Send to 2 people) — subject + number + verb, nothing else.
- System notice: `80bytes 초과 시 MMS로 전송되며 단문(SMS)의 3배 요금이 청구됩니다.`
- Inline help: `되도록 한 화면에서 가장 중요한 1개만` (Preferably only one of the most important per screen — button-usage guidance)
- Button labels: `출력하기`, `선택 해제`, `학습지 생성`, `다음으로`, `뒤로`, `초기화`, `다시 출제하기`, `정보 수정`, `강의모드`, `삭제하기`.

## Visual foundations

### Palette — one hero blue on grey-white

`#1677FF` carries the entire brand. Everything else is neutral. This isn't a gradient-heavy, peacock-feathered consumer brand — it's a dense productivity tool, and the job of colour here is to answer "where should my eye go?" and "what's broken?". Saturated colour appears only for: primary actions, the active nav tab, selected rows, and the red/green/orange semantic triplet.

- **Hero:** `#1677FF` (never `#0050B3`, never a purple gradient, never a mint). Hover darkens to `#1166DE`.
- **Neutrals:** a 4-step grey scale `#212121 / #555 / #777 / #999` with `#D9D9D9` for lines and `#F7F8F9` for the page canvas.
- **Semantic:** red `#FB1A18` / green `#389E0D` / orange `#D46B08`, each with a matching soft background/border pair (see tokens).
- **Charts:** blue, green, orange, red, teal, lime — in that order. No pinks, no purples.

### Typography — SUIT, four weights

The whole product sets in **SUIT** (sunn.us's open-source Korean + Latin sans), in weights 400/500/600/700. The system touches **14 px** almost exclusively for body UI; 16/18/22/24 for headings and section titles; 12/13 for meta/captions. **No font smaller than 11 px.** Line-heights are tight — body text runs at 22 px on 14, UI labels at 100% (true leading). Letter-spacing is slightly condensed (`-0.005em`).

### Shape & structure

- **Corner radius:** 6 px for 95% of things (buttons, inputs, selects, chips). 10 px for outer panels. 2 px for page-section containers. `999px` is only used for dot indicators and avatars.
- **Borders:** 1 px solid `#D9D9D9` is the default. Selected/active states swap the border to the primary blue, plus a light-blue fill. Disabled inputs: `#F7F8F9` fill + `#D9D9D9` border + `#999` label.
- **Shadows:** almost never used on resting surfaces. The product is flat. Two shadows exist in the Figma: a very soft card shadow (`0 2px 8px rgba(0,0,0,0.06)`) and a heavier floating-panel shadow (`0 6px 16px rgba(0,35,11,0.2)`) for dropdowns/tooltips.
- **Button groups:** when two or more buttons are lined up (side by side or stacked), the gap between them is **12 px** — always `display:flex` + `gap:12px`, never per-button margins. 8 px stays for icon ↔ label inside a single button.
- **Cards:** a `mh-card` is `white + 1px #D9D9D9 + 10px radius` — no shadow, no accent stripe, no gradient.

### Imagery

There's essentially no photographic or illustrative imagery in the product itself — only the MATHOLIC wordmark (geometric "MATHOLIC" in seven rainbow colours, a pre-existing brand mark) and product screenshots. **Don't invent illustrations.** If a blank state needs something, prefer a Lucide icon at `#D9D9D9`, 32–48 px, centred, no label fluff beyond "없음" or "데이터 없음".

### Motion

Minimal. Hover transitions on buttons/links fade in ~150 ms (`ease-out`). Dropdowns fade+translate 4 px down, 150 ms. No bounces, no spring animations, no layered parallax. Tooltip fade is ≤ 100 ms.

### Interaction states

- **Hover:** buttons lighten outer stroke (primary → `#1890FF`). Rows gain a `#F7F8F9` fill. Links underline on hover only.
- **Press / click / active selected:** primary button darkens slightly; segmented/toggle moves to the "ON" style (light-blue fill `#E5F2FD`, blue border, blue semibold label).
- **Focus:** 2 px outer ring in primary blue at 20% alpha. Keyboard-only — not a CSS `:active` flash.
- **Disabled:** fill `#F7F8F9`, border `#D9D9D9`, label `#999`, no pointer-events. **Never** dim-by-opacity; the palette already handles it.
- **Error:** 1 px `#FB1A18` border; helper text `#FB1A18`.

### Transparency & blur

Not a tool in this system. Everything is opaque. The only alpha usage is in semantic-coloured backgrounds (already expressed as solid hex in tokens) and shadow tints.

### Layout rules

- Application chrome is fixed: a 56 px top GNB (global nav bar) pinned to the top of the viewport, and a 40 px right rail for secondary tools.
- Main content sits inside a white surface on the `#F7F8F9` page canvas, typically full-bleed width within the shell — no max-width constraint. Teachers use big monitors.
- Section headers are `h1` (24 px / 700) with a thin horizontal line below, at 20% opacity.
- Tables are dense: 48 px rows, 14 px base text, alternating white (no zebra stripes), borders only between rows (`#EEEEEE`).

### Iconography

**Matholic uses [Lucide](https://lucide.dev/).** This is explicit, verbatim, in the design file (`/page/section/Icon/Icon.jsx` caption: *"Lucide icon에서 svg 파일 복사해서 사용. 개발팀에 공유할 때는 아이콘 이름 코멘트로 알려주기"* — "Copy SVG from Lucide icons. When sharing with the dev team, note the icon name as a comment").

- **Default stroke:** 2 px, default Lucide sizing.
- **Default colour:** `#999999` (the tertiary grey) for idle UI chrome; `#212121` for active/selected; `#1677FF` when inside a primary button; `#FB1A18` when destructive.
- **Default size:** 16 × 16 inside buttons; 18 × 18 in icon buttons; 12 × 12 inside chevrons/carets inside selects.

**Custom navigation icons.** The top-GNB icons (수업/학습지/교재채점/학습현황/진단평가/연산대장/시험대장/더보기) are **bespoke pictograms** in the Matholic palette — not Lucide. They ship as a single PNG sprite in the Figma file; I've copied it to `assets/icons/top_nav_icons.png` for reference but flag this as an asset to rebuild with real SVGs when the real product files arrive.

- **Emoji:** not used. Never mix into labels.
- **Unicode characters as icons:** only for list-markers within a page's own content (bullet dots, arithmetic symbols inside questions) — not for UI chrome.
- **The logo:** a colourful, geometric wordmark. Six letterforms `M A T H O L I C` each rendered in a different solid colour (pinkish-red, teal, lime, yellow, pink, orange, blue-circle). Do **not** recolour or restyle. Use as-is (`assets/logos/matholic_logo.png`), or the bilingual EN+KR variant.

### What **NOT** to do in a Matholic design

- No purple / pink / lavender gradients.
- No glassmorphism or blurred-glass panels.
- No neumorphism, no deep shadows.
- No "emoji cards". No "left-border accent colour" cards.
- No Inter. No Roboto. No system-ui-only fallback.
- No hand-drawn illustrations or doodle SVGs.
- No dark mode (not spec'd — ask before adding).
- No max-width constraints on teacher-facing dashboards.

## Flags — ask the user

1. **No codebase provided.** UI kit components are reconstructed, not lifted. Expect per-pixel drift; ask for the frontend repo to tighten.
2. **No real illustration library.** Only the logo. If the product has blank-state illustrations, upload them.
3. **No dark-mode spec.** Tokens are light-only. Need a variant? Ask.
4. **Top-nav icons are a PNG sprite.** I didn't redraw them — using the sprite as-is. When you ship real production code, replace with individual SVGs.
5. **SUIT font is self-hosted** from `fonts/*.woff2` (Thin 100 → Heavy 900). SIL OFL — keep the license if you redistribute.
