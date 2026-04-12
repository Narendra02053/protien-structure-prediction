import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, Expand } from 'lucide-react';

const STYLES = ['cartoon', 'stick', 'sphere', 'surface'];
const COLORS = ['spectrum', 'chain', 'white'];

const StructureViewer = ({ pdbString, mutationPos }) => {
    const viewerRef = useRef(null);
    const [viewer, setViewer] = useState(null);
    const [style, setStyle] = useState('cartoon');
    const [color, setColor] = useState('spectrum');
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (!pdbString || !viewerRef.current) return;
        const config = { backgroundColor: 'rgba(0,0,0,0)' };
        const v = window.$3Dmol.createViewer(viewerRef.current, config);
        v.addModel(pdbString, "pdb");
        v.setStyle({}, { cartoon: { color: 'spectrum' } });
        if (mutationPos) {
            v.addStyle({ resi: mutationPos }, { stick: { color: 'red', radius: 0.5 } });
            v.addLabel(`Mut ${mutationPos}`, { backgroundColor: 'rgba(239,68,68,0.7)', fontSize: 10, position: { resi: mutationPos } });
        }
        v.zoomTo();
        v.render();
        v.spin('y', 0.5);
        setViewer(v);
        return () => { if (v) v.clear(); };
    }, [pdbString, mutationPos]);

    const changeStyle = (s) => {
        if (!viewer) return;
        setStyle(s);
        viewer.setStyle({}, { [s]: { color } });
        if (mutationPos) viewer.addStyle({ resi: mutationPos }, { stick: { color: 'red', radius: 0.5 } });
        viewer.render();
    };

    const changeColor = (c) => {
        if (!viewer) return;
        setColor(c);
        viewer.setStyle({}, { [style]: { color: c } });
        if (mutationPos) viewer.addStyle({ resi: mutationPos }, { stick: { color: 'red', radius: 0.5 } });
        viewer.render();
    };

    const takeScreenshot = () => {
        if (!viewer) return;
        const img = viewer.pngURI();
        const link = document.createElement('a');
        link.href = img;
        link.download = 'protein_structure.png';
        link.click();
    };

    const toggleFullscreen = () => {
        const el = viewerRef.current?.parentElement;
        if (!el) return;
        if (!document.fullscreenElement) {
            el.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div className="glass rounded-3xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none z-0" />
            <div ref={viewerRef} className="w-full h-[520px] relative z-10" style={{ background: 'radial-gradient(ellipse at center, rgba(15,23,42,0.8) 0%, rgba(3,7,17,0.95) 100%)' }} />

            {/* Toolbar Top-Right */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={takeScreenshot} title="Screenshot" className="p-2.5 glass rounded-xl hover:bg-white/10 transition-colors">
                    <Camera size={16} className="text-gray-400" />
                </button>
                <button onClick={() => { viewer?.spin(false); viewer?.zoomTo(); viewer?.render(); }} title="Reset" className="p-2.5 glass rounded-xl hover:bg-white/10 transition-colors">
                    <RefreshCw size={16} className="text-gray-400" />
                </button>
                <button onClick={toggleFullscreen} title="Fullscreen" className="p-2.5 glass rounded-xl hover:bg-white/10 transition-colors">
                    <Expand size={16} className="text-gray-400" />
                </button>
            </div>

            {/* Style/Color Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-20">
                <div className="flex gap-1 p-1 glass rounded-xl">
                    {STYLES.map(s => (
                        <button
                            key={s}
                            onClick={() => changeStyle(s)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                                style === s
                                    ? 'bg-blue-500/20 text-blue-300 shadow-inner'
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <div className="flex gap-1 p-1 glass rounded-xl">
                    {COLORS.map(c => (
                        <button
                            key={c}
                            onClick={() => changeColor(c)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                                color === c
                                    ? 'bg-purple-500/20 text-purple-300 shadow-inner'
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StructureViewer;
