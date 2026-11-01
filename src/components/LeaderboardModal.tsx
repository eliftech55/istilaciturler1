import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  X, 
  LogIn, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck, 
  Award, 
  Zap, 
  Crown,
  RefreshCw 
} from 'lucide-react';
import { 
  auth, 
  loginWithGoogle, 
  loginAsGuest, 
  logoutUser, 
  subscribeLeaderboard, 
  LeaderboardItem 
} from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { soundEffects } from '../utils/audio';

interface LeaderboardModalProps {
  onClose: () => void;
  currentScore?: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose, currentScore = 0 }) => {
  const [user, setUser] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const unsubLeaderboard = subscribeLeaderboard((items) => {
      setLeaderboard(items);
      setLoading(false);
    });

    return () => {
      unsubAuth();
      unsubLeaderboard();
    };
  }, []);

  const handleGoogleLogin = async () => {
    soundEffects.playClick();
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();
    setIsLoggingIn(true);
    try {
      await loginAsGuest(guestName.trim() || undefined);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    soundEffects.playClick();
    await logoutUser();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-700/60 flex items-center justify-center text-amber-400">
              <Trophy size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Karadeniz Liderlik Tablosu</h2>
              <p className="text-xs text-slate-400">Canlı Cloud Firestore Sıralaması</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X size={18} />
          </button>
        </div>

        {/* Auth Bar */}
        <div className="py-3 border-b border-slate-800/80 bg-slate-950/40 -mx-5 sm:-mx-6 px-5 sm:px-6 shrink-0">
          {user ? (
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {user.displayName?.charAt(0) || 'K'}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-200 truncate">{user.displayName || 'Misafir Oyuncu'}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    {user.isAnonymous ? 'Misafir Girişi' : user.email}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-semibold flex items-center gap-1 transition-colors"
              >
                <LogOut size={13} />
                <span>Çıkış</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.24v3.15C3.26 21.36 7.36 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.24C.45 8.18 0 9.99 0 12s.45 3.82 1.24 5.39l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.24 6.61l4.03 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
                  </svg>
                  <span>Google ile Giriş Yap</span>
                </button>

                <form onSubmit={handleGuestLogin} className="flex-1 flex gap-1.5">
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Oyuncu Adı (Misafir)"
                    maxLength={16}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="py-1.5 px-3 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs whitespace-nowrap active:scale-95 transition-all"
                  >
                    Katıl
                  </button>
                </form>
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                Giriş yaparak skorunuzu Cloud Firestore bulutunda kalıcı saklayabilirsiniz.
              </p>
            </div>
          )}
        </div>

        {/* Liderlik Listesi */}
        <div className="flex-1 overflow-y-auto py-3 space-y-1.5 pr-1 text-xs">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <RefreshCw size={24} className="animate-spin text-cyan-400" />
              <span>Liderler yükleniyor...</span>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="py-10 text-center text-slate-400 space-y-1">
              <Award size={32} className="mx-auto text-slate-600" />
              <div className="font-semibold text-slate-300">Henüz kayıtlı lider skoru yok</div>
              <div className="text-[11px]">İlk görevi tamamlayıp adını zirveye yazdır!</div>
            </div>
          ) : (
            leaderboard.map((item, idx) => {
              const isCurrent = user && user.uid === item.userId;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-cyan-950/60 border-cyan-500/80 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Sıralama Rozeti */}
                    <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                      {idx === 0 ? (
                        <Crown size={18} className="text-amber-400 fill-amber-400" />
                      ) : idx === 1 ? (
                        <span className="text-slate-300">🥈</span>
                      ) : idx === 2 ? (
                        <span className="text-amber-600">🥉</span>
                      ) : (
                        <span className="text-slate-500">{idx + 1}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold truncate flex items-center gap-1.5">
                        <span>{item.displayName}</span>
                        {isCurrent && (
                          <span className="text-[9px] bg-cyan-600 text-white px-1.5 py-0.2 rounded font-mono">
                            Sen
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.levelReached}. Seviye · {item.capturedTotal} İstilacı Avlandı
                      </div>
                    </div>
                  </div>

                  {/* Puan */}
                  <div className="text-right shrink-0">
                    <span className="font-mono font-extrabold text-emerald-400 text-sm">
                      {item.score}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">Puan</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center shrink-0">
          <div className="text-[11px] text-slate-400">
            Mevcut Oyun Skoru: <b className="text-emerald-400 font-mono">{currentScore}</b>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
