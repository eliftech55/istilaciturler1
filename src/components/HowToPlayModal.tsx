import React from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Crosshair, 
  AlertOctagon, 
  Fish, 
  Zap, 
  X, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HowToPlayModalProps {
  onClose: () => void;
  onStartGame?: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose, onStartGame }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Gamepad2 size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Oyun Nasıl Oynanır?</h2>
              <p className="text-xs text-slate-400">ZETA Saha Kılavuzu ve Kurallar</p>
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

        {/* Content: 6 Kural Kartı */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
          
          {/* 1. Kontroller */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Gamepad2 size={16} />
              <span>1. Hareket ve Yönlendirme</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              <b>📱 Mobil:</b> Ekranın solundaki sanal joystick ile ZETA'yı serbestçe yüzdürün.<br />
              <b>⌨️ Bilgisayar:</b> <b>W, A, S, D</b> veya <b>Yön tuşları</b> ile yüzebilirsiniz.
            </p>
          </div>

          {/* 2. Yosun Toplama */}
          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Sparkles size={16} />
              <span>2. Yosun Toplama (+25 Enerji, +10 Puan)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Deniz tabanındaki yeşil yosunların yanından geçin veya <b>"🌿 YOSUN"</b> butonuna basın. Her yosun ZETA'ya <b>+25 Güç</b> ve <b>+10 Puan</b> kazandırır. Ayrıca ağın 60 saniyelik dolum süresini <b>3 saniye hızlandırır</b>.
            </p>
          </div>

          {/* 3. Özel Ağ İle Yakalama */}
          <div className="bg-sky-950/30 border border-sky-800/40 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <Crosshair size={16} />
              <span>3. Özel Ağ Fırlatma (+100 Puan)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              <b>"🎯 AĞ AT"</b> butonuna veya <b>Boşluk (Space)</b> tuşuna basarak uzaktan ağ fırlatın.
              Yalnızca robotunuzun enerjisi o türün <b>Yakalama Eşiği</b>ne eşit veya yüksekse canlı yakalanır ve araştırma merkezine gönderilir. Boşa atılan ağ <b>-10 Puan</b> düşürür!
            </p>
          </div>

          {/* 4. Doğrudan Temas YASAK */}
          <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertOctagon size={16} />
              <span>4. Doğrudan Temas Yasaktır (Hasar & Geri Tepme)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              İstilacı canlılara gövdenizle çarpmayın! Doğrudan temas halinde türe göre <b>-50 ile -250 arası enerji kaybı</b> yaşarsınız. Enerjiniz sıfıra düşerse oyun biter.
            </p>
          </div>

          {/* 5. Canlı Yapay Zekâsı */}
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Zap size={16} />
              <span>5. Canlı Yapay Zekâsı (Kovalamaca & Kaçış)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              ZETA'nın enerjisi canlıdan yüksekse canlı korkup sizden uzaklaşır. Ancak enerjiniz canlıdan düşükse canlı ZETA'yı takip edip saldırmaya çalışır!
            </p>
          </div>

          {/* 6. Bonus Yerli Türler */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
              <Fish size={16} />
              <span>6. Bonus Yerli Türler (+50 Puan)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Karadeniz'in yerli kırmızı <b>Barbun Balığı</b>na temas ettiğinizde onu korumuş olursunuz ve <b>+50 Bonus Puan</b> kazanırsınız.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
          >
            Kapat
          </button>

          {onStartGame && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onStartGame();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 font-bold text-white text-xs shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <CheckCircle size={16} />
              <span>Anladım, Göreve Başla!</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
