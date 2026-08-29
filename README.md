# Gín-á Flashcards

A vocabulary flashcard deck for kids aged 4–7, in **English**, **Traditional Mandarin (華語)** and
**Taiwanese (台語)**. 1000 words, every one with its own illustration.

- **Front** — picture + 漢字 (and pinyin, optional)
- **Back** — English + 台語 in Hàn-jī and Tâi-lô + Mandarin pinyin
- Pick how many unique cards you want (1–1000) and which topics, then flip through the deck
  forever — it reshuffles and starts a new round at the end.
- Works on phone, tablet and desktop: tap or swipe the card, or use ← → and space on a keyboard.
- Tap-to-hear uses the device's own speech voices, so the 華語 and English buttons only appear
  where a voice is installed. Taiwanese has no browser voice, so it is shown in text only.

## The illustrations

There are no image files. Every card is drawn as SVG at runtime by a small parametric engine in
`src/art/`: shared generators (`animal`, `bird`, `fruit`, `vehicle`, `person`, …) plus a one-line
recipe per word in `src/art/registry.js`. That keeps the whole app — art, words and all — to a
single ~300 KB HTML file with no network requests except the web fonts.

```
src/art/core.js       drawing primitives, the cute face, the ground blob
src/art/families.js   the family generators
src/art/registry.js   1000 recipes, one per word
src/data/*.tsv        the word list: en, 華語, pinyin, 台語 漢字, Tâi-lô, topic
src/app.html          markup + styles
src/app.js            deck logic
tools/build.js        bundles everything into docs/index.html
tools/check.js        validates that every word has art and renders
```

## Build

```sh
node tools/build.js     # writes docs/index.html
node tools/check.js     # 1000 words, 1000 recipes, 0 render errors
```

`docs/index.html` is a standalone page — open it directly, or serve `docs/` with GitHub Pages.

## A note on the Taiwanese

Taiwanese readings use the Ministry of Education **Tâi-lô** romanisation and its recommended
Hàn-jī, and cover the common Taiwanese (Hokkien) forms. Regional pronunciation varies a lot —
Tâi-lâm and Tâi-pak do not always agree — and this list was compiled without a native-speaker
review pass. Check anything you plan to teach with a fluent speaker; corrections to
`src/data/*.tsv` are one-line changes.
