const stats = [
  { value: '50K+', label: 'Resumes analyzed' },
  { value: '92%', label: 'ATS pass rate improvement' },
  { value: '<30s', label: 'Average analysis time' },
  { value: '4.9', label: 'User satisfaction' },
]

export default function SocialProof() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/25 p-8 md:p-12 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
          {/* Subtle container-isolated glowing accent blobs */}
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-violet-600/5 blur-2xl pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />

          <div className="grid grid-cols-2 gap-y-10 gap-x-8 lg:grid-cols-4 lg:gap-x-12 relative z-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group transition-all duration-300 hover:scale-105">
                <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent md:text-5xl drop-shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
                  {stat.value}
                </p>
                <p className="mt-2.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
