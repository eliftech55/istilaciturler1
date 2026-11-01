/**
 * Şeffaf Arka Planlı (Transparent PNG / Canvas) Karakter ve Nesne Çizicisi
 * Tüm canlılar ve nesneler temiz, arka plansız (şeffaf alfa kanallı) olarak çizilir.
 */

export class TransparentSpriteRenderer {
  // 1. ZETA Robot Drone (Şeffaf Arka Plan)
  public static drawZeta(
    ctx: CanvasRenderingContext2D,
    size: number,
    eyeState: 'happy' | 'focused' | 'alert' | 'danger',
    facingRight: boolean,
    powerRatio: number,
    isInvulnerable: boolean
  ) {
    ctx.save();
    const facing = facingRight ? 1 : -1;
    ctx.scale(facing, 1);

    // Yanıp sönen koruma aurası
    if (isInvulnerable) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(0, 0, size + 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Güç Aurası (Enerji durumuna göre renk değişen şeffaf halka)
    const auraColor = powerRatio > 0.5 ? 'rgba(56, 189, 248, 0.35)' : 'rgba(239, 68, 68, 0.45)';
    ctx.strokeStyle = auraColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, size + 8, 0, Math.PI * 2);
    ctx.stroke();

    // Robot Gövdesi: Beyaz ve Hidrodinamik Denizaltı Kapsülü
    const bodyGrad = ctx.createLinearGradient(0, -size * 0.7, 0, size * 0.7);
    bodyGrad.addColorStop(0, '#ffffff');
    bodyGrad.addColorStop(0.6, '#f1f5f9');
    bodyGrad.addColorStop(1, '#cbd5e1');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.68, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Mavi Araştırma Çizgisi
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.rect(-size * 0.2, -size * 0.65, size * 0.35, size * 1.3);
    ctx.fill();

    // Üst Sensör & Sualtı Işığı (Anten)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-3, -size * 0.95, 6, 12);

    const lightGrad = ctx.createRadialGradient(0, -size * 0.95, 1, 0, -size * 0.95, 7);
    lightGrad.addColorStop(0, '#fef08a');
    lightGrad.addColorStop(0.8, '#eab308');
    lightGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.arc(0, -size * 0.95, 7, 0, Math.PI * 2);
    ctx.fill();

    // Ön Dijital Ekran (Derin Lacivert Kavisli Vizör)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(size * 0.35, 0, size * 0.5, size * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // ZETA'nın İfadeli Robot Gözleri (Işıltılı Mavi LED)
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;

    if (eyeState === 'happy') {
      // Mutlu yay gözler
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(size * 0.28, -2, 5, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(size * 0.5, -2, 5, Math.PI, 0);
      ctx.stroke();
    } else if (eyeState === 'danger') {
      // Tehlike alarm gözleri (Kırmızı)
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.fillRect(size * 0.22, -5, 8, 8);
      ctx.fillRect(size * 0.44, -5, 8, 8);
    } else {
      // Standart meraklı yuvarlak gözler
      ctx.beginPath();
      ctx.arc(size * 0.28, -2, 4, 0, Math.PI * 2);
      ctx.arc(size * 0.48, -2, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0; // Gölgeyi sıfırla

    // Arka Pervane Motoru
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.rect(-size * 1.05, -9, 8, 18);
    ctx.fill();

    // Alt Ağ Fırlatıcı Tüpü
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(size * 0.35, 8, 14, 8, 3);
    ctx.fill();

    ctx.restore();
  }

  // 2. Rapana venosa (Deniz Salyangozu) - Temiz Şeffaf Çizim
  public static drawRapana(ctx: CanvasRenderingContext2D, size: number) {
    ctx.save();

    // Salyangozun kaslı taban ayağı (Gri-bej)
    ctx.fillStyle = '#78716c';
    ctx.beginPath();
    ctx.ellipse(size * 0.25, size * 0.42, size * 0.55, size * 0.22, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Duyargalar (Tentacles)
    ctx.strokeStyle = '#57534e';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(size * 0.6, size * 0.35);
    ctx.lineTo(size * 0.85, size * 0.15);
    ctx.moveTo(size * 0.65, size * 0.45);
    ctx.lineTo(size * 0.88, size * 0.35);
    ctx.stroke();

    // Büyük spiral ana kabuk gövdesi (Koyu turuncu / kahverengi)
    const shellGrad = ctx.createRadialGradient(-size * 0.1, 0, size * 0.2, 0, 0, size);
    shellGrad.addColorStop(0, '#fdba74');
    shellGrad.addColorStop(0.4, '#ea580c');
    shellGrad.addColorStop(0.85, '#9a3412');
    shellGrad.addColorStop(1, '#7c2d12');

    ctx.fillStyle = shellGrad;
    ctx.beginPath();
    ctx.ellipse(-size * 0.05, 0, size * 0.9, size * 0.68, -0.22, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#431407';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Spiral yivler ve kabuk kabartmaları (Venosa çizgileri)
    ctx.strokeStyle = '#fed7aa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-size * 0.15, 0, size * 0.55, -0.4, Math.PI * 0.8);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-size * 0.25, -size * 0.05, size * 0.35, -0.3, Math.PI * 0.7);
    ctx.stroke();

    // Kabuk ağzı (İç turuncu açıklık)
    ctx.fillStyle = '#ffedd5';
    ctx.beginPath();
    ctx.ellipse(size * 0.28, size * 0.1, size * 0.32, size * 0.45, 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 3. Mnemiopsis leidyi (Deniz Cevizi / Taraklısı) - Işıltılı Şeffaf Çizim
  public static drawMnemiopsis(ctx: CanvasRenderingContext2D, size: number, pulsePhase: number) {
    ctx.save();

    // Saydam loblu jelatinimsi gövde
    const bodyGrad = ctx.createRadialGradient(0, 0, size * 0.2, 0, 0, size);
    bodyGrad.addColorStop(0, 'rgba(224, 242, 254, 0.75)');
    bodyGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.35)');
    bodyGrad.addColorStop(1, 'rgba(14, 165, 233, 0.15)');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.85, size, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(186, 230, 253, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Biyolüminesan gökkuşağı tarak sıraları (Cilia)
    const hue = (pulsePhase * 40) % 360;
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = `hsla(${hue}, 95%, 65%, 0.9)`;
    ctx.shadowColor = `hsl(${hue}, 95%, 65%)`;
    ctx.shadowBlur = 10;

    // Sol tarak çizgisi
    ctx.beginPath();
    ctx.arc(-size * 0.35, 0, size * 0.7, -Math.PI * 0.45, Math.PI * 0.45);
    ctx.stroke();

    // Sağ tarak çizgisi
    ctx.beginPath();
    ctx.arc(size * 0.35, 0, size * 0.7, Math.PI * 0.55, Math.PI * 1.45);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // 4. Mya arenaria (Kum Midyesi) - Oval Şeffaf Çizim
  public static drawMya(ctx: CanvasRenderingContext2D, size: number) {
    ctx.save();

    // Tebeşirimsi beyaz-gri oval kabuk
    const clamGrad = ctx.createLinearGradient(0, -size * 0.5, 0, size * 0.5);
    clamGrad.addColorStop(0, '#ffffff');
    clamGrad.addColorStop(0.5, '#f1f5f9');
    clamGrad.addColorStop(1, '#94a3b8');

    ctx.fillStyle = clamGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Kabuk üzerindeki eşmerkezli halkalar
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.7, size * 0.45, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Uzayan sifon borusu
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.roundRect(size * 0.65, -size * 0.2, size * 0.4, size * 0.38, 4);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(size * 1.05, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 5. Anadara kagoshimensis (Dikenli Midye) - Yivli Koyu Kırmızı Şeffaf Çizim
  public static drawAnadara(ctx: CanvasRenderingContext2D, size: number) {
    ctx.save();

    // Koyu bordo radyal kabuk
    const shellGrad = ctx.createRadialGradient(0, 0, size * 0.2, 0, 0, size);
    shellGrad.addColorStop(0, '#ef4444');
    shellGrad.addColorStop(0.6, '#991b1b');
    shellGrad.addColorStop(1, '#450a0a');

    ctx.fillStyle = shellGrad;
    ctx.beginPath();
    ctx.arc(0, size * 0.1, size * 0.85, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Radyal derin yivler
    ctx.strokeStyle = '#fee2e2';
    ctx.lineWidth = 1.5;
    for (let i = 1; i < 7; i++) {
      const angle = Math.PI + (i / 7) * Math.PI;
      ctx.beginPath();
      ctx.moveTo(0, size * 0.1);
      ctx.lineTo(Math.cos(angle) * size * 0.85, size * 0.1 + Math.sin(angle) * size * 0.85);
      ctx.stroke();
    }

    ctx.restore();
  }

  // 6. Liza haematocheila (Rus Kefali) - Yırtıcı Balık Şeffaf Çizim
  public static drawLiza(ctx: CanvasRenderingContext2D, size: number, vx: number, pulsePhase: number) {
    ctx.save();
    const facing = vx >= 0 ? 1 : -1;
    ctx.scale(facing, 1);

    // Kuyruk yüzgeci hareketi
    const tailWiggle = Math.sin(pulsePhase * 3) * 6;

    // Aerodinamik Gövde (Gümüş-Altın tonlar)
    const fishGrad = ctx.createLinearGradient(0, -size * 0.4, 0, size * 0.4);
    fishGrad.addColorStop(0, '#713f12');
    fishGrad.addColorStop(0.3, '#ca8a04');
    fishGrad.addColorStop(0.7, '#fef08a');
    fishGrad.addColorStop(1, '#ffffff');

    ctx.fillStyle = fishGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 1.15, size * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#854d0e';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Çatal Kuyruk
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.moveTo(-size * 1.1, 0);
    ctx.lineTo(-size * 1.55, -size * 0.45 + tailWiggle);
    ctx.lineTo(-size * 1.35, tailWiggle * 0.5);
    ctx.lineTo(-size * 1.55, size * 0.45 + tailWiggle);
    ctx.closePath();
    ctx.fill();

    // Sırt Yüzgeci
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, -size * 0.4);
    ctx.lineTo(size * 0.1, -size * 0.7);
    ctx.lineTo(size * 0.3, -size * 0.38);
    ctx.closePath();
    ctx.fill();

    // Göğüs Yüzgeci
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(size * 0.1, size * 0.15, size * 0.3, size * 0.12, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Karakteristik Kırmızı Göz Çevresi (Haematocheila özelliği)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(size * 0.72, -size * 0.08, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(size * 0.72, -size * 0.08, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 7. Bonus Yerli Tür (Karadeniz Barbunu) - Şeffaf Çizim
  public static drawBarbun(ctx: CanvasRenderingContext2D, size: number, vx: number, swimPhase: number) {
    ctx.save();
    const facing = vx >= 0 ? 1 : -1;
    ctx.scale(facing, 1);

    const tailWiggle = Math.sin(swimPhase * 3.5) * 5;

    // Kırmızı-Turuncu Barbun Gövdesi
    const grad = ctx.createLinearGradient(0, -size * 0.5, 0, size * 0.5);
    grad.addColorStop(0, '#ea580c');
    grad.addColorStop(0.5, '#f97316');
    grad.addColorStop(1, '#ffedd5');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.46, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#c2410c';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Çatal Kuyruk
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(-size - 12, -9 + tailWiggle);
    ctx.lineTo(-size - 7, tailWiggle * 0.5);
    ctx.lineTo(-size - 12, 9 + tailWiggle);
    ctx.closePath();
    ctx.fill();

    // Çene Altı Bıyıkları (Barbun his bıyığı)
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(size * 0.7, size * 0.2);
    ctx.lineTo(size * 0.55, size * 0.5);
    ctx.stroke();

    // Göz
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(size * 0.55, -size * 0.08, 2.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
