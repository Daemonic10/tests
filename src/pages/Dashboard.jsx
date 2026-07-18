import {
  MODE_UTAMA,
  MODE_BOB_SABTU,
  MODE_BOB_MINGGU,
  modeLabel,
  modeSingkat,
} from "../lib/babaks";

const ACCENT = {
  indigo: {
    text: "text-indigo",
    bg: "bg-indigo-soft",
    border: "border-indigo/30",
  },
  gold: {
    text: "text-gold",
    bg: "bg-gold-soft",
    border: "border-gold/30",
  },
  cyan: {
    text: "text-cyan",
    bg: "bg-cyan-soft",
    border: "border-cyan/30",
  },
};

function ScorePanel({ label, accent, pendaftar, lunas, belum, tunai, bank }) {
  const a = ACCENT[accent];
  const total = tunai + bank;
  const tunaiPct = total > 0 ? Math.round((tunai / total) * 100) : 0;

  return (
    <div
      className={`rounded-2xl border ${a.border} bg-surface p-5 sm:p-6 flex flex-col gap-5`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.15em] text-muted mb-1">
            Kategori
          </p>
          <h3
            className={`font-display font-bold text-lg sm:text-xl ${a.text} truncate`}
          >
            {label}
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${a.bg} ${a.text}`}
        >
          {pendaftar} tim
        </span>
      </div>

      <div>
        <p className="text-xs text-muted mb-1">Omzet {label}</p>
        <p
          className={`scoreboard-num text-2xl sm:text-3xl font-bold ${a.text}`}
        >
          Rp {total.toLocaleString("id-ID")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-2 rounded-xl p-3">
          <p className="text-[11px] text-muted mb-1">Tunai</p>
          <p className="scoreboard-num text-emerald font-semibold text-sm">
            Rp {tunai.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-surface-2 rounded-xl p-3">
          <p className="text-[11px] text-muted mb-1">Transfer</p>
          <p className="scoreboard-num text-indigo font-semibold text-sm">
            Rp {bank.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden flex">
        <div className="h-full bg-emerald" style={{ width: `${tunaiPct}%` }} />
        <div
          className="h-full bg-indigo"
          style={{ width: `${100 - tunaiPct}%` }}
        />
      </div>

      <div className="feather-divider" />

      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-emerald">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald" /> {lunas} lunas
        </span>
        <span className="flex items-center gap-1.5 text-rose">
          <span className="w-1.5 h-1.5 rounded-full bg-rose" /> {belum} belum
        </span>
      </div>
    </div>
  );
}

function StatChip({ label, value, sub, tone = "text" }) {
  const toneMap = {
    text: "text-ink-text",
    emerald: "text-emerald",
    indigo: "text-indigo",
    gold: "text-gold",
  };
  return (
    <div className="card p-5">
      <p className="text-xs uppercase tracking-[0.12em] text-muted mb-2">
        {label}
      </p>
      <p
        className={`scoreboard-num text-xl sm:text-2xl font-bold ${toneMap[tone]}`}
      >
        {value}
      </p>
      {sub && <p className="text-[11px] text-muted mt-1">{sub}</p>}
    </div>
  );
}

function BackupPanel({ daftar, setDaftar, htm, setHtm }) {
  const handleExport = () => {
    const backup = {
      daftar,
      htm,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-lomba-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data.daftar)) {
          throw new Error(
            "File backup tidak valid (data peserta tidak ditemukan).",
          );
        }
        const konfirmasi = window.confirm(
          `Import akan MENIMPA ${daftar.length} data saat ini dengan ${data.daftar.length} data dari backup. Lanjutkan?`,
        );
        if (!konfirmasi) return;

        setDaftar(data.daftar);
        if (data.htm && typeof data.htm.utama === "number") {
          setHtm(data.htm);
        }
        alert("Import backup berhasil.");
      } catch (err) {
        alert("Gagal membaca file backup: " + err.message);
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="card p-5 sm:p-6 mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.15em] text-muted mb-1">
          Backup Data
        </p>
        <p className="text-sm text-ink-text">
          Ekspor seluruh data peserta &amp; harga HTM ke file, atau pulihkan
          dari file backup sebelumnya.
        </p>
      </div>
      <div className="flex gap-3 shrink-0">
        <button
          onClick={handleExport}
          className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-soft text-emerald hover:brightness-110 transition-all"
        >
          ⬇ Export
        </button>
        <label className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-indigo-soft text-indigo hover:brightness-110 transition-all cursor-pointer">
          ⬆ Import
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}

export default function Dashboard({ daftar, setDaftar, htm, setHtm }) {
  // Omzet dihitung dari harga yang terkunci saat peserta mendaftar (p.harga),
  // bukan dari htm saat ini. Ini penting karena HTM bersifat fleksibel dan
  // bisa berubah — transaksi lama tidak boleh ikut berubah nilainya.
  const hargaFallback = (mode) => (mode === MODE_UTAMA ? htm.utama : htm.bob);

  const hitung = (mode, metode) =>
    daftar
      .filter(
        (p) => p.sudahBayar && p.modeLomba === mode && p.metode === metode,
      )
      .reduce(
        (sum, p) =>
          sum + (typeof p.harga === "number" ? p.harga : hargaFallback(mode)),
        0,
      );

  const kategori = [
    { mode: MODE_UTAMA, label: modeLabel[MODE_UTAMA], accent: "indigo" },
    { mode: MODE_BOB_SABTU, label: modeLabel[MODE_BOB_SABTU], accent: "gold" },
    {
      mode: MODE_BOB_MINGGU,
      label: modeLabel[MODE_BOB_MINGGU],
      accent: "cyan",
    },
  ].map((kat) => {
    const tunai = hitung(kat.mode, "Tunai");
    const bank = hitung(kat.mode, "Bank Transfer");
    const peserta = daftar.filter((p) => p.modeLomba === kat.mode);
    const lunas = peserta.filter((p) => p.sudahBayar).length;
    return {
      ...kat,
      tunai,
      bank,
      omzet: tunai + bank,
      pendaftar: peserta.length,
      lunas,
      belum: peserta.length - lunas,
    };
  });

  const totalTunai = kategori.reduce((s, k) => s + k.tunai, 0);
  const totalTransfer = kategori.reduce((s, k) => s + k.bank, 0);
  const omzetTotal = totalTunai + totalTransfer;

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-ink">
      <div className="mb-6 sm:mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-gold mb-1">
          Papan Skor Keuangan
        </p>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink-text">
          Dashboard
        </h2>
      </div>

      <BackupPanel
        daftar={daftar}
        setDaftar={setDaftar}
        htm={htm}
        setHtm={setHtm}
      />

      {/* Ringkasan total keseluruhan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatChip
          label="Total Pendaftar"
          value={daftar.length}
          sub={kategori
            .map((k) => `${k.pendaftar} ${modeSingkat[k.mode]}`)
            .join(" · ")}
        />
        <StatChip
          label="Total Tunai"
          value={`Rp ${totalTunai.toLocaleString("id-ID")}`}
          tone="emerald"
        />
        <StatChip
          label="Total Transfer"
          value={`Rp ${totalTransfer.toLocaleString("id-ID")}`}
          tone="indigo"
        />
        <StatChip
          label="Omzet Keseluruhan"
          value={`Rp ${omzetTotal.toLocaleString("id-ID")}`}
          tone="gold"
        />
      </div>

      {/* Panel terpisah per kategori lomba — Utama, BoB Sabtu, BoB Minggu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
        {kategori.map((k) => (
          <ScorePanel
            key={k.mode}
            label={k.label}
            accent={k.accent}
            pendaftar={k.pendaftar}
            lunas={k.lunas}
            belum={k.belum}
            tunai={k.tunai}
            bank={k.bank}
          />
        ))}
      </div>

      {/* Tabel matriks detail */}
      <div className="rounded-2xl border border-border-soft bg-surface overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-border-soft">
          <h3 className="font-display font-semibold text-ink-text">
            Rincian Matriks Kategori × Metode
          </h3>
        </div>
        <div className="table-scroll">
          <table className="w-full text-center text-sm min-w-[560px]">
            <thead>
              <tr className="text-muted text-xs uppercase tracking-wide">
                <th className="p-4 text-left">Kategori</th>
                <th className="p-4 text-emerald">Tunai</th>
                <th className="p-4 text-indigo">Transfer</th>
                <th className="p-4 text-gold">Subtotal</th>
              </tr>
            </thead>
            <tbody className="text-ink-text">
              {kategori.map((k) => (
                <tr key={k.mode} className="border-t border-border-soft">
                  <td className="p-4 text-left font-medium whitespace-nowrap">
                    {k.label}
                  </td>
                  <td className="p-4 scoreboard-num">
                    Rp {k.tunai.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4 scoreboard-num">
                    Rp {k.bank.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4 scoreboard-num font-bold text-gold">
                    Rp {k.omzet.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gold/40 bg-surface-2">
                <td className="p-4 text-left font-display font-bold text-gold whitespace-nowrap">
                  GRAND TOTAL
                </td>
                <td className="p-4 scoreboard-num font-bold text-emerald">
                  Rp {totalTunai.toLocaleString("id-ID")}
                </td>
                <td className="p-4 scoreboard-num font-bold text-indigo">
                  Rp {totalTransfer.toLocaleString("id-ID")}
                </td>
                <td className="p-4 scoreboard-num font-bold text-gold">
                  Rp {omzetTotal.toLocaleString("id-ID")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
