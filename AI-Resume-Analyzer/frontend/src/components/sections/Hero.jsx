import Button from '../ui/Button'

export default function Hero() {
  return (
    <section className="relative pt-28 pb-14 md:pt-36 md:pb-18">
      <div className="mx-auto max-w-6xl px-6 text-center lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6 md:space-y-7">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            AI-powered resume insights
          </p>

          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            Land your dream job with{' '}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              smarter resumes
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-zinc-400 md:text-xl leading-relaxed">
            Upload your resume and get instant ATS scoring, keyword analysis, and
            actionable feedback — built for modern hiring pipelines.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#upload">
              <Button size="lg">Analyze my resume</Button>
            </a>
            <a href="#features">
              <Button variant="secondary" size="lg">
                See how it works
              </Button>
            </a>
          </div>

          <p className="text-sm text-zinc-500">
            PDF only · Private by default · No account required
          </p>
        </div>
      </div>
    </section>
  )
}
