const stats = [
  { value: '50K+', label: 'Resumes analyzed' },
  { value: '92%', label: 'ATS pass rate improvement' },
  { value: '<30s', label: 'Average analysis time' },
  { value: '4.9', label: 'User satisfaction' },
]

export default function SocialProof() {
  return (
    <section className="border-y border-white/5 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
