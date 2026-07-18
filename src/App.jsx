import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Pendaftaran from "./pages/Pendaftaran";
import Peserta from "./pages/Peserta";
import Dashboard from "./pages/Dashboard";
import Monitor from "./pages/Monitor";
import Penyisihan from "./pages/Penyisihan";
import Pengocokan from "./pages/Pengocokan";

<<<<<<< HEAD
function useLocalStorageState(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  const [daftar, setDaftar] = useLocalStorageState("dataLapak", []);
  const [htm, setHtm] = useLocalStorageState("htm", {
    utama: 50000,
    bob: 100000,
  });
=======
function readStoredValue(key, fallback) {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
}

function storeValue(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export default function App() {
  const [daftar, setDaftar] = useState(
    () => readStoredValue("dataLapak", []),
  );
  const [htm, setHtm] = useState(
    () => readStoredValue("htm", { utama: 50000, bob: 100000 }),
  );

  useEffect(() => storeValue("dataLapak", daftar), [daftar]);
  useEffect(() => storeValue("htm", htm), [htm]);
>>>>>>> 983b86608e7e182ebed8cc3f96e52a635ba033e1

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen bg-ink font-body text-ink-text">
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
