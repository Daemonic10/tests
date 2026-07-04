import { useState } from "react";
import { babakUrutan, babakLabel, pesertaUnik } from "../lib/babaks";

function acakSatuKloter(peserta) {
  let pool = [...peserta].sort(() => Math.random() - 0.5);
  let hasil = [];

  while (pool.length > 0) {
    const a = pool.shift();
    let idxLawan = pool.findIndex((p) => p.namaTim !== a.namaTim);
    let forced = false;

    if (idxLawan === -1) {
      if (pool.length % 2 === 1) {
        idxLawan = 0;
        forced = true;
      } else {
        hasil.push({ timA: a, timB: null, forced: false, bye: true });
        continue;
      }
    }

    const b = pool.splice(idxLawan, 1)[0];
    hasil.push({ timA: a, timB: b, forced, bye: false });
  }

  return hasil;
}

function KartuPasangan({ m, i }) {
  return (
    <div
      className={`bg-surface border rounded-2xl p-5 ${
        m.forced ? "border-rose/50" : "border-border-soft"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-widest text-muted">
          Meja {i + 1}
        </span>
        {m.forced && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-soft text-rose font-semibold">
            Tim Sama
          </span>
        )}
        {m.bye && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-2 text-muted font-semibold">
            BYE
          </span>
        )}
      </div>

      {m.bye ? (
        <div className="text-center py-3">
          <p className="font-display font-bold text-ink-text">
            {m.timA.namaBurung}
          </p>
          <p className="text-xs text-muted mb-3">{m.timA.namaTim}</p>
          <p className="text-xs text-muted italic">Tidak ada lawan ronde ini</p>
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="text-right">
            <p className="font-display font-bold text-ink-text truncate">
              {m.timA.namaBurung}
            </p>
            <p className="text-xs text-muted truncate">{m.timA.namaTim}</p>
          </div>
          <span className="scoreboard-num text-gold font-bold text-lg">VS</span>
          <div className="text-left">
            <p className="font-display font-bold text-ink-text truncate">
              {m.timB.namaBurung}
            </p>
            <p className="text-xs text-muted truncate">{m.timB.namaTim}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Pengocokan({ daftar }) {
  const [pasanganPerKloter, setPasanganPerKloter] = useState({});

  // Kelompokkan seluruh entri pendaftaran ke kloternya masing-masing
  // (kloter ditentukan otomatis saat pendaftaran, lihat halaman Pendaftaran).
  const kloterMap = {};
  daftar.forEach((p) => {
    const k = p.kloter || 1;
    if (!kloterMap[k]) kloterMap[k] = [];
    kloterMap[k].push(p);
  });
  const daftarKloter = Object.keys(kloterMap)
    .map(Number)
    .sort((a, b) => a - b);

  const acakKloter = (k) => {
    const peserta = kloterMap[k];
    if (!peserta || peserta.length < 2) {
      return alert(`Kloter ${k} butuh minimal 2 peserta!`);
    }
    setPasanganPerKloter((prev) => ({
      ...prev,
      [k]: acakSatuKloter(peserta),
    }));
  };

  // Data bagan turnamen: satu entri unik per burung (dedup), dikelompokkan
  // per tahap babak. Bagan otomatis muncul begitu ada progres di luar
  // babak Penyisihan (menang manual di halaman Penyisihan, atau otomatis
  // lolos karena 3x daftar ulang).
  const unik = pesertaUnik(daftar);
  const bagan = babakUrutan.reduce((acc, tahap) => {
    acc[tahap] = unik.filter((p) => p.babakStatus === tahap);
    return acc;
  }, {});
  const adaProgres = babakUrutan
    .slice(1)
    .some((tahap) => bagan[tahap].length > 0);

  return (
    <div className="p-8 min-h-screen bg-ink">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-gold mb-1">
          Undian Pertandingan
        </p>
        <h2 className="font-display font-bold text-3xl text-ink-text">
          Pengocokan Jadwal per Kloter
        </h2>
        <p className="text-xs text-muted mt-1">
          Peserta otomatis terbagi ke kloter saat mendaftar (maks. 20
          burung/kloter) · tim sama dihindari kecuali terpaksa
        </p>
      </div>

      {daftarKloter.length === 0 ? (
        <div className="border border-dashed border-border-soft rounded-2xl p-16 text-center text-muted">
          Belum ada peserta terdaftar.
        </div>
      ) : (
        daftarKloter.map((k) => {
          const peserta = kloterMap[k];
          const pasangan = pasanganPerKloter[k];
          return (
            <div key={k} className="mb-12">
              <div className="flex items-end justify-between flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-2xl text-gold">
                    Kloter {k}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-surface-2 text-xs text-muted">
                    {peserta.length} peserta
                  </span>
                </div>
                <button
                  onClick={() => acakKloter(k)}
                  className="bg-gold text-ink font-display font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all"
                >
                  🔀 Acak Kloter {k}
                </button>
              </div>

              {!pasangan ? (
                <div className="border border-dashed border-border-soft rounded-2xl p-10 text-center text-muted">
                  Belum diacak. Klik "Acak Kloter {k}" untuk membuat pasangan.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {pasangan.map((m, i) => (
                    <KartuPasangan key={i} m={m} i={i} />
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      {adaProgres && (
        <div className="mt-16">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-1">
              Progres Turnamen
            </p>
            <h3 className="font-display font-bold text-2xl text-ink-text">
              🏆 Bagan Turnamen
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
            {babakUrutan.map((tahap, idx) => (
              <div key={tahap} className="flex items-center gap-2">
                <div className="flex-1 bg-surface border border-border-soft rounded-2xl overflow-hidden">
                  <div
                    className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide ${
                      tahap === "Juara"
                        ? "bg-gold text-ink"
                        : "bg-surface-2 text-gold"
                    }`}
                  >
                    {babakLabel[tahap]}
                    <span className="ml-1.5 opacity-70">
                      ({bagan[tahap].length})
                    </span>
                  </div>
                  <div className="p-3 flex flex-col gap-2 min-h-[100px]">
                    {bagan[tahap].length === 0 ? (
                      <p className="text-[11px] text-muted italic text-center py-4">
                        belum ada
                      </p>
                    ) : (
                      bagan[tahap].map((p, i) => (
                        <div
                          key={i}
                          className="bg-surface-2 rounded-lg px-2.5 py-2 text-xs"
                        >
                          <p className="text-ink-text font-medium truncate">
                            {p.namaBurung}
                          </p>
                          <p className="text-muted truncate">{p.namaTim}</p>
                          {p.otomatisLolos && tahap !== "Penyisihan" && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 rounded-full bg-emerald-soft text-emerald text-[9px] font-semibold">
                              Lolos Otomatis
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                {idx < babakUrutan.length - 1 && (
                  <span className="hidden md:block text-muted text-lg shrink-0">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
