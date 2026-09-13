# 🚀 Outlier

**Rare-answer trivia. The rarer your answer, the higher you launch.**

Seven prompts, twenty seconds each. *Name a country with a crescent moon on its flag.* Everyone says Turkey. You say **Comoros**, and your rocket shoots past the International Space Station.

Play it: **https://zynx0-ops.github.io/outlier/**

Inspired by [Krillion](https://krillion.io), which dives down into the ocean. Outlier goes up instead: a perfect game of 700 points lands you on the Moon.

## How it plays

- **Daily mission.** Everyone gets the same 7 prompts each day. You get one attempt, and your streak is tracked.
- **Unlimited.** Random missions, free, as many as you like.
- **Challenges.** When you finish an unlimited mission, you can copy a link. A friend who opens it plays the same seven prompts, and at the end they see your score next to theirs. No accounts and no server.
- **Keep guessing.** An answer that isn't on the list doesn't end the round. You can keep typing until you land a valid answer or the timer runs out.
- **Forgiving input.** Case, accents, punctuation and "the" are ignored, plurals are accepted, and small typos on longer words are forgiven. If a typo is close to two different answers, it isn't accepted, so try again.

### Rarity tiers

| Tier | Points | Meaning |
| --- | --- | --- |
| ⭐ Outlier | 100 | The single hand-picked gem for the prompt |
| 🟪 Deep Space | 85 | A genuinely deep cut |
| 🟦 Rare | 60 | Most people never think of this |
| 🟩 Uncommon | 30 | Off the beaten path |
| 🟫 Galaxy Brain | 15 | The "obscure" pick that *everyone* thinks only they know |
| ⬜ Obvious | 10 | Half the planet said this |

### The launch

Every locked-in answer plays a short launch animation. The engine ignites and the camera follows the rocket up through a sky that darkens as you climb. Clouds, airliners, the ISS and satellites pass by, each landmark is labeled with its altitude, and the altimeter counts up in real time. A missed answer makes the engine sputter and stall. Landing an Outlier sets off a gold burst. Tap anywhere, or press Space, to skip the animation.

### Design

The interface follows Apple's design language. It uses the system font (SF Pro on Apple devices, Inter elsewhere), the iOS system color palette with automatic light and dark mode, frosted-glass materials, inset grouped lists, a tab bar, bottom sheets, alerts and SF Symbols–style icons. It can be added to an iPhone home screen, where it runs full screen with its own app icon.

### Altitude

Altitude grows exponentially with your score: `altitude = 384,401^(score/700) − 1` km. That means every extra point pushes you further than the last one. On the way up you pass Everest, the Kármán line, the ISS, Hubble, the GPS satellites and geostationary orbit before you reach the Moon.

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # data integrity + matching + scheduling tests
npm run build      # typecheck + production build
```

It's plain TypeScript with Vite and no framework. Every push to `main` is tested and deployed to GitHub Pages by `.github/workflows/deploy.yml`.

### Project layout

```
src/
  main.ts        wires the screens together
  screens.ts     Play, Stats and How to Play tabs, the mission report
  mission.ts     a mission in progress: question card, timer, result sheet
  scene.ts       the sky, rocket and launch animation
  ui.ts          shared UI pieces: mounting, tiles, toasts, alerts
  icons.ts       SF Symbols–style SVG icons
  game.ts        creating and saving daily / unlimited games
  match.ts       answer normalization + typo-tolerant matching
  schedule.ts    seeded daily / unlimited prompt selection
  altitude.ts    score → kilometres, landmarks
  share.ts       emoji share text + challenge links
  storage.ts     local stats, streaks and rarity breakdown
  data/          the prompt catalog
tests/core.test.ts
```

### Adding a prompt

Prompts live in `src/data/*.ts`, written in a compact format. Separate answers with `;` and alternate spellings with `/`. The first spelling is the one players see.

```ts
{
  id: 'crescent-flags',
  cat: 'Geography',
  text: 'A country with a crescent moon on its flag',
  hint: 'UN member states',
  obvious: 'Turkey/Türkiye; Pakistan',
  clever: 'Singapore',
  uncommon: 'Algeria; Tunisia; Malaysia; Azerbaijan; Libya',
  rare: 'Uzbekistan; Mauritania; Maldives; Turkmenistan',
  deep: 'Nepal; Brunei',
  outlier: 'Comoros',
}
```

`npm test` checks that every prompt has exactly one Outlier, that no spelling is claimed by two answers, and that every spelling matches back to its own answer.

Rarity is currently curated by hand, not measured from real player answers. Ideas and corrections are welcome as issues or pull requests.

## License

MIT
