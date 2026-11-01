import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Crosshair, Sparkles, Pause, Play, ChevronUp, ChevronDown } from 'lucide-react';

interface VirtualControlsProps {
  onVectorChange: (vec: { x: number; y: number }) => void;
  onFireNet: () => void;
  onCollect: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
  netCooldownSec: number;
  netMaxCooldownSec: number;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onVectorChange,
  onFireNet,
  onCollect,
  onTogglePause,
  isPaused,
  netCooldownSec,
  netMaxCooldownSec,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement | null>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  const maxRadius = 46; // Max joystick radius in px

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsDragging(true);

    if (joystickBaseRef.current) {
      const rect = joystickBaseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let dx = touch.clientX - centerX;
      let dy = touch.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist > maxRadius) {
        dx = (dx / dist) * maxRadius;
        dy = (dy / dist) * maxRadius;
      }

      setKnobPos({ x: dx, y: dy });
      onVectorChange({ x: dx / maxRadius, y: dy / maxRadius });
    }
  }, [maxRadius, onVectorChange]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || touchIdRef.current === null) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current && joystickBaseRef.current) {
        const rect = joystickBaseRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = touch.clientX - centerX;
        let dy = touch.clientY - centerY;
        const dist = Math.hypot(dx, dy);

        if (dist > maxRadius) {
          dx = (dx / dist) * maxRadius;
          dy = (dy / dist) * maxRadius;
        }

        setKnobPos({ x: dx, y: dy });
        onVectorChange({ x: dx / maxRadius, y: dy / maxRadius });
        break;
      }
    }
  }, [isDragging, maxRadius, onVectorChange]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setIsDragging(false);
        setKnobPos({ x: 0, y: 0 });
        onVectorChange({ x: 0, y: 0 });
        break;
      }
    }
  }, [onVectorChange]);

  // Support discrete vertical micro-buttons if user prefers
  const handleVerticalPress = (yVal: number) => {
    onVectorChange({ x: knobPos.x / maxRadius, y: yVal });
  };

  const handleVerticalRelease = () => {
    onVectorChange({ x: knobPos.x / maxRadius, y: 0 });
  };

  const isNetReady = netCooldownSec <= 0.05;
  const cooldownPercent = Math.min(100, Math.max(0, (netCooldownSec / netMaxCooldownSec) * 100));

  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none z-30 p-3 pb-6 flex items-end justify-between select-none">
      {/* Sol Taraf: Sanal Joystick + Yön Desteği */}
      <div className="pointer-events-auto flex items-center gap-3">
        {/* Analog Touch Joystick */}
        <div
          ref={joystickBaseRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="relative w-32 h-32 rounded-full bg-slate-900/70 border-2 border-cyan-500/30 backdrop-blur-sm shadow-xl flex items-center justify-center touch-none active:border-cyan-400"
        >
          {/* Compass Rings */}
          <div className="absolute inset-2 rounded-full border border-cyan-500/10 pointer-events-none" />
          <div className="absolute inset-6 rounded-full border border-cyan-500/15 pointer-events-none" />

          {/* Movable Knob */}
          <div
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-b from-cyan-400 to-sky-600 shadow-lg border-2 border-white/80 flex items-center justify-center pointer-events-none"
          >
            <div className="w-4 h-4 rounded-full bg-white/70" />
          </div>

          <span className="absolute -bottom-5 text-[10px] font-medium tracking-wide text-cyan-300/80">
            YÖNLENDİR
          </span>
        </div>

        {/* Hızlı Yukarı/Aşağı Butonları (Tek el mobil ergonomisi) */}
        <div className="hidden sm:flex flex-col gap-2">
          <button
            onTouchStart={() => handleVerticalPress(-1)}
            onTouchEnd={handleVerticalRelease}
            onMouseDown={() => handleVerticalPress(-1)}
            onMouseUp={handleVerticalRelease}
            aria-label="Yukarı Yüz"
            className="w-11 h-11 rounded-xl bg-slate-900/80 border border-slate-700 active:bg-cyan-600 flex items-center justify-center text-cyan-300 active:scale-95 transition-transform"
          >
            <ChevronUp size={22} />
          </button>
          <button
            onTouchStart={() => handleVerticalPress(1)}
            onTouchEnd={handleVerticalRelease}
            onMouseDown={() => handleVerticalPress(1)}
            onMouseUp={handleVerticalRelease}
            aria-label="Aşağı Dal"
            className="w-11 h-11 rounded-xl bg-slate-900/80 border border-slate-700 active:bg-cyan-600 flex items-center justify-center text-cyan-300 active:scale-95 transition-transform"
          >
            <ChevronDown size={22} />
          </button>
        </div>
      </div>

      {/* Sağ Taraf: Aksiyon Butonları (Ağ Fırlat, Yosun Topla, Duraklat) */}
      <div className="pointer-events-auto flex items-end gap-3">
        {/* Duraklat Butonu */}
        <button
          onClick={onTogglePause}
          aria-label={isPaused ? "Devam Et" : "Duraklat"}
          className="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 active:bg-slate-800 flex items-center justify-center shadow-md active:scale-95 transition-transform"
        >
          {isPaused ? <Play size={20} className="text-emerald-400" /> : <Pause size={20} />}
        </button>

        {/* Yosun Topla Butonu */}
        <button
          onClick={onCollect}
          aria-label="Yosun Topla"
          className="relative w-16 h-16 rounded-2xl bg-gradient-to-b from-emerald-600 to-teal-800 border-2 border-emerald-400/60 shadow-lg text-white flex flex-col items-center justify-center active:scale-90 transition-transform active:brightness-125"
        >
          <Sparkles size={22} className="text-emerald-200 animate-pulse" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">YOSUN</span>
          <span className="text-[8px] text-emerald-200 leading-none">+25⚡</span>
        </button>

        {/* Ağ Fırlat Butonu (Büyük Birincil Aksiyon) */}
        <button
          onClick={onFireNet}
          disabled={!isNetReady}
          aria-label="Ağ Fırlat"
          className={`relative w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-xl transition-all active:scale-90 border-2 ${
            isNetReady
              ? 'bg-gradient-to-b from-sky-500 to-blue-700 border-sky-300 text-white shadow-sky-500/30'
              : 'bg-slate-900/90 border-slate-700 text-slate-400 cursor-not-allowed opacity-80'
          }`}
        >
          {/* Cooldown Ring Overlay */}
          {!isNetReady && (
            <div 
              style={{ height: `${cooldownPercent}%` }} 
              className="absolute bottom-0 inset-x-0 bg-cyan-950/70 rounded-b-2xl transition-all"
            />
          )}

          <Crosshair size={28} className={isNetReady ? 'text-white animate-spin-slow' : 'text-slate-500'} />
          <span className="text-xs font-extrabold tracking-wide mt-1 z-10">
            {isNetReady ? 'AĞ AT' : `${Math.ceil(netCooldownSec)}s`}
          </span>
          <span className="text-[9px] text-sky-200/90 z-10 font-mono">
            {isNetReady ? 'HAZIR' : 'DOLUYOR'}
          </span>
        </button>
      </div>
    </div>
  );
};
