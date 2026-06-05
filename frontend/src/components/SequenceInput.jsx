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
  <svg viewBox="0 0 120 300" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 12px rgba(37,99,235,0.4))' }}>
    <defs>
      <linearGradient id="strand1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="strand2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.8" />
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
      const colors = ['#60a5fa','#a78bfa','#34d399','#f472b6','#fb923c'];
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
  <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border`}
    style={{ background: `${color}12`, borderColor: `${color}25`, color }}>
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
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold tracking-wider uppercase">
                  <Sparkles size={13} />
                  <span>Fine-tuned ESM-2 · 9,752 Human Proteins</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight font-display leading-[1.05]">
                  <span className="text-white">Protein</span>
                  <br />
                  <span className="gradient-text">Mutation</span>
                  <br />
                  <span className="text-white">Analyzer</span>
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                  Predict 3D structure, assess pathogenicity via LLR scoring, and benchmark model performance — powered by a fine-tuned ESM-2 transformer.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <FeaturePill icon={<Atom size={12} />} label="ESMFold Structure" color="#60a5fa" />
                <FeaturePill icon={<Activity size={12} />} label="pLDDT Confidence" color="#34d399" />
                <FeaturePill icon={<Database size={12} />} label="ClinVar Integration" color="#a78bfa" />
                <FeaturePill icon={<Cpu size={12} />} label="LLR Pathogenicity" color="#f472b6" />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white font-mono">9,752</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider">Training Proteins</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white font-mono">1.42</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider">Final Loss</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white font-mono">8M</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider">Parameters</div>
                </div>
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
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>

      {/* ─── FORM SECTION ─── */}
      <section className="max-w-4xl mx-auto px-6 pb-16 space-y-6">
        {/* Main Card */}
        <div className="glass rounded-3xl overflow-hidden animate-fade-in-up stagger-2">
          {/* Card top accent */}
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <div className="p-8 md:p-10 space-y-8">

            {/* Sequence Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-blue-300 flex items-center space-x-2">
                  <Dna size={15} />
                  <span>Amino Acid Sequence</span>
                </label>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-mono ${sequence.length > 400 ? 'text-red-400' : 'text-gray-600'}`}>
                    {sequence.length}<span className="text-gray-700">/400</span>
                  </span>
                  {isValid && <div className="pulse-dot" />}
                </div>
              </div>
              <textarea
                className="input-glass w-full h-36 rounded-2xl p-5 text-sm leading-relaxed resize-none"
                value={sequence}
                onChange={(e) => setSequence(e.target.value.toUpperCase())}
                placeholder="Paste your amino acid sequence here (e.g. MALWMRLL...)"
              />
              {invalidChars.length > 0 && (
                <p className="text-red-400 text-xs flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full inline-block" />
                  <span>Invalid characters: <strong className="font-mono">{invalidChars.join(', ')}</strong></span>
                </p>
              )}
            </div>

            {/* Mutation & Gene */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-violet-300 uppercase tracking-wider flex items-center space-x-2">
                  <FlaskConical size={12} />
                  <span>Mutation <span className="text-gray-600 normal-case">(optional)</span></span>
                </label>
                <input
                  type="text"
                  className="input-glass w-full rounded-xl p-3.5 text-sm"
                  value={mutation}
                  onChange={(e) => setMutation(e.target.value.toUpperCase())}
                  placeholder="e.g. A23K"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
                  Gene Name <span className="text-gray-600 normal-case">(optional)</span>
                </label>
                <input
                  type="text"
                  className="input-glass w-full rounded-xl p-3.5 text-sm font-sans"
                  value={geneName}
                  onChange={(e) => setGeneName(e.target.value)}
                  placeholder="e.g. INS, TP53, BRCA1"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                />
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center space-x-2.5 text-[10px] text-gray-500 bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-xl">
              <Lock size={12} className="text-emerald-500/70 flex-shrink-0" />
              <span>Your data is processed locally and via secure HTTPS connections to ESMFold and NCBI. Nothing is stored.</span>
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Quick Examples</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROTEINS.map(p => (
                  <button
                    key={p.name}
                    onClick={() => { setSequence(p.sequence); setMutation(p.mutation); setGeneName(p.gene); }}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 border border-white/[0.06] bg-white/[0.02] hover:bg-blue-500/10 hover:text-blue-300 hover:border-blue-500/25 transition-all duration-300"
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
              className="btn-primary w-full py-4 rounded-2xl font-bold text-base text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>{loadingMsg}</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={20} className="text-blue-200" />
                  <span>Analyze Protein</span>
                  <ChevronRight size={18} className="text-blue-300" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading Progress */}
        {loading && (
          <div className="glass rounded-2xl p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                <p className="text-sm text-gray-300 font-medium">{loadingMsg}</p>
              </div>
              <span className="text-xs text-gray-600 font-mono">{loadingIdx + 1}/{LOADING_MESSAGES.length}</span>
            </div>
            <div className="w-full bg-gray-900/60 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full progress-bar rounded-full transition-all duration-1000"
                style={{ width: `${((loadingIdx + 1) / LOADING_MESSAGES.length) * 100}%` }}
              />
            </div>
            <div className="flex gap-1.5">
              {LOADING_MESSAGES.map((_, i) => (
                <div key={i} className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${i <= loadingIdx ? 'bg-blue-500' : 'bg-gray-800'}`} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SequenceInput;
