import { useState } from "react";

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

  const initials = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const chip = (active, onClick, label, tone) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
        active
          ? `${tone} border-transparent`
          : "bg-surface-2 text-muted border-border-soft hover:text-ink-text"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-8 min-h-screen bg-ink">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-gold mb-1">
          Roster Kompetisi
        </p>
        <h2 className="font-display font-bold text-3xl text-ink-text">
          Daftar Peserta
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          className="bg-surface border border-border-soft focus:border-gold outline-none p-3 rounded-lg flex-1 text-ink-text placeholder:text-muted transition-colors"
          placeholder="Cari nama tim..."
          onChange={(e) => setCari(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 items-center">
          {chip(
            filterMode === "Semua",
            () => setFilterMode("Semua"),
            "Semua",
            "bg-surface-2 text-ink-text",
          )}
          {chip(
            filterMode === "Utama",
            () => setFilterMode("Utama"),
            "Utama",
            "bg-indigo-soft text-indigo",
          )}
          {chip(
            filterMode === "BoB",
            () => setFilterMode("BoB"),
            "BoB",
            "bg-gold-soft text-gold",
          )}
          <span className="w-px h-5 bg-border-soft mx-1" />
          {chip(
            filterBayar === "Lunas",
            () => setFilterBayar(filterBayar === "Lunas" ? "Semua" : "Lunas"),
            "Lunas",
            "bg-emerald-soft text-emerald",
          )}
          {chip(
            filterBayar === "Belum",
            () => setFilterBayar(filterBayar === "Belum" ? "Semua" : "Belum"),
            "Belum",
            "bg-rose-soft text-rose",
          )}
        </div>
      </div>

      <div className="bg-surface border border-border-soft rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-muted text-xs uppercase tracking-wide border-b border-border-soft">
              <th className="p-4">Tim</th>
              <th className="p-4">Burung</th>
              <th className="p-4">Mode</th>
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
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        p.modeLomba === "Utama"
                          ? "bg-indigo-soft text-indigo"
                          : "bg-gold-soft text-gold"
                      }`}
                    >
                      {p.modeLomba}
                    </span>
                  </td>
                  <td className="p-4 text-muted text-xs">{p.tanggal || "-"}</td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        update(
                          i,
                          "metode",
                          p.metode === "Tunai" ? "Bank Transfer" : "Tunai",
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
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
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-soft text-rose hover:brightness-125 transition-all"
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
  );
}
