import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../App";
import ProfileModal from "./modals/ProfileModal";
import SettingsModal from "./modals/SettingsModal";

// ─────────────────────────────────────────────
//  KONFIGURASI LAYOUT – Ubah di sini saja!
// ─────────────────────────────────────────────
const LAYOUT = {
  headerHeight: { mobile: "64px", desktop: "72px" },
  footerHeight: { mobile: "56px", desktop: "48px" },
  contentMaxWidth: "1000px",
  slideAreaHeight: "calc(100dvh - 64px - 56px)",
};

// ─────────────────────────────────────────────
//  DATA SLIDES
// ─────────────────────────────────────────────
const GERAK_SLIDES = [
  { type: "gerak-simak", label: "Ayo Simak" },
  { type: "gerak-bertanya", label: "Ayo Bertanya" },
  { type: "gerak-coba-tebak-image", label: "Coba Tebak" },
  { type: "gerak-coba-tebak-pertanyaan", label: "Coba Tebak Pertanyaan", background: "/assets/latar-slide/4.png" },
  { type: "gerak-materi", label: "Materi Gerak" },
  { type: "kecepatan-rumus", label: "Kecepatan dan Rumus" },
  { type: "contoh-soal-gerak", label: "Contoh Soal Gerak" },
  { type: "praktikum-gerak", label: "Praktikum Gerak" },
  { type: "tabel-pengamatan-gerak", label: "Tabel Pengamatan" },
  { type: "analisis-yuk-gerak", label: "Analisis Yuk" },
  { type: "mari-simpulkan-gerak", label: "Mari Simpulkan" },
  { type: "quiz", label: "Quiz Time", background: "/assets/latar-slide/4.png" },
  { type: "score", label: "Skor", background: "/assets/latar-slide/4.png" },
];

const GAYA_SLIDES = [
  { type: "gaya-simak", label: "Ayo Simak" },
  { type: "gaya-bertanya", label: "Ayo Bertanya" },
  { type: "gaya-coba-tebak", label: "Coba Tebak" },
  { type: "gaya-coba-tebak-pertanyaan", label: "Coba Tebak Pertanyaan", background: "/assets/latar-slide/4.png" },
  { type: "materi-gaya", label: "Materi Gaya" },
  { type: "newton", label: "Newton" },
  { type: "hukum-newton-i", label: "Hukum Newton I" },
  { type: "hukum-newton-ii", label: "Hukum Newton II" },
  { type: "hukum-newton-iii", label: "Hukum Newton III" },
  { type: "contoh-soal-gaya", label: "Contoh Soal Gaya" },
  { type: "praktikum-gaya", label: "Praktikum Gaya" },
  { type: "tabel-pengamatan-gaya", label: "Tabel Pengamatan" },
  { type: "analisis-yuk-gaya", label: "Analisis Yuk" },
  { type: "mari-simpulkan-gaya", label: "Mari Simpulkan" },
  { type: "quiz", label: "Quiz Time", background: "/assets/latar-slide/4.png" },
  { type: "score", label: "Skor", background: "/assets/latar-slide/4.png" },
];

// ─────────────────────────────────────────────
//  SOAL QUIZ
// ─────────────────────────────────────────────
const GERAK_QUESTIONS = [
  {
    question: "1. Sebuah mobil menempuh jarak 100 meter dalam waktu 20 sekon. Kelajuan mobil tersebut adalah …",
    options: [
      { label: "A", text: "2 m/s", correct: false },
      { label: "B", text: "4 m/s", correct: false },
      { label: "C", text: "5 m/s", correct: true },
      { label: "D", text: "10 m/s", correct: false },
    ],
  },
  {
    question: "2. Perubahan posisi benda dari titik awal ke titik akhir disebut …",
    options: [
      { label: "A", text: "Massa", correct: false },
      { label: "B", text: "Gaya", correct: false },
      { label: "C", text: "Perpindahan", correct: true },
      { label: "D", text: "Percepatan", correct: false },
    ],
  },
  {
    question: "3. Mobil A dan Mobil B menempuh lintasan 100 meter. Mobil A sampai dalam 10 sekon, Mobil B dalam 20 sekon. Mobil yang memiliki kelajuan lebih besar adalah …",
    options: [
      { label: "A", text: "Mobil A", correct: true },
      { label: "B", text: "Mobil B", correct: false },
      { label: "C", text: "Keduanya sama", correct: false },
      { label: "D", text: "Tidak dapat ditentukan", correct: false },
    ],
  },
  {
    question: "4. Rumus yang tepat untuk menghitung kelajuan adalah …",
    options: [
      { label: "A", text: "Kelajuan = massa x percepatan", correct: false },
      { label: "B", text: "Kelajuan = jarak : waktu", correct: true },
      { label: "C", text: "Kelajuan = jarak x kelajuan", correct: false },
      { label: "D", text: "Kelajuan = gaya : percepatan", correct: false },
    ],
  },
  {
    question: "5. Benda dikatakan bergerak apabila …",
    options: [
      { label: "A", text: "Bentuknya berubah", correct: false },
      { label: "B", text: "Warnanya berubah", correct: false },
      { label: "C", text: "Posisinya berubah terhadap titik acuan", correct: true },
      { label: "D", text: "Ukurannya membesar", correct: false },
    ],
  },
];

const GAYA_QUESTIONS = [
  {
    question: "1. Jika gaya yang diberikan pada benda diperbesar, maka benda akan …",
    options: [
      { label: "A", text: "bergerak lebih lambat", correct: false },
      { label: "B", text: "tetap diam", correct: false },
      { label: "C", text: "bergerak lebih cepat", correct: true },
      { label: "D", text: "massanya bertambah", correct: false },
    ],
  },
  {
    question: "2. Sebuah benda bermassa besar lebih sulit dipercepat karena …",
    options: [
      { label: "A", text: "gayanya kecil", correct: false },
      { label: "B", text: "massanya besar", correct: true },
      { label: "C", text: "waktunya lama", correct: false },
      { label: "D", text: "jaraknya jauh", correct: false },
    ],
  },
  {
    question: "3. Sebuah troli bermassa 2 kg didorong dengan gaya 10 N. Besar percepatan troli adalah …",
    options: [
      { label: "A", text: "2 m/s²", correct: false },
      { label: "B", text: "5 m/s²", correct: true },
      { label: "C", text: "10 m/s²", correct: false },
      { label: "D", text: "20 m/s²", correct: false },
    ],
  },
  {
    question: "4. Troli A bermassa kecil dan Troli B bermassa besar didorong dengan gaya yang sama. Troli yang memiliki percepatan lebih besar adalah …",
    options: [
      { label: "A", text: "Troli A", correct: true },
      { label: "B", text: "Troli B", correct: false },
      { label: "C", text: "Keduanya sama", correct: false },
      { label: "D", text: "Tidak bergerak", correct: false },
    ],
  },
  {
    question: "5. Saat siswa mendorong dinding, tangan terasa mendapat dorongan balik. Peristiwa ini membuktikan …",
    options: [
      { label: "A", text: "Hukum 1 Newton", correct: false },
      { label: "B", text: "Hukum 2 Newton", correct: false },
      { label: "C", text: "Hukum 3 Newton", correct: true },
      { label: "D", text: "Gaya gesek", correct: false },
    ],
  },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const GERAK_QUIZ_AUDIO = [
  "/assets/backsound/Audio Operator/0014_1.m4a",
  "/assets/backsound/Audio Operator/0014_2.m4a",
  "/assets/backsound/Audio Operator/0014_3.m4a",
  "/assets/backsound/Audio Operator/0014_4.m4a",
  "/assets/backsound/Audio Operator/0014_5.m4a",
];
const GAYA_QUIZ_AUDIO = [
  "/assets/backsound/Audio Operator/0022_1.m4a",
  "/assets/backsound/Audio Operator/0022_2.m4a",
  "/assets/backsound/Audio Operator/0022_3.m4a",
  "/assets/backsound/Audio Operator/0022_4.m4a",
  "/assets/backsound/Audio Operator/0022_5.m4a",
];

// ─────────────────────────────────────────────
//  KOMPONEN UTAMA
// ─────────────────────────────────────────────
function TopicFlow({ topic }) {
  const { navigateTo, playSound, playNarration } = useApp();

  const slides = topic === "gerak" ? GERAK_SLIDES : GAYA_SLIDES;
  const questions = topic === "gerak" ? GERAK_QUESTIONS : GAYA_QUESTIONS;

  // ── State umum ──
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizQuestion, setQuizQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizResult, setQuizResult] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // ── State Praktikum Gerak ──
  const [carPos, setCarPos] = useState(0);
  const [carMoving, setCarMoving] = useState(false);
  const [gerakTrials, setGerakTrials] = useState([]);
  const [gerakStartPos, setGerakStartPos] = useState(0);
  const [gerakStartVel, setGerakStartVel] = useState(0);
  const [gerakAcc, setGerakAcc] = useState(0);
  const [gerakElapsed, setGerakElapsed] = useState(0);
  const [gerakStopAt, setGerakStopAt] = useState(12);
  /** idle: belum jalan / setelah reset | running | paused: stop manual | finished: selesai (batas/waktu) */
  const [gerakSimState, setGerakSimState] = useState("idle");
  const carInterval = useRef(null);
  const carStartTime = useRef(null);
  const gerakLiveRef = useRef({ pos: 0, vel: 0, elapsed: 0 });
  const gerakPausedElapsedRef = useRef(0);

  // ── State Praktikum Gaya ──
  const [trolleyPos, setTrolleyPos] = useState(0);
  const [trolleyMoving, setTrolleyMoving] = useState(false);
  const [gayaTrials, setGayaTrials] = useState([]);
  const [gayaFlash, setGayaFlash] = useState(null);
  const [gayaInputForce, setGayaInputForce] = useState(100);
  const [gayaInputMass, setGayaInputMass] = useState(50);
  const [gayaFriction, setGayaFriction] = useState(0);
  const [gayaVelocity, setGayaVelocity] = useState(0);
  const [gayaAcceleration, setGayaAcceleration] = useState(0);
  const [gayaElapsed, setGayaElapsed] = useState(0);
  const [gayaUseExtraBox, setGayaUseExtraBox] = useState(false);
  const [gayaUseFridge, setGayaUseFridge] = useState(false);
  const [gayaPanel, setGayaPanel] = useState({
    gaya: true,
    jumlah: true,
    nilai: true,
    massa: true,
    kecepatan: true,
    percepatan: true,
  });
  const trolleyInterval = useRef(null);
  const trolleyStartTime = useRef(null);
  const videoRef = useRef(null);
  const scoreAudioRef = useRef(null);
  const lastHoverSoundRef = useRef({ key: "", at: 0 });

  // ── Derived ──
  const slide = slides[currentSlide];
  const backgroundImage = slide.background || "/assets/latar-slide/2.jpg";
  const showWordmark = backgroundImage === "/assets/latar-slide/2.jpg";

  // ── Navigasi ──
  const canGoPrev = () => slide.type !== "quiz" && slide.type !== "score" && currentSlide > 0;
  const canGoNext = () => {
    if (slide.type === "quiz" || slide.type === "score") return false;
    return currentSlide < slides.length - 1;
  };

  const goNext = () => {
    if (canGoNext()) {
      playSound("ui-next");
      setCurrentSlide((i) => i + 1);
    }
  };
  const goPrev = () => {
    if (canGoPrev()) {
      playSound("ui-back");
      setCurrentSlide((i) => i - 1);
    }
  };
  const click = (fn, sound = "click") => {
    playSound(sound);
    fn();
  };
  const playHover = (key, sound = "click") => {
    const now = Date.now();
    const sameKey = lastHoverSoundRef.current.key === key;
    const tooSoon = now - lastHoverSoundRef.current.at < 250;
    if (sameKey && tooSoon) return;
    lastHoverSoundRef.current = { key, at: now };
    playSound(sound);
  };

  // ── Narasi per slide ──
  useEffect(() => {
    const map = {
      "gerak-simak": "ui-ayo-simak",
      "gerak-bertanya": "slide-gerak-bertanya",
      "gerak-coba-tebak-image": "slide-gerak-coba-tebak",
      "gerak-coba-tebak-pertanyaan": "slide-gerak-coba-tebak-pertanyaan",
      "gerak-materi": "slide-gerak-materi",
      "kecepatan-rumus": "slide-kecepatan-rumus",
      "contoh-soal-gerak": "contoh-soal-gerak",
      "analisis-yuk-gerak": "slide-gerak-analisis",
      "mari-simpulkan-gerak": "slide-gerak-simpulkan",
      "gaya-simak": "ui-ayo-simak",
      "gaya-bertanya": "ui-ayo-bertanya",
      "gaya-coba-tebak": "slide-gaya-coba-tebak",
      "gaya-coba-tebak-pertanyaan": "slide-gaya-coba-tebak-pertanyaan",
      "materi-gaya": "slide-gaya-materi",
      newton: "slide-gaya-newton",
      "hukum-newton-i": "slide-gaya-newton-1",
      "hukum-newton-ii": "slide-gaya-newton-2",
      "hukum-newton-iii": "slide-gaya-newton-3",
      "contoh-soal-gaya": "contoh-soal-gaya",
      "analisis-yuk-gaya": "slide-gaya-analisis",
      "mari-simpulkan-gaya": "slide-gaya-simpulkan",
      score: "slide-gerak-score",
    };
    const key = map[slide.type];
    if (key) playNarration(key);
  }, [slide.type, topic, playNarration]);

  useEffect(() => {
    if (slide.type !== "quiz") return;
    const list = topic === "gerak" ? GERAK_QUIZ_AUDIO : GAYA_QUIZ_AUDIO;
    const quizAudio = list[quizQuestion];
    if (quizAudio) playNarration(quizAudio);
  }, [slide.type, topic, quizQuestion, playNarration]);

  // ── Cleanup interval saat unmount ──
  useEffect(
    () => () => {
      clearInterval(carInterval.current);
      clearInterval(trolleyInterval.current);
    },
    [],
  );
  useEffect(() => {
    if (gerakSimState === "idle") setCarPos(clamp(gerakStartPos, -100, 100));
  }, [gerakStartPos, gerakSimState]);

  // ───────────────────────────────────────────
  //  PRAKTIKUM GERAK – logika
  // ───────────────────────────────────────────
  const resetGerak = () => {
    clearInterval(carInterval.current);
    setCarMoving(false);
    setGerakSimState("idle");
    setCarPos(clamp(gerakStartPos, -100, 100));
    setGerakElapsed(0);
    gerakPausedElapsedRef.current = 0;
    gerakLiveRef.current = { pos: clamp(gerakStartPos, -100, 100), vel: gerakStartVel, elapsed: 0 };
  };

  const stopCar = () => {
    if (!carMoving) return;
    clearInterval(carInterval.current);
    setCarMoving(false);
    gerakPausedElapsedRef.current = gerakLiveRef.current.elapsed;
    setGerakSimState("paused");
  };

  const startCar = (resume = false) => {
    if (carMoving) return;
    clearInterval(carInterval.current);
    playSound("click");
    const stopAtSeconds = clamp(Number(gerakStopAt) || 12, 0.5, 60);
    const dt = 0.05;

    let initialPos;
    let initialVel;
    let baseElapsed = 0;

    if (resume && gerakSimState === "paused") {
      initialPos = clamp(gerakLiveRef.current.pos, -100, 100);
      initialVel = gerakLiveRef.current.vel;
      baseElapsed = gerakPausedElapsedRef.current;
    } else {
      initialPos = clamp(gerakStartPos, -100, 100);
      initialVel = gerakStartVel;
      baseElapsed = 0;
      gerakPausedElapsedRef.current = 0;
      setCarPos(initialPos);
    }

    setCarMoving(true);
    setGerakSimState("running");
    carStartTime.current = Date.now();

    const state = { pos: initialPos, vel: initialVel };
    gerakLiveRef.current = { pos: state.pos, vel: state.vel, elapsed: baseElapsed };
    setGerakElapsed(baseElapsed);

    carInterval.current = setInterval(() => {
      state.vel += gerakAcc * dt;
      state.pos += state.vel * dt;
      if (state.pos > 100) state.pos = 100;
      if (state.pos < -100) state.pos = -100;

      setCarPos(state.pos);
      const segmentElapsed = (Date.now() - carStartTime.current) / 1000;
      const elapsed = baseElapsed + segmentElapsed;
      setGerakElapsed(elapsed);
      gerakLiveRef.current = { pos: state.pos, vel: state.vel, elapsed };

      if (state.pos === 100 || state.pos === -100 || elapsed >= stopAtSeconds) {
        clearInterval(carInterval.current);
        setCarMoving(false);
        setGerakSimState("finished");
        gerakPausedElapsedRef.current = 0;
        setGerakTrials((prev) => {
          const next = [
            ...prev,
            {
              no: prev.length + 1,
              posisiAwal: `${gerakStartPos} m`,
              v0: `${gerakStartVel.toFixed(1)} m/s`,
              a: `${gerakAcc.toFixed(1)} m/s²`,
              waktu: `${elapsed.toFixed(1)} s`,
              posisiAkhir: `${state.pos.toFixed(1)} m`,
            },
          ];
          return next.slice(-5);
        });
      }
    }, 50);
  };

  // ───────────────────────────────────────────
  //  PRAKTIKUM GAYA – logika
  // ───────────────────────────────────────────
  const effectiveMass = Math.max(1, Number(gayaInputMass) + (gayaUseExtraBox ? 50 : 0) + (gayaUseFridge ? 200 : 0));
  const frictionForce = Math.abs(gayaInputForce) * gayaFriction * 0.9;
  const netForce = Math.max(0, Math.abs(gayaInputForce) - frictionForce) * (gayaInputForce >= 0 ? 1 : -1);
  const canRunTrolley = !trolleyMoving && Math.abs(gayaInputForce) > 0;

  const startTrolley = () => {
    if (!canRunTrolley) return;
    playSound("click");
    setTrolleyPos(0);
    setTrolleyMoving(true);
    setGayaElapsed(0);
    trolleyStartTime.current = Date.now();
    const dt = 0.05;
    const a = netForce / effectiveMass;
    let v = gayaVelocity;
    let pos = 0;
    setGayaAcceleration(a);

    clearInterval(trolleyInterval.current);
    trolleyInterval.current = setInterval(() => {
      v += a * dt;
      pos += v * dt * 2;
      pos = clamp(pos, -100, 100);
      setGayaVelocity(v);
      setTrolleyPos(pos);

      const elapsed = (Date.now() - trolleyStartTime.current) / 1000;
      setGayaElapsed(elapsed);

      if (Math.abs(pos) >= 100 || elapsed >= 12 || Math.abs(v) < 0.01) {
        clearInterval(trolleyInterval.current);
        setTrolleyMoving(false);
        setGayaTrials((prev) => {
          const updated = [
            ...prev,
            {
              no: prev.length + 1,
              F: `${gayaInputForce.toFixed(0)} N`,
              m: `${effectiveMass.toFixed(0)} kg`,
              a: `${a.toFixed(2)} m/s²`,
              v: `${v.toFixed(2)} m/s`,
              t: `${elapsed.toFixed(1)} s`,
            },
          ];
          setGayaFlash(updated.length);
          setTimeout(() => setGayaFlash(null), 800);
          return updated.slice(-6);
        });
      }
    }, 50);
  };

  // ── Quiz ──
  const handleQuizAnswer = (option) => {
    if (quizAnswered) return;
    playSound(`ui-option-${option.label.toLowerCase()}`);
    setQuizAnswered(true);
    if (option.correct) {
      setQuizScore((s) => s + 20);
      setQuizResult("correct");
      playSound("success");
    } else {
      setQuizResult("wrong");
      playSound("error");
    }
    setTimeout(() => {
      setQuizResult(null);
      setQuizAnswered(false);
      if (option.correct) {
        if (quizQuestion < questions.length - 1) setQuizQuestion((q) => q + 1);
        else setCurrentSlide((i) => i + 1);
      }
    }, 1500);
  };

  // ── Score backsound ──
  useEffect(() => {
    if (slide.type !== "score") return;
    try {
      scoreAudioRef.current = new Audio("/assets/backsound/Tampilan Nilai.wav");
      scoreAudioRef.current.play().catch(() => {});
    } catch (_) {}
    return () => {
      scoreAudioRef.current?.pause();
      scoreAudioRef.current = null;
    };
  }, [slide.type]);

  // ─────────────────────────────────────────
  //  SUB-KOMPONEN
  // ─────────────────────────────────────────
  const PapanPutih = ({ children, inset = "7%" }) => (
    <div className="h-full flex items-center justify-center">
      <div className="relative h-full">
        <img src="/assets/elemen/Papan Putih.png" alt="" className="h-full w-auto object-contain" />
        <div className="absolute overflow-hidden rounded-lg" style={{ inset, contain: "strict" }}>
          <div className="w-full h-full">{children}</div>
        </div>
      </div>
    </div>
  );

  const PapanPutihFull = ({ children, inset = "8%" }) => (
    <div className="w-full flex items-center justify-center" style={{ height: LAYOUT.slideAreaHeight }}>
      <div className="relative h-full w-fit mx-auto">
        <img src="/assets/elemen/Papan Putih.png" alt="" className="h-full w-auto object-contain" />
        <div className="absolute overflow-y-auto rounded-lg" style={{ inset }}>
          {children}
        </div>
      </div>
    </div>
  );

  const CharacterAndBoard = ({ characterSrc, characterAlt, boardInset = "7%", children }) => (
    <div className="w-full flex justify-center" style={{ height: LAYOUT.slideAreaHeight }}>
      <div className="flex items-end h-full w-full max-w-6xl">
        <div className="shrink-0 h-4/5 flex items-end">
          <img src={characterSrc} alt={characterAlt} className="h-full w-auto object-contain" />
        </div>
        <div className="flex-1 h-full min-w-0">
          <PapanPutih inset={boardInset}>{children}</PapanPutih>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────
  //  RENDER SLIDE
  // ─────────────────────────────────────────
  const renderSlide = () => {
    switch (slide.type) {
      case "gerak-simak":
        return (
          <CharacterAndBoard characterSrc="/assets/elemen/Gaya/Ayo Simak.png" characterAlt="Ayo Simak" boardInset="6%">
            <div className="flex flex-col justify-center items-center h-full w-full gap-2">
              <video ref={videoRef} src="/assets/elemen/Gerak/Animasi mobil Bergerak.mp4" controls playsInline className="w-full lg:h-[55%] h-[70%] object-cover bg-black" />
            </div>
          </CharacterAndBoard>
        );

      case "gerak-bertanya":
        return (
          <CharacterAndBoard characterSrc="/assets/elemen/Gerak/Ayo bertanya.png" characterAlt="Ayo Bertanya">
            <div className="w-full h-full flex flex-col justify-center overflow-y-auto">
              <img src="/assets/elemen/Gaya/Ayo bertanya 1.png" alt="Pertanyaan 1" className="w-full object-contain" />
              <img src="/assets/elemen/Gaya/Ayo bertanya 2.png" alt="Pertanyaan 2" className="w-full object-contain" />
            </div>
          </CharacterAndBoard>
        );

      case "gerak-coba-tebak-image":
        return (
          <CharacterAndBoard characterSrc="/assets/elemen/Gerak/Coba Tebak.png" characterAlt="Coba Tebak" boardInset="8%">
            <img src="/assets/elemen/Gaya/Coba Tebak 1.png" alt="Coba Tebak" className="w-full h-full object-contain" />
          </CharacterAndBoard>
        );

      case "gerak-coba-tebak-pertanyaan":
        return (
          <PapanPutihFull>
            <div className="font-oswald text-gray-800 p-2">
              <h3 className="text-center text-xl lg:text-4xl font-bold mb-3">COBA TEBAK</h3>
              <ol className="list-decimal list-inside space-y-3 text-base md:text-lg lg:text-3xl leading-snug">
                <li>Menurutmu, apa yang menyebabkan perbedaan gerak antara mobil yang satu dengan yang lain pada video??</li>
                <li>Jika waktu perjalanan kedua mobil sama, mengapa jarak yang ditempuh bisa berbeda?</li>
                <li>Menurut pendapatmu, faktor apa yang memengaruhi kelajuan mobil?</li>
              </ol>
            </div>
          </PapanPutihFull>
        );

      case "gerak-materi":
        return (
          <PapanPutihFull>
            <div className="font-oswald text-gray-800 text-base md:text-lg lg:text-3xl leading-relaxed space-y-3">
              <p>
                <span className="font-bold">Gerak</span> adalah perubahan posisi suatu objek yang diamati dari suatu titik acuan. Posisi merupakan kedudukan suatu benda terhadap titik acuan. Sembarang titik yang dipakai sebagai patokan
                untuk menentukan posisi suatu benda disebut titik acuan.
              </p>
              <p>
                Makhluk hidup bergerak dengan kemauan dirinya sendiri untuk mencari makanan. Lemari bergerak karena didorong. Gerak semua benda tersebut memerlukan perpindahan dari satu posisi ke posisi lainnya, atau panjang lintasan yang
                dilalui gerak benda yang dikenal dengan jarak tempuh.
              </p>
              <p>
                <span className="font-bold">Jarak</span> adalah panjang lintasan yang ditempuh oleh suatu benda. Jarak merupakan besaran skalar (hanya memiliki nilai tanpa arah).
              </p>
              <p className="italic text-gray-500">Contoh: Putri berlari sejauh 10 m.</p>
              <p>
                <span className="font-bold">Perpindahan</span> adalah perubahan kedudukan suatu benda pada selang waktu tertentu. Perpindahan merupakan besaran vektor (memiliki nilai dan arah).
              </p>
              <p className="italic text-gray-500">Contoh: Desri pergi ke sekolah sejauh 25 km dari rumah.</p>
              <p>
                <span className="font-bold">Kelajuan</span> adalah seberapa cepat jarak ditempuh dalam waktu tertentu tanpa memperhitungkan arah. Kelajuan termasuk besaran skalar.
              </p>
            </div>
          </PapanPutihFull>
        );

      case "kecepatan-rumus":
        return (
          <PapanPutihFull>
            <div className="font-oswald text-gray-800 text-base md:text-lg lg:text-3xl leading-relaxed space-y-3">
              <p>
                <span className="font-bold">Kecepatan</span> adalah besarnya perpindahan per satuan waktu. Kecepatan adalah besaran vektor yang memiliki nilai, satuan, dan arah.
              </p>
              <p>Dengan membandingkan jarak tempuh terhadap waktu, kamu akan mendapatkan nilai kelajuan sebuah benda. Kelajuan dapat ditulis dalam persamaan:</p>
              <div className="bg-gray-100 rounded-lg p-3 text-center text-2xl md:text-3xl font-bold tracking-wide">v = s / t</div>
              <ul className="space-y-1">
                <li>
                  <span className="font-bold">v</span> = Kelajuan (m/s)
                </li>
                <li>
                  <span className="font-bold">s</span> = Jarak tempuh (m)
                </li>
                <li>
                  <span className="font-bold">t</span> = Waktu (s)
                </li>
              </ul>
            </div>
          </PapanPutihFull>
        );

      case "contoh-soal-gerak":
        return (
          <PapanPutihFull>
            <div className="w-full h-full flex flex-col gap-2 p-1">
              <h3 className="font-bubblegum text-center text-primary-teal text-base md:text-xl">Contoh Soal Gerak</h3>
              <video controls playsInline className="w-full h-[70%] object-contain bg-black rounded-lg" src="/assets/elemen/Gerak/Contoh Soal.MOV" />
            </div>
          </PapanPutihFull>
        );

      case "praktikum-gerak":
        return renderPraktikumGerak();

      case "tabel-pengamatan-gerak":
        return (
          <PapanPutihFull>
            <img src="/assets/elemen/Gerak/Tabel Pengamatan.png" alt="Tabel Pengamatan" className="w-full h-full object-contain" />
          </PapanPutihFull>
        );

      case "analisis-yuk-gerak":
        return (
          <CharacterAndBoard characterSrc="/assets/elemen/Gerak/Analisis Yuk.png" characterAlt="Analisis Yuk">
            <div className="w-full h-full flex flex-col justify-center overflow-y-auto">
              <img src="/assets/elemen/Gerak/Analisis Yuk 1.png" alt="Analisis Yuk 1" className="w-full object-contain" />
              <img src="/assets/elemen/Gerak/Analisis Yuk 2.png" alt="Analisis Yuk 2" className="w-full object-contain" />
            </div>
          </CharacterAndBoard>
        );

      case "mari-simpulkan-gerak":
        return (
          <CharacterAndBoard characterSrc="/assets/elemen/Gerak/Mari Simpulkan.png" characterAlt="Mari Simpulkan">
            <div className="w-full h-full flex flex-col justify-center overflow-y-auto">
              <img src="/assets/elemen/Gerak/Mari Simpulkan 1.png" alt="Mari Simpulkan 1" className="w-[80%] object-contain" />
              <img src="/assets/elemen/Gerak/Mari Simpulkan 2.png" alt="Mari Simpulkan 2" className="w-full object-contain" />
            </div>
          </CharacterAndBoard>
        );

      case "gaya-simak":
        return (
          <CharacterAndBoard characterSrc="/assets/elemen/Gaya/Ayo Simak.png" characterAlt="Ayo Simak" boardInset="6%">
            <div className="flex flex-col justify-center items-center h-full w-full gap-2">
              <video ref={videoRef} src="/assets/elemen/Gaya/Gaya.mp4" controls playsInline className="w-full lg:h-[60%] h-[90%] object-contain bg-black" />
            </div>
          </CharacterAndBoard>
        );

      case "gaya-bertanya":
        return (
          <CharacterAndBoard characterSrc="/assets/elemen/Gaya/Ayo bertanya.png" characterAlt="Ayo Bertanya">
            <div className="w-full h-full flex flex-col justify-center overflow-y-auto">
              <img src="/assets/elemen/Gaya/Ayo bertanya 1.png" alt="Pertanyaan 1" className="w-full object-contain" />
              <img src="/assets/elemen/Gaya/Ayo bertanya 2.png" alt="Pertanyaan 2" className="w-full object-contain" />
            </div>
          </CharacterAndBoard>
        );

      case "gaya-coba-tebak":
        return (
          <CharacterAndBoard characterSrc="/assets/elemen/Gaya/Coba Tebak.png" characterAlt="Coba Tebak" boardInset="8%">
            <img src="/assets/elemen/Gaya/Coba Tebak 1.png" alt="Coba Tebak" className="w-full h-full object-contain" />
          </CharacterAndBoard>
        );

      case "gaya-coba-tebak-pertanyaan":
        return (
          <PapanPutihFull>
            <div className="font-oswald text-gray-800 p-2">
              <h3 className="text-center text-xl lg:text-3xl font-bold mb-3">COBA TEBAK</h3>
              <ol className="list-decimal list-inside space-y-3 text-base md:text-lg lg:text-3xl leading-snug">
                <li>Menurut dugaanmu, apa yang terjadi jika gaya dorong diperbesar?</li>
                <li>Bagaimana dugaanmu jika massa benda diperbesar?</li>
                <li>Menurut pendapatmu, apa hubungan gaya dengan percepatan?</li>
              </ol>
            </div>
          </PapanPutihFull>
        );

      case "materi-gaya":
        return (
          <PapanPutihFull>
            <div className="font-oswald text-gray-800 text-base md:text-lg lg:text-3xl leading-relaxed space-y-3">
              <p>
                <span className="font-bold">Gaya</span> adalah sesuatu berupa dorongan atau tarikan yang dapat menyebabkan benda bergerak. Tidak hanya itu, gaya juga dapat menyebabkan perubahan arah, bentuk, dan kecepatan sebuah benda. Gaya
                dapat mengubah arah gerak, maka gaya termasuk besaran vektor.
              </p>
              <p>
                Ada berbagai macam gaya yang dapat langsung kita rasakan dalam kehidupan sehari-hari. Dapatkah kamu menyebutkan contoh-contoh gaya otot, gaya pegas, gaya magnet, gaya mesin, gaya listrik, gaya gravitasi, dan gaya gesekan?
              </p>
            </div>
          </PapanPutihFull>
        );

      case "newton":
        return (
          <PapanPutihFull>
            <div className="font-oswald text-gray-800 text-base md:text-lg lg:text-3xl leading-relaxed space-y-3">
              <p>
                Pada abad ke-17 atau sekitar tahun 1600-an, seorang pemikir sekaligus ilmuwan bernama <span className="font-bold">Isaac Newton</span> merumuskan hukum-hukum gerak yang sangat luar biasa. Newton menemukan bahwa persoalan
                gerak yang terjadi di alam semesta dapat diterangkan dengan hanya tiga hukum yang sederhana.
              </p>
            </div>
          </PapanPutihFull>
        );

      case "hukum-newton-i":
        return (
          <PapanPutihFull>
            <div className="font-oswald text-gray-800 text-base md:text-lg lg:text-3xl leading-relaxed space-y-3">
              <h3 className="font-bold">Hukum 1 Newton</h3>
              <p>
                Jika resultan gaya-gaya yang bekerja pada benda bernilai nol, benda itu akan diam selamanya atau akan bergerak lurus beraturan dengan kecepatan tetap. Hukum ini berbicara tentang konsep{" "}
                <span className="font-bold">kelembaman</span> benda atau dikenal juga sebagai sifat kemalasan benda untuk mengubah posisinya.
              </p>
            </div>
          </PapanPutihFull>
        );

      case "hukum-newton-ii":
        return (
          <PapanPutihFull>
            <div className="font-oswald text-gray-800 text-base md:text-lg lg:text-3xl leading-relaxed space-y-3">
              <h3 className="font-bold">Hukum 2 Newton</h3>
              <p>Percepatan sebuah benda sebanding dengan gaya yang diberikan dan berbanding terbalik dengan massanya. Hukum II Newton dituangkan dalam rumus:</p>
              <div className="text-center text-2xl md:text-3xl font-bold italic my-2">F = m × a</div>
              <p>F = Gaya (Newton) &nbsp;|&nbsp; m = massa (kg) &nbsp;|&nbsp; a = percepatan (m/s²)</p>
            </div>
          </PapanPutihFull>
        );

      case "hukum-newton-iii":
        return (
          <PapanPutihFull>
            <div className="font-oswald text-gray-800 text-base md:text-lg lg:text-3xl leading-relaxed space-y-3">
              <h3 className="font-bold">Hukum 3 Newton – Aksi-Reaksi</h3>
              <p>
                Untuk setiap aksi gaya akan ada gaya reaksi yang sama besar tetapi berlawanan arah. Perlu ditekankan bahwa gaya aksi dan gaya reaksi bekerja pada benda yang <span className="font-bold">berbeda</span>.
              </p>
              <p className="italic text-gray-500">Contoh: Saat mendorong dinding, tangan merasakan dorongan balik dari dinding.</p>
            </div>
          </PapanPutihFull>
        );

      case "contoh-soal-gaya":
        return (
          <PapanPutihFull>
            <div className="w-full h-full flex flex-col gap-2 p-1">
              <h3 className="font-bubblegum text-center text-primary-teal text-base md:text-xl">Contoh Soal Gaya</h3>
              <video controls playsInline className="w-full h-[70%] object-contain bg-black rounded-lg" src="/assets/elemen/Gaya/Contoh Soal.MOV" />
            </div>
          </PapanPutihFull>
        );

      case "praktikum-gaya":
        return renderPraktikumGaya();

      case "tabel-pengamatan-gaya":
        return (
          <PapanPutihFull>
            <img src="/assets/elemen/Gaya/Tabel Pengamatan.png" alt="Tabel Pengamatan" className="w-full h-full object-contain" />
          </PapanPutihFull>
        );

      case "analisis-yuk-gaya":
        return (
          <CharacterAndBoard characterSrc="/assets/elemen/Gaya/Analisis Yuk.png" characterAlt="Analisis Yuk">
            <div className="w-full h-full flex flex-col justify-center overflow-y-auto">
              <img src="/assets/elemen/Gaya/Analisis Yuk 1.png" alt="Analisis Yuk 1" className="w-full object-contain" />
              <img src="/assets/elemen/Gaya/Analisis Yuk 2.png" alt="Analisis Yuk 2" className="w-full object-contain" />
            </div>
          </CharacterAndBoard>
        );

      case "mari-simpulkan-gaya":
        return (
          <CharacterAndBoard characterSrc="/assets/elemen/Gaya/Mari Simpulkan.png" characterAlt="Mari Simpulkan">
            <div className="w-full h-full flex flex-col justify-center overflow-y-auto">
              <img src="/assets/elemen/Gaya/Mari Simpulkan 1.png" alt="Mari Simpulkan 1" className="w-[80%] object-contain" />
              <img src="/assets/elemen/Gaya/Mari Simpulkan 2.png" alt="Mari Simpulkan 2" className="w-full object-contain" />
            </div>
          </CharacterAndBoard>
        );

      case "quiz":
        return renderQuiz();
      case "score":
        return renderScore();
      default:
        return null;
    }
  };

  // ─────────────────────────────────────────
  //  RENDER: Praktikum Gerak  ← FIXED
  //  – Satu scroll container, padding bersih
  // ─────────────────────────────────────────
  const renderPraktikumGerak = () =>
    (() => {
      const TRACK_INSET = 6;
      const trackPercent = (value) => TRACK_INSET + ((value + 100) / 200) * (100 - TRACK_INSET * 2);
      return (
        <div className="w-full max-w-4xl mx-auto rounded-2xl bg-white/85 border border-white/70 shadow-lg flex flex-col overflow-hidden" style={{ height: LAYOUT.slideAreaHeight }}>
          {/* ── Header strip ── */}
          <div className="shrink-0 bg-linear-to-r from-sky-500 to-blue-600 px-4 py-2.5">
            <h3 className="font-bubblegum text-white text-base md:text-xl tracking-wide">🚗 Praktikum Gerak</h3>
            <p className="text-sky-100 text-[0.65rem] md:text-xs mt-0.5">Atur parameter lalu tekan Start. Titik nol (0) ada di garis merah tengah lintasan.</p>
          </div>

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto px-3 py-3 md:px-5 md:py-4">
            <div className="flex flex-col gap-3 font-fredoka">
              {/* Controls 3-col */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { label: "Posisi awal (m)", val: gerakStartPos, set: (v) => setGerakStartPos(clamp(v, -100, 100)), min: -100, max: 100, step: 1 },
                  { label: "Kecepatan awal (m/s)", val: gerakStartVel, set: (v) => setGerakStartVel(clamp(v, -30, 30)), min: -30, max: 30, step: 0.5 },
                  { label: "Percepatan (m/s²)", val: gerakAcc, set: (v) => setGerakAcc(clamp(v, -20, 20)), min: -20, max: 20, step: 0.5 },
                ].map(({ label, val, set, min, max, step }) => (
                  <div key={label} className="bg-sky-50 rounded-xl p-2.5 border border-sky-200 flex flex-col gap-1">
                    <span className="font-semibold text-sky-700 text-[0.7rem]">{label}</span>
                    <div className="flex items-center gap-1.5">
                      <input type="number" min={min} max={max} step={step} value={val} onChange={(e) => set(Number(e.target.value))} className="w-20 px-2 py-1 rounded-lg border border-sky-300 text-sm text-center font-mono bg-white" />
                      <span className="text-sky-400 font-mono text-xs">
                        [{min}…{max}]
                      </span>
                    </div>
                    <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => set(Number(e.target.value))} className="w-full accent-blue-500 h-1.5" />
                  </div>
                ))}
              </div>
              <div className="bg-sky-50 rounded-xl p-2.5 border border-sky-200 text-xs flex items-center justify-between gap-2">
                <span className="font-semibold text-sky-700 text-[0.7rem]">Waktu berhenti otomatis (s)</span>
                <input
                  type="number"
                  min={0.5}
                  max={60}
                  step={0.5}
                  value={gerakStopAt}
                  onChange={(e) => setGerakStopAt(clamp(Number(e.target.value), 0.5, 60))}
                  className="w-20 px-2 py-1 rounded-lg border border-sky-300 text-sm text-center font-mono bg-white"
                />
              </div>

              {/* Lintasan simulasi */}
              <div className="relative border-2 border-sky-300 overflow-hidden shadow-inner" style={{ height: "7.5rem" }}>
                {/* Sky */}
                <div className="absolute inset-0 bg-linear-to-b from-sky-300 to-sky-400" />
                {/* Clouds */}
                <div className="absolute top-1.5 left-[8%] w-14 h-4 bg-white/70 rounded-full blur-sm" />
                <div className="absolute top-0.5 left-[20%] w-20 h-5 bg-white/70 rounded-full blur-sm" />
                <div className="absolute top-2 right-[15%] w-16 h-4 bg-white/70 rounded-full blur-sm" />
                {/* Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-linear-to-b from-green-400 to-green-600" />
                {/* Road */}
                <div className="absolute bottom-6 left-0 right-0 h-2.5 bg-gray-700" />
                {/* Dashed center line on road */}
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="absolute bottom-7 h-0.5 w-5 bg-yellow-300 opacity-60" style={{ left: `${i * 10 + 2}%` }} />
                ))}
                {/* Center axis marker */}
                <div className="absolute top-0 bottom-6 left-1/2 border-l-2 border-dashed border-red-500/60" />
                {/* Scale ticks */}
                {[-100, -50, 0, 50, 100].map((p) => (
                  <div key={p} className="absolute bottom-9 flex flex-col items-center pointer-events-none" style={{ left: `${trackPercent(p)}%`, transform: "translateX(-50%)" }}>
                    <div className="w-px h-1.5 bg-white/60" />
                    <span className="text-[0.55rem] text-white/80 font-bold mt-0.5">{p}</span>
                  </div>
                ))}
                {/* Car */}
                <motion.img
                  src="/assets/elemen/Gerak/Mobil.png"
                  alt="Mobil"
                  className="absolute bottom-[1.6rem] h-10 md:h-12 w-auto -translate-x-1/2 -scale-x-100 origin-center drop-shadow-lg"
                  style={{ scaleX: 1 }}
                  animate={{ left: `${trackPercent(carPos)}%` }}
                  transition={{ type: "tween", duration: 0.05 }}
                />
              </div>

              {/* Buttons & live readout */}
              <div className="flex items-center flex-wrap gap-2 justify-center">
                {(gerakSimState === "idle" || gerakSimState === "finished") && (
                  <button className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold shadow transition-all disabled:opacity-50" onClick={() => startCar(false)} disabled={carMoving}>
                    ▶ Start
                  </button>
                )}
                {gerakSimState === "running" && (
                  <button className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-sm font-semibold shadow transition-all disabled:opacity-50" onClick={stopCar} disabled={!carMoving}>
                    ■ Stop
                  </button>
                )}
                {gerakSimState === "paused" && (
                  <button className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold shadow transition-all disabled:opacity-50" onClick={() => startCar(true)} disabled={carMoving}>
                    ▶ Play
                  </button>
                )}
                <button className="px-5 py-2 rounded-xl bg-gray-500 hover:bg-gray-600 active:scale-95 text-white text-sm font-semibold shadow transition-all" onClick={resetGerak}>
                  ↺ Reset
                </button>
                <div className="flex gap-3 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-mono px-3 py-1.5 rounded-lg">
                  <span>⏱ {gerakElapsed.toFixed(1)} s</span>
                  <span className="text-sky-300">|</span>
                  <span>📍 {carPos.toFixed(1)} m</span>
                </div>
              </div>

              {/* Data table */}
              <div className="border border-sky-200 overflow-hidden">
                <div className="bg-blue-600 text-white text-[0.7rem] md:text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5">
                  <span>📋</span> Tabel Hasil Percobaan
                </div>
                <div className="overflow-x-auto max-h-32 md:max-h-40">
                  <table className="w-full text-[0.6rem] md:text-xs min-w-[480px]">
                    <thead className="bg-sky-50 sticky top-0">
                      <tr className="text-sky-700 text-left">
                        <th className="px-2 py-1.5 font-semibold">No. Percobaan</th>
                        <th className="px-2 py-1.5 font-semibold">Posisi Awal (m)</th>
                        <th className="px-2 py-1.5 font-semibold">Kecepatan Awal (m/s)</th>
                        <th className="px-2 py-1.5 font-semibold">Percepatan (m/s²)</th>
                        <th className="px-2 py-1.5 font-semibold">Waktu Tempuh (s)</th>
                        <th className="px-2 py-1.5 font-semibold">Posisi Akhir (m)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gerakTrials.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center text-gray-400 py-4 italic text-xs">
                            Belum ada percobaan – tekan Start untuk mulai!
                          </td>
                        </tr>
                      )}
                      {gerakTrials.map((trial) => (
                        <motion.tr key={trial.no} initial={{ backgroundColor: "#dbeafe" }} animate={{ backgroundColor: "#ffffff" }} transition={{ duration: 1.2 }} className="border-t border-sky-100">
                          <td className="px-2 py-1 font-bold text-blue-600">{trial.no}</td>
                          <td className="px-2 py-1">{trial.posisiAwal}</td>
                          <td className="px-2 py-1">{trial.v0}</td>
                          <td className="px-2 py-1">{trial.a}</td>
                          <td className="px-2 py-1">{trial.waktu}</td>
                          <td className="px-2 py-1">{trial.posisiAkhir}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* breathing space at bottom */}
              <div className="h-1" />
            </div>
          </div>
        </div>
      );
    })();

  // ─────────────────────────────────────────
  //  RENDER: Praktikum Gaya  ← REVAMPED
  //  – Orang mendorong secara animasi
  //  – Responsive + mobile-friendly
  // ─────────────────────────────────────────
  const renderPraktikumGaya = () => {
    // Hitung posisi orang: tepat di belakang benda sesuai arah dorong
    const pushingRight = gayaInputForce >= 0;
    // Jarak orang terhadap benda dibuat dinamis supaya tidak menumpuk
    // saat ada tambahan box/kulkas.
    const personOffset = 10 + (gayaUseExtraBox ? 5 : 0) + (gayaUseFridge ? 4 : 0) + (trolleyMoving ? 2 : 0);

    const rawPersonX = pushingRight
      ? trolleyPos - personOffset // orang di kiri, dorong ke kanan
      : trolleyPos + personOffset; // orang di kanan, dorong ke kiri
    const personX = clamp(rawPersonX, -95, 95);
    const personLeftPct = `${((personX + 100) / 200) * 100}%`;

    // Lean angle saat mendorong
    const leanAngle = trolleyMoving
      ? pushingRight
        ? 28
        : -28 // condong ke arah dorong (+ = kanan/maju)
      : 0;

    // Flip orang agar menghadap benar
    const personScaleX = pushingRight ? 1 : -1;

    return (
      <div className="w-full max-w-4xl mx-auto rounded-2xl bg-white/85 border border-white/70 shadow-lg flex flex-col overflow-hidden" style={{ height: LAYOUT.slideAreaHeight }}>
        {/* Header */}
        <div className="shrink-0 bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2.5">
          <h3 className="font-bubblegum text-white text-base md:text-xl tracking-wide">💪 Praktikum Gaya</h3>
          <p className="text-amber-100 text-[0.65rem] md:text-xs mt-0.5">Simulasi Hukum Newton II — F = m × a. Variasikan gaya dan massa, amati perubahan percepatan.</p>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-3 py-3 md:px-5 md:py-4">
          <div className="flex flex-col gap-3 font-fredoka">
            {/* Panel toggle checkboxes */}
            <div className="flex flex-wrap gap-1.5 text-[0.65rem] md:text-xs">
              {[
                ["gaya", "⚡ Gaya"],
                ["jumlah", "📦 Jumlah"],
                ["nilai", "🔢 Resultan"],
                ["massa", "⚖️ Massa"],
                ["kecepatan", "💨 Kecepatan"],
                ["percepatan", "🚀 Percepatan"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg border cursor-pointer select-none transition-colors
                    ${gayaPanel[key] ? "bg-amber-100 border-amber-400 text-amber-800" : "bg-gray-50 border-gray-200 text-gray-400"}`}
                >
                  <input type="checkbox" checked={gayaPanel[key]} onChange={(e) => setGayaPanel((prev) => ({ ...prev, [key]: e.target.checked }))} className="accent-amber-500 w-3 h-3" />
                  {label}
                </label>
              ))}
            </div>

            {/* Controls grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {/* Gaya */}
              <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 flex flex-col gap-1">
                <span className="font-semibold text-amber-700 text-[0.7rem]">⚡ Gaya diberikan (N)</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={-500}
                    max={500}
                    value={gayaInputForce}
                    onChange={(e) => setGayaInputForce(clamp(Number(e.target.value), -500, 500))}
                    className="w-20 px-2 py-1 rounded-lg border border-amber-300 text-sm text-center font-mono bg-white"
                  />
                  <span className="text-amber-400 text-[0.65rem]">{gayaInputForce >= 0 ? "→ kanan" : "← kiri"}</span>
                </div>
                <input type="range" min={-500} max={500} value={gayaInputForce} onChange={(e) => setGayaInputForce(Number(e.target.value))} className="w-full accent-amber-500 h-1.5" />
              </div>
              {/* Massa */}
              <div className="bg-orange-50 rounded-xl p-2.5 border border-orange-200 flex flex-col gap-1">
                <span className="font-semibold text-orange-700 text-[0.7rem]">⚖️ Massa dasar (kg)</span>
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={gayaInputMass}
                  onChange={(e) => setGayaInputMass(clamp(Number(e.target.value), 1, 300))}
                  className="w-full px-2 py-1.5 rounded-lg border border-orange-300 text-sm font-mono bg-white"
                />
                <div className="flex gap-2 flex-wrap mt-0.5">
                  <label className="flex items-center gap-1 text-[0.65rem] bg-white border border-orange-200 px-1.5 py-0.5 rounded-md cursor-pointer">
                    <input type="checkbox" checked={gayaUseExtraBox} onChange={(e) => setGayaUseExtraBox(e.target.checked)} className="accent-orange-500 w-3 h-3" />
                    📦 +50 kg
                  </label>
                  <label className="flex items-center gap-1 text-[0.65rem] bg-white border border-orange-200 px-1.5 py-0.5 rounded-md cursor-pointer">
                    <input type="checkbox" checked={gayaUseFridge} onChange={(e) => setGayaUseFridge(e.target.checked)} className="accent-orange-500 w-3 h-3" />
                    🧊 +200 kg
                  </label>
                </div>
              </div>
              {/* Gesekan */}
              <div className="bg-red-50 rounded-xl p-2.5 border border-red-200 flex flex-col gap-1">
                <span className="font-semibold text-red-700 text-[0.7rem]">🛑 Gesekan: {gayaFriction.toFixed(2)}</span>
                <input type="range" min={0} max={1} step="0.05" value={gayaFriction} onChange={(e) => setGayaFriction(Number(e.target.value))} className="w-full accent-red-500 mt-1 h-1.5" />
                <div className="flex justify-between text-[0.6rem] text-red-400 mt-0.5">
                  <span>Licin</span>
                  <span>Kasar</span>
                </div>
              </div>
            </div>

            {/* Massa total pill */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="bg-orange-100 border border-orange-300 text-orange-700 font-semibold px-3 py-1 rounded-full">⚖️ Massa total: {effectiveMass.toFixed(0)} kg</span>
              <span className="bg-amber-100 border border-amber-300 text-amber-700 font-semibold px-3 py-1 rounded-full">🧮 Resultan F: {netForce.toFixed(1)} N</span>
              <span className="bg-blue-100 border border-blue-300 text-blue-700 font-semibold px-3 py-1 rounded-full">🚀 a teori: {(netForce / effectiveMass).toFixed(2)} m/s²</span>
            </div>

            {/* ── ARENA SIMULASI ── */}
            <div className="relative rounded-2xl border-2 border-amber-300 overflow-hidden shadow-inner" style={{ height: "8.5rem" }}>
              {/* Background: langit */}
              <div className="absolute inset-0 bg-linear-to-b from-sky-300 via-sky-400 to-sky-500" />
              {/* Awan */}
              <div className="absolute top-2 left-[5%] w-16 h-4 bg-white/70 rounded-full blur-sm" />
              <div className="absolute top-0.5 left-[30%] w-24 h-5 bg-white/70 rounded-full blur-sm" />
              <div className="absolute top-2 right-[10%] w-18 h-4 bg-white/70 rounded-full blur-sm" />
              {/* Lantai */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-b from-amber-200 to-amber-400" />
              {/* Garis lantai */}
              <div className="absolute bottom-8 left-0 right-0 h-0.5 bg-amber-600/40" />
              {/* Pola lantai */}
              {[...Array(12)].map((_, i) => (
                <div key={i} className="absolute bottom-0 h-8 border-r border-amber-500/20" style={{ left: `${(i + 1) * 8.3}%` }} />
              ))}

              {/* ── ORANG ── dengan animasi dorong */}
              <motion.div
                className="absolute select-none z-20"
                style={{ bottom: "1.9rem", transformOrigin: "bottom center" }}
                animate={{
                  left: personLeftPct,
                  rotate: leanAngle,
                  scaleX: personScaleX,
                }}
                transition={{ type: "tween", duration: 0.05 }}
              >
                {/* Tubuh orang SVG sederhana */}
                <svg width="28" height="52" viewBox="0 0 28 52" className="drop-shadow-md" style={{ transform: "translateX(-50%)" }}>
                  {/* Kepala */}
                  <circle cx="14" cy="7" r="6.5" fill="#FBBF24" stroke="#92400E" strokeWidth="1.2" />
                  {/* Rambut */}
                  <ellipse cx="14" cy="2" rx="6" ry="3" fill="#92400E" />
                  {/* Mata */}
                  <circle cx="11.5" cy="6.5" r="1" fill="#1e293b" />
                  <circle cx="16.5" cy="6.5" r="1" fill="#1e293b" />
                  {/* Mulut senyum / serius saat dorong */}
                  {trolleyMoving ? <line x1="11" y1="9.5" x2="17" y2="9.5" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" /> : <path d="M11 9 Q14 11.5 17 9" stroke="#92400E" strokeWidth="1.2" fill="none" strokeLinecap="round" />}
                  {/* Badan */}
                  <rect x="8" y="14" width="12" height="18" rx="3" fill="#3B82F6" stroke="#1d4ed8" strokeWidth="1" />
                  {/* Kerah baju */}
                  <polygon points="14,14 11,18 17,18" fill="#FBBF24" />
                  {/* Tangan kiri */}
                  <motion.line
                    x1="8"
                    y1="17"
                    x2="2"
                    y2="26"
                    stroke="#FBBF24"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    animate={{ x2: trolleyMoving ? (pushingRight ? 3 : 22) : 2, y2: trolleyMoving ? 22 : 26 }}
                    transition={{ type: "tween", duration: 0.05 }}
                  />
                  {/* Tangan kanan */}
                  <motion.line
                    x1="20"
                    y1="17"
                    x2="26"
                    y2="26"
                    stroke="#FBBF24"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    animate={{ x2: trolleyMoving ? (pushingRight ? 25 : 5) : 26, y2: trolleyMoving ? 22 : 26 }}
                    transition={{ type: "tween", duration: 0.05 }}
                  />
                  {/* Kaki kiri */}
                  <motion.line
                    x1="11"
                    y1="32"
                    x2="8"
                    y2="48"
                    stroke="#1e293b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    animate={trolleyMoving ? { x2: [8, 5, 11], y2: [48, 44, 48] } : { x2: 8, y2: 48 }}
                    transition={trolleyMoving ? { repeat: Infinity, duration: 0.4, ease: "linear" } : {}}
                  />
                  {/* Kaki kanan */}
                  <motion.line
                    x1="17"
                    y1="32"
                    x2="20"
                    y2="48"
                    stroke="#1e293b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    animate={trolleyMoving ? { x2: [20, 23, 17], y2: [48, 44, 48] } : { x2: 20, y2: 48 }}
                    transition={trolleyMoving ? { repeat: Infinity, duration: 0.4, ease: "linear", delay: 0.2 } : {}}
                  />
                  {/* Sepatu */}
                  <ellipse cx="9" cy="49" rx="5" ry="2" fill="#1e293b" />
                  <ellipse cx="19" cy="49" rx="5" ry="2" fill="#1e293b" />
                  {/* Efek keringat / effort saat dorong */}
                  {trolleyMoving && (
                    <g>
                      <motion.text x="20" y="8" fontSize="8" fill="#60A5FA" animate={{ y: [8, 0, 8], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                        💧
                      </motion.text>
                    </g>
                  )}
                </svg>
              </motion.div>

              {/* ── BENDA (trolley + extra) ── */}
              <motion.div className="absolute flex items-end gap-0.5 z-10" style={{ bottom: "2rem" }} animate={{ left: `${((trolleyPos + 100) / 200) * 100}%`, x: "-50%" }} transition={{ type: "tween", duration: 0.05 }}>
                {/* Kotak utama */}
                <div className="relative">
                  <div className="w-12 md:w-14 h-10 rounded-t-lg bg-linear-to-b from-amber-600 to-amber-800 text-white text-[0.55rem] flex items-center justify-center font-bold shadow-md border border-amber-900">{gayaInputMass} kg</div>
                  {/* Roda */}
                  <div className="absolute -bottom-1.5 left-1 w-3 h-3 rounded-full bg-gray-700 border border-gray-500 shadow" />
                  <div className="absolute -bottom-1.5 right-1 w-3 h-3 rounded-full bg-gray-700 border border-gray-500 shadow" />
                </div>
                {/* Extra box */}
                {gayaUseExtraBox && (
                  <div className="relative">
                    <div className="w-10 h-8 rounded-t-lg bg-linear-to-b from-amber-500 to-amber-700 text-white text-[0.5rem] flex items-center justify-center font-bold shadow border border-amber-800">50 kg</div>
                    <div className="absolute -bottom-1.5 left-1 w-2.5 h-2.5 rounded-full bg-gray-700 border border-gray-500 shadow" />
                    <div className="absolute -bottom-1.5 right-1 w-2.5 h-2.5 rounded-full bg-gray-700 border border-gray-500 shadow" />
                  </div>
                )}
                {/* Kulkas */}
                {gayaUseFridge && (
                  <div className="relative">
                    <div className="w-9 h-14 rounded-t-lg bg-linear-to-b from-cyan-500 to-cyan-700 text-white text-[0.45rem] flex items-center justify-center font-bold shadow border border-cyan-800">
                      🧊
                      <br />
                      200 kg
                    </div>
                    <div className="absolute -bottom-1.5 left-0.5 w-2.5 h-2.5 rounded-full bg-gray-700 border border-gray-500 shadow" />
                    <div className="absolute -bottom-1.5 right-0.5 w-2.5 h-2.5 rounded-full bg-gray-700 border border-gray-500 shadow" />
                  </div>
                )}
              </motion.div>

              {/* ── Panah gaya ── */}
              {Math.abs(gayaInputForce) > 0 && (
                <motion.div
                  className="absolute z-30 pointer-events-none"
                  style={{ bottom: "3.5rem" }}
                  animate={{
                    left: `${((trolleyPos + 100) / 200) * 100}%`,
                    x: pushingRight ? "4px" : "-100%",
                  }}
                  transition={{ type: "tween", duration: 0.05 }}
                >
                  <div className="flex items-center gap-0.5 text-[0.6rem] font-bold" style={{ color: gayaInputForce >= 0 ? "#dc2626" : "#2563eb" }}>
                    {!pushingRight && <span>◀</span>}
                    <div
                      className="h-1 rounded-full"
                      style={{
                        width: `${Math.min(60, Math.abs(gayaInputForce) / 8 + 8)}px`,
                        background: gayaInputForce >= 0 ? "#dc2626" : "#2563eb",
                      }}
                    />
                    {pushingRight && <span>▶</span>}
                    <span className="ml-0.5 bg-white/80 px-1 rounded text-[0.55rem]">{Math.abs(gayaInputForce)}N</span>
                  </div>
                </motion.div>
              )}

              {/* Info panel di pojok */}
              <div className="absolute top-1.5 right-1.5 bg-white/90 rounded-lg px-2 py-1 text-[0.6rem] font-mono shadow border border-white/50 leading-relaxed">
                {gayaPanel.gaya && <div className="text-amber-700">F: {gayaInputForce.toFixed(0)} N</div>}
                {gayaPanel.jumlah && <div className="text-gray-600">📦 ×{1 + (gayaUseExtraBox ? 1 : 0) + (gayaUseFridge ? 1 : 0)}</div>}
                {gayaPanel.nilai && <div className="text-red-600">Fnet: {netForce.toFixed(1)} N</div>}
                {gayaPanel.massa && <div className="text-orange-700">m: {effectiveMass.toFixed(0)} kg</div>}
                {gayaPanel.kecepatan && <div className="text-blue-700">v: {gayaVelocity.toFixed(2)} m/s</div>}
                {gayaPanel.percepatan && <div className="text-green-700">a: {gayaAcceleration.toFixed(2)} m/s²</div>}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-sm font-semibold shadow transition-all disabled:opacity-50"
                onMouseEnter={() => playHover("start-gaya", "ui-next")}
                onClick={startTrolley}
                disabled={!canRunTrolley}
              >
                {trolleyMoving ? "💪 Mendorong…" : "▶ Start"}
              </button>
              <button
                className="px-5 py-2 rounded-xl bg-gray-500 hover:bg-gray-600 active:scale-95 text-white text-sm font-semibold shadow transition-all"
                onMouseEnter={() => playHover("reset-gaya", "ui-back")}
                onClick={() => {
                  clearInterval(trolleyInterval.current);
                  setTrolleyMoving(false);
                  setTrolleyPos(0);
                  setGayaVelocity(0);
                  setGayaAcceleration(0);
                  setGayaElapsed(0);
                }}
              >
                ↺ Reset
              </button>
              <div className="flex gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-mono px-3 py-1.5 rounded-lg">
                <span>⏱ {gayaElapsed.toFixed(1)} s</span>
              </div>
            </div>

            {/* Data table */}
            <div className="border border-amber-200 overflow-hidden">
              <div className="bg-amber-600 text-white text-[0.7rem] md:text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5">
                <span>📋</span> Tabel Hasil Percobaan
              </div>
              <div className="overflow-x-auto max-h-28 md:max-h-36">
                <table className="w-full text-[0.6rem] md:text-xs min-w-[460px]">
                  <thead className="bg-amber-50 sticky top-0">
                    <tr className="text-amber-700 text-left">
                      <th className="px-2 py-1.5 font-semibold">No.</th>
                      <th className="px-2 py-1.5 font-semibold">Gaya (N)</th>
                      <th className="px-2 py-1.5 font-semibold">Massa (kg)</th>
                      <th className="px-2 py-1.5 font-semibold">a (m/s²)</th>
                      <th className="px-2 py-1.5 font-semibold">v akhir</th>
                      <th className="px-2 py-1.5 font-semibold">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gayaTrials.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center text-gray-400 py-4 italic text-xs">
                          Belum ada percobaan – tekan Start untuk mulai!
                        </td>
                      </tr>
                    )}
                    {gayaTrials.map((row, i) => (
                      <motion.tr key={row.no} initial={{ backgroundColor: "#fef3c7" }} animate={{ backgroundColor: gayaFlash === i + 1 ? "#fef3c7" : "#ffffff" }} transition={{ duration: 1 }} className="border-t border-amber-100">
                        <td className="px-2 py-1 font-bold text-amber-700">{row.no}</td>
                        <td className="px-2 py-1">{row.F}</td>
                        <td className="px-2 py-1">{row.m}</td>
                        <td className="px-2 py-1 font-semibold text-green-700">{row.a}</td>
                        <td className="px-2 py-1">{row.v}</td>
                        <td className="px-2 py-1">{row.t}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* breathing space */}
            <div className="h-1" />
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────
  //  RENDER: Quiz
  // ─────────────────────────────────────────
  const renderQuiz = () => (
    <div className="w-full relative px-2 py-3 overflow-y-auto" style={{ height: LAYOUT.slideAreaHeight }}>
      <PapanPutihFull>
        <div className="flex flex-col justify-between h-full w-full gap-4">
          <div className="space-y-4">
            <h3 className="font-bubblegum text-2xl md:text-3xl text-red-500 text-center mb-3 md:mb-4">Quiz Time!</h3>
            <AnimatePresence mode="wait">
              <motion.div key={quizQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="font-fredoka text-sm md:text-lg text-gray-800 mb-3 leading-relaxed">{questions[quizQuestion].question}</p>
                <div className="grid grid-cols-2 gap-2 md:gap-2.5 mt-2">
                  {questions[quizQuestion].options.map((opt, i) => (
                    <motion.div
                      key={i}
                      className={[
                        "flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 transition-colors w-full",
                        quizAnswered && opt.correct
                          ? "bg-green-100 border-green-500 cursor-default"
                          : quizAnswered
                            ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-100"
                            : "bg-gray-50 border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-primary-blue",
                      ].join(" ")}
                      onMouseEnter={() => playHover(`quiz-${quizQuestion}-${opt.label}`, `ui-option-${opt.label.toLowerCase()}`)}
                      onClick={() => handleQuizAnswer(opt)}
                      whileHover={{ scale: quizAnswered ? 1 : 1.02 }}
                      whileTap={{ scale: quizAnswered ? 1 : 0.98 }}
                    >
                      <img src={`/assets/elemen/${opt.label}.png`} alt={opt.label} className="w-7 h-7 md:w-9 md:h-9 object-contain shrink-0" />
                      <span className="font-fredoka text-sm md:text-base text-gray-800">{opt.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-between mt-3 font-fredoka text-gray-400 text-xs md:text-sm">
            <span>
              Pertanyaan {quizQuestion + 1} dari {questions.length}
            </span>
            <span>Skor: {quizScore}</span>
          </div>

          <AnimatePresence>
            {quizResult && (
              <motion.div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 rounded-2xl z-50 gap-2" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
                <img src={quizResult === "correct" ? "/assets/elemen/Benar.png" : "/assets/elemen/Salah.png"} alt={quizResult} className="w-16 md:w-20 h-auto object-contain" />
                <p className="font-bubblegum text-lg md:text-xl text-gray-800">{quizResult === "correct" ? "Benar!" : "Salah! Coba lagi"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PapanPutihFull>
    </div>
  );

  // ─────────────────────────────────────────
  //  RENDER: Score
  // ─────────────────────────────────────────
  const renderScore = () => (
    <div className="w-full relative overflow-hidden flex flex-col items-center justify-center gap-3" style={{ height: LAYOUT.slideAreaHeight }}>
      <PapanPutihFull>
        <div className="flex flex-col items-center justify-center h-full w-full gap-3">
          <motion.h2 className="font-bubblegum text-3xl md:text-4xl text-primary-orange drop-shadow-md" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            KEREN!!
          </motion.h2>
          <motion.p className="font-fredoka text-base md:text-xl text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            Kamu sudah menyelesaikan materi {topic === "gerak" ? "Gerak" : "Gaya"}
          </motion.p>
          <motion.span className="font-bubblegum text-6xl md:text-7xl text-green-500 drop-shadow-md" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: "spring" }}>
            {quizScore}
          </motion.span>
          <motion.button
            className="inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3
                       bg-linear-to-b from-primary-blue to-[#3572b0]
                       rounded-3xl text-white font-fredoka text-base md:text-lg
                       shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
            onMouseEnter={() => playHover("score-back-home", "ui-back")}
            onClick={() => click(() => navigateTo("ayo-belajar"), "ui-back")}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src="/assets/elemen/Balik Menu Utama.png" alt="" className="w-6 md:w-7 h-auto object-contain" />
            Kembali ke Ayo Belajar
          </motion.button>
        </div>
      </PapanPutihFull>
    </div>
  );

  // ─────────────────────────────────────────
  //  RENDER UTAMA
  // ─────────────────────────────────────────
  return (
    <motion.div className="w-full h-full fixed inset-0 flex flex-col overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Latar belakang */}
      <div className="absolute inset-0 -z-10">
        <img src={backgroundImage} alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* ══ HEADER ══ */}
      <header className="relative shrink-0 flex items-center justify-between px-3 md:px-5 z-50" style={{ height: LAYOUT.headerHeight.mobile }}>
        <motion.img
          src="/assets/elemen/Balik Menu Utama.png"
          alt="Kembali"
          className="w-10 md:w-12 h-auto object-contain cursor-pointer"
          onMouseEnter={() => playHover("header-back-home", "ui-back")}
          onClick={() => click(() => navigateTo("ayo-belajar"), "ui-back")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        />

        {showWordmark && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src={topic === "gerak" ? "/assets/elemen/Gerak/Gerak Kata.png" : "/assets/elemen/Gaya/Gaya Kata.png"}
              alt={topic}
              className="h-10 md:h-14 lg:h-20 w-auto object-contain"
              onError={(e) => {
                if (topic === "gaya") e.currentTarget.src = "/assets/elemen/Gaya/Gaya.png";
              }}
            />
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-3">
          <motion.img
            src="/assets/elemen/Informasi.png"
            alt="Info"
            className="w-10 md:w-12 h-auto object-contain cursor-pointer"
            onMouseEnter={() => playHover("header-info", "ui-info")}
            onClick={() => click(() => setShowProfile(true), "ui-info")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          />
          <motion.img
            src="/assets/elemen/Pengaturan.png"
            alt="Pengaturan"
            className="w-10 md:w-12 h-auto object-contain cursor-pointer"
            onMouseEnter={() => playHover("header-settings", "ui-settings")}
            onClick={() => click(() => setShowSettings(true), "ui-settings")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          />
        </div>
      </header>

      {/* ══ KONTEN ══ */}
      <main className="shrink-0 flex items-center justify-center px-3 md:px-5 overflow-hidden" style={{ height: LAYOUT.slideAreaHeight }}>
        <div className="w-full" style={{ maxWidth: LAYOUT.contentMaxWidth }}>
          <AnimatePresence mode="wait">
            <motion.div key={currentSlide} className="w-full flex items-center justify-center" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2 }}>
              {renderSlide()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ══ FOOTER ══ */}
      <footer className="relative shrink-0 flex items-center justify-between px-2 md:px-4 z-50" style={{ height: LAYOUT.footerHeight.mobile }}>
        <div className="w-16 md:w-20">
          {canGoPrev() && (
            <motion.img
              src="/assets/elemen/Kembali.png"
              alt="Previous"
              className="w-full h-auto object-contain cursor-pointer"
              onMouseEnter={() => playHover("footer-prev", "ui-back")}
              onClick={goPrev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          )}
        </div>

        <div className="flex-1 flex items-center gap-2 px-2 max-w-[360px]">
          <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-primary-blue to-green-500 rounded-full transition-all duration-300" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }} />
          </div>
          <span className="text-white font-fredoka text-xs md:text-sm drop-shadow whitespace-nowrap">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>

        <div className="w-16 md:w-20 flex justify-end">
          {canGoNext() && (
            <motion.img
              src="/assets/elemen/Lanjut.png"
              alt="Next"
              className="w-full h-auto object-contain cursor-pointer"
              onMouseEnter={() => playHover("footer-next", "ui-next")}
              onClick={goNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          )}
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {showProfile && <ProfileModal onClose={() => click(() => setShowProfile(false))} />}
        {showSettings && <SettingsModal onClose={() => click(() => setShowSettings(false))} />}
      </AnimatePresence>
    </motion.div>
  );
}

export default TopicFlow;
