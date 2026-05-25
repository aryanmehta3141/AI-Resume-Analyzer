export default function GlowBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <div className="animate-glow-drift absolute -top-1/4 left-1/4 h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="animate-glow-drift absolute top-1/3 -right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[120px] [animation-delay:-4s]" />
      <div className="absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[100px]" />
    </div>
  )
}
