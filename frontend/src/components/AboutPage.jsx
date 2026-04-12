import React from 'react';
import { Cpu, Microscope, ShieldCheck, Network, Database, BookOpen, Beaker } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 relative z-10">
            <header className="space-y-4 animate-fade-in-up">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-xs font-semibold tracking-wider uppercase">
                    <BookOpen size={13} />
                    <span>Documentation</span>
                </div>
                <h1 className="text-4xl font-extrabold text-white text-glow">About the Project</h1>
                <p className="text-gray-400 text-lg max-w-2xl">Protein Structure Prediction & Disease Mutation Analysis — B.E. Computer Science Final Year Major Project</p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up stagger-1">
                {[
                    {
                        icon: <Cpu size={22} />, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/10',
                        title: 'ESMFold Prediction',
                        desc: 'We use the ESMFold API by Meta AI, a transformer-based model that predicts protein 3D structures from single sequences with atomic accuracy. Unlike AlphaFold, ESMFold is significantly faster while maintaining high performance for most proteins.'
                    },
                    {
                        icon: <Microscope size={22} />, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/10',
                        title: 'Fine-tuned ESM-2',
                        desc: 'Our core engine is a fine-tuned ESM-2 model (8M parameters) trained on 9,752 curated human protein sequences from UniProt Swiss-Prot. Masked Language Modeling reduced training loss from 6.58 to 1.42, proving successful domain adaptation.'
                    },
                    {
                        icon: <ShieldCheck size={22} />, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/10',
                        title: 'Variant Effect (LLR)',
                        desc: 'Pathogenicity is assessed via Log Likelihood Ratio. We mask the mutation position and measure how much less probable the mutant residue is compared to the wild-type. Scores below -2.0 indicate Likely Pathogenic.'
                    },
                    {
                        icon: <Database size={22} />, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/10',
                        title: 'ClinVar Integration',
                        desc: 'We query the NCBI ClinVar database in real-time to retrieve the number of known pathogenic variants for any gene, providing clinical evidence alongside our computational predictions.'
                    }
                ].map((card, i) => (
                    <div key={i} className={`glass rounded-3xl p-8 space-y-4 border ${card.border} card-3d`}>
                        <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center ${card.color}`}>
                            {card.icon}
                        </div>
                        <h2 className="text-lg font-bold text-white">{card.title}</h2>
                        <p className="text-sm text-gray-400 leading-relaxed">{card.desc}</p>
                    </div>
                ))}
            </section>

            <section className="glass rounded-3xl p-8 space-y-6 animate-fade-in-up stagger-2">
                <div className="flex items-center space-x-3">
                    <Beaker className="text-blue-400" size={20} />
                    <h2 className="text-xl font-bold text-white">pLDDT Confidence Scoring</h2>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">The predicted Local Distance Difference Test (pLDDT) is a per-residue confidence metric between 0 and 100.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { range: '>90', label: 'Very High Confidence', color: 'blue', desc: 'Backbone well-modeled' },
                        { range: '70-90', label: 'Confident', color: 'green', desc: 'Generally reliable' },
                        { range: '50-70', label: 'Low Confidence', color: 'amber', desc: 'Possible disorder' },
                        { range: '<50', label: 'Very Low', color: 'red', desc: 'Likely disordered' }
                    ].map(({ range, label, color, desc }) => (
                        <div key={range} className={`stat-pill p-4 rounded-2xl border border-${color}-500/10 space-y-1`}>
                            <p className={`text-${color}-400 text-lg font-bold font-mono`}>{range}</p>
                            <p className="text-xs font-semibold text-gray-300">{label}</p>
                            <p className="text-[10px] text-gray-500">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="glass rounded-3xl p-8 space-y-6 animate-fade-in-up stagger-3">
                <div className="flex items-center space-x-3">
                    <Network className="text-purple-400" size={20} />
                    <h2 className="text-xl font-bold text-white">System Architecture</h2>
                </div>
                <div className="rounded-2xl bg-black/20 p-6 flex justify-center overflow-x-auto">
                    <svg viewBox="0 0 800 260" className="w-full max-w-3xl" style={{ minWidth: '500px' }}>
                        <defs>
                            <linearGradient id="gBlue" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient>
                            <linearGradient id="gGreen" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#14b8a6" /></linearGradient>
                            <linearGradient id="gPurple" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#a855f7" /></linearGradient>
                            <linearGradient id="gAmber" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#ef4444" /></linearGradient>
                        </defs>
                        <rect x="40" y="80" width="140" height="80" rx="16" fill="none" stroke="url(#gBlue)" strokeWidth="1.5" opacity="0.7" />
                        <text x="110" y="115" fill="#93c5fd" textAnchor="middle" fontSize="13" fontWeight="600">React + Vite</text>
                        <text x="110" y="135" fill="#64748b" textAnchor="middle" fontSize="9">3Dmol · Recharts</text>

                        <rect x="300" y="40" width="160" height="180" rx="16" fill="none" stroke="url(#gGreen)" strokeWidth="1.5" opacity="0.7" />
                        <text x="380" y="75" fill="#86efac" textAnchor="middle" fontSize="13" fontWeight="600">FastAPI</text>
                        <text x="380" y="100" fill="#64748b" textAnchor="middle" fontSize="9">Prediction</text>
                        <text x="380" y="120" fill="#64748b" textAnchor="middle" fontSize="9">Analysis</text>
                        <text x="380" y="140" fill="#64748b" textAnchor="middle" fontSize="9">Comparison</text>
                        <text x="380" y="160" fill="#64748b" textAnchor="middle" fontSize="9">ClinVar</text>

                        <line x1="180" y1="110" x2="300" y2="110" stroke="#475569" strokeDasharray="5 5" />
                        <line x1="180" y1="130" x2="300" y2="150" stroke="#475569" strokeDasharray="5 5" />

                        <rect x="580" y="40" width="160" height="55" rx="12" fill="none" stroke="url(#gAmber)" strokeWidth="1.5" opacity="0.7" />
                        <text x="660" y="72" fill="#fcd34d" textAnchor="middle" fontSize="11" fontWeight="600">ESMFold API</text>

                        <rect x="580" y="110" width="160" height="55" rx="12" fill="none" stroke="url(#gPurple)" strokeWidth="1.5" opacity="0.7" />
                        <text x="660" y="142" fill="#c4b5fd" textAnchor="middle" fontSize="11" fontWeight="600">Fine-tuned ESM-2</text>

                        <rect x="580" y="180" width="160" height="55" rx="12" fill="none" stroke="url(#gAmber)" strokeWidth="1.5" opacity="0.5" />
                        <text x="660" y="212" fill="#fbbf24" textAnchor="middle" fontSize="11" fontWeight="600">NCBI ClinVar</text>

                        <line x1="460" y1="100" x2="580" y2="67" stroke="#475569" strokeDasharray="4 4" />
                        <line x1="460" y1="130" x2="580" y2="137" stroke="#475569" strokeDasharray="4 4" />
                        <line x1="460" y1="160" x2="580" y2="207" stroke="#475569" strokeDasharray="4 4" />
                    </svg>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
