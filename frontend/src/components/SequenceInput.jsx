import React, { useState } from 'react';
import { useProtein } from '../context/ProteinContext';
import { predictStructure } from '../api/predict';
import { useNavigate } from 'react-router-dom';
import {
  Loader2, Zap, Dna, FlaskConical, Sparkles, ShieldCheck,
  Lock, ChevronRight, Atom, Activity, Database, Cpu
} from 'lucide-react';

const EXAMPLE_PROTEINS = [
  { name: 'Insulin', gene: 'INS', mutation: 'A23K', sequence: 'MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKTRREAEDLQVGQVELGGGPGAGSLQPLALEGSLQKRGIVEQCCTSICSLYQLENYCN' },
  { name: 'Hemoglobin', gene: 'HBA1', mutation: 'V68L', sequence: 'MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR' },
  { name: 'Ubiquitin', gene: 'UBB', mutation: 'M1A', sequence: 'MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPPDQQRLIFAGKQLEDGRTLSDYNIQKESTLHLVLRLRGG' },
  { name: 'Lysozyme', gene: 'LYZ', mutation: 'D52N', sequence: 'MKALIVLGLVLLSVTVQGKVFERCELARTLKRLGMDGYRGISLANWMCLAKWESGYNTRATNYNAGDRSTDYGIFQINSRYWCNDGKTPGAVNACHLSCSALLQDNIADAVACAKRVVRDPQGIRAWVAWRNRCQNRDVRQYVQGCGV' },
  { name: 'Myoglobin', gene: 'MB', mutation: 'H64Q', sequence: 'MGLSDGEWQLVLNVWGKVEADIPGHGQEVLIRLFKGHPETLEKFDKFKHLKSEDEMKASEDLKKHGATVLTALGGILKKKGHHEAEIKPLAQSHATKHKIPVKYLEFISECIIQVLQSKHPGDFGADAQGAMNKALELFRKDMASNYKELGFQG' }
];

const LOADING_MESSAGES = [
  'Contacting ESMFold API...',
  'Predicting 3D structure...',
  'Extracting pLDDT confidence...',
  'Analyzing mutation pathogenicity...',
  'Querying ClinVar database...',
  'Finalizing results...'
];

/* ─── Animated DNA Helix SVG ─── */
const DNAHelix = () => (
  <svg viewBox="0 0 120 300" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 20px rgba(99,102,241,0.25))' }}>
    <defs>
      <linearGradient id="strand1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#818CF8" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#C084FC" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="strand2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#34D399" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#818CF8" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#C084FC" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    {/* Strand 1 */}
    <path d="M 20,10 Q 100,40 20,70 Q -60,100 20,130 Q 100,160 20,190 Q -60,220 20,250 Q 100,280 20,300"
      fill="none" stroke="url(#strand1)" strokeWidth="2.5" strokeLinecap="round" />
    {/* Strand 2 */}
    <path d="M 100,10 Q 20,40 100,70 Q 180,100 100,130 Q 20,160 100,190 Q 180,220 100,250 Q 20,280 100,300"
      fill="none" stroke="url(#strand2)" strokeWidth="2.5" strokeLinecap="round" />
    {/* Rungs */}
    {[25,55,85,115,145,175,205,235,265].map((y, i) => {
      const phase = (i % 2 === 0) ? 0 : 1;
      const x1 = phase === 0 ? 28 : 92;
      const x2 = phase === 0 ? 92 : 28;
      const colors = ['#818CF8','#C084FC','#34D399','#F472B6','#38BDF8'];
      return (
        <g key={y}>
          <line x1={x1} y1={y} x2={x2} y2={y} stroke={colors[i % colors.length]} strokeWidth="1.5" opacity="0.5" />
          <circle cx={x1} cy={y} r="3" fill={colors[i % colors.length]} opacity="0.8" />
          <circle cx={x2} cy={y} r="3" fill={colors[(i+2) % colors.length]} opacity="0.8" />
        </g>
      );
    })}
  </svg>
);

/* ─── Feature Pill ─── */
const FeaturePill = ({ icon, label, accentClass }) => (
  <div className={`inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900/80 border border-slate-800 ${accentClass}`}>
    {icon}
    <span>{label}</span>
  </div>
);

const SequenceInput = ({ onToast }) => {
  const { proteinData, updateProteinData } = useProtein();
  const [sequence, setSequence] = useState(proteinData.sequence);
  const [mutation, setMutation] = useState(proteinData.mutation);
  const [geneName, setGeneName] = useState(proteinData.geneName);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [loadingIdx, setLoadingIdx] = useState(0);
  const navigate = useNavigate();

  const cycleMessages = () => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[idx]);
      setLoadingIdx(idx);
    }, 3000);
    return interval;
  };

  const handlePredict = async () => {
    if (sequence.length < 10) return onToast('Sequence too short (min 10 chars)', 'error');
    setLoading(true);
    setLoadingMsg(LOADING_MESSAGES[0]);
    const msgInterval = cycleMessages();
    try {
      const structure = await predictStructure(sequence);
      let analysis = null;
      if (mutation && geneName) {
        const { analyzeMutation } = await import('../api/analyze');
        analysis = await analyzeMutation(sequence, mutation, geneName);
        const match = mutation.match(/\d+/);
        const pos = match ? parseInt(match[0]) : null;
        const plddt_obj = structure.plddt_scores.find(s => s.position === pos);
        analysis.plddt_at_position = plddt_obj ? plddt_obj.score : null;
      }
      let comparison = null;
      try {
        const { compareModels } = await import('../api/compare');
        comparison = await compareModels(sequence);
      } catch (e) { /* optional */ }
      updateProteinData({ sequence, mutation, geneName, structure, analysis, comparison });
      onToast('Analysis Complete!', 'success');
      navigate('/results');
    } catch (err) {
      const detail = err.response?.data?.detail;
      let msg = 'Analysis failed';
      if (Array.isArray(detail)) msg = detail[0]?.msg || 'Invalid input format';
      else if (typeof detail === 'string') msg = detail;
      else msg = err.message || 'An unexpected error occurred';
      onToast(msg, 'error');
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  };

  const validateSequence = (seq) => {
    const invalid = seq.toUpperCase().match(/[^ACDEFGHIKLMNPQRSTVWY]/g);
    return invalid ? Array.from(new Set(invalid)) : [];
  };
  const invalidChars = validateSequence(sequence);
  const isValid = sequence.length >= 10 && sequence.length <= 400 && invalidChars.length === 0;

  return (
    <div className="relative z-10">
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Text */}
            <div className="lg:col-span-8 space-y-6 animate-fade-in-up">
              <div className="space-y-4">
                <div className="neo-tag">
                  <Sparkles size={14} className="text-indigo-400" />
                  <span>Fine-tuned ESM-2 · 9,752 Human Proteins</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display text-white leading-tight">
                  Protein Structure &amp; <br />
                  <span className="gradient-text">Mutation Pathogenicity</span> Analyzer
                </h1>
                <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
                  Predict 3D protein structures, quantify variant pathogenicity via Log Likelihood Ratio (LLR) scoring, and benchmark model accuracy — powered by a fine-tuned ESM-2 transformer.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <FeaturePill icon={<Atom size={14} className="text-indigo-400" />} label="ESMFold 3D Structure" accentClass="text-slate-200" />
                <FeaturePill icon={<Activity size={14} className="text-emerald-400" />} label="pLDDT Confidence" accentClass="text-slate-200" />
                <FeaturePill icon={<Database size={14} className="text-purple-400" />} label="ClinVar Integration" accentClass="text-slate-200" />
                <FeaturePill icon={<Cpu size={14} className="text-blue-400" />} label="LLR Pathogenicity" accentClass="text-slate-200" />
              </div>

              <div className="flex items-center space-x-4 pt-2">
                {[
                  { val: '9,752', label: 'Training Proteins', color: 'text-indigo-400' },
                  { val: '1.42', label: 'Final Loss', color: 'text-emerald-400' },
                  { val: '8M', label: 'Parameters', color: 'text-purple-400' },
                ].map((s) => (
                  <div key={s.label} className="stat-pill px-4 py-2.5 text-center bg-slate-900/80 border border-slate-800">
                    <div className={`text-xl font-bold font-mono ${s.color}`}>{s.val}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: DNA Helix */}
            <div className="hidden lg:flex lg:col-span-4 justify-center items-center animate-fade-in stagger-2">
              <div className="relative w-32 h-72 helix-float">
                <DNAHelix />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FORM SECTION ─── */}
      <section className="max-w-4xl mx-auto px-6 pb-16 space-y-6">
        {/* Main Card */}
        <div className="glass overflow-hidden animate-fade-in-up stagger-2 border border-slate-800">
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500" />
          <div className="p-6 md:p-8 space-y-6">

            {/* Sequence Input */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                  <Dna size={16} className="text-indigo-400" />
                  <span>Amino Acid Sequence</span>
                </label>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-mono font-medium ${sequence.length > 400 ? 'text-red-400' : 'text-slate-400'}`}>
                    {sequence.length}<span className="text-slate-600">/400</span>
                  </span>
                  {isValid && <div className="pulse-dot" />}
                </div>
              </div>
              <textarea
                className="input-glass w-full h-36 p-4 text-sm leading-relaxed resize-none"
                value={sequence}
                onChange={(e) => setSequence(e.target.value.toUpperCase())}
                placeholder="Paste your amino acid sequence here (e.g. MALWMRLL...)"
              />
              {invalidChars.length > 0 && (
                <p className="text-red-400 text-xs flex items-center space-x-2 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                  <span>Invalid characters: <strong className="font-mono">{invalidChars.join(', ')}</strong></span>
                </p>
              )}
            </div>

            {/* Mutation & Gene */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                  <FlaskConical size={13} className="text-purple-400" />
                  <span>Mutation <span className="text-slate-500 font-normal lowercase">(optional)</span></span>
                </label>
                <input
                  type="text"
                  className="input-glass w-full p-3 text-sm"
                  value={mutation}
                  onChange={(e) => setMutation(e.target.value.toUpperCase())}
                  placeholder="e.g. A23K"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Gene Name <span className="text-slate-500 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  className="input-glass w-full p-3 text-sm font-sans"
                  value={geneName}
                  onChange={(e) => setGeneName(e.target.value)}
                  placeholder="e.g. INS, TP53, BRCA1"
                />
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center space-x-3 text-xs text-slate-300 bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <Lock size={14} className="text-indigo-400 flex-shrink-0" />
              <span>Data is processed via secure API endpoints (ESMFold &amp; NCBI). No sequence data is retained.</span>
            </div>

            {/* Examples */}
            <div className="space-y-2.5">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Quick Sample Proteins</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROTEINS.map(p => (
                  <button
                    key={p.name}
                    onClick={() => { setSequence(p.sequence); setMutation(p.mutation); setGeneName(p.gene); }}
                    className="neo-chip"
                  >
                    {p.name} ({p.gene})
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              disabled={loading || !isValid}
              onClick={handlePredict}
              className="btn-primary w-full py-3.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>{loadingMsg}</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Analyze Protein Sequence</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading Progress */}
        {loading && (
          <div className="glass p-5 space-y-3.5 animate-fade-in border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                <p className="text-sm text-slate-200 font-medium">{loadingMsg}</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">{loadingIdx + 1}/{LOADING_MESSAGES.length}</span>
            </div>
            <div className="neo-bar-track">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-700"
                style={{ width: `${((loadingIdx + 1) / LOADING_MESSAGES.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SequenceInput;

