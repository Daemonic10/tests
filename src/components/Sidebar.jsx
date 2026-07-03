import { Link, useLocation } from "react-router-dom";

const icons = {
  daftar: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  ),
  peserta: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-8.13a4 4 0 110 8 4 4 0 010-8zm6 2a4 4 0 010 8"
    />
  ),
  dashboard: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3v18h18M7 15l4-4 3 3 5-6"
    />
  ),
  penyisihan: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h10M4 18h6"
    />
  ),
  pengocokan: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4h6v6H4V4zm10 10h6v6h-6v-6zM4 20l16-16"
    />
  ),
  monitor: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 5h16v11H4zM9 20h6M12 16v4"
    />
  ),
};

const nav = [
  { to: "/", label: "Pendaftaran", icon: "daftar" },
  { to: "/peserta", label: "Daftar Peserta", icon: "peserta" },
  { to: "/dashboard", label: "Dashboard Keuangan", icon: "dashboard" },
  { to: "/penyisihan", label: "Penyisihan", icon: "penyisihan" },
  { to: "/pengocokan", label: "Pengocokan", icon: "pengocokan" },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 shrink-0 bg-ink text-ink-text min-h-screen p-5 flex flex-col border-r border-border-soft">
      <div className="mb-10 px-2">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gold-soft border border-gold/40 flex items-center justify-center text-gold font-display font-bold">
            L
          </span>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight tracking-tight">
              Lapak Burung
            </h1>
            <p className="text-[11px] uppercase tracking-[0.15em] text-muted">
              Arena Kicau Pro
            </p>
          </div>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {nav.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-2 ${
                active
                  ? "bg-surface border-gold text-gold"
                  : "border-transparent text-muted hover:text-ink-text hover:bg-surface/60"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-4 h-4 shrink-0"
              >
                {icons[item.icon]}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="feather-divider mb-3" />

      <Link
        to="/monitor"
        className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-display font-semibold transition-all ${
          pathname === "/monitor"
            ? "bg-gold text-ink"
            : "bg-gold-soft text-gold border border-gold/40 hover:bg-gold hover:text-ink"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="w-4 h-4"
        >
          {icons.monitor}
        </svg>
        Layar Monitor
      </Link>
    </aside>
  );
}
