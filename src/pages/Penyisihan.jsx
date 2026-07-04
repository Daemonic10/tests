import { babakUrutan, babakLabel, pesertaUnik } from "../lib/babaks";

function StepProgress({ status }) {
  const idx = babakUrutan.indexOf(status);
  return (
    <div className="flex items-center gap-1">
      {babakUrutan.slice(0, 4).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-5 rounded-full ${
            i <= idx ? "bg-gold" : "bg-surface-2"
          }`}
        />
      ))}
    </div>
  );
}

export default function Penyisihan({ daftar, setDaftar }) {
  // Dedup: 1 burung bisa punya beberapa baris (daftar ulang 3x/hari), tapi
  // di sini kita hanya perlu 1 baris per burung untuk progres babaknya.
  const unik = pesertaUnik(daftar);
  const aktif = unik.filter(
    (p) => p.babakStatus !== "Gugur" && p.babakStatus !== "Juara",
  );
  const juara = unik.filter((p) => p.babakStatus === "Juara");
  const gugur = unik.filter((p) => p.babakStatus === "Gugur").length;

  const menang = (p) => {
    const idx = babakUrutan.indexOf(p.babakStatus);
    const babakBaru = babakUrutan[Math.min(idx + 1, babakUrutan.length - 1)];
    setDaftar((prev) =>
      prev.map((x) =>
        x.namaTim === p.namaTim && x.namaBurung === p.namaBurung
          ? { ...x, babakStatus: babakBaru }
          : x,
      ),
    );
  };

  const kalah = (p) => {
    setDaftar((prev) =>
      prev.map((x) =>
        x.namaTim === p.namaTim && x.namaBurung === p.namaBurung
          ? { ...x, babakStatus: "Gugur" }
          : x,
      ),
    );
  };

  return (
    <div className="p-8 min-h-screen bg-ink">
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold mb-1">
            Babak Gugur
          </p>
          <h2 className="font-display font-bold text-3xl text-ink-text">
            Penyisihan &amp; Knockout
          </h2>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-surface-2 text-ink-text">
            {aktif.length} aktif
          </span>
          <span className="px-3 py-1.5 rounded-full bg-rose-soft text-rose">
            {gugur} gugur
          </span>
          <span className="px-3 py-1.5 rounded-full bg-gold-soft text-gold">
            {juara.length} juara
          </span>
        </div>
      </div>

      {juara.length > 0 && (
        <div className="mb-6 bg-gold-soft border border-gold/40 rounded-2xl p-5">
          <h3 className="font-display font-bold text-gold mb-3 flex items-center gap-2">
            🏆 Juara
          </h3>
          <div className="flex flex-wrap gap-2">
            {juara.map((p, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full bg-surface text-sm text-ink-text border border-gold/30"
              >
                {p.namaBurung}{" "}
                <span className="text-muted text-xs">· {p.namaTim}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-surface border border-border-soft rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-muted text-xs uppercase tracking-wide border-b border-border-soft">
              <th className="p-4">Tim / Burung</th>
              <th className="p-4">Mode</th>
              <th className="p-4">Progres Babak</th>
              <th className="p-4">Status</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {aktif.map((p, i) => (
              <tr
                key={i}
                className="border-t border-border-soft hover:bg-surface-2/50 transition-colors"
              >
                <td className="p-4">
                  <p className="text-ink-text font-medium flex items-center gap-2">
                    {p.namaBurung}
                    {p.otomatisLolos && (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-soft text-emerald text-[9px] font-semibold uppercase tracking-wide">
                        Lolos Otomatis
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted">{p.namaTim}</p>
                </td>
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
                <td className="p-4">
                  <StepProgress status={p.babakStatus} />
                </td>
                <td className="p-4 text-gold font-semibold text-xs">
                  {babakLabel[p.babakStatus] || p.babakStatus}
                </td>
                <td className="p-4 space-x-2">
                  <button
                    onClick={() => menang(p)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-soft text-emerald hover:brightness-125 transition-all"
                  >
                    Menang
                  </button>
                  <button
                    onClick={() => kalah(p)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-soft text-rose hover:brightness-125 transition-all"
                  >
                    Kalah
                  </button>
                </td>
              </tr>
            ))}
            {aktif.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted">
                  Tidak ada peserta aktif di babak ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted mt-4">
        Catatan: Untuk BoB, seluruh proses (Penyisihan → Juara) idealnya
        diselesaikan dalam 1 hari yang sama (lihat kolom tanggal pendaftaran),
        sesuai biaya pendaftarannya yang lebih mahal.
      </p>
    </div>
  );
}
