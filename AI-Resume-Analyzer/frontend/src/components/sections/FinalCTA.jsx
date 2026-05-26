import Button from '../ui/Button'

export default function FinalCTA() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/25 px-8 py-16 text-center md:px-16 md:py-20 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
          {/* Subtle container-isolated glowing accent blobs */}
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
          
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-cyan-500/5" />
          <div className="relative space-y-6 md:space-y-7">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
              Ready to optimize your resume?
            </h2>
            <p className="mx-auto max-w-xl text-[15px] md:text-base leading-relaxed text-zinc-400">
              Join thousands of job seekers using AI to get more interviews.
            </p>
            <div className="pt-2">
              <a href="#upload">
                <Button size="lg">Upload & analyze free</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
