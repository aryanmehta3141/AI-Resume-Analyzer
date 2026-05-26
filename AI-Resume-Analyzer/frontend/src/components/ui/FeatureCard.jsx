export default function FeatureCard({ icon, title, description }) {
  return (
    <article
      className={[
        'group flex h-full flex-col rounded-2xl border border-white/5',
        'bg-zinc-900/45 p-6 md:p-8 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)]',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1.5 hover:border-violet-500/30 hover:bg-zinc-900/60',
        'hover:shadow-[0_20px_50px_-12px_rgba(139,92,246,0.2)]',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      ].join(' ')}
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-violet-400 transition-all duration-300 group-hover:border-violet-500/40 group-hover:bg-violet-500/10 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
    </article>
  )
}
