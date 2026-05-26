export default function Footer() {
  return ( 
    <footer className="relative border-t border-white/5 bg-zinc-950/40 py-12 md:py-16 backdrop-blur-sm">
      {/* Visual top subtle glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          {/* Brand/Slogan Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 text-xs font-bold text-white shadow-sm shadow-violet-600/10">
                R
              </span>
              <span className="font-semibold text-white tracking-tight">ResumeAI</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400 max-w-xs">
              Elevate your job application with AI-powered resume analysis. Polish your skills, optimize keywords, and match hiring standards.
            </p>
          </div>

          {/* Developer/Contact Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-zinc-200">
              Developer Info
            </h3>
            <div className="space-y-2 text-sm text-zinc-400">
              <p className="font-medium text-zinc-300">Aryan Mehta</p>
              <p className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+917495841168" className="hover:text-white transition-colors duration-200">+91 7495841168</a>
              </p>
            </div>
          </div>

          {/* Social Links Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-zinc-200">
              Connect With Me
            </h3>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/aryanmehta3141"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                aria-label="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/aryan-mehta-050931382"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-white hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row text-center">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} ResumeAI. Designed & Developed by Aryan Mehta.
          </p>
          <p className="text-xs text-zinc-500">
            All rights reserved. Private & confidential processing.
          </p>
        </div>
      </div>
    </footer>
  )
}
