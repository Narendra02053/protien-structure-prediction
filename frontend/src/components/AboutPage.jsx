import React from 'react';
import { Cpu, Microscope, ShieldCheck, Network, Database, BookOpen, Beaker, Zap } from 'lucide-react';

const TECH_CARDS = [
  {
    icon: <Cpu size={20} />,
    accent: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    title: 'ESMFold Prediction',
    desc: "Meta AI's transformer-based model predicts protein 3D structures from single sequences with near-atomic accuracy. Significantly faster than AlphaFold while maintaining high performance for most proteins."
  },
  {
    icon: <Microscope size={20} />,
    accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    title: 'Fine-tuned ESM-2',
    desc: 'Core engine is a fine-tuned ESM-2 model (8M parameters) trained on 9,752 curated human protein sequences from UniProt Swiss-Prot. Masked Language Modeling reduced training loss from 6.58 → 1.42.'
  },
  {
    icon: <ShieldCheck size={20} />,
    accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    title: 'Variant Effect (LLR)',
    desc: 'Pathogenicity assessed via Log Likelihood Ratio scoring. We mask the mutation position and measure how much less probable the mutant residue is vs wild-type. LLR scores below −2.0 indicate Likely Pathogenic.'
  },
  {
    icon: <Database size={20} />,
    accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'ClinVar Integration',
    desc: 'Real-time queries to the NCBI ClinVar database retrieve known pathogenic variant counts for any gene, providing validated clinical evidence alongside computational predictions.'
  }
];

const PLDDT_LEVELS = [
  { range: '>90', label: 'Very High', color: '#3b82f6', bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', desc: 'Backbone is well modeled' },
  { range: '70–90', label: 'Confident', color: '#10b981', bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', desc: 'Generally reliable regions' },
  { range: '50–70', label: 'Low', color: '#f59e0b', bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', desc: 'May indicate disorder' },
  { range: '<50', label: 'Very Low', color: '#ef4444', bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', desc: 'Likely disordered region' },
];

const AboutPage = () => (
  <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 relative z-10">

    <header className="space-y-4 animate-fade-in-up">
      <div className="neo-tag">
        <BookOpen size={14} className="text-indigo-400" />
        <span>Documentation &amp; Methodology</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-white font-display leading-tight">
        About the Project
      </h1>
      <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
        Protein Structure Prediction &amp; Disease Mutation Analysis —{' '}
        <span className="text-indigo-300 font-semibold">B.E. Computer Science Final Year Major Project</span>
      </p>
      <div className="section-divider" />
    </header>

    {/* Tech Cards */}
    <section className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in-up stagger-1">
      {TECH_CARDS.map((card, i) => (
        <div
          key={i}
          className="glass p-6 space-y-3.5 card-3d border border-slate-800 hover:border-slate-700"
        >
          <div className={`neo-icon-box w-10 h-10 border ${card.accent} rounded-xl`}>
            {card.icon}
          </div>
          <h2 className="text-base font-bold text-white font-display">{card.title}</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
        </div>
      ))}
    </section>

    {/* pLDDT Section */}
    <section className="glass overflow-hidden animate-fade-in-up stagger-2 border border-slate-800">
      <div className="h-1 bg-gradient-to-r from-blue-500 to-emerald-500" />
      <div className="p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="neo-icon-box w-10 h-10 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
            <Beaker size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">pLDDT Confidence Scoring</h2>
            <p className="text-xs text-slate-400">Per-residue structural confidence metric (0–100)</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
          The predicted Local Distance Difference Test (pLDDT) is a confidence score assigned to each amino acid residue,
          ranging from 0 to 100. Higher scores indicate regions where the predicted 3D coordinates are likely accurate.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PLDDT_LEVELS.map(({ range, label, bg, text, desc }) => (
            <div
              key={range}
              className={`stat-pill p-5 space-y-1.5 border ${bg} rounded-xl transition-transform hover:-translate-y-0.5`}
            >
              <p className={`text-2xl font-bold font-mono ${text}`}>{range}</p>
              <p className={`text-xs font-semibold ${text}`}>{label}</p>
              <p className="text-[11px] text-slate-400 leading-snug">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Architecture Section */}
    <section className="glass overflow-hidden animate-fade-in-up stagger-3 border border-slate-800">
      <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
      <div className="p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="neo-icon-box w-10 h-10 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
            <Network size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">System Architecture</h2>
            <p className="text-xs text-slate-400">Full-stack pipeline overview</p>
          </div>
        </div>

        <div className="overflow-hidden border border-slate-800 rounded-xl bg-slate-950/70 p-6">
          <div className="overflow-x-auto">
            <svg viewBox="0 0 820 280" className="w-full" style={{ minWidth: '520px' }}>
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                  <path d="M0,0 L0,8 L8,4 z" fill="#94a3b8" />
                </marker>
              </defs>

              {/* Frontend Box */}
              <rect x="30" y="90" width="155" height="90" rx="10" fill="rgba(79,70,229,0.15)" stroke="#4f46e5" strokeWidth="1.5" />
              <text x="107" y="128" fill="#a5b4fc" textAnchor="middle" fontSize="13" fontWeight="700">React + Vite</text>
              <text x="107" y="150" fill="#94a3b8" textAnchor="middle" fontSize="9">3Dmol · Recharts · Tailwind</text>

              {/* FastAPI Box */}
              <rect x="310" y="50" width="175" height="185" rx="10" fill="rgba(16,185,129,0.1)" stroke="#10b981" strokeWidth="1.5" />
              <text x="397" y="88" fill="#6ee7b7" textAnchor="middle" fontSize="13" fontWeight="700">FastAPI</text>
              <text x="397" y="112" fill="#94a3b8" textAnchor="middle" fontSize="9">/predict</text>
              <text x="397" y="132" fill="#94a3b8" textAnchor="middle" fontSize="9">/analyze</text>
              <text x="397" y="152" fill="#94a3b8" textAnchor="middle" fontSize="9">/compare</text>
              <text x="397" y="172" fill="#94a3b8" textAnchor="middle" fontSize="9">/clinvar</text>

              {/* Arrows from frontend to backend */}
              <line x1="185" y1="125" x2="310" y2="120" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#arrow)" />
              <line x1="185" y1="155" x2="310" y2="160" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#arrow)" />

              {/* ESMFold Box */}
              <rect x="600" y="40" width="185" height="58" rx="8" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="692" y="74" fill="#93c5fd" textAnchor="middle" fontSize="11" fontWeight="700">ESMFold API</text>

              {/* Fine-tuned ESM Box */}
              <rect x="600" y="115" width="185" height="58" rx="8" fill="rgba(99,102,241,0.12)" stroke="#6366f1" strokeWidth="1.5" />
              <text x="692" y="149" fill="#c7d2fe" textAnchor="middle" fontSize="11" fontWeight="700">Fine-tuned ESM-2</text>

              {/* ClinVar Box */}
              <rect x="600" y="190" width="185" height="58" rx="8" fill="rgba(20,184,166,0.12)" stroke="#14b8a6" strokeWidth="1.5" />
              <text x="692" y="224" fill="#99f6e4" textAnchor="middle" fontSize="11" fontWeight="700">NCBI ClinVar</text>

              {/* Arrows from backend to services */}
              <line x1="485" y1="105" x2="600" y2="69" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow)" />
              <line x1="485" y1="145" x2="600" y2="144" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow)" />
              <line x1="485" y1="175" x2="600" y2="219" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow)" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    {/* Model Stats */}
    <section className="animate-fade-in-up stagger-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Training Proteins', value: '9,752', text: 'text-indigo-400', bg: 'border-indigo-500/20 bg-indigo-500/5' },
          { label: 'Initial Loss', value: '6.58', text: 'text-red-400', bg: 'border-red-500/20 bg-red-500/5' },
          { label: 'Final Loss', value: '1.42', text: 'text-emerald-400', bg: 'border-emerald-500/20 bg-emerald-500/5' },
          { label: 'Parameters', value: '8M', text: 'text-purple-400', bg: 'border-purple-500/20 bg-purple-500/5' },
        ].map(s => (
          <div key={s.label} className={`glass p-5 text-center border ${s.bg} rounded-xl card-3d`}>
            <p className={`text-3xl font-bold font-mono ${s.text}`}>{s.value}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-2 font-medium">{s.label}</p>
          </div>
        ))}
      </div>
    </section>

    <footer className="text-center space-y-3 pt-2 animate-fade-in-up stagger-5">
      <div className="section-divider" />
      <p className="text-slate-400 text-xs pt-4">
        Built with <span className="text-red-400">♥</span> as a B.E. Computer Science Final Year Project ·{' '}
        <span className="text-slate-300 font-medium">ESM-2 · ESMFold · FastAPI · React</span>
      </p>
    </footer>
  </div>
);

export default AboutPage;
