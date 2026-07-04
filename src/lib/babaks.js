// Jumlah maksimal peserta per kloter (batas 1 sesi pengocokan / gantangan).
export const KLOTER_SIZE = 20;

// Urutan babak turnamen (dipakai Pendaftaran, Penyisihan, Pengocokan, Monitor)
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

// Satu burung bisa memiliki lebih dari satu baris di `daftar` (karena daftar
// ulang hingga 3x/hari, tiap kali membuat entri kloter/gantangan baru untuk
// keperluan pembayaran). Tapi status babak (babakStatus) berlaku per burung,
// bukan per baris pendaftaran. Fungsi ini menyatukan baris-baris tersebut
// menjadi satu entri unik per (namaTim + namaBurung), dipakai untuk
// menampilkan progres babak / bagan supaya tidak duplikat.
export function pesertaUnik(daftar) {
  const map = new Map();
  daftar.forEach((p) => {
    const key = `${p.namaTim}__${p.namaBurung}`;
    if (!map.has(key)) map.set(key, p);
  });
  return Array.from(map.values());
}
