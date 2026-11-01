import React, { useState } from 'react';
import { Copy, Download, Check, X, Smartphone, Globe, Code2 } from 'lucide-react';

interface SingleFileExportModalProps {
  onClose: () => void;
}

export const SingleFileExportModal: React.FC<SingleFileExportModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      const response = await fetch('/karadeniz-koruyuculari-tek-dosya.html');
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/karadeniz-koruyuculari-tek-dosya.html';
    link.download = 'karadeniz_koruyuculari_zeta.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 flex flex-col max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
              <Smartphone size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Telefondan Geliştirme Paketi</h2>
              <p className="text-xs text-slate-400">Tek Dosya HTML (HTML5 + CSS + JS)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X size={18} />
          </button>
        </div>

        {/* Info for Android User */}
        <div className="py-4 space-y-3 text-xs leading-relaxed">
          <div className="bg-sky-950/30 border border-sky-800/40 rounded-xl p-3.5 text-sky-200">
            <span className="font-bold block mb-1">📱 Android Telefon İçin Özel Hazırlandı:</span>
            Bu oyun şu anda hem bulunduğunuz Google AI Studio ekranında canlı çalışmakta, hem de sıfır bilgisayar veya kurulum gerektirmeden telefonunuzun Chrome tarayıcısında tek başına çalışabilecek tek bir <code className="bg-sky-950 px-1 py-0.5 rounded text-sky-300 font-mono">.html</code> dosyası olarak paketlenmiştir.
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
              <Code2 size={16} className="text-cyan-400" />
              Nasıl Kullanılır ve Test Edilir?
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px]">
              <li>
                <b>1. Seçenek (Doğrudan İndirme):</b> Aşağıdaki <span className="text-cyan-300">"HTML Dosyasını İndir"</span> butonuna dokunun. İndirilen dosyaya telefonunuzun Dosyalar uygulamasından dokunarak Chrome ile anında çevrimdışı oynayabilirsiniz.
              </li>
              <li>
                <b>2. Seçenek (Kodu Kopyalama):</b> <span className="text-cyan-300">"Tüm Kodu Kopyala"</span> butonuna basıp istediğiniz mobil metin editörüne (ör. QuickEdit, Dcoder vb.) yapıştırabilirsiniz.
              </li>
              <li>
                <b>3. Seçenek (AI Studio Dev Ekranı):</b> Hiçbir şey indirmeden bu ekranda doğrudan oynayıp geliştirebilirsiniz!
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={handleCopyCode}
              className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span>{copied ? 'Kopyalandı! 📋' : 'HTML Kodunu Kopyala'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 font-bold text-slate-100 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
            >
              <Download size={18} />
              <span>HTML Dosyasını İndir</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            Tamam
          </button>
        </div>

      </div>
    </div>
  );
};
