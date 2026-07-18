// ============================================================================
// Konstanta & helper inti aturan lomba.
// Semua halaman (Pendaftaran, Peserta, Penyisihan, Pengocokan, Dashboard,
// Monitor) mengambil "kebenaran" aturan dari file ini supaya logikanya
// konsisten di satu tempat.
// ============================================================================

// Jumlah maksimal peserta per kloter (batas 1 sesi pengocokan / gantangan).
export const KLOTER_SIZE = 20;

// ----------------------------------------------------------------------------
// Kategori lomba
// ----------------------------------------------------------------------------
// BoB dulunya 1 kategori tunggal. Sekarang dipecah menjadi 2 kategori yang
// benar-benar independen: BoB Sabtu & BoB Minggu. Kategori BoB mana yang
// aktif ditentukan OTOMATIS dari hari pendaftaran sebenarnya (bukan pilihan
// manual) — lihat getKategoriBobHariIni().
export const MODE_UTAMA = "Utama";
export const MODE_BOB_SABTU = "BoBSabtu";
export const MODE_BOB_MINGGU = "BoBMinggu";

// Daftar semua kategori yang valid, dipakai untuk iterasi (filter, dashboard, dll).
export const semuaMode = [MODE_UTAMA, MODE_BOB_SABTU, MODE_BOB_MINGGU];

// Label panjang, dipakai di judul/panel.
export const modeLabel = {
  [MODE_UTAMA]: "Lomba Utama",
  [MODE_BOB_SABTU]: "Best of Best — Sabtu",
  [MODE_BOB_MINGGU]: "Best of Best — Minggu",
};

// Label pendek, dipakai di badge/chip kecil.
export const modeSingkat = {
  [MODE_UTAMA]: "Utama",
  [MODE_BOB_SABTU]: "BoB Sabtu",
  [MODE_BOB_MINGGU]: "BoB Minggu",
};

// Warna aksen per kategori (kelas Tailwind, selaras dengan token warna di
// index.css). Utama = indigo, BoB Sabtu = gold, BoB Minggu = cyan — supaya
// ketiganya mudah dibedakan sekilas di tabel/kartu manapun.
export const modeAccent = {
  [MODE_UTAMA]: {
    text: "text-indigo",
    bg: "bg-indigo-soft",
    ring: "ring-indigo/30",
  },
  [MODE_BOB_SABTU]: {
    text: "text-gold",
    bg: "bg-gold-soft",
    ring: "ring-gold/30",
  },
  [MODE_BOB_MINGGU]: {
    text: "text-cyan",
    bg: "bg-cyan-soft",
    ring: "ring-cyan/30",
  },
};

/**
 * Menentukan kategori BoB yang aktif untuk sebuah tanggal (format YYYY-MM-DD).
 * Aturan: Sabtu -> BoB Sabtu, Minggu -> BoB Minggu, hari lain -> null (BoB
 * tidak dibuka di luar akhir pekan).
 */
export function getKategoriBobHariIni(tanggalISO) {
  if (!tanggalISO) return null;
  const hari = new Date(`${tanggalISO}T00:00:00`).getDay(); // 0=Minggu .. 6=Sabtu
  if (hari === 6) return MODE_BOB_SABTU;
  if (hari === 0) return MODE_BOB_MINGGU;
  return null;
}

/** True jika tanggal yang diberikan adalah hari BoB (Sabtu/Minggu). */
export function isHariBob(tanggalISO) {
  return getKategoriBobHariIni(tanggalISO) !== null;
}

// ----------------------------------------------------------------------------
// Babak turnamen
// ----------------------------------------------------------------------------
export const babakUrutan = [
  "Penyisihan",
  "PerempatFinal",
  "SemiFinal",
  "Final",
  "Juara",
];

export const babakLabel = {
  Penyisihan: "Penyisihan",
  PerempatFinal: "Perempat Final",
  SemiFinal: "Semi Final",
  Final: "Final",
  Juara: "Juara",
};

// ----------------------------------------------------------------------------
// Aturan kuota harian & auto-lolos
// ----------------------------------------------------------------------------
// Batas daftar ulang per burung, PER KATEGORI, PER HARI. Sebelumnya hitungan
// ini tercampur antar kategori (bug); sekarang setiap kategori (Utama, BoB
// Sabtu, BoB Minggu) punya akumulasinya sendiri-sendiri dan tidak saling
// memengaruhi satu sama lain.
export const KUOTA_HARIAN_PER_KATEGORI = 3;

/**
 * Menghitung berapa kali burung ini SUDAH terdaftar hari ini, dibatasi HANYA
 * pada kategori (modeLomba) yang sedang dipilih. Ini kunci perbaikan bug:
 * pendaftaran di kategori lain (mis. Utama) tidak pernah dihitung ke dalam
 * akumulasi kategori BoB, begitu pula sebaliknya.
 */
export function hitungRegistrasiHariIni(
  daftar,
  { namaTim, namaBurung, modeLomba, tanggal },
) {
  if (!namaTim || !namaBurung) return 0;
  return daftar.filter(
    (p) =>
      p.namaTim === namaTim &&
      p.namaBurung === namaBurung &&
      p.modeLomba === modeLomba &&
      p.tanggal === tanggal,
  ).length;
}

/**
 * Satu burung bisa memiliki lebih dari satu baris di `daftar` (karena daftar
 * ulang hingga 3x/hari per kategori, tiap kali membuat entri kloter/gantangan
 * baru untuk keperluan pembayaran). Tapi status babak (babakStatus) berlaku
 * per burung, bukan per baris pendaftaran. Fungsi ini menyatukan baris-baris
 * tersebut menjadi satu entri unik per (namaTim + namaBurung), dipakai untuk
 * menampilkan progres babak / bagan supaya tidak duplikat.
 */
export function pesertaUnik(daftar) {
  const map = new Map();
  daftar.forEach((p) => {
    const key = `${p.namaTim}__${p.namaBurung}`;
    if (!map.has(key)) map.set(key, p);
  });
  return Array.from(map.values());
}
