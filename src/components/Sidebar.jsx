import { useEffect, useState } from "react";
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
  menu: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 7h16M4 12h16M4 17h16"
    />
  ),
  close: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 6l12 12M18 6L6 18"
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

function Icon({ name, className = "w-4 h-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={`shrink-0 ${className}`}
    >
      {icons[name]}
    </svg>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="w-8 h-8 rounded-lg bg-gold-soft border border-gold/40 flex items-center justify-center text-gold font-display font-bold">
        L
      </span>
      <div>
        <h1 className="font-display font-bold text-lg leading-tight tracking-tight text-ink-text">
          Lapak Burung
        </h1>
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted">
          Arena Kicau Pro
        </p>
      </div>
    </div>
  );
}

function NavLinks({ pathname, onNavigate }) {
  return (
    <nav className="space-y-1 flex-1">
      {nav.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-2 ${
              active
                ? "bg-surface border-gold text-gold"
                : "border-transparent text-muted hover:text-ink-text hover:bg-surface/60"
            }`}
          >
            <Icon name={item.icon} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MonitorLink({ pathname, onNavigate }) {
  return (
    <Link
      to="/monitor"
      onClick={onNavigate}
      className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-display font-semibold transition-all ${
        pathname === "/monitor"
          ? "bg-gold text-ink"
          : "bg-gold-soft text-gold border border-gold/40 hover:bg-gold hover:text-ink"
      }`}
    >
      <Icon name="monitor" />
      Layar Monitor
    </Link>
  );
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Tutup drawer otomatis setiap kali berpindah halaman.
  useEffect(() => setOpen(false), [pathname]);

  // Kunci scroll body saat drawer mobile terbuka.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* ---- Top bar mobile (< md) ---- */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 bg-ink/95 backdrop-blur border-b border-border-soft">
        <Brand />
        <button
          onClick={() => setOpen(true)}
          aria-label="Buka menu navigasi"
          className="w-10 h-10 rounded-lg flex items-center justify-center text-ink-text bg-surface border border-border-soft active:scale-95 transition-transform"
        >
          <Icon name="menu" className="w-5 h-5" />
        </button>
      </header>

      {/* ---- Sidebar statis desktop (>= md) ---- */}
      <aside className="hidden md:flex w-64 shrink-0 bg-ink text-ink-text min-h-screen p-5 flex-col border-r border-border-soft">
        <div className="mb-10 px-2">
          <Brand />
        </div>
        <NavLinks pathname={pathname} />
        <div className="feather-divider mb-3 mt-3" />
        <MonitorLink pathname={pathname} />
      </aside>

      {/* ---- Drawer mobile (< md) ---- */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <button
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-ink border-r border-border-soft p-5 flex flex-col animate-[slideIn_0.2s_ease-out]">
            <div className="mb-8 flex items-center justify-between">
              <Brand />
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup menu"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-muted bg-surface border border-border-soft"
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            <div className="feather-divider mb-3 mt-3" />
            <MonitorLink
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}
