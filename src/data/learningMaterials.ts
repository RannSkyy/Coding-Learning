import { LearningTopic } from '../types';

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    id: 'algoritma',
    title: '1. Apa itu Algoritma?',
    summary: 'Algoritma adalah serangkaian langkah terstruktur dan logis untuk menyelesaikan sebuah masalah.',
    analogy: 'Bayangkan kamu membuat secangkir teh manis: (1) Masak air, (2) Masukkan teh celup ke cangkir, (3) Tuang air panas, (4) Tambah gula 1 sendok, (5) Aduk rata. Urutan ini tidak boleh terbalik!',
    icon: 'Layers',
    color: 'from-blue-500 to-indigo-600',
    explanation: [
      'Komputer atau robot itu sangat teliti namun tidak memiliki inisiatif sendiri. Mereka hanya menjalankan perintah persis seperti yang kita susun.',
      'Jika satu langkah terlewat atau urutannya keliru (misalnya kamu meminum teh sebelum airnya dituang), hasilnya akan gagal atau error.',
      'Dalam pemrograman, berpikir algoritmik melatih kita memecah masalah besar menjadi urutan instruksi kecil yang jelas.'
    ],
    pseudocodeExample: `// Contoh Algoritma: Berangkat Sekolah
1. Bangun tidur tepat waktu
2. Mandi dan gosok gigi
3. Pakai seragam sekolah
4. Sarapan pagi
5. Berangkat menuju sekolah`,
    blockVisuals: [
      {
        blockName: 'Maju (Step Forward)',
        description: 'Memerintahkan robot melangkah satu petak ke arah depan yang sedang dihadapinya.',
        color: 'bg-blue-500'
      },
      {
        blockName: 'Ambil Bintang (Pick)',
        description: 'Robot meraih item berharga yang berada di petak posisinya sekarang.',
        color: 'bg-amber-500'
      }
    ],
    quizQuestion: {
      question: 'Mengapa urutan langkah dalam algoritma sangat penting?',
      options: [
        'Karena robot hanya bisa membaca huruf kapital',
        'Karena hasil akhir bergantung pada langkah yang dikerjakan secara berurutan dan benar',
        'Karena komputer tidak memerlukan listrik jika urutannya benar',
        'Agar kode terlihat lebih panjang dan rumit'
      ],
      correctIndex: 1,
      explanation: 'Benar! Langkah yang terbalik atau salah urutan akan menyebabkan hasil yang keliru (bug/error).'
    }
  },
  {
    id: 'sequence',
    title: '2. Urutan Langkah (Sequence)',
    summary: 'Sequence adalah eksekusi perintah secara beruntun dari atas ke bawah, satu per satu.',
    analogy: 'Ketika kamu membaca buku komik, kamu membaca panel dari kiri ke kanan, lalu ke panel berikutnya di bawahnya. Robot juga membaca blok kode dari blok paling atas menuju ke paling bawah.',
    icon: 'ArrowDownNarrowWide',
    color: 'from-teal-500 to-emerald-600',
    explanation: [
      'Setiap blok kode yang kamu taruh di area kerja (workspace) akan diproses robot secara berurutan.',
      'Perhatikan arah hadap robot (Orientasi). Robot bisa menghadap ke Atas (Utara), Kanan (Timur), Bawah (Selatan), atau Kiri (Barat).',
      'Saat robot berbelok ke kanan, posisinya tidak berpindah petak, hanya arah hadapnya yang berputar 90 derajat searah jarum jam!'
    ],
    pseudocodeExample: `Mulai
Maju (1 langkah)
Belok Kanan
Maju (2 langkah)
Ambil Bintang
Selesai`,
    blockVisuals: [
      {
        blockName: 'Belok Kiri (Turn Left)',
        description: 'Memutar arah hadap robot 90° berlawanan arah jarum jam di tempat.',
        color: 'bg-cyan-600'
      },
      {
        blockName: 'Belok Kanan (Turn Right)',
        description: 'Memutar arah hadap robot 90° searah jarum jam di tempat.',
        color: 'bg-indigo-600'
      }
    ],
    quizQuestion: {
      question: 'Jika robot menghadap ke Timur (Kanan), lalu menjalankan blok "Belok Kiri", ke manakah robot menghadap sekarang?',
      options: [
        'Selatan (Bawah)',
        'Barat (Kiri)',
        'Utara (Atas)',
        'Tetap ke Timur'
      ],
      correctIndex: 2,
      explanation: 'Tepat sekali! Berbelok ke kiri dari arah Timur akan membuat robot menghadap ke Utara (Atas).'
    }
  },
  {
    id: 'loop',
    title: '3. Perulangan (Loop)',
    summary: 'Loop digunakan untuk mengulang serangkaian instruksi berkali-kali secara otomatis tanpa menulis ulang.',
    analogy: 'Bayangkan kamu disuruh menyapu 5 petak lantai. Kamu tidak perlu berkata "Sapu petak 1, Sapu petak 2, Sapu petak 3, ...". Kamu cukup berkata: "Ulangi 5 kali: Sapu petak lalu maju."',
    icon: 'Repeat',
    color: 'from-purple-500 to-indigo-600',
    explanation: [
      'Menulis kode yang panjang dan berulang sangat memakan waktu serta rawan salah. Programmer profesional selalu menggunakan LOOP!',
      'Blok "Ulangi [N] Kali" membungkus blok-blok di dalamnya. Semua blok di dalam wadah perulangan akan dieksekusi berputar sampai jumlah N tercapai.',
      'Di game Coding For Kids, menggunakan loop membantumu mendapatkan 3 BINTANG karena jumlah blok yang digunakan jauh lebih sedikit dan efisien!'
    ],
    pseudocodeExample: `// Tanpa Loop (9 baris):
Maju; Maju; Maju; Maju; Maju;

// Dengan Loop (hanya 1 blok pembungkus):
Ulangi 5 Kali:
  Maju`,
    blockVisuals: [
      {
        blockName: 'Ulangi [N] Kali (Repeat Loop)',
        description: 'Mengeksekusi semua instruksi di dalamnya sebanyak N kali berturut-turut.',
        color: 'bg-purple-600'
      }
    ],
    quizQuestion: {
      question: 'Jika kamu ingin robot melangkah maju 4 kali lalu belok kanan sebanyak 3 siklus kotak, konsep apa yang paling efisien?',
      options: [
        'Menumpuk 20 blok maju sembarangan',
        'Menggunakan blok Ulangi (Repeat) dengan isi Maju dan Belok Kanan',
        'Membiarkan robot diam sampai baterai habis',
        'Menggunakan blok Lompat berkali-kali'
      ],
      correctIndex: 1,
      explanation: 'Benar! Loop membuat susunan algoritma jauh lebih pendek, bersih, dan hemat blok.'
    }
  },
  {
    id: 'condition',
    title: '4. Percabangan (Condition / If)',
    summary: 'Condition memungkinkan robot memeriksa situasi sekitar dan mengambil keputusan berbeda sesuai kondisi.',
    analogy: 'Ketika kamu hendak menyeberang jalan: JIKA lampu berwarna hijau, MAKA kamu menyeberang. JIKA lampu merah, MAKA kamu berhenti menunggu.',
    icon: 'GitFork',
    color: 'from-rose-500 to-pink-600',
    explanation: [
      'Dunia tidak selalu lurus dan datar. Kadang di depan robot ada batu besar, jurang air, atau bintang berkilau.',
      'Dengan blok "JIKA (IF)", robot memeriksa kondisi sebelum bertindak. Misalnya: "Jika di depan ada rintangan -> Lompat, jika tidak -> Maju biasa".',
      'Ini adalah fondasi kecerdasan buatan (Artificial Intelligence) dan logika pemrograman modern!'
    ],
    pseudocodeExample: `Ulangi 5 Kali:
  Jika Ada Rintangan di Depan:
    Lompat
  Jika Ada Bintang:
    Ambil Bintang
  Maju`,
    blockVisuals: [
      {
        blockName: 'Jika Ada Rintangan (If Obstacle)',
        description: 'Hanya menjalankan aksi di dalamnya jika petak di depan robot terhalang batu/semak.',
        color: 'bg-rose-600'
      },
      {
        blockName: 'Lompat (Jump)',
        description: 'Robot melompati 1 petak rintangan atau air langsung ke petak berikutnya.',
        color: 'bg-orange-500'
      }
    ],
    quizQuestion: {
      question: 'Apa kegunaan utama blok JIKA (IF) dalam pemrograman?',
      options: [
        'Membuat warna layar berubah menjadi merah',
        'Membuat program bisa mengambil keputusan berdasarkan kondisi saat itu',
        'Mengulang perintah sampai komputer mati',
        'Menghapus semua blok yang sudah dibuat'
      ],
      correctIndex: 1,
      explanation: 'Hebat! Blok percabangan (IF) memberikan kemampuan berpikir dan memilih aksi yang tepat sesuai keadaan.'
    }
  }
];
