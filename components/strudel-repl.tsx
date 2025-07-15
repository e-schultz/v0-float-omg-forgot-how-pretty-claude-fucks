"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { RotateCcw, Zap } from "lucide-react"

interface StrudelReplProps {
  height?: string
  className?: string
  onPhaseChange?: (phase: number) => void
}

export function StrudelRepl({ height = "500px", className = "", onPhaseChange }: StrudelReplProps) {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [isTracking, setIsTracking] = useState(false)
  const [intensity, setIntensity] = useState(0.5)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const phaseIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Single ritual URL - no switching to avoid resets
  const strudelUrl = `https://strudel.cc/?F8vqy7bP1pNi#c2V0Y3BzKDEyNS8yNDApCgovLyBQaGFzZSB0cmFja2VyIGZvciBtdXRhdGlvbnMKbGV0IHBoYXNlID0gIjwwIDAgMCAwIDEgMSAxIDEgMiAyIDIgMiAzIDMgMyAzIDQgNCA0IDQ%2BIi5zbG93KDE2KQoKc3RhY2soCiAgLy8gUEhBU0UgMDogRWxlY3Ryb25pYyBJbnNlY3RzIGF0IER1c2sKICAvLyBDaGlycGluZywgY2xpY2tpbmcsIGJyZWF0aGluZwogIHN0YWNrKAogICAgbm90ZSgiYzYgZWI2IGc2IGM3Ii5zdHJ1Y3QoInQoNSw4KSIpKQogICAgICAucygic2luZSIpCiAgICAgIC5nYWluKHBlcmxpbi5yYW5nZSgwLjEsIDAuMykuZmFzdCgyKSkKICAgICAgLnBhbihwZXJsaW4ucmFuZ2UoLTEsIDEpLmZhc3QoMC43KSkKICAgICAgLnJlbGVhc2UoMC4wMSkKICAgICAgLmRlbGF5KDAuMTI1KQogICAgICAuZGVsYXl0aW1lKHBlcmxpbi5yYW5nZSgwLjA1LCAwLjE1KSkKICAgICAgLnJvb20oMC44KQogICAgICAubWFzayhwaGFzZS5lcSgwKSksCiAgICAKICAgIHNvdW5kKCJoaDo4IikubihpcmFuZCgxNikpCiAgICAgIC5nYWluKDAuMikKICAgICAgLnNwZWVkKHBlcmxpbi5yYW5nZSgyLCA0KSkKICAgICAgLnBhbihzaW5lLnJhbmdlKC0wLjgsIDAuOCkuZmFzdCgzKSkKICAgICAgLmhwZihwZXJsaW4ucmFuZ2UoODAwMCwgMTUwMDApKQogICAgICAuc3RydWN0KCJ0KDEzLDE2KSIpCiAgICAgIC5tYXNrKHBoYXNlLmVxKDApKQogICksCiAgCiAgLy8gUEhBU0UgMTogQm9vdHktR3JhYmJpbmcgV29iYmxlIEVtZXJnZXMKICAvLyBUaGUgYmFzcyBhd2FrZW5zCiAgbm90ZSgiPGYxIGYxIGYxIGFiMT4iLnNsb3coMikpCiAgICAucygic2F3dG9vdGgiKQogICAgLmN1dG9mZihzaW5lLnJhbmdlKDIwMCwgMTIwMCkuc2xvdygyKSkKICAgIC5yZXNvbmFuY2UocGVybGluLnJhbmdlKDEwLCAyMCkpCiAgICAuZ2FpbigxLjIpCiAgICAuZGlzdG9ydCgwLjMpCiAgICAucm9vbSgwLjMpCiAgICAubWFzayhwaGFzZS5ndGUoMSkpLAogIAogIHNvdW5kKCJiZDozKjQgW34gc2Q6Ml0qMiIpCiAgICAuYmFuaygiUm9sYW5kVFI4MDgiKQogICAgLmdhaW4oMC45KQogICAgLnNoYXBlKDAuNCkKICAgIC5tYXNrKHBoYXNlLmd0ZSgxKSksCiAgCiAgLy8gUEhBU0UgMjogUGFuIFNvbmljIFRlbGFrb2UgV2FsbAogIC8vIFJoeXRobWljIGludGVuc2l0eQogIHN0YWNrKAogICAgc291bmQoImJkOjAhMTYiKS5nYWluKDEuMikuZGlzdG9ydCgwLjgpLAogICAgc291bmQoImluZHVzdHJpYWw6MiIpLnN0cnVjdCgidCg3LDgpIikuZ2FpbigwLjgpLnNwZWVkKDAuNSksCiAgICBub3RlKCJmMSE4Iikucygic3F1YXJlIikucmVsZWFzZSgwLjA1KS5nYWluKDAuNykuZGlzdG9ydCgwLjkpCiAgKQogIC5zaGFwZSgwLjkpCiAgLnJvb20oMC4xKQogIC5tYXNrKHBoYXNlLmVxKDIpKSwKICAKICAvLyBIeXBub3RpYyBwdWxzZSBsYXllcgogIHNvdW5kKCJtZXRhbDoxIikKICAgIC5zcGVlZChwZXJsaW4ucmFuZ2UoMC44LCAxLjIpKQogICAgLmdhaW4oMC42KQogICAgLnN0cnVjdCgidCEzMiIpCiAgICAucGFuKHNpbmUuc2xvdyg3KSkKICAgIC5tYXNrKHBoYXNlLmVxKDIpKSwKICAKICAvLyBQSEFTRSAzOiBTbGFnIEJvb20gVmFuIExvb24gQ3Jlc2NlbmRvCiAgLy8gUG9seXJoeXRobWljIGVjc3Rhc3kgYnVpbGRzCiAgc3RhY2soCiAgICBub3RlKCJmMiBjMyBmMyBhYjMgYzQiLnN0cnVjdCgidCgxMSwxNikiKSkKICAgICAgLnMoInNhd3Rvb3RoIikKICAgICAgLmN1dG9mZihwZXJsaW4ucmFuZ2UoNTAwLCA1MDAwKS5mYXN0KDAuNSkpCiAgICAgIC5nYWluKGNvc2luZS5yYW5nZSgwLjMsIDAuOCkuc2xvdyg0KSkKICAgICAgLnJvb20oMC42KQogICAgICAuZGVsYXkoMC4yNSksCiAgICAKICAgIHNvdW5kKCJ0YWJsYTozIHRhYmxhOjUgdGFibGE6NyIuc3RydWN0KCJ0KDUsOCkiKSkKICAgICAgLnNwZWVkKDEuMikKICAgICAgLmdhaW4oMC41KQogICAgICAucGFuKCI8LTAuNSAwIDAuNT4iKSwKICAgIAogICAgc291bmQoImdyZXRzY2g6MiE0IikKICAgICAgLmdhaW4oc2luZS5yYW5nZSgwLjQsIDAuOCkuc2xvdyg4KSkKICApCiAgLm1hc2socGhhc2UuZXEoMykpLAogIAogIC8vIFBIQVNFIDQ6IERKIFB5dGhvbiBSZWdnYWV0b24gU291bAogIC8vIERlbWJvdyBzd2VldG5lc3MKICBzb3VuZCgiYmQ6MiB%2BIGJkOjIgW34gYmQ6Ml0iKQogICAgLmdhaW4oMC44KQogICAgLnNoYXBlKDAuMikKICAgIC5yb29tKDAuNCkKICAgIC5tYXNrKHBoYXNlLmVxKDQpKSwKICAKICBzb3VuZCgicmltOjEgfiB%2BIHJpbToxIH4gcmltOjEgfiB%2BIikKICAgIC5nYWluKDAuNikKICAgIC5zcGVlZCgxLjIpCiAgICAuZGVsYXkoMC4xMjUpCiAgICAucm9vbSgwLjUpCiAgICAubWFzayhwaGFzZS5lcSg0KSksCiAgCiAgbm90ZSgiPGMyIGcyIGMzIGViMz4iLnNsb3coNCkpCiAgICAucygic2luZSIpCiAgICAuZ2FpbigwLjcpCiAgICAucm9vbSgwLjYpCiAgICAucmVsZWFzZSgyKQogICAgLm1hc2socGhhc2UuZXEoNCkpLAogIAogIC8vIE1lbG9kaWMgc291bCBsYXllcgogIG5vdGUoImM0IGViNCBnNCBjNSIuc3RydWN0KCJ0KDMsOCkiKSkKICAgIC5zKCJ0cmlhbmdsZSIpCiAgICAuZ2FpbigwLjMpCiAgICAuZGVsYXkoMC4zNzUpCiAgICAuZGVsYXlmZWVkYmFjaygwLjYpCiAgICAucm9vbSgwLjgpCiAgICAucGFuKHNpbmUuc2xvdygxMSkpCiAgICAubWFzayhwaGFzZS5lcSg0KSkKKQoub3JiaXQoMyk%3D`

  // Start phase tracking when user manually starts it
  const startPhaseTracking = useCallback(() => {
    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current)
    }

    setIsTracking(true)
    setCurrentPhase(0)

    phaseIntervalRef.current = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % 5)
    }, 8000) // 8 seconds per phase
  }, [])

  // Notify parent of phase changes
  useEffect(() => {
    if (onPhaseChange) onPhaseChange(currentPhase)
  }, [currentPhase, onPhaseChange])

  // Stop phase tracking
  const stopPhaseTracking = useCallback(() => {
    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current)
      phaseIntervalRef.current = null
    }
    setIsTracking(false)
    setCurrentPhase(0)
  }, [])

  // Reset phase tracking
  const resetPhaseTracking = useCallback(() => {
    stopPhaseTracking()
    setCurrentPhase(0)
  }, [stopPhaseTracking])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (phaseIntervalRef.current) {
        clearInterval(phaseIntervalRef.current)
      }
    }
  }, [])

  const phaseNames = [
    "Electronic Insects at Dusk",
    "Booty-Grabbing Wobble Emerges",
    "Pan Sonic Telakoe Wall",
    "Slag Boom Van Loon Crescendo",
    "DJ Python Reggaeton Soul",
  ]

  const phaseColors = ["text-blue-400", "text-purple-400", "text-red-400", "text-orange-400", "text-green-400"]

  const phaseDescriptions = [
    "Chirping, clicking, breathing sounds emerge from the digital void",
    "Bass frequencies awaken, wobbling through synthetic membranes",
    "Rhythmic intensity builds into an industrial wall of sound",
    "Polyrhythmic ecstasy cascades through multiple time signatures",
    "Dembow sweetness wraps the chaos in reggaeton soul",
  ]

  return (
    <div className={`strudel-container ${className}`}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold uppercase tracking-wide text-white">Extractive Ritual</h2>
          <div className={`flex items-center gap-2 text-sm transition-colors ${phaseColors[currentPhase]}`}>
            <Zap size={16} className={isTracking ? "animate-pulse" : ""} />
            <span>Phase {currentPhase}:</span>
            <span className="opacity-80">{phaseNames[currentPhase]}</span>
          </div>
        </div>
        <p className={`text-sm transition-colors ${phaseColors[currentPhase]} opacity-80`}>
          {phaseDescriptions[currentPhase]}
        </p>
      </div>

      {/* Simplified Control Panel */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-black/30 rounded-lg border border-blue-400/10">
        {/* Phase Tracking Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={startPhaseTracking}
            disabled={isTracking}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 rounded text-white text-sm transition-colors"
          >
            {isTracking ? "Tracking Active" : "Start Visual Sync"}
          </button>
          <button
            onClick={stopPhaseTracking}
            disabled={!isTracking}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 rounded text-white text-sm transition-colors"
          >
            Stop
          </button>
          <button
            onClick={resetPhaseTracking}
            className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
            title="Reset Phase"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Intensity Control */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-blue-400">Intensity:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={intensity}
            onChange={(e) => setIntensity(Number.parseFloat(e.target.value))}
            className="w-20"
          />
          <span className="text-xs text-blue-400 w-8">{Math.round(intensity * 100)}%</span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              isTracking ? phaseColors[currentPhase].replace("text-", "bg-") : "bg-gray-400"
            }`}
          />
          <span className="text-xs text-blue-400">{isTracking ? "Synced" : "Manual"}</span>
        </div>
      </div>

      {/* Phase Progress Bar */}
      {isTracking && (
        <div className="mb-4 p-3 bg-black/20 rounded-lg border border-blue-400/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-blue-400">Ritual Progress</span>
            <span className="text-xs text-blue-400">{currentPhase + 1}/5</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${phaseColors[currentPhase].replace(
                "text-",
                "bg-",
              )}`}
              style={{ width: `${((currentPhase + 1) / 5) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            {phaseNames.map((name, i) => (
              <span
                key={i}
                className={`transition-colors ${
                  i === currentPhase ? phaseColors[i] : i < currentPhase ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Strudel REPL */}
      <div className="relative overflow-hidden rounded-lg border border-blue-400/20 bg-black/50">
        <iframe
          ref={iframeRef}
          src={strudelUrl}
          width="100%"
          height={height}
          className="border-0"
          title="Strudel Live Coding Environment"
          allow="autoplay; microphone"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        />

        {/* Enhanced overlay with phase-reactive effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${phaseColors[currentPhase].replace("text-", "")}/30 to-transparent transition-colors`}
          />
          <div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${phaseColors[currentPhase].replace("text-", "")}/30 to-transparent transition-colors`}
          />

          {/* Phase indicator with better styling */}
          <div
            className={`absolute top-4 right-4 px-3 py-1 rounded text-xs border transition-all ${
              isTracking
                ? `bg-${phaseColors[currentPhase].replace("text-", "")}-900/80 ${phaseColors[currentPhase]} border-${phaseColors[currentPhase].replace("text-", "")}-400/20`
                : "bg-black/80 text-blue-400 border-blue-400/20"
            }`}
          >
            Phase {currentPhase}/4 {isTracking && "• Live"}
          </div>

          {/* Intensity overlay */}
          <div
            className={`absolute inset-0 bg-gradient-radial from-${phaseColors[currentPhase].replace("text-", "")}/10 to-transparent transition-opacity`}
            style={{ opacity: isTracking ? intensity * 0.3 : 0 }}
          />
        </div>
      </div>

      <div className="mt-3 text-xs text-blue-400/60 flex justify-between items-center">
        <span>Press ▶️ in Strudel to start music • Click "Start Visual Sync" to connect visuals • Modify code live</span>
        <div className="flex gap-4">
          <a
            href="https://strudel.cc/learn/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            Learn Strudel →
          </a>
        </div>
      </div>

      <style jsx>{`
        .strudel-container {
          font-family: "IBM Plex Mono", monospace;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}
