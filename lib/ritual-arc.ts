/**
 * The ritual arc — one clock, five moods, overlapping.
 *
 * This table is the single source of truth. `buildPatch()` injects the same
 * windows into the Strudel code, and the visuals evaluate `levelsAt(cycle)`
 * against the scheduler's real cycle. Nothing runs on a separate timer.
 *
 * A mood's window is a trapezoid over arc position x ∈ [0, 1):
 *   fades in over [a - f, a], holds [a, b], fades out over [b, b + f].
 * Windows may wrap past 1 — that's the mutation beginning again.
 */

export const CPS = 125 / 240 // 125 bpm, one cycle = one bar
// 64 bars per possession, 320 before the insects return — the 2025-07-15
// strudel session's own clock ("brain pew – Strudel Music Code Synthesis")
export const ARC = 320

export interface Mood {
  key: string
  name: string
  desc: string
  color: string
  a: number
  b: number
  f: number
  bpm: [number, number]
}

export const MOODS: Mood[] = [
  {
    key: "insects",
    bpm: [100, 100],
    name: "Electronic Insects at Dusk",
    desc: "Chirping, clicking, breathing sounds emerge from the digital void",
    color: "#60a5fa",
    a: 0.93,
    b: 1.17,
    f: 0.07,
  },
  {
    key: "wobble",
    bpm: [124, 126],
    name: "Booty-Grabbing Wobble Emerges",
    desc: "Bass frequencies awaken — and the wobble keeps speeding up",
    color: "#c084fc",
    a: 0.2,
    b: 0.37,
    f: 0.06,
  },
  {
    key: "wall",
    bpm: [120, 120],
    name: "Pan Sonic Telakoe Wall",
    desc: "The wobble, grown to sixteenths: a rhythmic wall that soothes",
    color: "#f87171",
    a: 0.42,
    b: 0.57,
    f: 0.04,
  },
  {
    key: "india",
    bpm: [138, 154],
    name: "Slag Boom Van Loon Crescendo",
    desc: "Drone, tabla, a rising raga — the roll doubles until it breaks",
    color: "#fb923c",
    a: 0.6,
    b: 0.76,
    f: 0.03,
  },
  {
    key: "python",
    bpm: [98, 98],
    name: "DJ Python Reggaeton Soul",
    desc: "Dembow sweetness wraps the chaos — then the insects return",
    color: "#4ade80",
    a: 0.79,
    b: 0.9,
    f: 0.04,
  },
]

const smooth = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u))

function trap(x: number, a: number, b: number, f: number) {
  return smooth((x - (a - f)) / f) * smooth((b + f - x) / f)
}

export function win(x: number, m: Mood) {
  return Math.max(trap(x, m.a, m.b, m.f), trap(x + 1, m.a, m.b, m.f))
}

export function arcPos(cycle: number, offset = 0) {
  return ((((cycle / ARC + offset) % 1) + 1) % 1)
}

export function levelsAt(cycle: number, offset = 0) {
  const x = arcPos(cycle, offset)
  return MOODS.map((m) => win(x, m))
}

/**
 * Tempo map — weighted by the live envelopes, so crossfades are also tempo
 * glides (idea from Desktop Daddy's tarantula / mutation: the light
 * accelerates 138 → 154, the melt drops to 98).
 */
export function bpmAt(cycle: number, offset = 0) {
  const x = arcPos(cycle, offset)
  let num = 0
  let den = 0
  MOODS.forEach((m) => {
    const l = win(x, m)
    if (l <= 0) return
    const span = m.b - m.a
    let u = (x - m.a) / span
    if (u < -0.5) u += 1 / span // wrapped window
    const bpm = m.bpm[0] + (m.bpm[1] - m.bpm[0]) * Math.min(1, Math.max(0, u))
    num += l * bpm
    den += l
  })
  return den > 0 ? num / den : 110
}

/** Offset that puts `cycle` at the start of mood `i`'s hold. */
export function offsetForMood(i: number, cycle: number) {
  const m = MOODS[i]
  return (((m.a - cycle / ARC) % 1) + 1) % 1
}

export interface RitualState {
  intensity: number
  offset: number
  cps: number
}

declare global {
  // eslint-disable-next-line no-var
  var __ritual: RitualState | undefined
}

export function ritualState(): RitualState {
  if (!globalThis.__ritual) globalThis.__ritual = { intensity: 0.5, offset: 0, cps: CPS }
  return globalThis.__ritual
}

/**
 * The patch. Envelope math is plain JS inside Strudel's scope; `signal(t => …)`
 * samples it at each event onset, so gains/filters glide with the arc and the
 * intensity knob is read live on every query.
 */
export function buildPatch() {
  const w = (k: string) => {
    const m = MOODS.find((x) => x.key === k)!
    return `env(${m.a}, ${m.b}, ${m.f})`
  }
  return `// EXTRACTIVE RITUAL — revisit 2026-09-25
// one arc, five moods, overlapping. nothing switches; everything mutates.
// "the mutations never fully erase each other. traces remain." — 2025-07-15
setcps(${CPS.toFixed(6)})

const ARC = ${ARC}
const rs = globalThis.__ritual
const knob = () => rs.intensity
const pos = t => ((((t / ARC) + rs.offset) % 1) + 1) % 1
const sm = u => u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u)
const tr = (x, a, b, f) => sm((x - a + f) / f) * sm((b + f - x) / f)
const env = (a, b, f) => signal(t => Math.max(tr(pos(t), a, b, f), tr(pos(t) + 1, a, b, f)))
const live = e => e.fmap(v => v > 0.003 ? 1 : 0)
const at = f => signal(t => f(pos(t), t))
// every lap of the arc re-seeds the key — the mutation begins again, elsewhere
const lap = t => Math.floor(t / ARC + rs.offset)
const TR = signal(t => [0, 5, -2, 3, 7, -4][((lap(t) % 6) + 6) % 6])
const tp = p => p.add(note(TR))

// ── 0 · electronic insects at dusk ────────────────────────────
const Ei = ${w("insects")}
const insects = stack(
  tp(note("f6 ab6 c7 eb7 f7 c7")).struct("t(<5 7 9>,16,<0 3 5>)").degradeBy(0.25)
    .s("sine").fm(4).fmh(3.01).fmdecay(0.04).fmsustain(0)
    .penv(7).pdecay(0.05)
    .decay(0.07).sustain(0)
    .gain(Ei.mul(0.2)).pan(perlin.range(0.05, 0.95).fast(0.7))
    .delay(0.3).delaytime(0.1875).delayfeedback(0.45),
  s("click*16").n(irand(4)).degradeBy(0.55)
    .speed(perlin.range(1.5, 3.5)).hpf(5000)
    .gain(Ei.mul(0.16)).pan(sine.fast(3).range(0.1, 0.9)),
  s("insect").n("<0 1 2>").slow(2).legato(1)
    .speed(perlin.range(0.85, 1.25)).lpf(5000)
    .gain(Ei.mul(0.22)).pan(sine.slow(5)),
  // trace: last lap's chimes, still falling as the garden wakes
  tp(note("<ab5 c6 eb6 f6>*2")).degradeBy(0.8).s("sine").fm(2).fmh(4)
    .decay(0.3).sustain(0).gain(Ei.mul(0.05)).pan(rand),
  s("pink").attack(1).release(1.2)
    .lpf(sine.slow(8).range(700, 2600))
    .gain(Ei.mul(sine.slow(4).range(0.03, 0.09)))
).room(0.75).size(4).orbit(1).mask(live(Ei))

// ── 1 · booty-grabbing wobble ─────────────────────────────────
// the wobble is a retriggered filter envelope. its rate climbs
// 1 → 16 per bar, changing only on bar lines so the phase never
// jumps — at 16 it IS the telakoe pulse.
const Ew = ${w("wobble")}
const RATES = [[0.25, 1], [0.29, 2], [0.33, 3], [0.36, 4], [0.385, 6], [0.405, 8], [0.425, 12]]
const rate = x => { for (const [e, r] of RATES) { if (x < e) return r } return 16 }
const RATE = signal(t => rate(pos(Math.floor(t)))).segment(1)
const wobnote = "<f1 f1 ab1 [f1 c2]>"
const wobble = stack(
  note(wobnote).ply(RATE)
    .s("sawtooth").lpf(150).lpq(9)
    .lpenv(signal(t => 3.5 + 2.5 * knob()))
    .lpattack(signal(t => 0.45 / (rs.cps || ${CPS.toFixed(6)}) / rate(pos(Math.floor(t)))))
    .lpdecay(signal(t => 0.5 / (rs.cps || ${CPS.toFixed(6)}) / rate(pos(Math.floor(t)))))
    .lpsustain(0).attack(0.004).release(0.03)
    .shape(signal(t => 0.2 + 0.3 * knob()))
    .gain(Ew.mul(0.42)),
  note(wobnote).s("sine").gain(Ew.mul(0.5)),
  s("bd:3").struct("t ~ ~ ~ ~ ~ t ~ ~ ~ t ~ ~ ~ ~ ~").gain(Ew.mul(0.9)).shape(0.3),
  s("~ ~ cp:1 ~").gain(Ew.mul(0.55)).room(0.3),
  s("hh:3*8").gain(Ew.mul("0.5 0.22 0.65 0.28")).hpf(6000).pan(0.62)
).swingBy(1 / 7, 4).orbit(2).mask(live(Ew))

// ── 2 · pan sonic telakoe wall ────────────────────────────────
// brain-fuck-you intensity that still breathes: everything is
// on the grid, nothing is loud for long.
const Ev = ${w("wall")}
const wall = stack(
  tp(note("f1*16")).s("sine").decay(0.09).sustain(0)
    .gain(Ev.mul("1 .55 .8 .55")).shape(signal(t => 0.15 + 0.45 * knob())),
  tp(note("f6")).s("square").struct("t(7,16)").decay(0.012).sustain(0)
    .hpf(3000).gain(Ev.mul(0.28)).pan(0.3),
  tp(note("c7")).s("square").struct("t(5,16,2)").decay(0.01).sustain(0)
    .hpf(4000).gain(Ev.mul(0.22)).pan(0.72),
  tp(note("f2")).s("sine").attack(0.5).release(0.8)
    .gain(Ev.mul(0.2)).distort(signal(t => 0.5 + knob())),
  tp(note("c6")).s("sine").attack(0.3).release(1)
    .gain(Ev.mul(sine.fast(4).range(0.02, 0.07))),
  s("metal:1").struct("t(3,8,1)").speed(0.5).lpf(2500).gain(Ev.mul(0.28)),
  s("bd:0*4").gain(Ev.mul(0.85)).shape(0.45),
  // trace: the wobble's sub ghosts through the wall
  tp(note(wobnote)).s("sine").gain(Ev.mul(0.16))
).room(0.15).orbit(3).mask(live(Ev))

// ── 3 · slag boom van loon — light of india ───────────────────
const Ea = ${w("india")}
const cres = at(x => sm((x - 0.58) / 0.18))
const ROLL = [1, 1, 2, 2, 3, 4, 6, 8]
const india = stack(
  tp(note("[f2,c3,f3]")).s("sawtooth").vowel("<a o>").attack(0.3).release(1)
    .lpf(cres.range(500, 3200)).gain(Ea.mul(0.14)),
  s("tabla").n(irand(26)).struct("t(<7 9 11>,16)")
    .gain(Ea.mul(0.5)).pan(rand.range(0.3, 0.7)),
  s("tabla2").n(irand(46)).struct("t(3,8,<0 2>)").speed(1.1)
    .gain(Ea.mul(cres.mul(0.4))).pan(rand.range(0.2, 0.8)),
  tp(note("f4 gb4 a4 bb4 c5 db5 e5 f5")).struct("t(11,16)")
    .add(note(signal(t => 12 * Math.floor(sm((pos(t) - 0.58) / 0.18) * 1.99))))
    .s("sawtooth").lpf(cres.range(900, 5200)).decay(0.18).sustain(0)
    .gain(Ea.mul(cres.range(0.1, 0.3))).pan(sine.slow(3).range(0.2, 0.8))
    .delay(0.35).delaytime(0.1875).delayfeedback(0.4),
  s("sd:1*4").ply(at(x => ROLL[Math.min(7, Math.floor(sm((x - 0.58) / 0.18) * 8))]).segment(1))
    .hpf(cres.range(300, 1800)).gain(Ea.mul(cres.range(0.04, 0.42))),
  s("gretsch").n("0 5 [9 5] 2 ~ 5 0 [9 9]").gain(Ea.mul(cres.mul(0.38))),
  s("bd:3*4").gain(Ea.mul(0.75)),
  // trace: one of the wall's clicks keeps ticking under the raga
  tp(note("c7")).s("square").struct("t(5,16,2)").decay(0.01).sustain(0)
    .hpf(4000).gain(Ea.mul(0.07)).pan(0.72)
).room(0.35).orbit(4).mask(live(Ea))

// ── 4 · dj python reggaeton soul ──────────────────────────────
const Ep = ${w("python")}
const python = stack(
  s("bd:5").struct("t ~ ~ ~ t ~ ~ ~ t ~ ~ ~ t ~ ~ ~").lpf(900).gain(Ep.mul(0.75)),
  s("perc:2").struct("~ ~ ~ t ~ ~ t ~ ~ ~ ~ t ~ ~ t ~").gain(Ep.mul(0.42))
    .delay(0.2).delaytime(0.375),
  tp(note("<[db3,f3,ab3,c4,eb4] [c3,eb3,g3,bb3,d4] [bb2,db3,f3,ab3,c4] [f2,ab2,c3,eb3,g3]>"))
    .s("triangle").attack(0.4).release(1.8).lpf(1800).gain(Ep.mul(0.14)),
  tp(note("<db2 c2 bb1 f1>")).struct("t ~ ~ t ~ ~ t ~ t ~ ~ t ~ ~ t ~")
    .s("sine").decay(0.4).sustain(0.3).gain(Ep.mul(0.42)),
  tp(note("<ab5 c6 eb6 f6>*2")).degradeBy(0.5).s("sine").fm(2).fmh(4)
    .decay(0.3).sustain(0).gain(Ep.mul(0.11)).pan(rand)
    .delay(0.5).delaytime(0.375).delayfeedback(0.5),
  s("hh:1*16").gain(Ep.mul("0.14 0.06 0.1 0.06")).hpf(7000),
  // trace: the insects hide in the high end
  s("click*16").n(irand(4)).degradeBy(0.8).speed(perlin.range(2, 3.5))
    .hpf(7000).gain(Ep.mul(0.1)).pan(rand)
).room(0.8).size(6).orbit(5).mask(live(Ep))

stack(insects, wobble, wall, india, python)
`
}
