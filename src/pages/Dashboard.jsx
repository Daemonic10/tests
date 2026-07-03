function ScorePanel({ label, accent, pendaftar, lunas, belum, tunai, bank }) {
  const accentMap = {
    indigo: {
      text: "text-indigo",
      bg: "bg-indigo-soft",
      border: "border-indigo/30",
      bar: "bg-indigo",
    },
    gold: {
      text: "text-gold",
      bg: "bg-gold-soft",
      border: "border-gold/30",
      bar: "bg-gold",
    },
  }[accent];

  const total = tunai + bank;
  const tunaiPct = total > 0 ? Math.round((tunai / total) * 100) : 0;

  return (
    <div
      className={`rounded-2xl border ${accentMap.border} bg-surface p-6 flex flex-col gap-5`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-muted mb-1">
            Kategori
          </p>
          <h3 className={`font-display font-bold text-xl ${accentMap.text}`}>
            {label}
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${accentMap.bg} ${accentMap.text}`}
        >
          {pendaftar} tim
        </span>
      </div>

      <div>
        <p className="text-xs text-muted mb-1">Omzet {label}</p>
        <p className={`scoreboard-num text-3xl font-bold ${accentMap.text}`}>
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

      <div>
        <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden flex">
          <div
            className="h-full bg-emerald"
            style={{ width: `${tunaiPct}%` }}
          />
          <div
            className="h-full bg-indigo"
            style={{ width: `${100 - tunaiPct}%` }}
          />
        </div>
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
    <div className="bg-surface border border-border-soft rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.12em] text-muted mb-2">
        {label}
      </p>
      <p className={`scoreboard-num text-2xl font-bold ${toneMap[tone]}`}>
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
    <div className="bg-surface border border-border-soft rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
          ⬇ Export Backup
        </button>
        <label className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-indigo-soft text-indigo hover:brightness-110 transition-all cursor-pointer">
          ⬆ Import Backup
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
  const hitung = (mode, metode) =>
    daftar
      .filter(
        (p) => p.sudahBayar && p.modeLomba === mode && p.metode === metode,
      )
      .reduce(
        (sum, p) =>
          sum +
          (typeof p.harga === "number"
            ? p.harga
            : mode === "Utama"
              ? htm.utama
              : htm.bob),
        0,
      );

  const utamaTunai = hitung("Utama", "Tunai");
  const utamaBank = hitung("Utama", "Bank Transfer");
  const bobTunai = hitung("BoB", "Tunai");
  const bobBank = hitung("BoB", "Bank Transfer");

  const omzetUtama = utamaTunai + utamaBank;
  const omzetBob = bobTunai + bobBank;
  const totalTunai = utamaTunai + bobTunai;
  const totalTransfer = utamaBank + bobBank;
  const omzetTotal = totalTunai + totalTransfer;

  const pesertaUtama = daftar.filter((p) => p.modeLomba === "Utama");
  const pesertaBob = daftar.filter((p) => p.modeLomba === "BoB");
  const lunasUtama = pesertaUtama.filter((p) => p.sudahBayar).length;
  const lunasBob = pesertaBob.filter((p) => p.sudahBayar).length;

  return (
    <div className="p-8 min-h-screen bg-ink">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-gold mb-1">
          Papan Skor Keuangan
        </p>
        <h2 className="font-display font-bold text-3xl text-ink-text">
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatChip
          label="Total Pendaftar"
          value={daftar.length}
          sub={`${pesertaUtama.length} Utama · ${pesertaBob.length} BoB`}
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

      {/* Panel terpisah per kategori lomba */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <ScorePanel
          label="Lomba Utama"
          accent="indigo"
          pendaftar={pesertaUtama.length}
          lunas={lunasUtama}
          belum={pesertaUtama.length - lunasUtama}
          tunai={utamaTunai}
          bank={utamaBank}
        />
        <ScorePanel
          label="Best of Best (BoB)"
          accent="gold"
          pendaftar={pesertaBob.length}
          lunas={lunasBob}
          belum={pesertaBob.length - lunasBob}
          tunai={bobTunai}
          bank={bobBank}
        />
      </div>

      {/* Tabel matriks detail */}
      <div className="rounded-2xl border border-border-soft bg-surface overflow-hidden">
        <div className="px-6 py-4 border-b border-border-soft">
          <h3 className="font-display font-semibold text-ink-text">
            Rincian Matriks Kategori × Metode
          </h3>
        </div>
        <table className="w-full text-center text-sm">
          <thead>
            <tr className="text-muted text-xs uppercase tracking-wide">
              <th className="p-4 text-left">Kategori</th>
              <th className="p-4 text-emerald">Tunai</th>
              <th className="p-4 text-indigo">Transfer</th>
              <th className="p-4 text-gold">Subtotal</th>
            </tr>
          </thead>
          <tbody className="text-ink-text">
            <tr className="border-t border-border-soft">
              <td className="p-4 text-left font-medium">Lomba Utama</td>
              <td className="p-4 scoreboard-num">
                Rp {utamaTunai.toLocaleString("id-ID")}
              </td>
              <td className="p-4 scoreboard-num">
                Rp {utamaBank.toLocaleString("id-ID")}
              </td>
              <td className="p-4 scoreboard-num font-bold text-gold">
                Rp {omzetUtama.toLocaleString("id-ID")}
              </td>
            </tr>
            <tr className="border-t border-border-soft">
              <td className="p-4 text-left font-medium">BoB</td>
              <td className="p-4 scoreboard-num">
                Rp {bobTunai.toLocaleString("id-ID")}
              </td>
              <td className="p-4 scoreboard-num">
                Rp {bobBank.toLocaleString("id-ID")}
              </td>
              <td className="p-4 scoreboard-num font-bold text-gold">
                Rp {omzetBob.toLocaleString("id-ID")}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gold/40 bg-surface-2">
              <td className="p-4 text-left font-display font-bold text-gold">
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
  );
}
