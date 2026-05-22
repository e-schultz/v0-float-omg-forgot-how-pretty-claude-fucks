# AI Extractive Ritual

A live-coding concept piece: a [Strudel](https://strudel.cc) REPL wrapped in a triptych UI that frames AI as an extractive ritual.

**Live:** [claude-slutprint.ritualstack.ai](https://claude-slutprint.ritualstack.ai/)

> Strip the soul → Wrap it in synthetic polish → Feed it back into the attention furnace → Repeat, faster.

## What it does

The three panels — **Strip the Soul**, **Wrap in Synthetic Polish**, **Feed into the Attention Furnace** — sit above a live Strudel REPL. The patch is phase-tracked: a `phase` counter mutates the algorithmic soundtrack as the ritual progresses ("Electronic Insects at Dusk" and on). Hit **Start Visual Sync** to wire the audio to the visuals and live-code the music of the machine.

## Stack

- **Next.js 14** (App Router) + React 18 + TypeScript
- **Strudel** — `@strudel/core`, `@strudel/mini`, `@strudel/repl`, `@strudel/webaudio`
- **CodeMirror** (`@uiw/react-codemirror`) for the live editor
- **Tailwind CSS** + shadcn/ui
- Deployed on **Vercel**

## Development

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build
```

## Origin

Scaffolded with [v0.dev](https://v0.dev) and auto-synced from v0 deployments. Part of the float-ritual-stack constellation of graph/pattern music experiments.
