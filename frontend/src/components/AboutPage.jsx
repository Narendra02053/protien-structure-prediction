import React from 'react';
import { Cpu, Microscope, ShieldCheck, Network, Database, BookOpen, Beaker, Zap } from 'lucide-react';

const TECH_CARDS = [
  {
    icon: <Cpu size={22} strokeWidth={2.5} />,
    bg: '#7C9EFF',
    title: 'ESMFold Prediction',
    desc: 'Meta AI\'s transformer-based model predicts protein 3D structures from single sequences with atomic accuracy. Significantly faster than AlphaFold while maintaining high performance for most proteins.'
  },
  {
    icon: <Microscope size={22} strokeWidth={2.5} />,
    bg: '#C9A0FF',
    title: 'Fine-tuned ESM-2',
    desc: 'Core engine is a fine-tuned ESM-2 model (8M parameters) trained on 9,752 curated human protein sequences from UniProt Swiss-Prot. Masked Language Modeling reduced training loss from 6.58 → 1.42.'
  },
  {
    icon: <ShieldCheck size={22} strokeWidth={2.5} />,
    bg: '#7CFF6B',
    title: 'Variant Effect (LLR)',
    desc: 'Pathogenicity assessed via Log Likelihood Ratio. We mask the mutation position and measure how much less probable the mutant residue is vs wild-type. Scores below −2.0 indicate Likely Pathogenic.'
  },
  {
    icon: <Database size={22} strokeWidth={2.5} />,
    bg: '#FFE600',
    title: 'ClinVar Integration',
    desc: 'Real-time queries to the NCBI ClinVar database retrieve the number of known pathogenic variants for any gene, providing clinical evidence alongside our computational predictions.'
  }
];

const PLDDT_LEVELS = [
  { range: '>90', label: 'Very High', color: '#7C9EFF', desc: 'Backbone well-modeled' },
  { range: '70–90', label: 'Confident', color: '#7CFF6B', desc: 'Generally reliable' },
  { range: '50–70', label: 'Low', color: '#FF9F43', desc: 'Possible disorder' },
  { range: '<50', label: 'Very Low', color: '#FF6B6B', desc: 'Likely disordered' },
];

const AboutPage = () => (
  <div className="max-w-5xl mx-auto px-6 py-14 space-y-14 relative z-10">

    <header className="space-y-5 animate-fade-in-up">
      <div className="neo-tag">
        <BookOpen size={13} strokeWidth={2.5} />
        <span>Documentation</span>
      </div>
      <h1 className="text-5xl font-extrabold text-white font-display leading-tight">
        About the Project
      </h1>
      <p className="text-white/60 text-lg max-w-2xl leading-relaxed font-medium">
        Protein Structure Prediction &amp; Disease Mutation Analysis —{' '}
        <span className="text-white font-extrabold bg-accent-yellow px-1 text-[#0a0a0a]">B.E. Computer Science Final Year Major Project</span>
      </p>
      <div className="section-divider" />
    </header>

    <section className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in-up stagger-1">
      {TECH_CARDS.map((card, i) => (
        <div
          key={i}
          className="glass p-7 space-y-4 card-3d group"
          style={{ background: card.bg }}
        >
          <div className="neo-icon-box w-12 h-12 bg-[#0a0a0a] text-white">
            {card.icon}
          </div>
          <h2 className="text-base font-extrabold text-[#0a0a0a] font-display">{card.title}</h2>
          <p className="text-sm text-[#0a0a0a]/80 leading-relaxed font-medium">{card.desc}</p>
        </div>
      ))}
    </section>

    <section className="glass overflow-hidden animate-fade-in-up stagger-2">
      <div className="h-3 bg-accent-blue border-b-3 border-white" />
      <div className="p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="neo-icon-box w-10 h-10 bg-accent-blue">
            <Beaker className="text-[#0a0a0a]" size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-display">pLDDT Confidence Scoring</h2>
            <p className="text-xs text-white/50 font-bold">Per-residue structural confidence metric</p>
          </div>
        </div>
        <p className="text-sm text-white/60 leading-relaxed max-w-2xl font-medium">
          The predicted Local Distance Difference Test (pLDDT) is a per-residue confidence metric between 0 and 100,
          indicating how reliable each part of the predicted structure is.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PLDDT_LEVELS.map(({ range, label, color, desc }) => (
            <div
              key={range}
              className="stat-pill p-5 space-y-2 group hover:-translate-y-0.5 transition-transform"
              style={{ background: color }}
            >
              <p className="text-2xl font-extrabold font-mono text-[#0a0a0a]">{range}</p>
              <p className="text-xs font-extrabold text-[#0a0a0a]">{label}</p>
              <p className="text-[10px] text-[#0a0a0a]/70 leading-snug font-bold">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="glass overflow-hidden animate-fade-in-up stagger-3">
      <div className="h-3 bg-accent-violet border-b-3 border-white" />
      <div className="p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="neo-icon-box w-10 h-10 bg-accent-violet">
            <Network className="text-[#0a0a0a]" size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white font-display">System Architecture</h2>
            <p className="text-xs text-white/50 font-bold">Full-stack pipeline overview</p>
          </div>
        </div>

        <div className="overflow-hidden border-3 border-white shadow-neo-sm bg-[#0a0a0a]">
          <div className="p-6 overflow-x-auto">
            <svg viewBox="0 0 820 280" className="w-full" style={{ minWidth: '520px' }}>
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                  <path d="M0,0 L0,8 L8,4 z" fill="#ffffff" />
                </marker>
              </defs>

              <rect x="30" y="90" width="150" height="90" fill="#7C9EFF" stroke="#ffffff" strokeWidth="3" />
              <text x="105" y="128" fill="#0a0a0a" textAnchor="middle" fontSize="13" fontWeight="800">React + Vite</text>
              <text x="105" y="148" fill="#0a0a0a" textAnchor="middle" fontSize="9" fontWeight="600">3Dmol · Recharts · Tailwind</text>

              <rect x="310" y="50" width="170" height="180" fill="#7CFF6B" stroke="#ffffff" strokeWidth="3" />
              <text x="395" y="88" fill="#0a0a0a" textAnchor="middle" fontSize="13" fontWeight="800">FastAPI</text>
              <text x="395" y="112" fill="#0a0a0a" textAnchor="middle" fontSize="9" fontWeight="600">/predict</text>
              <text x="395" y="130" fill="#0a0a0a" textAnchor="middle" fontSize="9" fontWeight="600">/analyze</text>
              <text x="395" y="148" fill="#0a0a0a" textAnchor="middle" fontSize="9" fontWeight="600">/compare</text>
              <text x="395" y="166" fill="#0a0a0a" textAnchor="middle" fontSize="9" fontWeight="600">/clinvar</text>

              <line x1="180" y1="120" x2="310" y2="120" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#arrow)" />
              <line x1="180" y1="150" x2="310" y2="160" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#arrow)" />

              <rect x="600" y="40" width="180" height="58" fill="#FFE600" stroke="#ffffff" strokeWidth="3" />
              <text x="690" y="74" fill="#0a0a0a" textAnchor="middle" fontSize="11" fontWeight="800">ESMFold API</text>

              <rect x="600" y="115" width="180" height="58" fill="#C9A0FF" stroke="#ffffff" strokeWidth="3" />
              <text x="690" y="149" fill="#0a0a0a" textAnchor="middle" fontSize="11" fontWeight="800">Fine-tuned ESM-2</text>

              <rect x="600" y="190" width="180" height="58" fill="#4ECDC4" stroke="#ffffff" strokeWidth="3" />
              <text x="690" y="224" fill="#0a0a0a" textAnchor="middle" fontSize="11" fontWeight="800">NCBI ClinVar</text>

              <line x1="480" y1="105" x2="600" y2="69" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
              <line x1="480" y1="140" x2="600" y2="144" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
              <line x1="480" y1="175" x2="600" y2="219" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <section className="animate-fade-in-up stagger-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Training Proteins', value: '9,752', bg: '#7C9EFF' },
          { label: 'Initial Loss', value: '6.58', bg: '#FF6B6B' },
          { label: 'Final Loss', value: '1.42', bg: '#7CFF6B' },
          { label: 'Parameters', value: '8M', bg: '#C9A0FF' },
        ].map(s => (
          <div key={s.label} className="glass p-5 text-center card-3d" style={{ background: s.bg }}>
            <p className="text-3xl font-extrabold font-mono text-[#0a0a0a]">{s.value}</p>
            <p className="text-[10px] text-[#0a0a0a]/70 uppercase tracking-widest mt-2 font-extrabold">{s.label}</p>
          </div>
        ))}
      </div>
    </section>

    <footer className="text-center space-y-3 pt-4 animate-fade-in-up stagger-5">
      <div className="section-divider" />
      <p className="text-white/50 text-xs pt-4 font-bold">
        Built with <span className="text-accent-red">♥</span> as a B.E. Computer Science Final Year Project ·{' '}
        <span className="text-white">ESM-2 · ESMFold · FastAPI · React</span>
      </p>
    </footer>
  </div>
);

export default AboutPage;
