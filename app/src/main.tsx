import { App as NativeApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { builtById } from "./scenes/registry";
import "./styles.css";
import "./locale.css";
import { ChapterPage } from "./ui/ChapterPage";
import { Home } from "./ui/Home";

// Routes are plain hash tokens (#ch14) so links into a chapter survive being shared.
const parse = () => {
  const m = location.hash.match(/^#ch(\d+)$/);
  return m ? Number(m[1]) : null;
};

function App() {
  const [id, setId] = useState(parse);
  // the chapter just left, so the table of contents opens where the student was
  const [from, setFrom] = useState<number | null>(null);
  const current = useRef(id);
  useEffect(() => {
    const onHash = () => {
      const next = parse();
      // leaving a chapter's own page (/ch14/) for the table of contents: move to the site root,
      // so reloading shows the table of contents rather than that page's chapter again
      if (next === null && /\/ch\d+\/$/.test(location.pathname)) history.replaceState(null, "", import.meta.env.BASE_URL);
      if (current.current !== null) setFrom(current.current);
      current.current = next;
      setId(next);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  // Android back button: a chapter goes back to the table of contents, the table of contents leaves the app
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const sub = NativeApp.addListener("backButton", () => {
      if (parse() !== null) location.hash = "";
      else void NativeApp.exitApp();
    });
    return () => void sub.then((h) => h.remove());
  }, []);
  const built = id === null ? undefined : builtById(id);
  return built ? <ChapterPage key={built.spec.id} built={built} /> : <Home from={from} />;
}

// offline support on the public website only (not inside the Android app or the single-file artifact)
if (import.meta.env.MODE === "pages" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {}));
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
