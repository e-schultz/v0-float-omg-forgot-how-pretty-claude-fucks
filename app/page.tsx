"use client"

import { AIExtractiveRitual } from "@/components/ai-extractive-ritual"
import { StrudelRepl } from "@/components/strudel-repl"
import { useState } from "react"

export default function Home() {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [isTracking, setIsTracking] = useState(false)

  const handlePhaseChange = (phase: number) => {
    setCurrentPhase(phase)
  }

  // Track when Strudel component starts/stops tracking
  const handleTrackingChange = (tracking: boolean) => {
    setIsTracking(tracking)
  }

  return (
    <main className="min-h-screen bg-black p-5">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Main Triptych with phase-reactive visuals */}
        <section className="flex justify-center">
          <AIExtractiveRitual currentPhase={currentPhase} isTracking={isTracking} />
        </section>

        {/* Strudel REPL Section */}
        <section>
          <StrudelRepl height="500px" className="w-full" onPhaseChange={handlePhaseChange} />
        </section>

        {/* Connection Text with phase-reactive styling */}
        <section className="text-center py-8">
          <div className="max-w-2xl mx-auto">
            <p
              className={`text-sm leading-relaxed transition-colors ${
                isTracking
                  ? `text-${["blue", "purple", "red", "orange", "green"][currentPhase]}-400/80`
                  : "text-blue-400/80"
              }`}
            >
              The ritual continues through sound. As AI strips, wraps, and feeds our attention, we code the algorithmic
              soundtrack to our own extraction.
              <br />
              <span
                className={`transition-colors ${
                  isTracking
                    ? `text-${["blue", "purple", "red", "orange", "green"][currentPhase]}-400`
                    : "text-blue-400"
                }`}
              >
                Live code the music of the machine.
              </span>
            </p>
            <div
              className={`mt-4 text-xs transition-colors ${
                isTracking
                  ? `text-${["blue", "purple", "red", "orange", "green"][currentPhase]}-400/60`
                  : "text-blue-400/60"
              }`}
            >
              Current Phase: {currentPhase} | {isTracking ? "Synced" : "Manual"} | Audio Context Ready
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
