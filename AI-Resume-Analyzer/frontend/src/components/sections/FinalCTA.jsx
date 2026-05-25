import Button from '../ui/Button'

export default function FinalCTA() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 px-8 py-16 text-center md:px-16 md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-500/10" />
          <div className="relative space-y-8">
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
              Ready to optimize your resume?
            </h2>
            <p className="mx-auto max-w-xl text-lg text-zinc-400">
              Join thousands of job seekers using AI to get more interviews.
            </p>
            <a href="#upload">
              <Button size="lg">Upload & analyze free</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
