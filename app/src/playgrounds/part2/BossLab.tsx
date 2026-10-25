import { useEffect, useRef, useState } from "react";
import { DATASETS, accOf, epoch, initNet, lossOf, out, type Dataset, type TinyNet } from "../../data/part2-boss";
import { mulberry32 } from "../../data/part2-batch";
import { num } from "../../data/part2-toy";
import "./style.css";

const GX = 60;
const GY = 50;
const VB = { w: 300, h: 250 };
const HIDDEN = [2, 4, 8];
const LRS = [0.03, 0.1, 0.3, 1];
const MAX_EPOCHS = 600;
const PER_FRAME = 2;

const token = (el: Element, name: string) => getComputedStyle(el).getPropertyValue(name).trim();
const sx = (ds: Dataset, x: number) => ((x - ds.xr[0]) / (ds.xr[1] - ds.xr[0])) * VB.w;
const sy = (ds: Dataset, y: number) => VB.h - ((y - ds.yr[0]) / (ds.yr[1] - ds.yr[0])) * VB.h;

type State = { net: TinyNet; epochs: number; loss: number[] };

export function BossLab() {
  const [dsKey, setDsKey] = useState<Dataset["key"]>("map");
  const [hidden, setHidden] = useState(8);
  const [lr, setLr] = useState(0.1);
  const [seed, setSeed] = useState(1);
  const [running, setRunning] = useState(false);
  const [showVal, setShowVal] = useState(true);
  const ds = DATASETS.find((d) => d.key === dsKey)!;
  // the training state lives in a ref so every animation frame continues from the latest epoch; `tick` re-renders
  const stRef = useRef<State>({ net: initNet(8, 1), epochs: 0, loss: [] });
  const [tick, setTick] = useState(0);
  const st = stRef.current;
  const [ever, setEver] = useState([false, false, false, false]);
  const heat = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const rnd = useRef(mulberry32(99));
  const live = useRef({ ds, lr });
  live.current = { ds, lr };

  const reset = (key = dsKey, h = hidden, s = seed + 1) => {
    cancelAnimationFrame(raf.current);
    setRunning(false);
    setSeed(s);
    rnd.current = mulberry32(99 + s);
    const d = DATASETS.find((x) => x.key === key)!;
    const net = initNet(h, s);
    stRef.current = { net, epochs: 0, loss: [lossOf(net, d, d.train)] };
    setTick((t) => t + 1);
  };
  useEffect(() => {
    reset("map", 8, 1);
    return () => cancelAnimationFrame(raf.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // the training loop: a couple of epochs per animation frame
  useEffect(() => {
    if (!running) return;
    const step = () => {
      const { ds: d, lr: r } = live.current;
      const s = stRef.current;
      for (let k = 0; k < PER_FRAME && s.epochs < MAX_EPOCHS; k++) {
        epoch(s.net, d, r, 10, rnd.current);
        s.epochs += 1;
        const l = lossOf(s.net, d, d.train);
        s.loss.push(Number.isFinite(l) ? l : 1e6);
      }
      setTick((t) => t + 1);
      if (s.epochs >= MAX_EPOCHS) setRunning(false);
      else raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [running]);

  // the decision map
  useEffect(() => {
    const c = heat.current;
    if (!c) return;
    const g = c.getContext("2d");
    if (!g) return;
    const good = token(c, "--hl-mint");
    const bad = token(c, "--hl-pink");
    g.clearRect(0, 0, GX, GY);
    for (let j = 0; j < GY; j++)
      for (let i = 0; i < GX; i++) {
        const x = ds.xr[0] + ((i + 0.5) / GX) * (ds.xr[1] - ds.xr[0]);
        const y = ds.yr[1] - ((j + 0.5) / GY) * (ds.yr[1] - ds.yr[0]);
        const o = out(st.net, ds, x, y);
        const conf = Number.isFinite(o) ? Math.min(1, Math.abs(o - 0.5) * 2) : 1;
        g.globalAlpha = 0.25 + 0.55 * conf;
        g.fillStyle = o > 0.5 ? good : bad;
        g.fillRect(i, j, 1, 1);
      }
    g.globalAlpha = 1;
  }, [tick, ds]); // eslint-disable-line react-hooks/exhaustive-deps

  const trainAcc = accOf(st.net, ds, ds.train);
  const valAcc = accOf(st.net, ds, ds.val);
  const lastLoss = st.loss[st.loss.length - 1] ?? 0;
  const blown = !Number.isFinite(lastLoss) || lastLoss > 1;
  const now = [dsKey === "map" && valAcc === 1 && st.epochs > 0, dsKey === "target" && valAcc >= 0.95 && st.epochs > 0, dsKey === "target" && hidden === 2 && st.epochs >= 300, lr === 1 && st.epochs >= 40];
  useEffect(() => {
    if (now.some((d, i) => d && !ever[i])) setEver((e) => e.map((d, i) => d || now[i]));
  }, [now[0], now[1], now[2], now[3]]); // eslint-disable-line react-hooks/exhaustive-deps

  let tip: string;
  if (st.epochs === 0) tip = "'학습 시작'을 눌러 보세요. 처음엔 손잡이가 아무렇게나라서 경계도 엉망이에요.";
  else if (blown) tip = `손실이 ${lastLoss > 999 ? "엄청나게" : num(lastLoss, 1) + "까지"} 튀어 올랐어요! 학습률이 너무 커서 튕겨 나갔어요(22장). 학습률을 줄이고 처음부터 해 보세요.`;
  else if (dsKey === "target" && hidden === 2 && st.epochs >= 200 && valAcc < 0.9) tip = "뉴런 2개로는 꺾인 직선 두 개뿐이라 동그란 과녁을 둘러쌀 수 없어요. 뉴런을 늘려 보세요(18장).";
  else if (valAcc === 1) tip = `검증 점까지 모두 맞혔어요! ${st.epochs} 에폭 만에. 이제 ${dsKey === "map" ? "과녁에 도전해 보세요." : "뉴런 2개로도 될지 시험해 보세요."}`;
  else tip = `${st.epochs} 에폭: 손실 ${num(lastLoss, 3)}, 검증 정확도 ${Math.round(valAcc * 100)}%. 경계가 자라는 걸 지켜보세요.`;

  // loss curve
  const LW = 300;
  const LH = 70;
  const lmax = Math.max(0.05, Math.min(1, Math.max(...st.loss.slice(0, 3), 0.1)));
  const step = Math.max(1, Math.ceil(st.loss.length / 300));
  const pts = st.loss.filter((_, i) => i % step === 0 || i === st.loss.length - 1);
  const lossD = pts.map((l, i) => `${i ? "L" : "M"} ${((i / Math.max(1, pts.length - 1)) * LW).toFixed(1)} ${(LH - (Math.min(l, lmax) / lmax) * (LH - 4)).toFixed(1)}`).join(" ");

  const pick = (on: boolean) => (on ? { borderStyle: "solid", borderColor: "var(--ink)", color: "var(--ink)" } : undefined);

  return (
    <div className="plane-lab">
      <div className="p2-boss-plot">
        <canvas ref={heat} width={GX} height={GY} aria-hidden="true" />
        <svg viewBox={`0 0 ${VB.w} ${VB.h}`} role="img" aria-label={`${ds.name}: 에폭 ${st.epochs}, 검증 정확도 ${Math.round(valAcc * 100)}%`}>
          {ds.train.map((d, i) => {
            const x = sx(ds, d.x);
            const y = sy(ds, d.y);
            if (d.t) return <circle key={i} cx={x} cy={y} r={4.6} fill="var(--hl-mint)" stroke="var(--ink)" strokeWidth={1.4} />;
            return <path key={i} d={`M ${x - 3.6} ${y - 3.6} L ${x + 3.6} ${y + 3.6} M ${x + 3.6} ${y - 3.6} L ${x - 3.6} ${y + 3.6}`} stroke="var(--ink)" strokeWidth={2.2} strokeLinecap="round" />;
          })}
          {showVal &&
            ds.val.map((d, i) => {
              const x = sx(ds, d.x);
              const y = sy(ds, d.y);
              const right = (out(st.net, ds, d.x, d.y) > 0.5 ? 1 : 0) === d.t;
              return <path key={`v${i}`} d={`M ${x} ${y - 5.5} L ${x + 5.5} ${y} L ${x} ${y + 5.5} L ${x - 5.5} ${y} Z`} fill={d.t ? "var(--hl-mint)" : "var(--hl-pink)"} stroke={right ? "var(--ink)" : "var(--pen)"} strokeWidth={right ? 1.4 : 2.6} />;
            })}
        </svg>
      </div>
      <div className="plane-side">
        <div className="ctx-presets" role="group" aria-label="문제 고르기">
          {DATASETS.map((d) => (
            <button key={d.key} aria-pressed={dsKey === d.key} style={pick(dsKey === d.key)} onClick={() => { setDsKey(d.key); reset(d.key, hidden); }}>
              {d.name}
            </button>
          ))}
        </div>
        <div className="p2-boss-row">
          <span>뉴런</span>
          <div className="ctx-presets" role="group" aria-label="은닉 뉴런 수">
            {HIDDEN.map((h) => (
              <button key={h} aria-pressed={hidden === h} style={pick(hidden === h)} onClick={() => { setHidden(h); reset(dsKey, h); }}>
                {h}개
              </button>
            ))}
          </div>
        </div>
        <div className="p2-boss-row">
          <span>학습률</span>
          <div className="ctx-presets" role="group" aria-label="학습률">
            {LRS.map((r) => (
              <button key={r} aria-pressed={lr === r} style={pick(lr === r)} onClick={() => setLr(r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="lab-actions">
          <button className="btn" onClick={() => setRunning((v) => !v)} disabled={st.epochs >= MAX_EPOCHS}>
            {running ? "멈춤" : st.epochs ? "이어서 학습" : "학습 시작"}
          </button>
          <button className="btn ghost" onClick={() => reset()}>
            처음부터
          </button>
          <button className="btn ghost" aria-pressed={showVal} onClick={() => setShowVal((v) => !v)}>
            검증 점 {showVal ? "숨기기" : "보기"}
          </button>
        </div>
        <p className="p2-calc">
          에폭 <b>{st.epochs}</b> · 손실 <b>{blown ? "폭발!" : num(lastLoss, 3)}</b>
          <br />
          훈련 정확도 {Math.round(trainAcc * 100)}% · 검증 정확도 <b>{Math.round(valAcc * 100)}%</b>
        </p>
        <svg viewBox={`0 0 ${LW} ${LH}`} className="p2-boss-loss" role="img" aria-label="에폭마다 손실">
          <line x1={0} y1={LH} x2={LW} y2={LH} stroke="var(--ink)" strokeWidth={1.2} />
          <path d={lossD} fill="none" stroke="var(--hl-orange)" strokeWidth={2.2} />
          <text x={2} y={10} fontSize={10} fill="var(--ink-2)">
            손실
          </text>
        </svg>
        <ul className="missions">
          {["맛집 지도: 검증 정확도 100%", "과녁: 검증 정확도 95% 이상", "뉴런 2개로 과녁에 300 에폭 도전하기", "학습률 1로 학습해 보기"].map((t, i) => (
            <li key={t} data-done={ever[i]}>
              {ever[i] ? "○" : "□"} {t}
            </li>
          ))}
        </ul>
        <p className="p2-note">
          {ds.name}: 초록 칸은 신경망이 {ds.good}, 분홍 칸은 {ds.bad}라고 판단한 곳. 동그라미·엑스 = 훈련 점, ◇ = 검증 점(빨간 테두리는 틀린 것). 점은 설명용 예시예요.
        </p>
        <p className="lab-tip">{tip}</p>
      </div>
    </div>
  );
}
