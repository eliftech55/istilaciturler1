import React from 'react';
import { LevelConfig } from '../types/game';
import { Shield, Target, Zap, AlertTriangle, ArrowRight, Info, Compass } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface LevelBriefingModalProps {
  level: LevelConfig;
  onStartLevel: () => void;
}

export const LevelBriefingModal: React.FC<LevelBriefingModalProps> = ({ level, onStartLevel }) => {
  const { species } = level;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="text-center space-y-1 pb-3 border-b border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-[11px] font-semibold">
            <Compass size={14} className="text-cyan-400" />
            <span>{level.name}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {species.commonName} Avı
          </h2>
          <p className="text-xs text-cyan-400/90 font-mono italic">
            {species.scientificName}
          </p>
        </div>

        {/* Canlı Kartı ve Özellikleri */}
        <div className="py-4 space-y-3.5 text-xs">
          
          {/* Görsel ve Kısa Tanım */}
          <div className="flex items-center gap-3.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div 
              style={{ backgroundColor: `${species.color}20`, borderColor: species.color }}
              className="w-16 h-16 rounded-xl border-2 flex items-center justify-center text-2xl shrink-0 shadow-inner"
            >
              {species.id === 'rapana' && '🐚'}
              {species.id === 'mnemiopsis' && '🪼'}
              {species.id === 'mya' && '🦪'}
              {species.id === 'anadara' && '🐚'}
              {species.id === 'liza' && '🐟'}
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-200 block text-xs">
                {species.commonName} Nedir?
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {species.description}
              </p>
            </div>
          </div>

          {/* Seviye İstatistikleri (4'lü Panel) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block">Hedef Sayı</span>
              <span className="text-sm font-extrabold text-amber-400">🎯 {level.targetCount} Adet</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block">Yakalama Eşiği</span>
              <span className="text-sm font-extrabold text-cyan-400">⚡ {species.captureThreshold} Güç</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block">Güç Sınırı</span>
              <span className="text-sm font-extrabold text-sky-400">🔋 {species.powerLimit} Güç</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block">Temas Hasarı</span>
              <span className="text-sm font-extrabold text-rose-400">💥 -{species.contactDamage} Güç</span>
            </div>
          </div>

          {/* Ekolojik Tehdit & Köken Bilgisi */}
          <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
              <AlertTriangle size={15} />
              <span>Karadeniz'e Zararı ve Kökeni:</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              <b>Kökeni:</b> {species.origin}<br />
              <b>Tehdit:</b> {species.ecologicalImpact}
            </p>
          </div>

          {/* ZETA Saha Taktik İpucu */}
          <div className="bg-cyan-950/30 border border-cyan-800/40 rounded-xl p-3 flex items-start gap-2 text-cyan-200 text-[11px]">
            <Info size={16} className="text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <b>Taktik:</b> En az <b>{species.captureThreshold} Güç</b> toplayana kadar canlıdan uzak dur. Yeterli güce ulaştığında arkasından yaklaşıp uzaktan ağını fırlat!
            </span>
          </div>

        </div>

        {/* Göreve Başla Butonu */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              soundEffects.playClick();
              onStartLevel();
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-extrabold text-white text-sm shadow-xl shadow-cyan-600/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>SEVİYEYE BAŞLA</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};
