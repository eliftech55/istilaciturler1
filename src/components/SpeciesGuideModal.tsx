import React, { useState } from 'react';
import { INVASIVE_SPECIES } from '../data/gameData';
import { BookOpen, X, Globe, AlertTriangle, Zap, ShieldAlert } from 'lucide-react';

interface SpeciesGuideModalProps {
  onClose: () => void;
}

export const SpeciesGuideModal: React.FC<SpeciesGuideModalProps> = ({ onClose }) => {
  const speciesList = Object.values(INVASIVE_SPECIES);
  const [selectedId, setSelectedId] = useState(speciesList[0].id);

  const selectedSpecies = INVASIVE_SPECIES[selectedId] || speciesList[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">İstilacı Türler Rehberi</h2>
              <p className="text-xs text-slate-400">Karadeniz Biyoçeşitlilik Bilgi Bankası</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X size={18} />
          </button>
        </div>

        {/* Species Selector Tabs */}
        <div className="flex gap-1.5 overflow-x-auto py-3 border-b border-slate-800 no-scrollbar">
          {speciesList.map((sp) => (
            <button
              key={sp.id}
              onClick={() => setSelectedId(sp.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                sp.id === selectedId
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sp.commonName}
            </button>
          ))}
        </div>

        {/* Species Detail Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
          <div className="flex flex-col sm:flex-row gap-4 items-start bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {/* Visual Icon / Avatar */}
            <div className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center p-2 shrink-0 self-center sm:self-start">
              {selectedSpecies.id === 'rapana' ? (
                <img
                  src="/src/assets/images/rapana_venosa_snail_1793561925354.jpg"
                  alt="Rapana venosa"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div 
                  style={{ backgroundColor: selectedSpecies.color }}
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-slate-900 text-lg shadow-inner"
                >
                  ⚡
                </div>
              )}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-base font-extrabold text-white">
                  {selectedSpecies.commonName}
                </h3>
                <span className="font-mono text-cyan-300 italic text-[11px]">
                  {selectedSpecies.scientificName}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedSpecies.description}
              </p>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Başlangıç Gücü</span>
              <span className="text-sm font-bold text-amber-400">⚡ {selectedSpecies.startingPower}</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Yakalama Eşiği</span>
              <span className="text-sm font-bold text-cyan-400">🎯 {selectedSpecies.captureThreshold}</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Güç Sınırı</span>
              <span className="text-sm font-bold text-sky-400">🔋 {selectedSpecies.powerLimit}</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Temas Hasarı</span>
              <span className="text-sm font-bold text-rose-400">💥 -{selectedSpecies.contactDamage}</span>
            </div>
          </div>

          {/* Origin & Ballast info */}
          <div className="space-y-2">
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 flex gap-2.5">
              <Globe size={18} className="text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200 block mb-0.5">Kökeni ve Geliş Yolu:</span>
                <span className="text-slate-300 leading-relaxed">{selectedSpecies.origin}</span>
              </div>
            </div>

            <div className="bg-rose-950/20 p-3 rounded-xl border border-rose-900/40 flex gap-2.5">
              <AlertTriangle size={18} className="text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-300 block mb-0.5">Karadeniz Ekosistemine Zararı:</span>
                <span className="text-rose-200/90 leading-relaxed">{selectedSpecies.ecologicalImpact}</span>
              </div>
            </div>
          </div>

          {/* Educational Note */}
          <div className="bg-cyan-950/20 p-3 rounded-xl border border-cyan-800/40 text-[11px] text-cyan-200/90 flex items-center gap-2">
            <ShieldAlert size={16} className="text-cyan-400 shrink-0" />
            <span>
              Tüm bu türler balast suyu arıtma sistemleri ve deniz koruma kuralları ile kontrol altına alınabilir.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
          >
            Kapat ve Oyuna Dön
          </button>
        </div>

      </div>
    </div>
  );
};
