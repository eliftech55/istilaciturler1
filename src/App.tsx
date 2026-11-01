/**
 * KARADENİZ'İN KORUYUCULARI – ZETA: İstilacı Tür Avcısı
 * 2D Eğitsel Denizaltı Macera Web Oyunu
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GAME_LEVELS } from './data/gameData';
import { GameState, LevelConfig } from './types/game';
import { GameCanvas } from './components/GameCanvas';
import { VirtualControls } from './components/VirtualControls';
import { IntroStoryModal } from './components/IntroStoryModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { LevelBriefingModal } from './components/LevelBriefingModal';
import { SpeciesGuideModal } from './components/SpeciesGuideModal';
import { SingleFileExportModal } from './components/SingleFileExportModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { GitHubExportModal } from './components/GitHubExportModal';
import { soundEffects } from './utils/audio';
import { auth, recordScoreAndProgress, loginAsGuest } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  Shield, 
  Target, 
  Trophy, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Smartphone, 
  RotateCcw, 
  Play, 
  Pause, 
  ChevronRight,
  Sparkles,
  Award,
  HelpCircle,
  Github,
  Cloud
} from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('INTRO_STORY');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [power, setPower] = useState(100);
  const [maxPower, setMaxPower] = useState(200);
  const [captured, setCaptured] = useState(0);
  const [totalTarget, setTotalTarget] = useState(5);
  const [netCooldownSec, setNetCooldownSec] = useState(0);
  const [netMaxCooldownSec, setNetMaxCooldownSec] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firestoreSaved, setFirestoreSaved] = useState(false);

  // Separate Modal Overlays
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showGitHub, setShowGitHub] = useState(false);

  // Firebase auth state subscription
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // Input state
  const [inputVector, setInputVector] = useState({ x: 0, y: 0 });
  const [netTrigger, setNetTrigger] = useState(0);
  const [collectTrigger, setCollectTrigger] = useState(0);

  const currentLevel: LevelConfig = GAME_LEVELS[currentLevelIdx] || GAME_LEVELS[0];

  // Sound Mute Toggle
  const handleToggleMute = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
  };

  // Keyboard controls for desktop
  useEffect(() => {
    const heldKeys: Record<string, boolean> = {};

    const updateFromKeys = () => {
      let x = 0;
      let y = 0;
      if (heldKeys['arrowleft'] || heldKeys['a']) x -= 1;
      if (heldKeys['arrowright'] || heldKeys['d']) x += 1;
      if (heldKeys['arrowup'] || heldKeys['w']) y -= 1;
      if (heldKeys['arrowdown'] || heldKeys['s']) y += 1;
      setInputVector({ x, y });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      heldKeys[key] = true;
      updateFromKeys();

      if (e.code === 'Space') {
        e.preventDefault();
        setNetTrigger((prev) => prev + 1);
      } else if (key === 'e') {
        e.preventDefault();
        setCollectTrigger((prev) => prev + 1);
      } else if (key === 'p' || key === 'escape') {
        e.preventDefault();
        setGameState((prev) => (prev === 'PLAYING' ? 'PAUSED' : prev === 'PAUSED' ? 'PLAYING' : prev));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      heldKeys[key] = false;
      updateFromKeys();
    };

    const handleBlur = () => {
      for (const k in heldKeys) heldKeys[k] = false;
      setInputVector({ x: 0, y: 0 });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const handleScoreChange = useCallback((delta: number) => {
    setScore((prev) => Math.max(0, prev + delta));
  }, []);

  const handlePowerChange = useCallback((newPower: number, newMaxPower: number) => {
    setPower(newPower);
    setMaxPower(newMaxPower);
  }, []);

  const handleCaptureProgress = useCallback((count: number, target: number) => {
    setCaptured(count);
    setTotalTarget(target);
  }, []);

  const handleNetCooldownChange = useCallback((sec: number, maxSec: number) => {
    setNetCooldownSec(sec);
    setNetMaxCooldownSec(maxSec);
  }, []);

  const handleLevelComplete = useCallback(async () => {
    setFirestoreSaved(false);
    let u = currentUser;
    if (!u) {
      try {
        u = (await loginAsGuest()) || null;
      } catch (e) {
        console.error(e);
      }
    }
    if (u) {
      try {
        await recordScoreAndProgress(u, score + 200, currentLevelIdx + 1, currentLevel.targetCount);
        setFirestoreSaved(true);
      } catch (e) {
        console.error('Firestore kayıt hatası:', e);
      }
    }

    if (currentLevelIdx < GAME_LEVELS.length - 1) {
      setGameState('LEVEL_CLEARED');
    } else {
      setGameState('VICTORY');
    }
  }, [currentUser, score, currentLevelIdx, currentLevel]);

  const handleGameOver = useCallback(async () => {
    let u = currentUser;
    if (!u && score > 0) {
      try {
        u = (await loginAsGuest()) || null;
      } catch {}
    }
    if (u && score > 0) {
      try {
        await recordScoreAndProgress(u, score, currentLevelIdx + 1, captured);
      } catch {}
    }
    setGameState('GAME_OVER');
  }, [currentUser, score, currentLevelIdx, captured]);

  // Sonraki Seviyeye Geçerken Brifing Ekranı Göster
  const handleNextLevel = () => {
    if (currentLevelIdx < GAME_LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
      setGameState('LEVEL_BRIEFING');
    } else {
      setGameState('VICTORY');
    }
  };

  const handleRestartLevel = () => {
    setGameState('LEVEL_BRIEFING');
  };

  const handleRestartGame = () => {
    setCurrentLevelIdx(0);
    setScore(0);
    setGameState('LEVEL_BRIEFING');
  };

  const powerRatio = maxPower > 0 ? (power / maxPower) * 100 : 0;
  const isPowerLow = power <= currentLevel.species.captureThreshold;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col font-sans select-none touch-none">
      
      {/* --- ÜST KONTROL & BİLGİ ÇUBUĞU (HUD HEADER) --- */}
      <header className="h-14 bg-slate-900/90 border-b border-slate-800/80 px-3 sm:px-6 flex items-center justify-between gap-2 z-40 backdrop-blur-md shrink-0">
        
        {/* Sol Taraf: Marka & Seviye */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-400/60 shrink-0 bg-slate-950 flex items-center justify-center">
            <img
              src="/src/assets/images/zeta_submarine_robot_1793561924213.jpg"
              alt="ZETA"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 leading-tight">
            <span className="text-xs sm:text-sm font-extrabold text-cyan-400 tracking-tight block truncate">
              ZETA: Karadeniz'in Koruyucuları
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              {currentLevel.name}
            </span>
          </div>
        </div>

        {/* Orta & Sağ: Göstergeler (Güç, Hedef, Puan) */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          
          {/* Güç Göstergesi */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-xl">
            <Shield size={16} className={isPowerLow ? 'text-rose-400 animate-pulse' : 'text-cyan-400'} />
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-1 text-[10px] font-mono tabular-nums">
                <span className="text-slate-400 text-[9px]">GÜÇ</span>
                <span className={isPowerLow ? 'text-rose-400 font-bold' : 'text-cyan-300 font-bold'}>
                  {power}/{maxPower}
                </span>
              </div>
              <div className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                <div
                  style={{ width: `${Math.min(100, Math.max(0, powerRatio))}%` }}
                  className={`h-full rounded-full transition-all ${
                    isPowerLow ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-400 to-sky-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* İstilacı Yakalama Sayacı */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-mono tabular-nums">
            <Target size={16} className="text-amber-400 shrink-0" />
            <span className="text-slate-300">
              <span className="font-bold text-amber-300">{captured}</span>/{totalTarget}
            </span>
          </div>

          {/* Skor */}
          <div className="hidden xs:flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-mono tabular-nums">
            <Trophy size={16} className="text-emerald-400 shrink-0" />
            <span className="font-bold text-emerald-300">{score}</span>
          </div>

          {/* Yardımcı Butonlar */}
          <div className="flex items-center gap-1">
            
            {/* Nasıl Oynanır? Butonu */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setShowHowToPlay(true);
              }}
              aria-label="Nasıl Oynanır?"
              title="Oyun Nasıl Oynanır?"
              className="px-2.5 py-1.5 rounded-lg bg-cyan-950 border border-cyan-800/80 text-cyan-300 hover:bg-cyan-900 flex items-center gap-1 text-[11px] font-bold transition-colors"
            >
              <HelpCircle size={15} />
              <span className="hidden sm:inline">Nasıl Oynanır?</span>
            </button>

            {/* Liderlik Tablosu (Firebase Firestore) */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setShowLeaderboard(true);
              }}
              aria-label="Lider Tablosu"
              title="Canlı Liderlik Tablosu (Cloud Firestore)"
              className="px-2.5 py-1.5 rounded-lg bg-amber-950 border border-amber-700/80 text-amber-300 hover:bg-amber-900 flex items-center gap-1 text-[11px] font-bold transition-colors"
            >
              <Trophy size={14} />
              <span className="hidden md:inline">Liderler</span>
            </button>

            {/* GitHub Aktarma / Depo */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setShowGitHub(true);
              }}
              aria-label="GitHub"
              title="GitHub Saklama ve Depo"
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors"
            >
              <Github size={16} />
            </button>

            {/* Türler Rehberi */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setShowGuide(true);
              }}
              aria-label="Türler Rehberi"
              title="Türler Rehberi"
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
            >
              <BookOpen size={16} />
            </button>

            {/* Tek Dosya HTML / Mobil İndir */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setShowExport(true);
              }}
              aria-label="Tek Dosya HTML"
              title="Android Tek Dosya HTML İndir / Kopyala"
              className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-800/80 text-sky-300 hover:bg-sky-900 flex items-center justify-center transition-colors"
            >
              <Smartphone size={16} />
            </button>

            {/* Ses Aç / Kapat */}
            <button
              onClick={handleToggleMute}
              aria-label={isMuted ? "Sesi Aç" : "Sesi Kapat"}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
            >
              {isMuted ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>

      </header>

      {/* --- OYUN ALANI (CANVAS & CONTROLS) --- */}
      <main className="relative flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden">
        
        <GameCanvas
          level={currentLevel}
          score={score}
          onScoreChange={handleScoreChange}
          onPowerChange={handlePowerChange}
          onCaptureProgress={handleCaptureProgress}
          onNetCooldownChange={handleNetCooldownChange}
          onLevelComplete={handleLevelComplete}
          onGameOver={handleGameOver}
          isPaused={gameState !== 'PLAYING'}
          inputVector={inputVector}
          netTrigger={netTrigger}
          collectTrigger={collectTrigger}
        />

        {/* Mobil Dokunmatik Kumanda Arayüzü */}
        {gameState === 'PLAYING' && (
          <VirtualControls
            onVectorChange={setInputVector}
            onFireNet={() => setNetTrigger((prev) => prev + 1)}
            onCollect={() => setCollectTrigger((prev) => prev + 1)}
            onTogglePause={() => {
              soundEffects.playClick();
              setGameState('PAUSED');
            }}
            isPaused={false}
            netCooldownSec={netCooldownSec}
            netMaxCooldownSec={netMaxCooldownSec}
          />
        )}

      </main>

      {/* --- MODALLER --- */}

      {/* 1. Açılış Hikayesi & 3 Soruluk Eğitim */}
      {gameState === 'INTRO_STORY' && (
        <IntroStoryModal
          onStartGame={() => setGameState('LEVEL_BRIEFING')}
          onShowHowToPlay={() => setShowHowToPlay(true)}
        />
      )}

      {/* 2. Seviye Başlangıç Görev Brifingi (O Seviyede Yakalanabilir Olan İstilacı Tür Bilgisi) */}
      {gameState === 'LEVEL_BRIEFING' && (
        <LevelBriefingModal
          level={currentLevel}
          onStartLevel={() => setGameState('PLAYING')}
        />
      )}

      {/* 3. Duraklatma Modalı */}
      {gameState === 'PAUSED' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 text-center shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <Pause size={20} className="text-cyan-400" />
              Oyun Duraklatıldı
            </h2>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 text-left space-y-1">
              <div><b>Hedef Tür:</b> {currentLevel.species.commonName} ({currentLevel.species.scientificName})</div>
              <div><b>Yakalama Eşiği:</b> {currentLevel.species.captureThreshold} Güç</div>
              <div><b>Güç Sınırı:</b> {currentLevel.species.powerLimit} Güç</div>
              <div><b>Skor:</b> {score} Puan</div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setGameState('PLAYING');
                }}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-white text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
              >
                <Play size={18} />
                <span>Devam Et</span>
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setShowHowToPlay(true);
                }}
                className="w-full py-2.5 rounded-xl border border-cyan-700/60 hover:bg-cyan-950/40 font-semibold text-cyan-300 text-xs flex items-center justify-center gap-2 transition-all"
              >
                <HelpCircle size={16} />
                <span>Nasıl Oynanır?</span>
              </button>
              <button
                onClick={handleRestartLevel}
                className="w-full py-2 rounded-xl border border-slate-700 hover:bg-slate-800 font-semibold text-slate-400 text-xs flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw size={15} />
                <span>Seviyeyi Yeniden Başlat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Seviye Tamamlama Modalı */}
      {gameState === 'LEVEL_CLEARED' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
              <Sparkles size={32} />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white">
                Seviye Tamamlandı! 🎉
              </h2>
              <p className="text-xs text-emerald-300 font-semibold">
                +{200} Seviye Tamamlama Bonusu Eklendi!
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1.5 text-left">
              <div className="flex justify-between">
                <span>Temizlenen Tür:</span>
                <span className="font-bold text-cyan-400">{currentLevel.species.commonName}</span>
              </div>
              <div className="flex justify-between">
                <span>Araştırma Merkezine Aktarılan:</span>
                <span className="font-bold text-slate-100">{currentLevel.targetCount} Adet</span>
              </div>
              <div className="flex justify-between">
                <span>Toplam Skor:</span>
                <span className="font-mono font-bold text-emerald-400">{score} Puan</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic">
              "Karadeniz'in yerli canlıları ve balık yumurtaları bu türün istilasından korundu. Harika iş çıkardın ZETA!"
            </p>

            <button
              onClick={handleNextLevel}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-white text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>{currentLevelIdx + 2}. Seviye Brifingine Geç</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 5. Oyun Bitti (Güç Sıfırlandı) */}
      {gameState === 'GAME_OVER' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-900/60 rounded-2xl p-6 text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-500 mx-auto">
              ⚠️
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white">
                ZETA'nın Enerjisi Tükendi!
              </h2>
              <p className="text-xs text-rose-300">
                Robot bataryası sıfıra düştü.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 text-left space-y-1.5">
              <span className="font-bold text-amber-400 block">💡 Karadeniz Hayatta Kalma İpucu:</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                İstilacı yabancı türlere doğrudan dokunmak yasaktır! Yosun toplayarak bataryanı doldur ve özel ağınla güvenli mesafeden yakala.
              </p>
            </div>

            <button
              onClick={handleRestartLevel}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 font-bold text-white text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <RotateCcw size={18} />
              <span>Tekrar Dene</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. Büyük Final Zafer Modalı */}
      {gameState === 'VICTORY' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl p-6 text-center shadow-2xl space-y-4">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mx-auto">
              <Award size={40} />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white">
                Karadeniz Kurtarıldı! 🌊
              </h2>
              <p className="text-xs text-amber-300 font-semibold">
                Tüm 5 İstilacı Tür Araştırma Merkezine Aktarıldı
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Tebrikler kahraman araştırmacı! Rapana venosa, Mnemiopsis leidyi, Mya arenaria, Anadara kagoshimensis ve Liza haematocheila türlerinin ekosisteme verdiği zarar durduruldu.
            </p>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs flex justify-between font-mono">
              <span className="text-slate-400">Son Toplam Skor:</span>
              <span className="font-bold text-emerald-400 text-sm">{score} Puan</span>
            </div>

            <button
              onClick={handleRestartGame}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 font-bold text-white text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <RotateCcw size={18} />
              <span>Yeniden Oyna</span>
            </button>
          </div>
        </div>
      )}

      {/* Nasıl Oynanır Modalı */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {/* Rehber Modalı */}
      {showGuide && (
        <SpeciesGuideModal onClose={() => setShowGuide(false)} />
      )}

      {/* Tek Dosya HTML / Mobil İndir Modalı */}
      {showExport && (
        <SingleFileExportModal onClose={() => setShowExport(false)} />
      )}

      {/* Liderlik Tablosu Modalı (Firebase Firestore) */}
      {showLeaderboard && (
        <LeaderboardModal 
          onClose={() => setShowLeaderboard(false)} 
          currentScore={score}
        />
      )}

      {/* GitHub Saklama / Depo Modalı */}
      {showGitHub && (
        <GitHubExportModal onClose={() => setShowGitHub(false)} />
      )}

    </div>
  );
}
