"use client"

import { useCallback, useRef, useState } from "react"

// @strudel/web touches `window` at import time — load it on first play only.
type StrudelModule = typeof import("@strudel/web")
type Repl = {
  evaluate: (code: string, autostart?: boolean) => Promise<unknown>
  stop: () => void
  setCps: (cps: number) => void
  scheduler: { now: () => number; started: boolean }
}

export function useStrudel() {
  const mod = useRef<StrudelModule | null>(null)
  const repl = useRef<Repl | null>(null)
  const booting = useRef<Promise<Repl> | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "playing" | "stopped">("idle")
  const [error, setError] = useState<string | null>(null)

  const boot = useCallback(async () => {
    if (repl.current) return repl.current
    if (!booting.current) {
      booting.current = (async () => {
        const s = await import("@strudel/web")
        mod.current = s
        const r = (await s.initStrudel({
          prebake: () => s.samples("github:tidalcycles/dirt-samples"),
          onEvalError: (e: Error) => setError(e.message),
        })) as Repl
        repl.current = r
        return r
      })()
    }
    return booting.current
  }, [])

  const play = useCallback(
    async (code: string) => {
      setError(null)
      if (!repl.current) setStatus("loading")
      const r = await boot()
      await mod.current?.getAudioContext().resume()
      await r.evaluate(code, true)
      setStatus("playing")
    },
    [boot],
  )

  const stop = useCallback(() => {
    repl.current?.stop()
    setStatus("stopped")
  }, [])

  /** The music's own clock, in cycles. The only clock the visuals trust. */
  const now = useCallback(() => {
    const r = repl.current
    return r && r.scheduler.started ? r.scheduler.now() : null
  }, [])

  const setCps = useCallback((cps: number) => repl.current?.setCps(cps), [])

  return { play, stop, now, setCps, status, error }
}
