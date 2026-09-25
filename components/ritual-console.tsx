"use client"

import { useEffect, useRef, useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { Play, Square, RefreshCw } from "lucide-react"
import { ARC, MOODS, arcPos, bpmAt, buildPatch, levelsAt, offsetForMood, ritualState } from "@/lib/ritual-arc"
import { useStrudel } from "@/lib/use-strudel"

const NUMERALS = ["I", "II", "III", "IV", "V"]

/**
 * The console drives the page. One requestAnimationFrame loop reads the
 * music's clock and writes CSS custom properties (--l0…--l4, --beat) on
 * <html>; the triptych styles itself from those. No React re-render per frame.
 */
export function RitualConsole() {
  const { play, stop, now, setCps, status, error } = useStrudel()
  const [code, setCode] = useState(() => buildPatch())
  const [mood, setMood] = useState(0)
  const [bpm, setBpm] = useState(0)
  const [intensity, setIntensity] = useState(0.5)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    ritualState().intensity = intensity
  }, [intensity])

  useEffect(() => {
    let raf = 0
    let lastMood = -1
    let lastBpm = -1
    const root = document.documentElement
    const tick = () => {
      const R = ritualState()
      const c = now()
      let levels = [0, 0, 0, 0, 0]
      let beat = 0
      if (c !== null) {
        levels = levelsAt(c, R.offset)
        beat = Math.exp(-((c * 4) % 1) * 5)
        const target = bpmAt(c, R.offset)
        if (Math.abs(target - R.cps * 240) > 0.15) {
          R.cps = target / 240
          setCps(R.cps)
        }
        const dom = levels.indexOf(Math.max(...levels))
        if (dom !== lastMood) setMood((lastMood = dom))
        const b = Math.round(target)
        if (b !== lastBpm) setBpm((lastBpm = b))
      }
      levels.forEach((l, i) => root.style.setProperty(`--l${i}`, l.toFixed(3)))
      root.style.setProperty("--beat", beat.toFixed(3))
      root.style.setProperty("--live", c === null ? "0" : "1")
      drawArc(canvasRef.current, c === null ? null : arcPos(c, R.offset), levels)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [now, setCps])

  const jump = (i: number) => {
    const c = now()
    if (c === null) return
    ritualState().offset = offsetForMood(i, c)
  }

  const playing = status === "playing"
  const m = MOODS[mood]

  return (
    <div className="ritual-console">
      <div className="mb-4 flex items-baseline justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-bold uppercase tracking-wide text-white">Extractive Ritual</h2>
        <div className="text-sm" style={{ color: m.color }}>
          {NUMERALS[mood]} · {m.name}
          {playing && <span className="opacity-60"> · {bpm} bpm</span>}
        </div>
      </div>
      <p className="text-sm mb-4 opacity-80" style={{ color: m.color }}>
        {m.desc}
      </p>

      <div className="flex items-center gap-2 mb-3 p-3 bg-black/30 rounded-lg border border-white/10 flex-wrap">
        <button
          onClick={() => (playing ? stop() : play(code))}
          className="px-4 py-2 rounded text-sm text-white border transition-colors flex items-center gap-2"
          style={{ borderColor: m.color, background: playing ? "transparent" : `${m.color}33` }}
        >
          {playing ? <Square size={14} /> : <Play size={14} />}
          {status === "loading" ? "waking the ritual…" : playing ? "stop" : "begin the ritual"}
        </button>
        <button
          onClick={() => play(code)}
          disabled={!playing}
          title="re-evaluate the code below (keeps the clock)"
          className="p-2 text-white/70 hover:text-white disabled:opacity-30"
        >
          <RefreshCw size={16} />
        </button>
        <div className="flex gap-1 ml-2">
          {MOODS.map((mm, i) => (
            <button
              key={mm.key}
              onClick={() => jump(i)}
              disabled={!playing}
              title={`mutate toward: ${mm.name}`}
              className="w-9 py-1.5 text-xs rounded border disabled:opacity-30 transition-colors"
              style={{
                borderColor: i === mood && playing ? mm.color : "rgba(255,255,255,0.12)",
                color: i === mood && playing ? mm.color : "rgba(255,255,255,0.8)",
              }}
            >
              {NUMERALS[i]}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 ml-auto text-xs text-white/70">
          intensity
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-24"
            style={{ accentColor: m.color }}
          />
          <span className="w-8 tabular-nums">{Math.round(intensity * 100)}%</span>
        </label>
      </div>

      <canvas ref={canvasRef} className="w-full h-20 rounded-lg bg-black/40 border border-white/10 mb-3" />

      {error && <div className="text-xs text-red-400 mb-3 font-mono">eval error: {error}</div>}

      <div className="rounded-lg overflow-hidden border border-white/10">
        <CodeMirror
          value={code}
          onChange={setCode}
          extensions={[javascript()]}
          theme="dark"
          height="420px"
          basicSetup={{ foldGutter: false, highlightActiveLine: false }}
        />
      </div>
      <div className="mt-3 text-xs text-white/40 flex justify-between gap-4 flex-wrap">
        <span>
          {ARC} bars per mutation · edit the code, then ↻ · the page's colours read the music&apos;s own clock
        </span>
        <a href="https://strudel.cc/learn/" target="_blank" rel="noopener noreferrer" className="hover:text-white/70">
          learn strudel →
        </a>
      </div>
    </div>
  )
}

function drawArc(cv: HTMLCanvasElement | null, x: number | null, levels: number[]) {
  if (!cv) return
  const dpr = window.devicePixelRatio || 1
  const W = cv.clientWidth
  const H = cv.clientHeight
  if (cv.width !== W * dpr) {
    cv.width = W * dpr
    cv.height = H * dpr
  }
  const g = cv.getContext("2d")!
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.clearRect(0, 0, W, H)
  const N = 240
  MOODS.forEach((m, i) => {
    g.beginPath()
    g.moveTo(0, H)
    for (let k = 0; k <= N; k++) {
      const u = k / N
      const l = levelsAt(u * ARC)[i]
      g.lineTo(u * W, H - 6 - l * (H - 18))
    }
    g.lineTo(W, H)
    g.closePath()
    g.fillStyle = m.color + (x === null ? "22" : Math.round(40 + levels[i] * 120).toString(16).padStart(2, "0"))
    g.fill()
    g.strokeStyle = m.color + "aa"
    g.lineWidth = 1
    g.stroke()
  })
  if (x !== null) {
    g.fillStyle = "#fff"
    g.fillRect(x * W - 1, 0, 2, H)
  }
}
