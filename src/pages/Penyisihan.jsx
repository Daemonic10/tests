import {
  babakUrutan,
  babakLabel,
  pesertaUnik,
  modeSingkat,
  modeAccent,
} from "../lib/babaks";

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

export default function Penyisihan({ daftar, setDaftar }) {
  // Dedup: 1 burung bisa punya beberapa baris (daftar ulang per kategori),
  // tapi di sini kita hanya perlu 1 baris per burung untuk progres babaknya.
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
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-ink">
      <div className="mb-6 sm:mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold mb-1">
            Babak Gugur
          </p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink-text">
            Penyisihan &amp; Knockout
          </h2>
        </div>
        <div className="flex gap-2 sm:gap-3 text-xs">
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

      <div className="card overflow-hidden">
        <div className="table-scroll">
          <table className="w-full text-left text-sm min-w-[720px]">
            <thead>
              <tr className="text-muted text-xs uppercase tracking-wide border-b border-border-soft">
                <th className="p-4">Tim / Burung</th>
                <th className="p-4">Kategori</th>
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
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-soft text-emerald text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap">
                          Lolos Otomatis
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted">{p.namaTim}</p>
                  </td>
                  <td className="p-4">
                    <ModeBadge mode={p.modeLomba} />
                  </td>
                  <td className="p-4">
                    <StepProgress status={p.babakStatus} />
                  </td>
                  <td className="p-4 text-gold font-semibold text-xs whitespace-nowrap">
                    {babakLabel[p.babakStatus] || p.babakStatus}
                  </td>
                  <td className="p-4 space-x-2 whitespace-nowrap">
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
      </div>

      <p className="text-xs text-muted mt-4">
        Catatan: BoB Sabtu &amp; BoB Minggu masing-masing berjalan dalam 1 hari
        yang sama (Penyisihan → Juara), sesuai tanggal pendaftarannya — sejalan
        dengan biaya pendaftarannya yang lebih mahal dan kuota harian yang
        terpisah dari kategori Utama.
      </p>
    </div>
  );
}
