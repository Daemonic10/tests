import { useState } from "react";
import { KLOTER_SIZE } from "../lib/babak";

export default function Pendaftaran({ daftar, setDaftar, htm, setHtm }) {
  const [f, setF] = useState({
    namaTim: "",
    namaBurung: "",
    modeLomba: "Utama",
  });

  // Input harga HTM sementara (sebelum disimpan ke state global via tombol "Terapkan")
  const [hargaUtama, setHargaUtama] = useState(htm.utama);
  const [hargaBob, setHargaBob] = useState(htm.bob);

  const hariIni = new Date().toISOString().slice(0, 10);

  // Kuota 3x/hari berlaku PER BURUNG (dalam satu tim), bukan per tim.
  // Jadi 1 tim boleh mendaftarkan banyak burung berbeda, tapi burung yang
  // sama hanya boleh daftar ulang maksimal 3x pada tanggal yang sama.
  const jumlahHariIni =
    f.namaTim && f.namaBurung
      ? daftar.filter(
          (p) =>
            p.namaTim === f.namaTim &&
            p.namaBurung === f.namaBurung &&
            p.tanggal === hariIni,
        ).length
      : 0;
  const sisaKuota = 3 - jumlahHariIni;
  const registrasiKeBerapa = jumlahHariIni + 1;
  const akanOtomatisLolos = registrasiKeBerapa >= 3;
  const hargaAktif = f.modeLomba === "Utama" ? htm.utama : htm.bob;

  // Kloter berjalan otomatis: setiap KLOTER_SIZE pendaftaran (per kategori,
  // per hari) akan masuk ke kloter berikutnya, supaya rapi saat dipasangkan
  // di halaman Pengocokan.
  const kloterBerikutnya =
    Math.floor(
      daftar.filter((p) => p.modeLomba === f.modeLomba && p.tanggal === hariIni)
        .length / KLOTER_SIZE,
    ) + 1;

  const handleDaftar = () => {
    if (!f.namaTim || !f.namaBurung) return alert("Isi Data!");

    if (jumlahHariIni >= 3) {
      return alert(
        `Burung "${f.namaBurung}" (Tim ${f.namaTim}) sudah mendaftar 3 kali hari ini. Batas maksimal tercapai.`,
      );
    }

    const recordBaru = {
      ...f,
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

      // Daftar ulang ke-3 pada burung yang sama -> otomatis lolos ke babak
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
        `🎉 "${f.namaBurung}" (Tim ${f.namaTim}) sudah 3x daftar ulang dan OTOMATIS LOLOS ke babak Perempat Final!`,
      );
    }

    setF({ namaTim: "", namaBurung: "", modeLomba: "Utama" });
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

  return (
    <div className="p-8 min-h-screen bg-ink">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-gold mb-1">
          Meja Pendaftaran
        </p>
        <h2 className="font-display font-bold text-3xl text-ink-text">
          Pendaftaran Peserta
        </h2>
      </div>

      {/* Panel pengaturan HTM — diisi lebih dulu karena harga bersifat fleksibel */}
      <div className="max-w-3xl mb-6 bg-surface border border-gold/30 rounded-2xl p-6">
        <p className="text-xs uppercase tracking-[0.15em] text-gold mb-4">
          1. Atur Harga HTM (fleksibel, tentukan dulu sebelum daftar)
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
              HTM Best of Best / BoB (Rp)
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
          {htm.utama.toLocaleString("id-ID")} · BoB: Rp{" "}
          {htm.bob.toLocaleString("id-ID")}. Perubahan harga hanya berlaku untuk
          pendaftaran baru, transaksi lama tidak ikut berubah.
        </p>
      </div>

      <p className="text-xs uppercase tracking-[0.15em] text-gold mb-3 max-w-3xl">
        2. Data Pendaftaran
      </p>
      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 max-w-3xl">
        <div className="bg-surface border border-border-soft rounded-2xl p-6 space-y-4">
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
          <div>
            <label className="text-xs text-muted mb-1.5 block">
              Kategori Lomba
            </label>
            <select
              className="bg-surface-2 border border-border-soft focus:border-gold outline-none p-3 w-full rounded-lg text-ink-text transition-colors"
              value={f.modeLomba}
              onChange={(e) => setF({ ...f, modeLomba: e.target.value })}
            >
              <option value="Utama">Lomba Utama</option>
              <option value="BoB">Best of Best (BoB)</option>
            </select>
            <p className="text-xs text-muted mt-1.5">
              Harga untuk kategori ini:{" "}
              <span className="text-gold font-semibold">
                Rp {hargaAktif.toLocaleString("id-ID")}
              </span>{" "}
              · Akan masuk{" "}
              <span className="text-gold font-semibold">
                Kloter {kloterBerikutnya}
              </span>
            </p>
          </div>
          <button
            onClick={handleDaftar}
            disabled={!!f.namaTim && !!f.namaBurung && sisaKuota <= 0}
            className="w-full py-3 rounded-lg font-display font-bold bg-gold text-ink hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Simpan Pendaftaran
          </button>
        </div>

        <div className="bg-surface border border-border-soft rounded-2xl p-6 flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.15em] text-muted">
            Kuota Harian per Burung
          </p>
          {f.namaTim && f.namaBurung ? (
            <>
              <div>
                <p className="text-sm text-ink-text font-medium mb-1">
                  {f.namaBurung}
                </p>
                <p className="text-xs text-muted -mt-1 mb-1">Tim {f.namaTim}</p>
                <p className="scoreboard-num text-4xl font-bold text-gold">
                  {Math.max(sisaKuota, 0)}
                  <span className="text-lg text-muted"> / 3</span>
                </p>
                <p className="text-xs text-muted mt-1">sisa slot hari ini</p>
              </div>
              <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className={`h-full ${sisaKuota <= 0 ? "bg-rose" : "bg-gold"}`}
                  style={{ width: `${(jumlahHariIni / 3) * 100}%` }}
                />
              </div>
              {sisaKuota <= 0 ? (
                <p className="text-xs text-rose">
                  Kuota harian burung ini sudah habis.
                </p>
              ) : akanOtomatisLolos ? (
                <p className="text-xs text-gold font-semibold">
                  ✨ Ini pendaftaran ke-3 — burung akan OTOMATIS LOLOS ke
                  Perempat Final setelah disimpan.
                </p>
              ) : (
                <p className="text-xs text-muted">
                  3x daftar ulang pada burung yang sama akan membuatnya otomatis
                  lolos ke babak berikutnya.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted">
              Isi nama tim &amp; nama burung untuk melihat sisa kuota
              pendaftaran hari ini (maks. 3x/hari per burung). Satu tim boleh
              mendaftarkan banyak burung berbeda. 3x daftar ulang pada burung
              yang sama = otomatis lolos ke babak berikutnya.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
