import React from 'react';
import { Cpu, Microscope, ShieldCheck, Network, Database, BookOpen, Beaker, Zap, Github, ExternalLink } from 'lucide-react';

const TECH_CARDS = [
  {
    icon: <Cpu size={22} />, color: '#60a5fa', bg: 'rgba(37,99,235,0.10)', border: 'rgba(37,99,235,0.15)',
    title: 'ESMFold Prediction',
    desc: 'Meta AI\'s transformer-based model predicts protein 3D structures from single sequences with atomic accuracy. Significantly faster than AlphaFold while maintaining high performance for most proteins.'
  },
  {
    icon: <Microscope size={22} />, color: '#c4b5fd', bg: 'rgba(124,58,237,0.10)', border: 'rgba(124,58,237,0.15)',
    title: 'Fine-tuned ESM-2',
    desc: 'Core engine is a fine-tuned ESM-2 model (8M parameters) trained on 9,752 curated human protein sequences from UniProt Swiss-Prot. Masked Language Modeling reduced training loss from 6.58 → 1.42.'
  },
  {
    icon: <ShieldCheck size={22} />, color: '#34d399', bg: 'rgba(5,150,105,0.10)', border: 'rgba(5,150,105,0.15)',
    title: 'Variant Effect (LLR)',
    desc: 'Pathogenicity assessed via Log Likelihood Ratio. We mask the mutation position and measure how much less probable the mutant residue is vs wild-type. Scores below −2.0 indicate Likely Pathogenic.'
  },
  {
    icon: <Database size={22} />, color: '#fcd34d', bg: 'rgba(217,119,6,0.10)', border: 'rgba(217,119,6,0.15)',
    title: 'ClinVar Integration',
    desc: 'Real-time queries to the NCBI ClinVar database retrieve the number of known pathogenic variants for any gene, providing clinical evidence alongside our computational predictions.'
  }
];

const PLDDT_LEVELS = [
  { range: '>90', label: 'Very High', color: '#3b82f6', desc: 'Backbone well-modeled' },
  { range: '70–90', label: 'Confident', color: '#10b981', desc: 'Generally reliable' },
  { range: '50–70', label: 'Low', color: '#f59e0b', desc: 'Possible disorder' },
  { range: '<50', label: 'Very Low', color: '#ef4444', desc: 'Likely disordered' },
];

const AboutPage = () => (
  <div className="max-w-5xl mx-auto px-6 py-14 space-y-14 relative z-10">

    {/* ─── Header ─── */}
    <header className="space-y-5 animate-fade-in-up">
      <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-xs font-semibold tracking-wider uppercase">
        <BookOpen size={13} />
        <span>Documentation</span>
      </div>
      <h1 className="text-5xl font-extrabold text-white font-display text-glow-violet leading-tight">
        About the Project
      </h1>
      <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
        Protein Structure Prediction &amp; Disease Mutation Analysis —{' '}
        <span className="text-gray-300 font-medium">B.E. Computer Science Final Year Major Project</span>
      </p>
      <div className="section-divider" />
    </header>

    {/* ─── Tech Cards ─── */}
    <section className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in-up stagger-1">
      {TECH_CARDS.map((card, i) => (
        <div
          key={i}
          className="glass rounded-3xl p-7 space-y-4 card-3d group transition-all duration-300"
          style={{ borderColor: card.border }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: card.bg, color: card.color }}
          >
            {card.icon}
          </div>
          <h2 className="text-base font-bold text-white font-display">{card.title}</h2>
          <p className="text-sm text-gray-400 leading-relaxed">{card.desc}</p>
        </div>
      ))}
    </section>

    {/* ─── pLDDT Section ─── */}
    <section className="glass rounded-3xl overflow-hidden animate-fade-in-up stagger-2">
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      <div className="p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Beaker className="text-blue-400" size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">pLDDT Confidence Scoring</h2>
            <p className="text-xs text-gray-500">Per-residue structural confidence metric</p>
          </div>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
          The predicted Local Distance Difference Test (pLDDT) is a per-residue confidence metric between 0 and 100,
          indicating how reliable each part of the predicted structure is.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PLDDT_LEVELS.map(({ range, label, color, desc }) => (
            <div
              key={range}
              className="stat-pill p-5 rounded-2xl space-y-2 group hover:scale-105 transition-transform duration-300"
              style={{ borderColor: `${color}20` }}
            >
              <p className="text-2xl font-bold font-mono" style={{ color, textShadow: `0 0 20px ${color}60` }}>{range}</p>
              <p className="text-xs font-semibold text-gray-300">{label}</p>
              <p className="text-[10px] text-gray-600 leading-snug">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ─── Architecture ─── */}
    <section className="glass rounded-3xl overflow-hidden animate-fade-in-up stagger-3">
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      <div className="p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <Network className="text-violet-400" size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">System Architecture</h2>
            <p className="text-xs text-gray-500">Full-stack pipeline overview</p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/[0.04]" style={{ background: 'rgba(4,8,20,0.60)' }}>
          <div className="p-6 overflow-x-auto">
            <svg viewBox="0 0 820 280" className="w-full" style={{ minWidth: '520px' }}>
              <defs>
                <linearGradient id="gBlue" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2563eb" /><stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="gGreen" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#059669" /><stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="gViolet" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
                <linearGradient id="gAmber" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#d97706" /><stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill="rgba(100,116,139,0.6)" />
                </marker>
              </defs>

              {/* React Box */}
              <rect x="30" y="90" width="150" height="90" rx="14" fill="rgba(37,99,235,0.08)" stroke="url(#gBlue)" strokeWidth="1.5" />
              <text x="105" y="128" fill="#93c5fd" textAnchor="middle" fontSize="13" fontWeight="700" filter="url(#glow)">React + Vite</text>
              <text x="105" y="148" fill="#475569" textAnchor="middle" fontSize="9">3Dmol · Recharts · Tailwind</text>

              {/* FastAPI Box */}
              <rect x="310" y="50" width="170" height="180" rx="14" fill="rgba(5,150,105,0.08)" stroke="url(#gGreen)" strokeWidth="1.5" />
              <text x="395" y="88" fill="#6ee7b7" textAnchor="middle" fontSize="13" fontWeight="700" filter="url(#glow)">FastAPI</text>
              <text x="395" y="112" fill="#475569" textAnchor="middle" fontSize="9">/predict</text>
              <text x="395" y="130" fill="#475569" textAnchor="middle" fontSize="9">/analyze</text>
              <text x="395" y="148" fill="#475569" textAnchor="middle" fontSize="9">/compare</text>
              <text x="395" y="166" fill="#475569" textAnchor="middle" fontSize="9">/clinvar</text>

              {/* Arrows React → FastAPI */}
              <line x1="180" y1="120" x2="310" y2="120" stroke="rgba(100,116,139,0.4)" strokeDasharray="5 4" markerEnd="url(#arrow)" />
              <line x1="180" y1="150" x2="310" y2="160" stroke="rgba(100,116,139,0.3)" strokeDasharray="5 4" markerEnd="url(#arrow)" />

              {/* ESMFold Box */}
              <rect x="600" y="40" width="180" height="58" rx="12" fill="rgba(217,119,6,0.08)" stroke="url(#gAmber)" strokeWidth="1.5" />
              <text x="690" y="74" fill="#fcd34d" textAnchor="middle" fontSize="11" fontWeight="700">ESMFold API</text>

              {/* ESM-2 Box */}
              <rect x="600" y="115" width="180" height="58" rx="12" fill="rgba(124,58,237,0.08)" stroke="url(#gViolet)" strokeWidth="1.5" />
              <text x="690" y="149" fill="#c4b5fd" textAnchor="middle" fontSize="11" fontWeight="700">Fine-tuned ESM-2</text>

              {/* ClinVar Box */}
              <rect x="600" y="190" width="180" height="58" rx="12" fill="rgba(5,150,105,0.08)" stroke="url(#gGreen)" strokeWidth="1.5" />
              <text x="690" y="224" fill="#6ee7b7" textAnchor="middle" fontSize="11" fontWeight="700">NCBI ClinVar</text>

              {/* Arrows FastAPI → Services */}
              <line x1="480" y1="105" x2="600" y2="69" stroke="rgba(100,116,139,0.4)" strokeDasharray="4 4" markerEnd="url(#arrow)" />
              <line x1="480" y1="140" x2="600" y2="144" stroke="rgba(100,116,139,0.4)" strokeDasharray="4 4" markerEnd="url(#arrow)" />
              <line x1="480" y1="175" x2="600" y2="219" stroke="rgba(100,116,139,0.4)" strokeDasharray="4 4" markerEnd="url(#arrow)" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    {/* ─── Training Stats ─── */}
    <section className="animate-fade-in-up stagger-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Training Proteins', value: '9,752', color: '#60a5fa' },
          { label: 'Initial Loss', value: '6.58', color: '#f87171' },
          { label: 'Final Loss', value: '1.42', color: '#34d399' },
          { label: 'Parameters', value: '8M', color: '#c4b5fd' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-5 text-center card-3d">
            <p className="text-3xl font-bold font-mono" style={{ color: s.color, textShadow: `0 0 30px ${s.color}50` }}>{s.value}</p>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-2 font-bold">{s.label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ─── Footer ─── */}
    <footer className="text-center space-y-3 pt-4 animate-fade-in-up stagger-5">
      <div className="section-divider" />
      <p className="text-gray-600 text-xs pt-4">
        Built with <span className="text-red-400">♥</span> as a B.E. Computer Science Final Year Project ·{' '}
        <span className="text-gray-500">ESM-2 · ESMFold · FastAPI · React</span>
      </p>
    </footer>
  </div>
);

export default AboutPage;
