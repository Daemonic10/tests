import { useState } from "react";
import {
  KLOTER_SIZE,
  KUOTA_HARIAN_PER_KATEGORI,
  MODE_UTAMA,
  modeSingkat,
  modeAccent,
  getKategoriBobHariIni,
  hitungRegistrasiHariIni,
} from "../lib/babaks";

const HARI_LABEL = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

function KategoriToggle({
  pilihan,
  setPilihan,
  bobTersedia,
  kategoriBobAktif,
}) {
  const bobLabel = kategoriBobAktif ? modeSingkat[kategoriBobAktif] : "BoB";

  return (
    <div>
      <label className="text-xs text-muted mb-1.5 block">Kategori Lomba</label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setPilihan("utama")}
          className={`py-3 rounded-lg text-sm font-semibold border transition-colors ${
            pilihan === "utama"
              ? "bg-indigo-soft text-indigo border-indigo/40"
              : "bg-surface-2 text-muted border-border-soft hover:text-ink-text"
          }`}
        >
          Lomba Utama
        </button>
        <button
          type="button"
          disabled={!bobTersedia}
          onClick={() => setPilihan("bob")}
          title={
            bobTersedia
              ? `Kategori aktif hari ini: ${bobLabel}`
              : "BoB hanya dibuka pada hari Sabtu & Minggu"
          }
          className={`py-3 rounded-lg text-sm font-semibold border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            pilihan === "bob"
              ? "bg-gold-soft text-gold border-gold/40"
              : "bg-surface-2 text-muted border-border-soft hover:text-ink-text"
          }`}
        >
          {bobTersedia ? bobLabel : "BoB (tutup hari ini)"}
        </button>
      </div>
      {!bobTersedia && (
        <p className="text-xs text-muted mt-1.5">
          Best of Best otomatis terbagi 2: <b>BoB Sabtu</b> &amp;{" "}
          <b>BoB Minggu</b> — kategori aktif menyesuaikan hari pendaftaran
          sebenarnya, dan hari ini bukan akhir pekan.
        </p>
      )}
    </div>
  );
}

export default function Pendaftaran({ daftar, setDaftar, htm, setHtm }) {
  const [pilihanKategori, setPilihanKategori] = useState("utama"); // "utama" | "bob"
  const [f, setF] = useState({ namaTim: "", namaBurung: "" });

  // Input harga HTM sementara (sebelum disimpan ke state global via tombol "Terapkan")
  const [hargaUtama, setHargaUtama] = useState(htm.utama);
  const [hargaBob, setHargaBob] = useState(htm.bob);

  const now = new Date();
  const hariIni = now.toISOString().slice(0, 10);
  const namaHariIni = HARI_LABEL[now.getDay()];

  // Kategori BoB aktif hari ini ditentukan otomatis dari tanggal sebenarnya.
  const kategoriBobAktif = getKategoriBobHariIni(hariIni);
  const bobTersedia = kategoriBobAktif !== null;

  // Kategori final yang benar-benar tersimpan ke data (bukan sekadar pilihan UI).
  const modeLomba =
    pilihanKategori === "bob" && bobTersedia ? kategoriBobAktif : MODE_UTAMA;

  // Kuota 3x/hari berlaku PER BURUNG, PER KATEGORI — bukan per tim, dan tidak
  // tercampur antar kategori. Artinya pendaftaran burung yang sama di
  // kategori Utama TIDAK ikut dihitung ke akumulasi kuota BoB, begitu pula
  // sebaliknya. Satu tim boleh mendaftarkan banyak burung berbeda.
  const jumlahHariIni = hitungRegistrasiHariIni(daftar, {
    namaTim: f.namaTim,
    namaBurung: f.namaBurung,
    modeLomba,
    tanggal: hariIni,
  });
  const sisaKuota = KUOTA_HARIAN_PER_KATEGORI - jumlahHariIni;
  const registrasiKeBerapa = jumlahHariIni + 1;
  const akanOtomatisLolos = registrasiKeBerapa >= KUOTA_HARIAN_PER_KATEGORI;
  const hargaAktif = modeLomba === MODE_UTAMA ? htm.utama : htm.bob;

  // Kloter berjalan otomatis: setiap KLOTER_SIZE pendaftaran (per kategori,
  // per hari) akan masuk ke kloter berikutnya, supaya rapi saat dipasangkan
  // di halaman Pengocokan. Karena kategori BoB kini terbagi 2, kloter Sabtu
  // & Minggu juga otomatis terpisah.
  const kloterBerikutnya =
    Math.floor(
      daftar.filter((p) => p.modeLomba === modeLomba && p.tanggal === hariIni)
        .length / KLOTER_SIZE,
    ) + 1;

  const resetForm = () => {
    setF({ namaTim: "", namaBurung: "" });
    setPilihanKategori("utama");
  };

  const handleDaftar = () => {
    if (!f.namaTim || !f.namaBurung) return alert("Isi Data!");

    if (jumlahHariIni >= KUOTA_HARIAN_PER_KATEGORI) {
      return alert(
        `Burung "${f.namaBurung}" (Tim ${f.namaTim}) sudah mendaftar ${KUOTA_HARIAN_PER_KATEGORI}x hari ini di kategori ${modeSingkat[modeLomba]}. Batas maksimal tercapai.`,
      );
    }

    const recordBaru = {
      namaTim: f.namaTim,
      namaBurung: f.namaBurung,
      modeLomba,
      tanggal: hariIni,
      sudahBayar: false,
      metode: "Tunai",
      babakStatus: "Penyisihan",
      // Harga dikunci saat pendaftaran, supaya perubahan HTM di kemudian
      // hari tidak mengubah omzet transaksi yang sudah tercatat.
      harga: hargaAktif,
      registrasiKe: registrasiKeBerapa,
      kloter: kloterBerikutnya,
    };

    setDaftar((prev) => {
      const updated = [...prev, recordBaru];
      if (!akanOtomatisLolos) return updated;

      // Daftar ulang ke-3 (di kategori yang sama) -> otomatis lolos ke babak
      // berikutnya. Update diterapkan ke SEMUA baris burung ini (bukan cuma
      // baris terbaru) supaya statusnya konsisten di semua tampilan.
      return updated.map((x) =>
        x.namaTim === f.namaTim && x.namaBurung === f.namaBurung
          ? { ...x, babakStatus: "PerempatFinal", otomatisLolos: true }
          : x,
      );
    });

    if (akanOtomatisLolos) {
      alert(
        `🎉 "${f.namaBurung}" (Tim ${f.namaTim}) sudah ${KUOTA_HARIAN_PER_KATEGORI}x daftar ulang di kategori ${modeSingkat[modeLomba]} dan OTOMATIS LOLOS ke babak Perempat Final!`,
      );
    }

    resetForm();
  };

  const terapkanHarga = () => {
    const u = Number(hargaUtama);
    const b = Number(hargaBob);
    if (Number.isNaN(u) || Number.isNaN(b) || u < 0 || b < 0) {
      return alert("Harga HTM tidak valid.");
    }
    setHtm({ utama: u, bob: b });
    alert("Harga HTM berhasil diterapkan.");
  };

  const accent = modeAccent[modeLomba];
  const tombolDisabled = f.namaTim && f.namaBurung && sisaKuota <= 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-ink">
      <div className="mb-6 sm:mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-gold mb-1">
          Meja Pendaftaran · {namaHariIni}
        </p>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink-text">
          Pendaftaran Peserta
        </h2>
      </div>

      {/* Panel pengaturan HTM — diisi lebih dulu karena harga bersifat fleksibel */}
      <div className="max-w-3xl mb-6 card p-5 sm:p-6 border-gold/30">
        <p className="text-xs uppercase tracking-[0.15em] text-gold mb-4">
          1. Atur Harga HTM
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <div>
            <label className="text-xs text-muted mb-1.5 block">
              HTM Lomba Utama (Rp)
            </label>
            <input
              type="number"
              min="0"
              className="bg-surface-2 border border-border-soft focus:border-gold outline-none p-3 w-full rounded-lg text-ink-text transition-colors"
              value={hargaUtama}
              onChange={(e) => setHargaUtama(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted mb-1.5 block">
              HTM Best of Best — Sabtu &amp; Minggu (Rp)
            </label>
            <input
              type="number"
              min="0"
              className="bg-surface-2 border border-border-soft focus:border-gold outline-none p-3 w-full rounded-lg text-ink-text transition-colors"
              value={hargaBob}
              onChange={(e) => setHargaBob(e.target.value)}
            />
          </div>
          <button
            onClick={terapkanHarga}
            className="py-3 px-5 rounded-lg font-display font-bold bg-gold-soft text-gold hover:brightness-110 transition-all whitespace-nowrap"
          >
            Terapkan
          </button>
        </div>
        <p className="text-xs text-muted mt-3">
          Harga saat ini tersimpan — Utama: Rp{" "}
          {htm.utama.toLocaleString("id-ID")} · BoB (Sabtu &amp; Minggu): Rp{" "}
          {htm.bob.toLocaleString("id-ID")}. Perubahan harga hanya berlaku untuk
          pendaftaran baru, transaksi lama tidak ikut berubah.
        </p>
      </div>

      <p className="text-xs uppercase tracking-[0.15em] text-gold mb-3 max-w-3xl">
        2. Data Pendaftaran
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5 sm:gap-6 max-w-3xl">
        <div className="card p-5 sm:p-6 space-y-4">
          <div>
            <label className="text-xs text-muted mb-1.5 block">Nama Tim</label>
            <input
              className="bg-surface-2 border border-border-soft focus:border-gold outline-none p-3 w-full rounded-lg text-ink-text placeholder:text-muted transition-colors"
              placeholder="cth. Kicau Mania FC"
              value={f.namaTim}
              onChange={(e) => setF({ ...f, namaTim: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-muted mb-1.5 block">
              Nama Burung
            </label>
            <input
              className="bg-surface-2 border border-border-soft focus:border-gold outline-none p-3 w-full rounded-lg text-ink-text placeholder:text-muted transition-colors"
              placeholder="cth. Kacer Petir"
              value={f.namaBurung}
              onChange={(e) => setF({ ...f, namaBurung: e.target.value })}
            />
          </div>

          <KategoriToggle
            pilihan={pilihanKategori}
            setPilihan={setPilihanKategori}
            bobTersedia={bobTersedia}
            kategoriBobAktif={kategoriBobAktif}
          />

          <p className="text-xs text-muted -mt-1">
            Harga untuk kategori ini:{" "}
            <span className={`font-semibold ${accent.text}`}>
              Rp {hargaAktif.toLocaleString("id-ID")}
            </span>{" "}
            · Akan masuk{" "}
            <span className={`font-semibold ${accent.text}`}>
              Kloter {kloterBerikutnya}
            </span>
          </p>

          <button
            onClick={handleDaftar}
            disabled={tombolDisabled}
            className="w-full py-3 rounded-lg font-display font-bold bg-gold text-ink hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Simpan Pendaftaran
          </button>
        </div>

        <div className="card p-5 sm:p-6 flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.15em] text-muted">
            Kuota Harian per Burung ·{" "}
            <span className={accent.text}>{modeSingkat[modeLomba]}</span>
          </p>
          {f.namaTim && f.namaBurung ? (
            <>
              <div>
                <p className="text-sm text-ink-text font-medium mb-1">
                  {f.namaBurung}
                </p>
                <p className="text-xs text-muted -mt-1 mb-1">Tim {f.namaTim}</p>
                <p
                  className={`scoreboard-num text-4xl font-bold ${accent.text}`}
                >
                  {Math.max(sisaKuota, 0)}
                  <span className="text-lg text-muted">
                    {" "}
                    / {KUOTA_HARIAN_PER_KATEGORI}
                  </span>
                </p>
                <p className="text-xs text-muted mt-1">sisa slot hari ini</p>
              </div>
              <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className={`h-full ${sisaKuota <= 0 ? "bg-rose" : "bg-gold"}`}
                  style={{
                    width: `${(jumlahHariIni / KUOTA_HARIAN_PER_KATEGORI) * 100}%`,
                  }}
                />
              </div>
              {sisaKuota <= 0 ? (
                <p className="text-xs text-rose">
                  Kuota harian burung ini di kategori {modeSingkat[modeLomba]}{" "}
                  sudah habis.
                </p>
              ) : akanOtomatisLolos ? (
                <p className="text-xs text-gold font-semibold">
                  ✨ Ini pendaftaran ke-{KUOTA_HARIAN_PER_KATEGORI} di kategori{" "}
                  {modeSingkat[modeLomba]} — burung akan OTOMATIS LOLOS ke
                  Perempat Final setelah disimpan.
                </p>
              ) : (
                <p className="text-xs text-muted">
                  {KUOTA_HARIAN_PER_KATEGORI}x daftar ulang pada burung yang
                  sama, DI KATEGORI YANG SAMA, akan membuatnya otomatis lolos ke
                  babak berikutnya. Hitungan Utama &amp; BoB tidak tercampur.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted">
              Isi nama tim &amp; nama burung untuk melihat sisa kuota
              pendaftaran hari ini (maks. {KUOTA_HARIAN_PER_KATEGORI}x/hari per
              burung, per kategori). Satu tim boleh mendaftarkan banyak burung
              berbeda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
