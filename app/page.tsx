import { AIExtractiveRitual } from "@/components/ai-extractive-ritual"
import { RitualConsole } from "@/components/ritual-console"

export default function Home() {
  return (
    <main className="min-h-screen bg-black p-5">
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="flex justify-center">
          <AIExtractiveRitual />
        </section>

        <section>
          <RitualConsole />
        </section>

        <section className="text-center py-8">
          <p className="max-w-2xl mx-auto text-sm leading-relaxed text-blue-400/80">
            The ritual continues through sound. As AI strips, wraps, and feeds our attention, we code the algorithmic
            soundtrack to our own extraction.
            <br />
            <span className="text-blue-400">Live code the music of the machine.</span>
          </p>
        </section>
      </div>
    </main>
  )
}
