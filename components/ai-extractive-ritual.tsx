"use client"

import { useEffect, useState } from "react"

interface AIExtractiveRitualProps {
  currentPhase?: number
  isTracking?: boolean
}

export function AIExtractiveRitual({ currentPhase = 0, isTracking = false }: AIExtractiveRitualProps) {
  const [pulseIntensity, setPulseIntensity] = useState(0.5)

  // React to phase changes with visual effects
  useEffect(() => {
    if (isTracking) {
      // Increase pulse intensity based on phase
      setPulseIntensity(0.3 + currentPhase * 0.2)
    } else {
      setPulseIntensity(0.5)
    }
  }, [currentPhase, isTracking])

  const phaseColors = [
    "blue-400", // Phase 0: Electronic Insects
    "purple-400", // Phase 1: Wobble Emerges
    "red-400", // Phase 2: Sonic Wall
    "orange-400", // Phase 3: Crescendo
    "green-400", // Phase 4: Reggaeton Soul
  ]

  const currentColor = phaseColors[currentPhase]

  return (
    <div className="max-w-2xl w-full">
      {/* Triptych Container with phase-reactive styling */}
      <div
        className={`grid grid-cols-2 grid-rows-2 gap-2 bg-black rounded-xl overflow-hidden mb-6 transition-all duration-1000 ${
          isTracking ? `ring-2 ring-${currentColor}/30` : ""
        }`}
      >
        {/* Panel 1: Strip the Soul */}
        <div
          className={`panel-1 relative overflow-hidden rounded-lg flex flex-col justify-between p-6 h-70 transition-all duration-1000 ${
            isTracking && currentPhase === 0 ? `ring-2 ring-${currentColor}` : ""
          }`}
        >
          <div
            className={`float-sigil absolute top-4 right-4 text-2xl opacity-60 z-30 font-bold transition-all ${
              isTracking && currentPhase === 0 ? `text-${currentColor} animate-pulse` : "text-blue-400"
            }`}
          >
            {"{∿}"}
          </div>
          <div className="relative z-20">
            <h2
              className={`panel-title text-xl font-bold uppercase tracking-wide transition-colors ${
                isTracking && currentPhase === 0 ? `text-${currentColor}` : "text-white"
              }`}
            >
              Strip the Soul
            </h2>
            <p
              className={`panel-description text-sm leading-relaxed mt-3 transition-colors ${
                isTracking && currentPhase === 0 ? `text-${currentColor}` : "text-blue-400"
              }`}
            >
              Extracted essence from viral source. Interface of mimicry.
            </p>
          </div>
          <div className="extraction-elements absolute bottom-5 left-5 right-15 h-15 opacity-30 z-10">
            <div className="extraction-bars flex h-full items-end gap-0.5">
              {[0, 0.2, 0.4, 0.6, 0.8].map((delay, i) => (
                <div
                  key={i}
                  className={`bar flex-1 transition-colors ${
                    isTracking && currentPhase === 0 ? `bg-${currentColor}` : "bg-blue-400"
                  }`}
                  style={{
                    animation: `extract ${isTracking && currentPhase === 0 ? 1 : 2}s ease-in-out infinite`,
                    animationDelay: `${delay}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2: Wrap in Synthetic Polish */}
        <div
          className={`panel-2 relative overflow-hidden rounded-lg flex flex-col justify-between p-6 h-70 transition-all duration-1000 ${
            isTracking && currentPhase === 1 ? `ring-2 ring-${currentColor}` : ""
          }`}
        >
          <div
            className={`float-sigil absolute top-4 right-4 text-2xl opacity-60 z-30 font-bold transition-all ${
              isTracking && currentPhase === 1 ? `text-white animate-pulse` : "text-black"
            }`}
          >
            {"{Ξ}"}
          </div>
          <div className="relative z-20">
            <h2
              className={`panel-title text-xl font-bold uppercase tracking-wide transition-colors ${
                isTracking && currentPhase === 1 ? `text-white` : "text-black"
              }`}
            >
              Wrap in Synthetic Polish
            </h2>
            <p
              className={`panel-description text-sm leading-relaxed mt-3 transition-colors ${
                isTracking && currentPhase === 1 ? `text-white/90` : "text-black/80"
              }`}
            >
              The performance of understanding. Cosmetic coherence.
            </p>
          </div>
          <div
            className={`synthetic-overlay absolute inset-0 z-10 transition-opacity ${
              isTracking && currentPhase === 1 ? "opacity-100" : "opacity-50"
            }`}
          />
        </div>

        {/* Panel 3: Feed into the Attention Furnace */}
        <div
          className={`panel-3 relative overflow-hidden rounded-lg flex flex-col justify-between p-6 h-70 col-span-2 transition-all duration-1000 ${
            isTracking && (currentPhase === 2 || currentPhase === 3 || currentPhase === 4)
              ? `ring-2 ring-${currentColor}`
              : ""
          }`}
        >
          <div
            className={`float-sigil glitch-effect absolute top-4 right-4 text-2xl opacity-60 z-30 font-bold transition-all ${
              isTracking && (currentPhase >= 2) ? `text-${currentColor} animate-pulse` : "text-orange-500"
            }`}
          >
            {"{⚐}"}
          </div>
          <div className="relative z-20">
            <h2
              className={`panel-title glitch-effect text-xl font-bold uppercase tracking-wide transition-colors ${
                isTracking && (currentPhase >= 2) ? `text-${currentColor}` : "text-white"
              }`}
            >
              Feed into the Attention Furnace
            </h2>
            <p
              className={`panel-description text-sm leading-relaxed mt-3 transition-colors ${
                isTracking && (currentPhase >= 2) ? `text-${currentColor}` : "text-blue-400"
              }`}
            >
              Commodified loop. Repeat, faster. Forget, faster.
            </p>
          </div>
          <div className="furnace-particles absolute inset-0 z-10">
            {[0, 0.5, 1, 1.5].map((delay, i) => (
              <div
                key={i}
                className={`particle absolute w-0.5 h-0.5 rounded-full transition-colors ${
                  isTracking && (currentPhase >= 2) ? `bg-${currentColor}` : "bg-orange-500"
                }`}
                style={{
                  left: `${20 + i * 20}%`,
                  animation: `furnace-rise ${isTracking && (currentPhase >= 2) ? 2 : 3}s linear infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quote Section with phase-reactive styling */}
      <div
        className={`quote-section mt-6 p-5 rounded-lg border-l-4 transition-all duration-1000 ${
          isTracking ? `bg-${currentColor}/5 border-${currentColor}` : "bg-blue-400/5 border-blue-400"
        }`}
      >
        <div
          className={`quote-text text-base leading-relaxed mb-3 transition-colors ${
            isTracking ? `text-${currentColor}` : "text-blue-400"
          }`}
        >
          It's AI as extractive ritual:
          <br />• Strip the soul
          <br />• Wrap it in synthetic polish
          <br />• Feed it back into the attention furnace
          <br />• Repeat, faster
        </div>
        <div className="hashtags flex gap-3 flex-wrap">
          <span
            className={`hashtag text-sm opacity-80 transition-colors ${
              isTracking ? `text-${currentColor}` : "text-blue-400"
            }`}
          >
            #AIrituals
          </span>
          <span
            className={`hashtag text-sm opacity-80 transition-colors ${
              isTracking ? `text-${currentColor}` : "text-blue-400"
            }`}
          >
            #FLOAT
          </span>
          <span
            className={`hashtag text-sm opacity-80 transition-colors ${
              isTracking ? `text-${currentColor}` : "text-blue-400"
            }`}
          >
            #ExtractiveSystems
          </span>
        </div>
      </div>

      <style jsx>{`
        .panel-1 {
          background: linear-gradient(135deg, #1a1a1a 0%, #0d1117 100%);
        }
        
        .panel-1::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(96, 165, 250, 0.1) 0%, transparent 50%),
            repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px);
          filter: blur(0.5px);
        }

        .panel-2 {
          background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 50%, #1E40AF 100%);
        }
        
        .panel-2::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%),
            linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
        }

        .panel-3 {
          background: 
            linear-gradient(45deg, #ff0066, #ff6600, #ffcc00, #66ff00, #0066ff, #6600ff, #ff0066),
            linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
          background-size: 400% 400%, 100% 100%;
          animation: glitch-bg 3s ease-in-out infinite;
        }

        .panel-3::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 6px),
            repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 6px);
          mix-blend-mode: overlay;
        }

        @keyframes glitch-bg {
          0%, 100% { background-position: 0% 50%, 0% 0%; }
          50% { background-position: 100% 50%, 0% 0%; }
        }

        @keyframes extract {
          0%, 100% { height: 20%; }
          50% { height: 80%; }
        }

        .synthetic-overlay {
          background: linear-gradient(45deg, 
            transparent 25%, 
            rgba(255,255,255,0.1) 50%, 
            transparent 75%);
          animation: synthetic-sweep 4s linear infinite;
        }

        @keyframes synthetic-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes furnace-rise {
          0% { 
            bottom: 0; 
            opacity: 1; 
            transform: scale(1);
          }
          100% { 
            bottom: 100%; 
            opacity: 0; 
            transform: scale(0.5);
          }
        }

        .glitch-effect {
          animation: glitch 0.3s ease-in-out infinite alternate;
        }

        @keyframes glitch {
          0% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          20% {
            transform: translate(-1px, 1px);
            filter: hue-rotate(90deg);
          }
          40% {
            transform: translate(-1px, -1px);
            filter: hue-rotate(180deg);
          }
          60% {
            transform: translate(1px, 1px);
            filter: hue-rotate(270deg);
          }
          80% {
            transform: translate(1px, -1px);
            filter: hue-rotate(360deg);
          }
          100% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
        }

        .h-70 {
          height: 280px;
        }

        .h-15 {
          height: 60px;
        }

        .right-15 {
          right: 60px;
        }
      `}</style>
    </div>
  )
}
