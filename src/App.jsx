import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Pendaftaran from "./pages/Pendaftaran";
import Peserta from "./pages/Peserta";
import Dashboard from "./pages/Dashboard";
import Monitor from "./pages/Monitor";
import Penyisihan from "./pages/Penyisihan";
import Pengocokan from "./pages/Pengocokan";

export default function App() {
  const [daftar, setDaftar] = useState(
    () => JSON.parse(localStorage.getItem("dataLapak")) || [],
  );
  const [htm, setHtm] = useState(
    () =>
      JSON.parse(localStorage.getItem("htm")) || { utama: 50000, bob: 100000 },
  );

  useEffect(
    () => localStorage.setItem("dataLapak", JSON.stringify(daftar)),
    [daftar],
  );
  useEffect(() => localStorage.setItem("htm", JSON.stringify(htm)), [htm]);

  return (
    <Router>
      <div className="flex min-h-screen bg-ink font-body text-ink-text">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Routes>
            <Route
              path="/"
              element={
                <Pendaftaran
                  daftar={daftar}
                  setDaftar={setDaftar}
                  htm={htm}
                  setHtm={setHtm}
                />
              }
            />
            <Route
              path="/peserta"
              element={<Peserta daftar={daftar} setDaftar={setDaftar} />}
            />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  daftar={daftar}
                  setDaftar={setDaftar}
                  htm={htm}
                  setHtm={setHtm}
                />
              }
            />
            <Route
              path="/penyisihan"
              element={<Penyisihan daftar={daftar} setDaftar={setDaftar} />}
            />
            <Route
              path="/pengocokan"
              element={<Pengocokan daftar={daftar} />}
            />
            <Route path="/monitor" element={<Monitor daftar={daftar} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
