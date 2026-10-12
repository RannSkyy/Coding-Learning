import React from 'react';
import {
  Code2,
  Brain,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Layers,
  Heart,
  BookOpen,
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <span>Tentang Coding For Kids</span>
          <span>·</span>
          <span>Informatika SMP & SD</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          Belajar Berpikir Seperti Programmer{' '}
          <span className="text-blue-600">Tanpa Menulis Kode.</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Media pembelajaran interaktif berbasis game puzzle visual yang dirancang khusus untuk melatih logika berpikir komputasional generasi muda Indonesia.
        </p>
      </div>

      {/* Latar Belakang & Filosofi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 font-display">
            Mengapa Bukan Kode Biasa?
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Banyak siswa merasa coding itu menakutkan karena langsung dihadapkan pada sintaks bahasa pemrograman seperti Python atau JavaScript yang rumit dengan titik-koma dan kurung kurawal.
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Padahal esensi sejati pemrograman adalah <strong>logika berpikir</strong> (Problem Solving), bukan menghafal sintaks bahasa. Melalui Coding For Kids, siswa fokus pada urutan langkah logis robot sebelum nantinya beralih ke kode teks.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 font-display">
            Capaian Pembelajaran (Learning Outcomes)
          </h2>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Memahami urutan instruksi berurutan (Sequence).</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Mengenal konsep perulangan (Loop) untuk efisiensi kode.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Mengenal pengambilan keputusan bercabang (Condition/IF).</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Melatih ketekunan problem solving dan abstraksi algoritma.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 5 Dunia Kurikulum Roadmap */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Struktur Materi 80 Level
          </span>
          <h2 className="text-2xl font-black font-display text-white mt-1">
            Jalur Progresi Belajar Siswa
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs font-mono text-emerald-400 font-bold mb-1">Dunia 1</div>
            <h3 className="text-sm font-bold">Gerakan Dasar</h3>
            <p className="text-xs text-slate-400 mt-1">15 Level · Maju, belok kiri, belok kanan, orientasi.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs font-mono text-amber-400 font-bold mb-1">Dunia 2</div>
            <h3 className="text-sm font-bold">Koleksi Bintang</h3>
            <p className="text-xs text-slate-400 mt-1">15 Level · Mengambil objek, rute bercabang, lompat rintangan.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs font-mono text-purple-400 font-bold mb-1">Dunia 3</div>
            <h3 className="text-sm font-bold">Perulangan (Loop)</h3>
            <p className="text-xs text-slate-400 mt-1">15 Level · Repeat N kali, efisiensi blok, pola zigzag.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs font-mono text-rose-400 font-bold mb-1">Dunia 4</div>
            <h3 className="text-sm font-bold">Percabangan (IF)</h3>
            <p className="text-xs text-slate-400 mt-1">15 Level · Pengambilan keputusan jika ada rintangan/bintang.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs font-mono text-blue-400 font-bold mb-1">Dunia 5</div>
            <h3 className="text-sm font-bold">Labirin Master</h3>
            <p className="text-xs text-slate-400 mt-1">20 Level · Integrasi semua konsep dalam labirin besar.</p>
          </div>
        </div>
      </div>

      {/* Rencana Pengembangan Versi 2.0 (Sesuai PRD) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display">
          Rencana Pengembangan Lanjutan (Versi 2.0)
        </h2>
        <p className="text-xs text-slate-500">
          Fondasi aplikasi disiapkan untuk ekspansi fitur edukasi sekolah di masa depan:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <strong className="text-slate-900 block mb-1">👨‍🏫 Mode Guru</strong>
            Manajemen kelas, penugasan level khusus, dan rekap statistik murid.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <strong className="text-slate-900 block mb-1">🛠️ Editor Level</strong>
            Membuat puzzle kustom dan berbagi tantangan antar siswa.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <strong className="text-slate-900 block mb-1">📜 Sertifikat Kelulusan</strong>
            Penerbitan sertifikat otomatis setelah menuntaskan seluruh 80 level.
          </div>
        </div>
      </div>
    </div>
  );
};
