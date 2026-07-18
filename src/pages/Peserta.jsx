import { useState } from "react";
import { semuaMode, modeSingkat, modeAccent } from "../lib/babaks";

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Chip({ active, onClick, label, tone }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap ${
        active
          ? `${tone} border-transparent`
          : "bg-surface-2 text-muted border-border-soft hover:text-ink-text"
      }`}
    >
      {label}
    </button>
  );
}

function ModeBadge({ mode }) {
  const accent = modeAccent[mode];
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${accent.bg} ${accent.text}`}
    >
      {modeSingkat[mode]}
    </span>
  );
}

export default function Peserta({ daftar, setDaftar }) {
  const [cari, setCari] = useState("");
  const [filterMode, setFilterMode] = useState("Semua");
  const [filterBayar, setFilterBayar] = useState("Semua");

  const filtered = daftar.filter((p) => {
    const cocokCari = p.namaTim.toLowerCase().includes(cari.toLowerCase());
    const cocokMode = filterMode === "Semua" || p.modeLomba === filterMode;
    const cocokBayar =
      filterBayar === "Semua" ||
      (filterBayar === "Lunas" ? p.sudahBayar : !p.sudahBayar);
    return cocokCari && cocokMode && cocokBayar;
  });

  const update = (i, k, v) => {
    const d = [...daftar];
    d[i] = { ...d[i], [k]: v };
    setDaftar(d);
  };

  const hapus = (i, p) => {
    const konfirmasi = window.confirm(
      `Hapus peserta "${p.namaBurung}" (Tim ${p.namaTim})? Tindakan ini tidak bisa dibatalkan.`,
    );
    if (!konfirmasi) return;
    setDaftar(daftar.filter((_, idx) => idx !== i));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-ink">
      <div className="mb-6 sm:mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-gold mb-1">
          Roster Kompetisi
        </p>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink-text">
          Daftar Peserta
        </h2>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <input
          className="bg-surface border border-border-soft focus:border-gold outline-none p-3 rounded-lg w-full text-ink-text placeholder:text-muted transition-colors"
          placeholder="Cari nama tim..."
          onChange={(e) => setCari(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 items-center">
          <Chip
            active={filterMode === "Semua"}
            onClick={() => setFilterMode("Semua")}
            label="Semua"
            tone="bg-surface-2 text-ink-text"
          />
          {semuaMode.map((m) => (
            <Chip
              key={m}
              active={filterMode === m}
              onClick={() => setFilterMode(m)}
              label={modeSingkat[m]}
              tone={`${modeAccent[m].bg} ${modeAccent[m].text}`}
            />
          ))}
          <span className="w-px h-5 bg-border-soft mx-1 hidden sm:block" />
          <Chip
            active={filterBayar === "Lunas"}
            onClick={() =>
              setFilterBayar(filterBayar === "Lunas" ? "Semua" : "Lunas")
            }
            label="Lunas"
            tone="bg-emerald-soft text-emerald"
          />
          <Chip
            active={filterBayar === "Belum"}
            onClick={() =>
              setFilterBayar(filterBayar === "Belum" ? "Semua" : "Belum")
            }
            label="Belum"
            tone="bg-rose-soft text-rose"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="table-scroll">
          <table className="w-full text-left text-sm min-w-[820px]">
            <thead>
              <tr className="text-muted text-xs uppercase tracking-wide border-b border-border-soft">
                <th className="p-4">Tim</th>
                <th className="p-4">Burung</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Metode</th>
                <th className="p-4">Status Bayar</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const i = daftar.indexOf(p);
                return (
                  <tr
                    key={i}
                    className="border-t border-border-soft hover:bg-surface-2/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-surface-2 border border-border-soft flex items-center justify-center text-xs font-bold text-gold shrink-0">
                          {initials(p.namaTim)}
                        </span>
                        <span className="text-ink-text font-medium">
                          {p.namaTim}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-muted">{p.namaBurung}</td>
                    <td className="p-4">
                      <ModeBadge mode={p.modeLomba} />
                    </td>
                    <td className="p-4 text-muted text-xs">
                      {p.tanggal || "-"}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          update(
                            i,
                            "metode",
                            p.metode === "Tunai" ? "Bank Transfer" : "Tunai",
                          )
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                          p.metode === "Tunai"
                            ? "bg-emerald-soft text-emerald"
                            : "bg-indigo-soft text-indigo"
                        }`}
                      >
                        {p.metode || "Tunai"}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => update(i, "sudahBayar", !p.sudahBayar)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          p.sudahBayar
                            ? "bg-emerald-soft text-emerald"
                            : "bg-rose-soft text-rose"
                        }`}
                      >
                        {p.sudahBayar ? "LUNAS" : "BELUM"}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => hapus(i, p)}
                        title="Hapus peserta"
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-soft text-rose hover:brightness-125 transition-all whitespace-nowrap"
                      >
                        🗑 Hapus
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted">
                    Tidak ada peserta yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
