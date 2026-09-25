// Minimal surface of @strudel/web used by lib/use-strudel.ts (package ships no types).
declare module "@strudel/web" {
  export function initStrudel(options?: {
    prebake?: () => unknown
    onEvalError?: (e: Error) => void
    [k: string]: unknown
  }): Promise<unknown>
  export function samples(source: string): Promise<void>
  export function getAudioContext(): AudioContext
}
