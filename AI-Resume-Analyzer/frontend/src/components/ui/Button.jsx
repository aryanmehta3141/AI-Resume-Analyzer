const variants = {
  primary:
    'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/25 hover:brightness-110 border border-white/10',
  secondary:
    'bg-transparent text-white border border-white/15 hover:border-white/30 hover:bg-white/5',
  ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5',
}

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-full font-medium',
        'transition-all duration-300 ease-out',
        'active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
