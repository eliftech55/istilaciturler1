import React, { useState } from 'react';
import { TUTORIAL_QUIZ } from '../data/gameData';
import { ShieldCheck, Play, ArrowRight, HelpCircle, CheckCircle2, XCircle, UserCheck, Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface IntroStoryModalProps {
  onStartGame: () => void;
  onShowHowToPlay?: () => void;
  onRegisterUser: (username: string) => Promise<void>;
  initialUsername?: string;
}

export const IntroStoryModal: React.FC<IntroStoryModalProps> = ({ 
  onStartGame, 
  onShowHowToPlay,
  onRegisterUser,
  initialUsername = ''
}) => {
  const [username, setUsername] = useState(
    initialUsername || (typeof window !== 'undefined' ? localStorage.getItem('zeta_player_name') || '' : '')
  );
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState<'register' | 'story' | 'levels' | 'quiz' | 'ready'>('register');
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const currentQ = TUTORIAL_QUIZ[currentQuizIdx];

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = username.trim() || `Koruyucu-${Math.floor(1000 + Math.random() * 9000)}`;
    setIsRegistering(true);
    soundEffects.playClick();
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('zeta_player_name', cleanName);
      }
      await onRegisterUser(cleanName);
      setStep('story');
    } catch (err) {
      console.error(err);
      setStep('story');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (quizAnswered) return;
    setSelectedOption(idx);
    setQuizAnswered(true);

    if (idx === currentQ.correctIndex) {
      soundEffects.playBonus();
      setQuizScore((prev) => prev + 1);
    } else {
      soundEffects.playDamage();
    }
  };

  const handleNextQuiz = () => {
    soundEffects.playClick();
    if (currentQuizIdx < TUTORIAL_QUIZ.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
      setSelectedOption(null);
      setQuizAnswered(false);
    } else {
      setStep('ready');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 flex flex-col my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Step 0: Kullanıcı Adı Belirleme ve Veritabanı Kaydı */}
        {step === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col items-center text-center space-y-4">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-lg shadow-cyan-500/20 bg-slate-950 flex items-center justify-center">
              <img
                src="/src/assets/images/zeta_submarine_robot_1793561924213.jpg"
                alt="ZETA Robot Drone"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
                Karadeniz Araştırma Enstitüsü
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                Oyuncu Kaydı
              </h2>
              <p className="text-xs text-slate-400">
                Liderlik tablosunda yer almak ve ilerlemeni kaydetmek için kullanıcı adını belirle.
              </p>
            </div>

            <div className="w-full space-y-2 text-left">
              <label className="text-xs font-semibold text-slate-300 block">
                Kullanıcı Adınız (Takma Ad):
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Örn: DenizAvcısı, KaptanEmre..."
                maxLength={16}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <span className="text-[10px] text-slate-400 block text-right font-mono">
                {username.length}/16 Karakter
              </span>
            </div>

            <div className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-left text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-cyan-300 flex items-center gap-1.5 text-xs">
                <Sparkles size={14} className="text-cyan-400" />
                Firebase Cloud Firestore Entegrasyonu
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Skorun, yakaladığın istilacı türler ve seviye ilerlemen bu isimle bulut veritabanına kaydedilecektir.
              </p>
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-extrabold text-white shadow-xl shadow-cyan-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all text-sm tracking-wide"
            >
              <UserCheck size={18} />
              <span>{isRegistering ? 'Kaydediliyor...' : 'Veritabanına Kaydol ve Başla'}</span>
            </button>
          </form>
        )}

        {/* Step 1: ZETA Tanıtımı ve Karadeniz Sorunu */}
        {step === 'story' && (
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-lg shadow-cyan-500/20 bg-slate-950 flex items-center justify-center">
              <img
                src="/src/assets/images/zeta_submarine_robot_1793561924213.jpg"
                alt="ZETA Robot Drone"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
                Hoş Geldin, <span className="text-white font-bold">{username || 'Koruyucu'}</span>!
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                Ben ZETA 🤖
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-lg text-left">
              Karadeniz'in hassas ekosistemini korumak için tasarlanmış araştırma robotuyum. 
              Uluslararası ticaret yapan dev kargo gemileri, dengede kalmak için aldıkları <span className="text-cyan-300 font-semibold">balast sularını</span> Karadeniz'e boşalttığında, okyanuslardan gelen yabancı canlılar denizimize yayılıyor.
            </p>

            <div className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-left text-xs text-slate-300 space-y-1.5">
              <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-cyan-400" />
                Karadeniz Tehlikede!
              </div>
              <p>
                Bu istilacı türlerin Karadeniz'de doğal avcısı olmadığı için hızla çoğalıyor; hamsi larvalarını ve yerli midye yataklarını tüketerek denizimizi tehdit ediyorlar.
              </p>
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-2">
              {onShowHowToPlay && (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    onShowHowToPlay();
                  }}
                  className="py-3 px-4 rounded-xl border border-cyan-500/50 hover:bg-cyan-950/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <HelpCircle size={16} />
                  <span>Nasıl Oynanır?</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setStep('levels');
                }}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-bold text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all text-xs"
              >
                <span>5 Seviyelik Görevi İncele</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 5 Seviyelik Görev */}
        {step === 'levels' && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
                Görev Protokolü
              </div>
              <h2 className="text-xl font-bold text-white">
                5 İstilacı Tür Görevi
              </h2>
              <p className="text-xs text-slate-400">
                Her seviyede enerji eşiğini aşıp türleri güvenli araştırma merkezine aktaracaksın.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-950/70 border border-amber-900/40 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-400">1. Rapana venosa</span>
                  <div className="text-slate-400">Deniz Salyangozu (5 Adet) · Eşik: 100⚡</div>
                </div>
                <span className="text-amber-300 font-mono text-[11px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  Temas: -50⚡
                </span>
              </div>

              <div className="bg-slate-950/70 border border-cyan-900/40 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-cyan-400">2. Mnemiopsis leidyi</span>
                  <div className="text-slate-400">Deniz Cevizi (2 Adet) · Eşik: 200⚡</div>
                </div>
                <span className="text-cyan-300 font-mono text-[11px] bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  Temas: -100⚡
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-700/40 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-300">3. Mya arenaria</span>
                  <div className="text-slate-400">Kum Midyesi (3 Adet) · Eşik: 300⚡</div>
                </div>
                <span className="text-slate-300 font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded">
                  Temas: -150⚡
                </span>
              </div>

              <div className="bg-slate-950/70 border border-red-900/40 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-red-400">4. Anadara kagoshimensis</span>
                  <div className="text-slate-400">Dikenli Midye (4 Adet) · Eşik: 400⚡</div>
                </div>
                <span className="text-red-300 font-mono text-[11px] bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
                  Temas: -200⚡
                </span>
              </div>

              <div className="bg-slate-950/70 border border-yellow-900/40 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-yellow-400">5. Liza haematocheila</span>
                  <div className="text-slate-400">Rus Kefali (5 Adet) · Eşik: 500⚡</div>
                </div>
                <span className="text-yellow-300 font-mono text-[11px] bg-yellow-950/60 px-2 py-0.5 rounded border border-yellow-800/40">
                  Temas: -250⚡
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setStep('story');
                }}
                className="w-1/3 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-semibold"
              >
                Geri
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setStep('quiz');
                }}
                className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-bold text-white text-xs shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span>3 Soruluk Eğitime Başla</span>
                <HelpCircle size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 3 Soruluk Etkileşimli Eğitim */}
        {step === 'quiz' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-semibold text-cyan-400">
                Soru {currentQuizIdx + 1} / {TUTORIAL_QUIZ.length}
              </span>
              <span>Skor: {quizScore} Doğru</span>
            </div>

            <h3 className="text-base font-bold text-white text-left">
              {currentQ.question}
            </h3>

            <div className="space-y-2.5">
              {currentQ.options.map((opt, i) => {
                let btnStyle = 'bg-slate-950/70 border-slate-800 hover:border-slate-600 text-slate-200';
                if (quizAnswered) {
                  if (i === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-100';
                  } else if (i === selectedOption) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-100';
                  }
                }

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectOption(i)}
                    disabled={quizAnswered}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-start gap-2.5 ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {['A', 'B', 'C'][i]}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {quizAnswered && i === currentQ.correctIndex && (
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    )}
                    {quizAnswered && i === selectedOption && i !== currentQ.correctIndex && (
                      <XCircle size={16} className="text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {quizAnswered && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
                <span className="font-semibold text-cyan-400 block mb-1">Açıklama:</span>
                {currentQ.explanation}
              </div>
            )}

            {quizAnswered && (
              <button
                type="button"
                onClick={handleNextQuiz}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-white text-xs shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span>{currentQuizIdx < TUTORIAL_QUIZ.length - 1 ? 'Sonraki Soru' : 'Eğitimi Tamamla'}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}

        {/* Step 4: Oyuna Davet & Başlama */}
        {step === 'ready' && (
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white">
                Tebrikler {username || 'Koruyucu'}!
              </h2>
              <p className="text-xs text-emerald-300">
                Eğitim Testi: {quizScore} / {TUTORIAL_QUIZ.length} Doğru · Veritabanı Kaydı Hazır
              </p>
            </div>

            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              Artık Karadeniz'i korumak için tam yetkilisin! Yosun toplayarak enerjini doldur, Rapana venosa salyangozlarını güvenli ağınla yakala.
            </p>

            <div className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-left text-xs text-slate-400 space-y-1 font-mono">
              <div>🎮 <span className="text-slate-200">Mobil:</span> Sol sanal joystick, sağ butonlar (Ağ At, Yosun)</div>
              <div>⌨️ <span className="text-slate-200">Bilgisayar:</span> WASD / Yön tuşları, Boşluk (Ağ), E (Yosun)</div>
            </div>

            <button
              type="button"
              onClick={onStartGame}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-extrabold text-white shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all text-sm tracking-wide"
            >
              <Play size={18} />
              <span>GÖREVE BAŞLA (1. SEVİYE)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
