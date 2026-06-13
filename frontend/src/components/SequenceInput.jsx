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
  <svg viewBox="0 0 120 300" className="w-full h-full" style={{ filter: 'drop-shadow(4px 4px 0 rgba(255,230,0,0.3))' }}>
    <defs>
      <linearGradient id="strand1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7C9EFF" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#C9A0FF" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="strand2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7CFF6B" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#7C9EFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#C9A0FF" stopOpacity="0.8" />
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
      const colors = ['#7C9EFF','#C9A0FF','#7CFF6B','#FF6B9D','#FF9F43'];
      return (
        <g key={y}>
          <line x1={x1} y1={y} x2={x2} y2={y} stroke={colors[i % colors.length]} strokeWidth="1.5" opacity="0.6" />
          <circle cx={x1} cy={y} r="3" fill={colors[i % colors.length]} opacity="0.8" />
          <circle cx={x2} cy={y} r="3" fill={colors[(i+2) % colors.length]} opacity="0.8" />
        </g>
      );
    })}
  </svg>
);

/* ─── Feature Pill ─── */
const FeaturePill = ({ icon, label, color }) => (
  <div className="inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-extrabold border-3 border-white shadow-neo-sm"
    style={{ background: color, color: '#0a0a0a' }}>
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
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <div className="neo-tag">
                  <Sparkles size={13} strokeWidth={2.5} />
                  <span>Fine-tuned ESM-2 · 9,752 Human Proteins</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight font-display leading-[1.05] text-white">
                  <span>Protein</span>
                  <br />
                  <span className="gradient-text">Mutation</span>
                  <br />
                  <span>Analyzer</span>
                </h1>
                <p className="text-white/60 text-lg leading-relaxed max-w-lg font-medium">
                  Predict 3D structure, assess pathogenicity via LLR scoring, and benchmark model performance — powered by a fine-tuned ESM-2 transformer.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <FeaturePill icon={<Atom size={12} />} label="ESMFold Structure" color="#7C9EFF" />
                <FeaturePill icon={<Activity size={12} />} label="pLDDT Confidence" color="#7CFF6B" />
                <FeaturePill icon={<Database size={12} />} label="ClinVar Integration" color="#C9A0FF" />
                <FeaturePill icon={<Cpu size={12} />} label="LLR Pathogenicity" color="#FF6B9D" />
              </div>

              <div className="flex items-center space-x-4 pt-2">
                {[
                  { val: '9,752', label: 'Training Proteins', bg: 'bg-accent-yellow' },
                  { val: '1.42', label: 'Final Loss', bg: 'bg-accent-cyan' },
                  { val: '8M', label: 'Parameters', bg: 'bg-accent-pink' },
                ].map((s, i) => (
                  <div key={s.label} className={`stat-pill px-4 py-3 text-center ${s.bg}`}>
                    <div className="text-2xl font-extrabold text-[#0a0a0a] font-mono">{s.val}</div>
                    <div className="text-[10px] text-[#0a0a0a]/70 uppercase tracking-wider font-bold">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: DNA Helix */}
            <div className="hidden lg:flex justify-center items-center animate-fade-in stagger-2">
              <div className="relative w-32 h-80 helix-float">
                <DNAHelix />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FORM SECTION ─── */}
      <section className="max-w-4xl mx-auto px-6 pb-16 space-y-6">
        {/* Main Card */}
        <div className="glass overflow-hidden animate-fade-in-up stagger-2">
          <div className="h-3 bg-accent-yellow border-b-3 border-white" />
          <div className="p-8 md:p-10 space-y-8">

            {/* Sequence Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-extrabold text-white flex items-center space-x-2">
                  <Dna size={15} strokeWidth={2.5} />
                  <span>Amino Acid Sequence</span>
                </label>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-mono font-bold ${sequence.length > 400 ? 'text-accent-red' : 'text-white/50'}`}>
                    {sequence.length}<span className="text-white/30">/400</span>
                  </span>
                  {isValid && <div className="pulse-dot" />}
                </div>
              </div>
              <textarea
                className="input-glass w-full h-36 p-5 text-sm leading-relaxed resize-none"
                value={sequence}
                onChange={(e) => setSequence(e.target.value.toUpperCase())}
                placeholder="Paste your amino acid sequence here (e.g. MALWMRLL...)"
              />
              {invalidChars.length > 0 && (
                <p className="text-accent-red text-xs flex items-center space-x-2 font-bold">
                  <span className="w-2 h-2 bg-accent-red border-2 border-white inline-block" />
                  <span>Invalid characters: <strong className="font-mono">{invalidChars.join(', ')}</strong></span>
                </p>
              )}
            </div>

            {/* Mutation & Gene */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                  <FlaskConical size={12} strokeWidth={2.5} />
                  <span>Mutation <span className="text-white/40 normal-case">(optional)</span></span>
                </label>
                <input
                  type="text"
                  className="input-glass w-full p-3.5 text-sm"
                  value={mutation}
                  onChange={(e) => setMutation(e.target.value.toUpperCase())}
                  placeholder="e.g. A23K"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Gene Name <span className="text-white/40 normal-case">(optional)</span>
                </label>
                <input
                  type="text"
                  className="input-glass w-full p-3.5 text-sm font-sans"
                  value={geneName}
                  onChange={(e) => setGeneName(e.target.value)}
                  placeholder="e.g. INS, TP53, BRCA1"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                />
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center space-x-2.5 text-[10px] text-white font-bold bg-accent-emerald border-3 border-white shadow-neo-sm p-3.5">
              <Lock size={12} className="text-[#0a0a0a] flex-shrink-0" strokeWidth={2.5} />
              <span className="text-[#0a0a0a]">Your data is processed locally and via secure HTTPS connections to ESMFold and NCBI. Nothing is stored.</span>
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-extrabold">Quick Examples</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROTEINS.map(p => (
                  <button
                    key={p.name}
                    onClick={() => { setSequence(p.sequence); setMutation(p.mutation); setGeneName(p.gene); }}
                    className="neo-chip"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              disabled={loading || !isValid}
              onClick={handlePredict}
              className="btn-primary w-full py-4 font-extrabold text-base disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} strokeWidth={2.5} />
                  <span>{loadingMsg}</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={20} strokeWidth={2.5} />
                  <span>Analyze Protein</span>
                  <ChevronRight size={18} strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading Progress */}
        {loading && (
          <div className="glass p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-accent-yellow border-2 border-white animate-ping" />
                <p className="text-sm text-white font-extrabold">{loadingMsg}</p>
              </div>
              <span className="text-xs text-white/50 font-mono font-bold">{loadingIdx + 1}/{LOADING_MESSAGES.length}</span>
            </div>
            <div className="neo-bar-track">
              <div
                className="h-full progress-bar transition-all duration-1000"
                style={{ width: `${((loadingIdx + 1) / LOADING_MESSAGES.length) * 100}%` }}
              />
            </div>
            <div className="flex gap-1.5">
              {LOADING_MESSAGES.map((_, i) => (
                <div key={i} className={`flex-1 h-2 border-2 border-white transition-all duration-500 ${i <= loadingIdx ? 'bg-accent-yellow' : 'bg-[#1a1a1a]'}`} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SequenceInput;
