export default function FeatureCard({ icon, title, description }) {
  return (
    <article
      className={[
        'group flex h-full flex-col rounded-2xl border border-white/10',
        'bg-zinc-900/50 p-6 md:p-8',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:border-violet-500/40',
        'hover:shadow-[0_0_40px_-12px_rgba(139,92,246,0.5)]',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      ].join(' ')}
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-violet-400 transition-colors duration-300 group-hover:border-violet-500/30 group-hover:bg-violet-500/10">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
    </article>
  )
}
