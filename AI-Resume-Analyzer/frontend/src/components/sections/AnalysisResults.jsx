function ScoreRing({ score }) {
  const percentage = score ?? 0;
  const radius = 50;
  const strokeWidth = 7;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let textClass = "text-rose-400";
  let strokeGradientId = "grad-rose";

  if (percentage >= 80) {
    textClass = "text-emerald-400";
    strokeGradientId = "grad-emerald";
  } else if (percentage >= 60) {
    textClass = "text-amber-400";
    strokeGradientId = "grad-amber";
  }

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/35 p-6 md:p-8 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.3)] lg:min-h-[220px] transition-all duration-300 hover:border-white/10 overflow-hidden group">
      {/* Visual ambient radial light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.06)_0%,transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
        ATS Score
      </p>

      <div className="relative flex items-center justify-center h-32 w-32">
        <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="grad-rose" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          {/* Background circle track */}
          <circle
            className="text-zinc-800/40"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Animated foreground progress */}
          <circle
            stroke={`url(#${strokeGradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ 
              strokeDashoffset, 
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="drop-shadow-[0_0_6px_rgba(139,92,246,0.3)]"
          />
        </svg>

        {/* Floating details inside circle */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-4xl font-extrabold tracking-tight ${textClass} drop-shadow-[0_0_12px_rgba(0,0,0,0.6)]`}>
            {percentage}
          </span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
            out of 100
          </span>
        </div>
      </div>
    </div>
  );
}

function ListBlock({ title, items, accent = "violet" }) {
  const accentConfig = {
    violet: {
      dot: "bg-violet-500 shadow-violet-500/25",
      border: "hover:border-violet-500/20",
      iconColor: "text-violet-400 bg-violet-500/10 border border-violet-500/10",
      svg: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    cyan: {
      dot: "bg-cyan-500 shadow-cyan-500/25",
      border: "hover:border-cyan-500/20",
      iconColor: "text-cyan-400 bg-cyan-500/10 border border-cyan-500/10",
      svg: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    amber: {
      dot: "bg-amber-500 shadow-amber-500/25",
      border: "hover:border-amber-500/20",
      iconColor: "text-amber-400 bg-amber-500/10 border border-amber-500/10",
      svg: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  }[accent];

  return (
    <div className={`h-full rounded-2xl border border-white/5 bg-zinc-900/35 p-6 md:p-8 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 ${accentConfig.border}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentConfig.iconColor}`}>
          {accentConfig.svg}
        </div>
        <h3 className="text-lg font-bold tracking-tight text-white">{title}</h3>
      </div>
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-zinc-950/20 border border-white/5 rounded-2xl">
          <svg className="h-8 w-8 text-emerald-500/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Perfect! No issues detected.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li
              key={i}
              className="group flex gap-3 text-[13.5px] leading-relaxed text-zinc-300 bg-white/[0.012] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-xl px-4 py-3.5 transition-all duration-200 shadow-sm"
            >
              <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${accentConfig.dot}`} />
              <span className="group-hover:text-zinc-200 transition-colors duration-200">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AnalysisResults({ data }) {
  if (!data) return null;

  const fileName = data.fileName ?? "resume.pdf";
  const atsScore = data.atsScore ?? 0;
  const feedback = data.feedback ?? "";
  const formattingSuggestions = data.formattingSuggestions ?? [];
  const keywordImprovements = data.keywordImprovements ?? [];
  const missingSkills = data.missingSkills ?? [];

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div className="text-center">
        <p className="text-sm text-zinc-500 bg-zinc-900/40 border border-white/5 py-1.5 px-4 rounded-full inline-flex items-center gap-2 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
          Results for <span className="text-zinc-300 font-medium">{fileName}</span>
        </p>
      </div>

      {/* Score + feedback — wide row */}
      <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
        <ScoreRing score={atsScore} />
        <div className="rounded-2xl border border-white/5 bg-zinc-900/35 p-6 md:p-8 lg:p-10 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex flex-col justify-center relative overflow-hidden group hover:border-white/10 transition-all duration-300">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
          <h3 className="mb-4 text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <svg className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Overall Feedback
          </h3>
          <p className="text-sm leading-relaxed text-zinc-300 md:text-[14.5px] md:leading-7 bg-zinc-950/20 border border-white/5 p-4 rounded-xl italic">
            "{feedback || "No feedback returned."}"
          </p>
        </div>
      </div>

      {/* Suggestion cards — full width, 3 columns on large screens */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
        <ListBlock title="Formatting suggestions" items={formattingSuggestions} />
        <ListBlock
          title="Keyword improvements"
          items={keywordImprovements}
          accent="cyan"
        />
        <ListBlock title="Missing skills" items={missingSkills} accent="amber" />
      </div>
    </div>
  );
}
