import { pesertaUnik } from "../lib/babak";

export default function Monitor({ daftar }) {
  const unik = pesertaUnik(daftar);
  const aktif = unik.filter((p) => p.babakStatus !== "Gugur");
  const juara = aktif.filter((p) => p.babakStatus === "Juara");
  const berlaga = aktif.filter((p) => p.babakStatus !== "Juara");

  return (
    <div className="min-h-screen bg-ink text-ink-text p-10 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative text-center mb-12">
        <p className="text-xs uppercase tracking-[0.35em] text-gold mb-2">
          Live Scoreboard
        </p>
        <h1 className="font-display font-bold text-5xl uppercase tracking-tight">
          Daftar Lolos Babak
        </h1>
        <div className="feather-divider max-w-md mx-auto mt-6" />
      </div>

      {juara.length > 0 && (
        <div className="relative mb-12">
          <h2 className="font-display text-gold text-center text-xl mb-5 tracking-widest uppercase">
            🏆 Juara
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {juara.map((p, i) => (
              <div
                key={i}
                className="bg-gold text-ink rounded-2xl px-8 py-5 text-center font-display shadow-[0_0_40px_-8px_var(--color-gold)]"
              >
                <p className="text-2xl font-bold">{p.namaBurung}</p>
                <p className="text-sm opacity-80">
                  {p.namaTim} · {p.modeLomba}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {berlaga.map((p, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl border bg-surface ${
              p.modeLomba === "Utama" ? "border-indigo/40" : "border-gold/40"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-semibold ${
                  p.modeLomba === "Utama"
                    ? "bg-indigo-soft text-indigo"
                    : "bg-gold-soft text-gold"
                }`}
              >
                {p.modeLomba}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted">
                {p.babakStatus}
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl">{p.namaBurung}</h2>
            <p className="text-muted mt-1">{p.namaTim}</p>
          </div>
        ))}
        {berlaga.length === 0 && juara.length === 0 && (
          <div className="col-span-full text-center text-muted py-20">
            Belum ada peserta yang tampil.
          </div>
        )}
      </div>
    </div>
  );
}
