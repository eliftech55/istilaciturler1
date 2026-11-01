import { InvasiveSpeciesInfo, LevelConfig, QuizQuestion } from '../types/game';

export const INVASIVE_SPECIES: Record<string, InvasiveSpeciesInfo> = {
  rapana: {
    id: 'rapana',
    scientificName: 'Rapana venosa',
    commonName: 'Deniz Salyangozu',
    description: 'Büyük, sert ve kahverengimsi spiral kabuklu yırtıcı bir yumuşakça. Karadeniz\'in yerel midyelerini ve istiridyelerini delerek tüketir.',
    origin: 'Japon Denizi ve Sarı Deniz (Asya Pasifik)',
    ecologicalImpact: 'Gemilerin balast sularıyla 1940\'larda Karadeniz\'e taşınmıştır. Doğal düşmanı olmadığından yerli midye yataklarını tüketerek ekolojik dengeyi bozar.',
    count: 5,
    startingPower: 100,
    captureThreshold: 100,
    powerLimit: 200,
    contactDamage: 50,
    color: '#ea580c',
    accentColor: '#fdba74',
    speed: 1.2,
    size: 34,
    habitat: 'bottom'
  },
  mnemiopsis: {
    id: 'mnemiopsis',
    scientificName: 'Mnemiopsis leidyi',
    commonName: 'Deniz Cevizi (Taraklı Denizanası)',
    description: 'Yarı saydam, loblu ve ışık kırıcı kirpikleriyle gökkuşağı rengi parıldayan taraklı canlı. Çok yüksek üreme hızına sahiptir.',
    origin: 'Kuzey Amerika Atlantik Kıyıları',
    ecologicalImpact: '1980\'lerin başında balast suyuyla girdi. Hamsi larvalarını ve hamsinin beslendiği zooplanktonları tüketerek 1989 hamsi krizine yol açtı.',
    count: 2,
    startingPower: 300,
    captureThreshold: 200,
    powerLimit: 400,
    contactDamage: 100,
    color: '#06b6d4',
    accentColor: '#a5f3fc',
    speed: 1.6,
    size: 42,
    habitat: 'midwater'
  },
  mya: {
    id: 'mya',
    scientificName: 'Mya arenaria',
    commonName: 'Kum Midyesi',
    description: 'Oval, tebeşirimsi beyaz kabuklu ve uzun sifonlu kum içine gömülen istilacı çift kabuklu yumuşakça.',
    origin: 'Kuzey Atlantik Kıyıları',
    ecologicalImpact: 'Kum ve çamur tabanlarda yerel dip faunası türlerinin yaşam alanlarını daraltır ve sediment dengesini bozar.',
    count: 3,
    startingPower: 500,
    captureThreshold: 300,
    powerLimit: 600,
    contactDamage: 150,
    color: '#e2e8f0',
    accentColor: '#cbd5e1',
    speed: 1.4,
    size: 38,
    habitat: 'bottom'
  },
  anadara: {
    id: 'anadara',
    scientificName: 'Anadara kagoshimensis',
    commonName: 'Dikenli / Göçmen Midye',
    description: 'Koyu renkli, derin yivli radyal kabuk çizgilerine sahip ve hemoglobin içeren kırmızı kanlı egzotik çift kabuklu.',
    origin: 'Batı Pasifik Okyanusu',
    ecologicalImpact: 'Düşük oksijenli dip sularında bile hızla çoğalarak Karadeniz\'in yerel midye türlerini rekabette saf dışı bırakır.',
    count: 4,
    startingPower: 700,
    captureThreshold: 400,
    powerLimit: 800,
    contactDamage: 200,
    color: '#b91c1c',
    accentColor: '#fca5a5',
    speed: 1.8,
    size: 36,
    habitat: 'bottom'
  },
  liza: {
    id: 'liza',
    scientificName: 'Liza haematocheila',
    commonName: 'Rus Kefali (So-iuy Kefali)',
    description: 'Hızlı yüzen, kırmızımsı göz çevresine ve güçlü yüzgeçlere sahip yırtıcı istilacı kefal balığı türü.',
    origin: 'Amur Nehri ve Japon Denizi Havzası',
    ecologicalImpact: '1970\'lerde Karadeniz\'e insanlar tarafından aşılandı. Yerli balık türlerinin besin kaynaklarına ortak olup baskı kurmaktadır.',
    count: 5,
    startingPower: 900,
    captureThreshold: 500,
    powerLimit: 1000,
    contactDamage: 250,
    color: '#eab308',
    accentColor: '#fef08a',
    speed: 2.6,
    size: 46,
    habitat: 'free'
  }
};

export const GAME_LEVELS: LevelConfig[] = [
  {
    levelNumber: 1,
    name: '1. Seviye: Rapana venosa',
    subtitle: 'Deniz Salyangozu Avı',
    species: INVASIVE_SPECIES.rapana,
    seaweedCount: 10,
    bonusCount: 2,
    targetCount: 5,
    introMessage: 'Karadeniz zemininde yerel midyeleri tüketen 5 adet Rapana venosa tespit edildi. Yosun toplayıp 100 enerjiye ulaş ve özel ağınla onları araştırma kapsülüne al!'
  },
  {
    levelNumber: 2,
    name: '2. Seviye: Mnemiopsis leidyi',
    subtitle: 'Deniz Cevizi İstilası',
    species: INVASIVE_SPECIES.mnemiopsis,
    seaweedCount: 12,
    bonusCount: 2,
    targetCount: 2,
    introMessage: 'Dikkat! Hamsi larvalarını yutan şeffaf Mnemiopsis leidyi akıntıya kapılmış. Yakalamak için en az 200 enerjiye ihtiyacın var!'
  },
  {
    levelNumber: 3,
    name: '3. Seviye: Mya arenaria',
    subtitle: 'Kum Midyesi Tehdidi',
    species: INVASIVE_SPECIES.mya,
    seaweedCount: 14,
    bonusCount: 3,
    targetCount: 3,
    introMessage: 'Kum zemine gömülen Mya arenaria türü yerel kabukluları yok ediyor. 300 enerji eşiğini aş ve onları yakala!'
  },
  {
    levelNumber: 4,
    name: '4. Seviye: Anadara kagoshimensis',
    subtitle: 'Dikenli Yabancı Midye',
    species: INVASIVE_SPECIES.anadara,
    seaweedCount: 15,
    bonusCount: 3,
    targetCount: 4,
    introMessage: 'Zorlu görev! Derin sularda hızla yayılan 4 adet Anadara kagoshimensis bulundu. Yakalama eşiği: 400 Enerji!'
  },
  {
    levelNumber: 5,
    name: '5. Seviye: Liza haematocheila',
    subtitle: 'Rus Kefali Takibi',
    species: INVASIVE_SPECIES.liza,
    seaweedCount: 18,
    bonusCount: 4,
    targetCount: 5,
    introMessage: 'Büyük Final! Hızlı ve güçlü 5 Rus Kefali yüzüyor. Onlar senden güçlüyken sana doğru hücum ederler. Enerjini 500\'e çıkarıp Karadeniz\'i kurtar!'
  }
];

export const TUTORIAL_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: 'İstilacı yabancı türler Karadeniz gibi kapalı denizlere genellikle nasıl ulaşır?',
    options: [
      'Gemilerin balast suları ve uluslararası deniz ticaretiyle',
      'Kuşların göç yollarını takip ederek yüzerek',
      'Denizaltı volkanlarının patlaması sonucunda'
    ],
    correctIndex: 0,
    explanation: 'Doğru! Yük gemileri dengede kalmak için aldıkları balast sularını başka denizlere boşalttığında yabancı canlılar Karadeniz ekosistemine taşınır.'
  },
  {
    id: 2,
    question: 'ZETA\'nın istilacı türleri yakalamak için hangi temel güvenlik kuralına uyması gerekir?',
    options: [
      'Canlılara gövdesiyle çarparak onları durdurmak',
      'Doğrudan dokunmadan, yeterli enerji toplayıp uzaktan özel ağ fırlatmak',
      'Onları su yüzeyine çekip kurutmak'
    ],
    correctIndex: 1,
    explanation: 'Harika! İstilacı türlere doğrudan temas etmek ZETA\'nın enerjisini hızla tüketir. Uzaktan fırlatılan özel ağ güvenli yakalama sağlar.'
  },
  {
    id: 3,
    question: 'ZETA robotu deniz altındaki tükenen enerjisini nasıl yeniler?',
    options: [
      'Karadeniz yosunlarını toplayarak fotosentez enerjisi emerek (+25)',
      'Deniz suyunu doğrudan içerek',
      'Karaya çıkıp şarj istasyonuna bağlanarak'
    ],
    correctIndex: 0,
    explanation: 'Tebrikler! Karadeniz yosunları ZETA\'nın bataryasını +25 güç ile yeniler ve her yosun +10 puan kazandırır.'
  }
];
