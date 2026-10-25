import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { MNIST_TEST_ACC } from "../../../../data/part2-mnist";
import { predict, toMnist } from "../../../../data/part2-mnist-net";
import "../../../../playgrounds/part2/style.css";

type P = [number, number];
const RASTER = 112; // strokes are re-drawn here at a fixed scale, then reduced to 28×28 like MNIST
const LINE = 9; // px in RASTER space ≈ 2.2 px once the ink box is 20 px tall, MNIST's stroke width
const BOX = 80;

const token = (el: Element, name: string) => getComputedStyle(el).getPropertyValue(name).trim();

/** draw the strokes so their ink box is about BOX px, centred, white on black (an offscreen grayscale buffer) */
function rasterize(strokes: P[][]) {
  const pts = strokes.flat();
  if (!pts.length) return null;
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const side = Math.max(x1 - x0, y1 - y0, 1e-3);
  const k = (BOX - LINE) / side;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const c = document.createElement("canvas");
  c.width = RASTER;
  c.height = RASTER;
  const g = c.getContext("2d", { willReadFrequently: true });
  if (!g) return null;
  g.fillStyle = "black";
  g.fillRect(0, 0, RASTER, RASTER);
  g.strokeStyle = "white";
  g.lineWidth = LINE;
  g.lineCap = "round";
  g.lineJoin = "round";
  for (const s of strokes) {
    g.beginPath();
    s.forEach(([x, y], i) => {
      const px = RASTER / 2 + (x - cx) * k;
      const py = RASTER / 2 + (y - cy) * k;
      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    });
    if (s.length === 1) g.lineTo(RASTER / 2 + (s[0][0] - cx) * k + 0.01, RASTER / 2 + (s[0][1] - cy) * k);
    g.stroke();
  }
  const d = g.getImageData(0, 0, RASTER, RASTER).data;
  const gray = new Float32Array(RASTER * RASTER);
  for (let i = 0; i < gray.length; i++) gray[i] = d[i * 4] / 255;
  return toMnist(gray, RASTER, RASTER);
}

export function DigitPad() {
  const pad = useRef<HTMLCanvasElement>(null);
  const seen = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<P[][]>([]);
  const drawing = useRef(false);
  const pending = useRef(0);
  const [probs, setProbs] = useState<number[] | null>(null);
  const [count, setCount] = useState(0);

  const paint = useCallback(() => {
    const c = pad.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    if (c.width !== Math.round(r.width * dpr)) {
      c.width = Math.round(r.width * dpr);
      c.height = Math.round(r.height * dpr);
    }
    const g = c.getContext("2d");
    if (!g) return;
    g.clearRect(0, 0, c.width, c.height);
    g.strokeStyle = token(c, "--ink");
    g.lineWidth = c.width * 0.065;
    g.lineCap = "round";
    g.lineJoin = "round";
    for (const s of strokes.current) {
      g.beginPath();
      s.forEach(([x, y], i) => (i ? g.lineTo(x * c.width, y * c.height) : g.moveTo(x * c.width, y * c.height)));
      if (s.length === 1) g.lineTo(s[0][0] * c.width + 0.01, s[0][1] * c.height);
      g.stroke();
    }
  }, []);

  const think = useCallback(() => {
    pending.current = 0;
    const x = rasterize(strokes.current);
    const sc = seen.current;
    if (sc) {
      const g = sc.getContext("2d");
      if (g) {
        g.clearRect(0, 0, 28, 28);
        if (x) {
          const ink = token(sc, "--ink");
          g.fillStyle = ink;
          for (let i = 0; i < 784; i++)
            if (x[i] > 0.02) {
              g.globalAlpha = Math.min(1, x[i]);
              g.fillRect(i % 28, Math.floor(i / 28), 1, 1);
            }
          g.globalAlpha = 1;
        }
      }
    }
    setProbs(x ? predict(x).probs : null);
  }, []);
  const schedule = useCallback(() => {
    if (!pending.current) pending.current = requestAnimationFrame(think);
  }, [think]);

  useEffect(() => {
    paint();
    const onResize = () => paint();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(pending.current);
    };
  }, [paint]);

  const pos = (e: PointerEvent<HTMLCanvasElement>): P => {
    const r = e.currentTarget.getBoundingClientRect();
    return [Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))];
  };
  const clear = () => {
    strokes.current = [];
    setCount(0);
    paint();
    think();
  };
  const undo = () => {
    strokes.current = strokes.current.slice(0, -1);
    setCount(strokes.current.length);
    paint();
    think();
  };

  const best = probs ? probs.indexOf(Math.max(...probs)) : -1;
  const tip = !probs
    ? "マスいっぱいに数字を1つ大きくかいてみましょう。0から9までどれでもOKです。"
    : probs[best] > 0.8
      ? `ネットワークの答え：${best}（${Math.round(probs[best] * 100)}%）。当たりましたか？わざとあいまいにかいて、迷わせてみましょう。`
      : `ネットワークが迷っています：${best}の確率 ${Math.round(probs[best] * 100)}%。どの数字と迷っているか、棒を見てみましょう。`;

  return (
    <div className="plane-lab">
      <div className="p2-pad">
        <canvas
          ref={pad}
          aria-label="指で数字をかくマス"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            drawing.current = true;
            strokes.current = [...strokes.current, [pos(e)]];
            setCount(strokes.current.length);
            paint();
            schedule();
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            const s = strokes.current[strokes.current.length - 1];
            s.push(pos(e));
            paint();
            schedule();
          }}
          onPointerUp={() => {
            drawing.current = false;
            schedule();
          }}
          onPointerCancel={() => {
            drawing.current = false;
          }}
        />
        <div className="lab-actions">
          <button className="btn" onClick={clear} disabled={count === 0}>
            消す
          </button>
          <button className="btn ghost" onClick={undo} disabled={count === 0}>
            1画もどす
          </button>
        </div>
      </div>
      <div className="plane-side">
        <div className="p2-seen">
          <canvas ref={seen} width={28} height={28} aria-label="ネットワークが見ている28×28の画像" />
          <p className="p2-note">ネットワークが見ている画像：MNISTと同じように、インクを20×20の大きさにそろえ、重心を28×28の真ん中に置きました。</p>
        </div>
        <div className="bars">
          {Array.from({ length: 10 }, (_, d) => (
            <div className="bar-row p2-digit-row" key={d} data-best={d === best}>
              <span className="label">{d}</span>
              <span className="track">
                <span className="fill" style={{ display: "block", width: `${probs ? probs[d] * 100 : 0}%`, background: d === best ? "var(--hl-yellow)" : "var(--hl-sky)" }} />
              </span>
              <span className="val">{probs ? `${(probs[d] * 100).toFixed(probs[d] < 0.1 ? 1 : 0)}%` : "–"}</span>
            </div>
          ))}
        </div>
        <p className="p2-note">
          784 → 64 → 10 のネットワーク。MNISTのテスト画像1万枚のうち{(MNIST_TEST_ACC * 100).toFixed(1)}%を当てました。指でかいた字はMNISTとちがうので、ときどきまちがえます。
        </p>
        <p className="lab-tip">{tip}</p>
      </div>
    </div>
  );
}
