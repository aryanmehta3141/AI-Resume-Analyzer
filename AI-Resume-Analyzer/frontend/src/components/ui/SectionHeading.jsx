export default function SectionHeading({ eyebrow, title, description, className = '' }) {
  return (
    <div className={`mx-auto max-w-2xl text-center space-y-4 ${className}`}>
      {eyebrow && (
        <p className="text-sm font-medium tracking-wide uppercase text-violet-400">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      {description && (
        <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
