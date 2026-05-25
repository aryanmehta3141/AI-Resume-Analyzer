const links = [
  { label: 'Features', href: '#features' },
  { label: 'Upload', href: '#upload' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
]

export default function Footer() {
  return ( 
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-cyan-500 text-xs font-bold text-white">
              R
            </span>
            <span className="font-semibold text-white">ResumeAI</span>
          </div>

          <ul className="flex flex-wrap justify-center gap-6">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-zinc-500 transition-colors duration-300 hover:text-zinc-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} ResumeAI
          </p>
        </div>
      </div>
    </footer>
  )
}
