import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Expand, Pause, Play, Layers } from 'lucide-react';

const STYLES = ['cartoon', 'stick', 'sphere', 'surface'];
const COLORS = ['spectrum', 'chain', 'white'];

const StructureViewer = ({ pdbString, mutationPos }) => {
  const viewerRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [style, setStyle] = useState('cartoon');
  const [color, setColor] = useState('spectrum');
  const [spinning, setSpinning] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!pdbString || !viewerRef.current) return;
    const v = window.$3Dmol.createViewer(viewerRef.current, { backgroundColor: '#0a0a0a' });
    v.addModel(pdbString, 'pdb');
    v.setStyle({}, { cartoon: { color: 'spectrum' } });
    if (mutationPos) {
      v.addStyle({ resi: mutationPos }, { stick: { color: '#ff6b6b', radius: 0.5 } });
      v.addLabel(`Mut ${mutationPos}`, {
        backgroundColor: 'rgba(255,107,107,0.85)',
        fontColor: 'white',
        fontSize: 11,
        position: { resi: mutationPos }
      });
    }
    v.zoomTo();
    v.render();
    v.spin('y', 0.5);
    setViewer(v);
    return () => { if (v) v.clear(); };
  }, [pdbString, mutationPos]);

  const applyStyle = (s, c) => {
    if (!viewer) return;
    viewer.setStyle({}, { [s]: { color: c } });
    if (mutationPos) viewer.addStyle({ resi: mutationPos }, { stick: { color: '#ff6b6b', radius: 0.5 } });
    viewer.render();
  };

  const changeStyle = (s) => { setStyle(s); applyStyle(s, color); };
  const changeColor = (c) => { setColor(c); applyStyle(style, c); };

  const toggleSpin = () => {
    if (!viewer) return;
    if (spinning) { viewer.spin(false); } else { viewer.spin('y', 0.5); }
    setSpinning(!spinning);
  };

  const takeScreenshot = () => {
    if (!viewer) return;
    const link = document.createElement('a');
    link.href = viewer.pngURI();
    link.download = 'protein_structure.png';
    link.click();
  };

  const toggleFullscreen = () => {
    const el = viewerRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) { el.requestFullscreen(); setIsFullscreen(true); }
    else { document.exitFullscreen(); setIsFullscreen(false); }
  };

  return (
    <div className="glass overflow-hidden relative group">
      <div className="h-3 bg-accent-blue border-b-3 border-white" />

      <div className="flex items-center justify-between px-5 py-3 border-b-3 border-white bg-accent-cyan/10">
        <div className="flex items-center space-x-2">
          <Layers size={14} className="text-white" strokeWidth={2.5} />
          <span className="text-xs font-extrabold text-white font-display">3D Structure</span>
          {mutationPos && (
            <span className="px-2 py-0.5 bg-accent-red border-3 border-white text-[9px] text-[#0a0a0a] font-extrabold shadow-neo-sm">
              Mut @ {mutationPos}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={toggleSpin} title={spinning ? 'Pause' : 'Spin'} className="neo-btn-icon">
            {spinning ? <Pause size={13} strokeWidth={2.5} /> : <Play size={13} strokeWidth={2.5} />}
          </button>
          <button onClick={takeScreenshot} title="Screenshot" className="neo-btn-icon">
            <Camera size={13} strokeWidth={2.5} />
          </button>
          <button onClick={() => { viewer?.spin(false); viewer?.zoomTo(); viewer?.render(); setSpinning(false); }} title="Reset" className="neo-btn-icon">
            <RefreshCw size={13} strokeWidth={2.5} />
          </button>
          <button onClick={toggleFullscreen} title="Fullscreen" className="neo-btn-icon">
            <Expand size={13} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div
        ref={viewerRef}
        className="w-full border-b-3 border-white"
        style={{
          height: '480px',
          background: '#0a0a0a'
        }}
      />

      <div className="flex items-center justify-between px-5 py-3 border-t-0">
        <div className="flex gap-1 p-1 border-3 border-white bg-[#0a0a0a] shadow-neo-sm">
          {STYLES.map(s => (
            <button key={s} onClick={() => changeStyle(s)}
              className={`px-3 py-1.5 text-[11px] font-extrabold capitalize transition-all border-2 ${
                style === s ? 'bg-accent-yellow border-white text-[#0a0a0a] shadow-neo-sm' : 'border-transparent text-white/50 hover:bg-accent-cyan hover:text-[#0a0a0a]'
              }`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1 p-1 border-3 border-white bg-[#0a0a0a] shadow-neo-sm">
          {COLORS.map(c => (
            <button key={c} onClick={() => changeColor(c)}
              className={`px-3 py-1.5 text-[11px] font-extrabold capitalize transition-all border-2 ${
                color === c ? 'bg-accent-violet border-white text-[#0a0a0a] shadow-neo-sm' : 'border-transparent text-white/50 hover:bg-accent-pink hover:text-[#0a0a0a]'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StructureViewer;
