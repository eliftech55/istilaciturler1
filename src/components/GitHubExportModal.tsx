import React, { useState } from 'react';
import { Github, Download, Copy, Check, X, ExternalLink, Smartphone } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface GitHubExportModalProps {
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState(false);

  const gitCommands = `# Telefonunda Termux veya masaüstü terminal varsa:
git remote add origin https://github.com/KULLANICI_ADINIZ/karadeniz-koruyuculari-zeta.git
git branch -M main
git push -u origin main`;

  const handleCopyCmd = () => {
    soundEffects.playClick();
    navigator.clipboard.writeText(gitCommands);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center text-white">
              <Github size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">GitHub Saklama ve Yayınlama</h2>
              <p className="text-xs text-slate-400">Android Telefonunuzdan Kolayca Gönderin</p>
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

        {/* Content */}
        <div className="py-3.5 space-y-3.5 text-xs leading-relaxed">
          
          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 text-emerald-200">
            <span className="font-bold block mb-0.5">✅ Git Deposu Hazırlandı ve İmzalandı:</span>
            Tüm oyun kaynak kodları, Firebase Firestore veritabanı kuralları (`firestore.rules`) ve yapılandırması Git yerel deposuna (`main` dalına) kaydedildi.
          </div>

          {/* 1. Yöntem: AI Studio Üzerinden */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-200 text-sm">
              <span className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs">1</span>
              <span>Telefondan 1 Tıkla GitHub'a Aktarma (En Kolayı)</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Google AI Studio ekranının sağ üst köşesindeki <b>Üç Nokta (⋮)</b> veya <b>"Export" / "GitHub'a Aktar"</b> seçeneğine dokunarak telefonunuzdaki GitHub hesabınızı bağlayabilir ve tek dokunuşla yeni bir GitHub deposuna gönderebilirsiniz.
            </p>
          </div>

          {/* 2. Yöntem: Hazır ZIP İndir ve GitHub'a Yükle */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-200 text-sm">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">2</span>
              <span>Projeyi ZIP Olarak İndir (GitHub Yüklemeye Hazır)</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Aşağıdaki butona dokunarak tüm projeyi (kaynak kodlar, görseller, Firebase kuralları) telefonunuza indirin. Ardından <b>github.com/new</b> adresinden yeni repo açıp "uploading an existing file" ile yükleyebilirsiniz.
            </p>
            <a
              href="/karadeniz-koruyuculari-zeta.zip"
              download="karadeniz-koruyuculari-zeta.zip"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md mt-1"
            >
              <Download size={16} />
              <span>karadeniz-koruyuculari-zeta.zip İndir (Tüm Proje)</span>
            </a>
          </div>

          {/* 2. Yöntem: GitHub Web Üzerinden */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-200 text-sm">
              <span className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs">2</span>
              <span>GitHub Web Sitesi Üzerinden Yeni Repo Oluşturma</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
              <li>Telefonunuzun tarayıcısından <b>github.com/new</b> adresine gidin.</li>
              <li>Depo adına: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300">karadeniz-koruyuculari-zeta</code> yazın.</li>
              <li>"Create repository" butonuna dokunun.</li>
              <li>İster AI Studio arayüzünden doğrudan bağlayın, isterseniz aşağıdaki Git komutlarını kullanın.</li>
            </ol>

            <div className="relative mt-2">
              <pre className="bg-slate-950 p-2.5 rounded-lg text-[10px] font-mono text-cyan-300 overflow-x-auto border border-slate-800">
                {gitCommands}
              </pre>
              <button
                onClick={handleCopyCmd}
                className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-200 flex items-center gap-1"
              >
                {copiedCmd ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedCmd ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
