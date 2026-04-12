import React, { useState } from 'react';
import { useProtein } from '../context/ProteinContext';
import { predictStructure } from '../api/predict';
import { useNavigate } from 'react-router-dom';
import { Loader2, Zap, Dna, FlaskConical, Sparkles } from 'lucide-react';

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
    'Almost done...'
];

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
                const pos = parseInt(mutation.match(/\d+/)?.[0]);
                const plddt_obj = structure.plddt_scores.find(s => s.position === pos);
                analysis.plddt_at_position = plddt_obj ? plddt_obj.score : null;
            }

            let comparison = null;
            try {
                const { compareModels } = await import('../api/compare');
                comparison = await compareModels(sequence);
            } catch (e) { /* comparison is optional */ }

            updateProteinData({ sequence, mutation, geneName, structure, analysis, comparison });
            onToast('Analysis Complete!', 'success');
            navigate('/results');
        } catch (err) {
            onToast(err.response?.data?.detail || err.message || 'Prediction failed', 'error');
        } finally {
            clearInterval(msgInterval);
            setLoading(false);
        }
    };

    const validateSequence = (seq) => {
        const invalidChars = seq.toUpperCase().match(/[^ACDEFGHIKLMNPQRSTVWY]/g);
        return invalidChars ? Array.from(new Set(invalidChars)) : [];
    };

    const invalidChars = validateSequence(sequence);

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 relative z-10">
            {/* Hero */}
            <header className="text-center space-y-5 animate-fade-in-up">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold tracking-wider uppercase">
                    <Sparkles size={14} />
                    <span>Fine-tuned ESM-2 — 9,752 Human Proteins</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight gradient-text leading-tight">
                    Protein Mutation<br />Analyzer
                </h1>
                <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
                    Predict 3D structure, assess pathogenicity, and benchmark model performance — all from a single amino acid sequence.
                </p>
            </header>

            {/* Main Glass Card */}
            <div className="glass rounded-3xl p-8 md:p-10 space-y-8 animate-fade-in-up stagger-2">
                <div className="space-y-8">
                    {/* Sequence Input */}
                    <div className="space-y-3 relative z-20">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-semibold text-blue-300 flex items-center space-x-2">
                                <Dna size={14} />
                                <span>Amino Acid Sequence</span>
                            </label>
                            <div className="flex items-center space-x-2">
                                <span className={`text-xs font-mono ${sequence.length > 400 ? 'text-red-400' : 'text-gray-600'}`}>
                                    {sequence.length}<span className="text-gray-700">/400</span>
                                </span>
                                {sequence.length > 0 && sequence.length <= 400 && invalidChars.length === 0 && (
                                    <div className="pulse-dot" />
                                )}
                            </div>
                        </div>
                        <textarea
                            className="input-glass w-full h-36 rounded-2xl p-5 font-mono text-sm leading-relaxed resize-none focus:ring-2 focus:ring-blue-500/20"
                            value={sequence}
                            onChange={(e) => setSequence(e.target.value.toUpperCase())}
                            placeholder="Paste your amino acid sequence here (e.g. MALWMRLL...)"
                        />
                        {invalidChars.length > 0 && (
                            <p className="text-red-400 text-xs flex items-center space-x-1">
                                <span className="inline-block w-1.5 h-1.5 bg-red-400 rounded-full" />
                                <span>Invalid characters: <strong>{invalidChars.join(', ')}</strong></span>
                            </p>
                        )}
                    </div>

                    {/* Mutation & Gene */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-20">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center space-x-2">
                                <FlaskConical size={12} />
                                <span>Mutation</span>
                            </label>
                            <input
                                type="text"
                                className="input-glass w-full rounded-xl p-3.5 font-mono text-sm focus:ring-2 focus:ring-purple-500/20"
                                value={mutation}
                                onChange={(e) => setMutation(e.target.value.toUpperCase())}
                                placeholder="e.g. A23K"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Gene Name</label>
                            <input
                                type="text"
                                className="input-glass w-full rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-purple-500/20"
                                value={geneName}
                                onChange={(e) => setGeneName(e.target.value)}
                                placeholder="e.g. INS, TP53, BRCA1"
                            />
                        </div>
                    </div>

                    {/* Examples */}
                    <div className="space-y-3">
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Quick Examples</p>
                        <div className="flex flex-wrap gap-2">
                            {EXAMPLE_PROTEINS.map(p => (
                                <button
                                    key={p.name}
                                    onClick={() => { setSequence(p.sequence); setMutation(p.mutation); setGeneName(p.gene); }}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:text-white hover:border-blue-500/20 transition-all duration-300"
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        disabled={loading || sequence.length === 0 || sequence.length > 400 || invalidChars.length > 0}
                        onClick={handlePredict}
                        className="btn-primary w-full py-4 rounded-2xl font-bold text-lg text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center space-x-3"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={22} />
                                <span className="text-base">{loadingMsg}</span>
                            </>
                        ) : (
                            <>
                                <Zap size={22} />
                                <span>Predict & Analyze</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="glass rounded-2xl p-6 space-y-4 animate-fade-in">
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                        <p className="text-sm text-gray-400">{loadingMsg}</p>
                    </div>
                    <div className="w-full bg-gray-800/50 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                            style={{ width: `${((loadingIdx + 1) / LOADING_MESSAGES.length) * 100}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SequenceInput;
