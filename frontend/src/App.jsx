import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ProteinProvider, useProtein } from './context/ProteinContext';
import SequenceInput from './components/SequenceInput';
import StructureViewer from './components/StructureViewer';
import PLDDTChart from './components/PLDDTChart';
import MutationCard from './components/MutationCard';
import PerplexityComparison from './components/PerplexityComparison';
import ProteinStats from './components/ProteinStats';
import AboutPage from './components/AboutPage';
import Toast from './components/Toast';
import { Microscope, ChevronLeft, Dna, BarChart3, BookOpen, Atom, Zap } from 'lucide-react';

/* ─── SVG Molecular Shapes ─── */
const VirusShape = ({ size = 20, color = '#7C9EFF' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="9" fill="none" stroke={color} strokeWidth="0.8" />
    {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
      const rad = (deg * Math.PI) / 180;
      return <g key={deg}>
        <line x1={20+Math.cos(rad)*9} y1={20+Math.sin(rad)*9} x2={20+Math.cos(rad)*17} y2={20+Math.sin(rad)*17} stroke={color} strokeWidth="0.7" />
        <circle cx={20+Math.cos(rad)*17} cy={20+Math.sin(rad)*17} r="1.5" fill={color} opacity="0.5" />
      </g>;
    })}
  </svg>
);
const HexShape = ({ size = 22, color = '#C9A0FF' }) => (
  <svg width={size} height={size} viewBox="0 0 30 30">
    <polygon points="15,2 27,9 27,21 15,28 3,21 3,9" fill="none" stroke={color} strokeWidth="0.8" />
    <polygon points="15,7 22,11 22,19 15,23 8,19 8,11" fill="none" stroke={color} strokeWidth="0.4" opacity="0.5" />
  </svg>
);
const DNAShape = ({ size = 28, color = '#4ECDC4' }) => (
  <svg width={size} height={size * 2} viewBox="0 0 30 60">
    <path d="M 5,0 Q 25,15 5,30 Q -15,45 5,60" fill="none" stroke={color} strokeWidth="1" />
    <path d="M 25,0 Q 5,15 25,30 Q 45,45 25,60" fill="none" stroke={color} strokeWidth="1" />
    {[8,18,28,38,48].map(y => <line key={y} x1="9" y1={y} x2="21" y2={y} stroke={color} strokeWidth="0.5" opacity="0.4" />)}
  </svg>
);
const MolShape = ({ size = 22, color = '#FF6B9D' }) => (
  <svg width={size} height={size} viewBox="0 0 30 30">
    <circle cx="15" cy="7" r="3" fill="none" stroke={color} strokeWidth="0.8" />
    <circle cx="7" cy="22" r="3" fill="none" stroke={color} strokeWidth="0.8" />
    <circle cx="23" cy="22" r="3" fill="none" stroke={color} strokeWidth="0.8" />
    <line x1="15" y1="10" x2="9" y2="19" stroke={color} strokeWidth="0.6" />
    <line x1="15" y1="10" x2="21" y2="19" stroke={color} strokeWidth="0.6" />
    <line x1="10" y1="22" x2="20" y2="22" stroke={color} strokeWidth="0.6" />
  </svg>
);
const RibbonShape = ({ size = 35, color = '#7CFF6B' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path d="M 5,35 C 10,20 15,25 20,10 C 25,-5 30,15 35,5" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    {[{x:10,y:27},{x:20,y:10},{x:30,y:12}].map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="2" fill={color} opacity="0.5" />)}
  </svg>
);

const SHAPES = [VirusShape, HexShape, DNAShape, MolShape, RibbonShape];
const SHAPE_COLORS = ['#FFE600','#7C9EFF','#7CFF6B','#FF6B9D','#FF9F43','#C9A0FF','#4ECDC4','#FF6B6B'];

/* ─── Animated Background ─── */
const AnimatedBackground = () => {
  const floaters = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => {
      const ShapeComponent = SHAPES[i % SHAPES.length];
      const color = SHAPE_COLORS[i % SHAPE_COLORS.length];
      const size = 12 + Math.random() * 20;
      return {
        id: i, ShapeComponent, color, size,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: 0.1 + Math.random() * 0.15,
        duration: 28 + Math.random() * 30,
        delay: -Math.random() * 25,
        rotateDur: 25 + Math.random() * 45,
        floatType: i % 4,
      };
    }), []);

  const particles = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${-Math.random() * 18}s`,
      duration: `${12 + Math.random() * 10}s`,
      size: `${1 + Math.random() * 1.5}px`,
      opacity: 0.3 + Math.random() * 0.4,
      color: SHAPE_COLORS[i % SHAPE_COLORS.length],
    })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="bg-scene" />
      <div className="grid-pattern" />

      {/* Brutal accent blocks */}
      <div className="neo-shape w-32 h-32 top-8 right-[8%]" style={{ background: 'rgba(255,230,0,0.08)' }} />
      <div className="neo-shape w-20 h-20 bottom-[15%] left-[5%] rounded-full" style={{ background: 'rgba(124,158,255,0.08)' }} />
      <div className="neo-shape w-16 h-40 top-[40%] right-[3%]" style={{ background: 'rgba(124,255,107,0.08)' }} />
      <div className="neo-shape w-24 h-24 bottom-[8%] right-[20%]" style={{ background: 'rgba(255,107,157,0.08)', transform: 'rotate(12deg)' }} />

      {floaters.map(f => (
        <div key={f.id} className="absolute" style={{
          left: f.left, top: f.top, opacity: f.opacity,
          animation: `floatDrift${f.floatType} ${f.duration}s ease-in-out ${f.delay}s infinite`,
          willChange: 'transform'
        }}>
          <div style={{ animation: `spin ${f.rotateDur}s linear infinite`, willChange: 'transform' }}>
            <f.ShapeComponent size={f.size} color={f.color} />
          </div>
        </div>
      ))}

      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          left: p.left,
          animationDelay: p.delay,
          animationDuration: p.duration,
          width: p.size, height: p.size,
          opacity: p.opacity,
          background: p.color,
        }} />
      ))}

      {/* Large decorative shapes */}
      <div className="absolute -left-48 -top-24 opacity-[0.03]" style={{ animation: 'spin 150s linear infinite' }}>
        <DNAShape size={700} color="#ffffff" />
      </div>
      <div className="absolute -right-40 top-[20vh] opacity-[0.02]" style={{ animation: 'spin 120s linear infinite reverse' }}>
        <VirusShape size={600} color="#ffffff" />
      </div>
    </div>
  );
};

/* ─── Navigation ─── */
const Navigation = () => {
  const location = useLocation();
  const navLinks = [
    { path: '/', label: 'Analyze', icon: <Zap size={14} /> },
    { path: '/results', label: 'Dashboard', icon: <BarChart3 size={14} /> },
    { path: '/about', label: 'About', icon: <BookOpen size={14} /> },
  ];

  return (
    <nav className="relative z-20 border-b-3 border-white bg-[#141414] shadow-neo-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="neo-icon-box w-10 h-10 bg-accent-yellow group-hover:bg-accent-cyan transition-colors">
            <Atom className="text-[#0a0a0a]" size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight font-display text-white">
              Prot<span className="bg-accent-yellow px-1 text-[#0a0a0a]">Path</span>
            </div>
            <div className="text-[8px] text-white/50 uppercase tracking-[0.25em] font-bold">Mutation Pipeline</div>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center p-1 border-3 border-white bg-[#0a0a0a] shadow-neo-sm">
          {navLinks.map(({ path, label, icon }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} className={`neo-nav-pill ${active ? 'active' : ''}`}>
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Status badge */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 badge-success">
          <div className="pulse-dot" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">API Online</span>
        </div>
      </div>
    </nav>
  );
};

/* ─── Results Dashboard ─── */
const ResultsDashboard = () => {
  const { proteinData } = useProtein();
  const match = proteinData.mutation?.match(/\d+/);
  const mutationPos = match ? parseInt(match[0]) : null;

  if (!proteinData.structure) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] relative z-10 px-6">
        <div className="glass p-14 text-center space-y-6 max-w-md w-full animate-scale-in">
          <div className="neo-icon-box w-20 h-20 mx-auto bg-accent-blue">
            <Dna className="text-[#0a0a0a]" size={36} strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white font-display">No Analysis Yet</h2>
            <p className="text-white/60 text-sm leading-relaxed font-medium">Enter a protein sequence on the Analyze page to generate structural and mutational insights.</p>
          </div>
          <Link to="/" className="inline-flex items-center space-x-2 px-8 py-3.5 btn-primary font-extrabold text-sm">
            <Zap size={16} />
            <span>Start Analysis</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 relative z-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
        <div>
          <Link to="/" className="inline-flex items-center text-xs text-white/50 hover:text-white mb-3 transition-colors group font-bold">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform mr-1" strokeWidth={2.5} />
            Back to Analysis
          </Link>
          <h1 className="text-3xl font-extrabold text-white font-display">Analysis Dashboard</h1>
          <p className="text-white/50 text-sm mt-1 font-medium">Structural & Mutational Insights</p>
        </div>
        <div className="flex gap-3">
          {[
            { label: 'Length', value: proteinData.structure.sequence_length, bg: 'bg-accent-blue' },
            { label: 'Mean pLDDT', value: proteinData.structure.mean_plddt, bg: 'bg-accent-emerald' },
          ].map(s => (
            <div key={s.label} className={`stat-pill px-5 py-3 ${s.bg}`}>
              <p className="text-[9px] text-[#0a0a0a] uppercase font-extrabold tracking-widest">{s.label}</p>
              <p className="text-lg font-extrabold font-mono text-[#0a0a0a]">{s.value}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="section-divider" />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          <div className="animate-fade-in-up stagger-1">
            <StructureViewer pdbString={proteinData.structure.pdb_string} mutationPos={mutationPos} />
          </div>
          <div className="animate-fade-in-up stagger-2">
            <ProteinStats sequence={proteinData.sequence} plddt_scores={proteinData.structure.plddt_scores} />
          </div>
          <div className="animate-fade-in-up stagger-3">
            <PerplexityComparison currentComparison={proteinData.comparison} />
          </div>
        </div>
        <div className="xl:col-span-4 space-y-8">
          <div className="animate-slide-right stagger-1">
            <MutationCard analysis={proteinData.analysis} geneName={proteinData.geneName} plddtAtPos={proteinData.analysis?.plddt_at_position} />
          </div>
          <div className="animate-slide-right stagger-2">
            <PLDDTChart data={proteinData.structure.plddt_scores} mutationPos={mutationPos} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Root App ─── */
const App = () => {
  const [toast, setToast] = useState(null);
  const showToast = (message, type) => setToast({ message, type });

  return (
    <ProteinProvider>
      <Router>
        <div className="min-h-screen relative bg-[#0a0a0a]">
          <AnimatedBackground />
          <div className="relative z-10">
            <Navigation />
            <main className="pb-24">
              <Routes>
                <Route path="/" element={<SequenceInput onToast={showToast} />} />
                <Route path="/results" element={<ResultsDashboard />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>
          </div>
          {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
      </Router>
    </ProteinProvider>
  );
};

export default App;
