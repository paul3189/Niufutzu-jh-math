/* 直覺道場外掛題組：三角比（similar.trig，九年級，108 課綱 S-9-4）— 2026-10-15
 * 範圍依授課老師 2026-10-15 裁定，只出：
 *   ① sin／cos／tan 的定義（對邊／斜邊、鄰邊／斜邊、對邊／鄰邊），比值只由角度決定
 *   ② 30°、45°、60° 的特別角三角比
 *   ③ 三角形面積 ½ab·sinC（夾角只用銳角；直角時不寫 sin 90°，直接當底與高）
 *   ④ sin、cos 的互餘關係 sin(90°−θ)=cosθ、cos(90°−θ)=sinθ
 *   ⑤ tan = sin ÷ cos
 *   ⑥ 應用：仰角、俯角、測高（含眼高、兩次仰角；兩次仰角只用 30°／45°／60°）— 老師 2026-10-15 同意加入
 * 不出：平方關係當公式、正弦／餘弦定理、和角差角、倍角、弧度、單位圓、鈍角三角比、反三角函數、圖形。
 * 非特別角的題目會在題幹給近似值（兩位小數，由 Math.sin 現算四捨五入，不手抄）。
 * 看圖反射的圖是 data/figs.js 的 qf-trig-*（_figs/custom_figs.py 產生，圖上不可有圖說）。
 */
(window.REFLEX_PLUS = window.REFLEX_PLUS || []).push(function (H) {
  "use strict";
  var mk = H.mk, mkDeg = H.mkDeg, ri = H.ri, pick = H.pick, frac = H.frac;
  var T = "similar.trig", G = 9;
  function D(x) { return "$" + x + "$"; }
  function F(n, d) { return D(frac(n, d)); }
  /* k√n：k=1 不寫 */
  function rt(k, n) { return (k === 1 ? "" : k) + "\\sqrt{" + n + "}"; }
  function deg(x) { return x + "^\\circ"; }
  function r2(x) { return Math.round(x * 100) / 100; }
  var RT = "直角三角形 $ABC$ 中，$\\angle C=90^\\circ$，";
  /* 畢氏數（股 a、股 b、斜邊 c），出題時隨機對調兩股 */
  var TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15], [20, 21, 29], [12, 16, 20]];
  function triple() {
    var t = pick(TRIPLES);
    return ri(2) ? { a: t[0], b: t[1], c: t[2] } : { a: t[1], b: t[0], c: t[2] };
  }

  /* ── ① 由邊長寫三角比 ── */
  function gSideRatio() {
    var s = triple(), a = s.a, b = s.b, c = s.c;          /* a = BC（∠A 的對邊）、b = AC、c = AB */
    var fn = pick(["sin", "cos", "tan"]), atA = ri(3) > 0;
    var V = {
      A: { sin: [a, c], cos: [b, c], tan: [a, b] },
      B: { sin: [b, c], cos: [a, c], tan: [b, a] }
    };
    var who = atA ? "A" : "B", v = V[who][fn];
    var given = ri(3);
    var q = RT;
    if (given === 0) q += "$\\overline{BC}=" + a + "$、$\\overline{AC}=" + b + "$、$\\overline{AB}=" + c + "$";
    else if (given === 1) q += "兩股 $\\overline{BC}=" + a + "$、$\\overline{AC}=" + b + "$";
    else q += "$\\overline{BC}=" + a + "$、斜邊 $\\overline{AB}=" + c + "$";
    q += "，$\\" + fn + " " + who + "=$？";
    var pool = H.shuffle([[a, c], [b, c], [a, b], [b, a]]).concat([[c, a], [c, b]]).map(function (p) { return F(p[0], p[1]); });
    var name = { sin: "對邊}}{\\text{斜邊", cos: "鄰邊}}{\\text{斜邊", tan: "對邊}}{\\text{鄰邊" }[fn];
    var tip = "站在 $\\angle " + who + "$ 看：$\\" + fn + " " + who + "=\\dfrac{\\text{" + name + "}}=" + frac(v[0], v[1]) + "$";
    if (given === 1) tip += "（斜邊先用畢氏定理：$\\sqrt{" + a + "^2+" + b + "^2}=" + c + "$）";
    if (given === 2) tip += "（缺的股先用畢氏定理：$\\sqrt{" + c + "^2-" + a + "^2}=" + b + "$）";
    return mk("geo", T, G, q, F(v[0], v[1]), [], tip, pool);
  }

  /* ── ② 特別角的值 ── */
  var SV = { half: "\\dfrac{1}{2}", r3h: "\\dfrac{\\sqrt{3}}{2}", r2h: "\\dfrac{\\sqrt{2}}{2}", r3t: "\\dfrac{\\sqrt{3}}{3}", one: "1", r3: "\\sqrt{3}" };
  var TAB = {
    sin: { 30: "half", 45: "r2h", 60: "r3h" },
    cos: { 30: "r3h", 45: "r2h", 60: "half" },
    tan: { 30: "r3t", 45: "one", 60: "r3" }
  };
  function gSpecialVal() {
    var fn = pick(["sin", "cos", "tan"]), A = pick([30, 45, 60]);
    var ans = TAB[fn][A];
    var other = A === 30 ? 60 : 30;
    var co = { sin: "cos", cos: "sin", tan: "sin" }[fn];
    var wr = [TAB[fn][other], TAB[co][A], TAB[fn][45], "r3", "one", "half", "r3h", "r3t"]
      .filter(function (k) { return k !== ans; })
      .filter(function (k, i, arr) { return arr.indexOf(k) === i; }).slice(0, 3);
    var tri = A === 45 ? "$1:1:\\sqrt{2}$" : "$1:\\sqrt{3}:2$（短股對 $30^\\circ$）";
    return mk("calc", T, G, "$\\" + fn + " " + deg(A) + "=$？", D(SV[ans]), wr.map(function (k) { return D(SV[k]); }),
      "畫出邊長比 " + tri + " 的三角形，站在 $" + deg(A) + "$ 讀邊長比：$\\" + fn + " " + deg(A) + "=" + SV[ans] + "$");
  }

  /* ── ② 特別角求邊長 ── */
  function gSpecialSide() {
    var k = 2 + ri(8), mode = ri(6), q, ans, tip;
    /* 選項池：k、√3k、2k、√2k 永遠互異 */
    var pool = [D(String(k)), D(rt(k, 3)), D(String(2 * k)), D(rt(k, 2))];
    if (mode === 0) {
      q = RT + "$\\angle A=30^\\circ$、斜邊 $\\overline{AB}=" + 2 * k + "$，$\\overline{BC}=$？";
      ans = D(String(k)); tip = "$\\overline{BC}$ 是 $30^\\circ$ 的對邊：$" + 2 * k + "\\sin30^\\circ=" + 2 * k + "\\times\\dfrac{1}{2}=" + k + "$";
    } else if (mode === 1) {
      q = RT + "$\\angle A=30^\\circ$、斜邊 $\\overline{AB}=" + 2 * k + "$，$\\overline{AC}=$？";
      ans = D(rt(k, 3)); tip = "$\\overline{AC}$ 是 $30^\\circ$ 的鄰邊：$" + 2 * k + "\\cos30^\\circ=" + 2 * k + "\\times\\dfrac{\\sqrt{3}}{2}=" + rt(k, 3) + "$";
    } else if (mode === 2) {
      q = RT + "$\\angle A=60^\\circ$、斜邊 $\\overline{AB}=" + 2 * k + "$，$\\overline{BC}=$？";
      ans = D(rt(k, 3)); tip = "$\\overline{BC}$ 是 $60^\\circ$ 的對邊：$" + 2 * k + "\\sin60^\\circ=" + rt(k, 3) + "$";
    } else if (mode === 3) {
      q = RT + "$\\angle A=60^\\circ$、$\\overline{AC}=" + k + "$，$\\overline{BC}=$？";
      ans = D(rt(k, 3)); tip = "已知鄰邊求對邊用 $\\tan$：$" + k + "\\tan60^\\circ=" + rt(k, 3) + "$";
    } else if (mode === 4) {
      q = RT + "$\\angle A=45^\\circ$、$\\overline{BC}=" + k + "$，斜邊 $\\overline{AB}=$？";
      ans = D(rt(k, 2)); tip = "等腰直角三角形 $1:1:\\sqrt{2}$：斜邊 $=\\sqrt{2}\\times" + k + "$";
    } else {
      q = RT + "$\\angle A=60^\\circ$、$\\overline{AC}=" + k + "$，斜邊 $\\overline{AB}=$？";
      ans = D(String(2 * k)); tip = "$\\cos60^\\circ=\\dfrac{\\overline{AC}}{\\overline{AB}}=\\dfrac{1}{2}$ → $\\overline{AB}=2\\times" + k + "$";
    }
    return mk("geo", T, G, q, ans, [], tip, pool);
  }

  /* ── ④ 互餘關係 ── */
  function gCofunction() {
    var t = 1 + ri(89);
    while (t === 45) t = 1 + ri(89);
    var a = 90 - t, mode = ri(3), q, tip;
    if (mode === 0) {
      q = "$\\sin " + deg(t) + "=\\cos x$，$x$ 為銳角，$x=$？";
      tip = "$\\sin\\theta=\\cos(90^\\circ-\\theta)$：$90^\\circ-" + deg(t) + "=" + deg(a) + "$";
    } else if (mode === 1) {
      q = "$\\cos " + deg(t) + "=\\sin x$，$x$ 為銳角，$x=$？";
      tip = "$\\cos\\theta=\\sin(90^\\circ-\\theta)$：$90^\\circ-" + deg(t) + "=" + deg(a) + "$";
    } else {
      q = "銳角 $A$、$B$ 滿足 $\\sin A=\\cos B$，$\\angle A=" + deg(t) + "$，$\\angle B=$？";
      tip = "$\\sin A=\\cos B$ 代表 $A$、$B$ 互餘（直角三角形的兩個銳角）：$\\angle B=90^\\circ-" + deg(t) + "$";
    }
    /* 誘答一律是 0°～90° 之間的銳角，不出現鈍角 */
    var wr = [t, a + 10, a - 10, a + 5, a - 5, 45].filter(function (v) { return v > 0 && v < 90 && v !== a; });
    return mkDeg("geo", T, G, q, a, wr.slice(0, 3), tip);
  }

  /* ── ⑤ tan = sin ÷ cos ── */
  function gTanFromSC() {
    var s = triple(), a = s.a, b = s.b, c = s.c;
    var q = "銳角 $\\theta$ 的 $\\sin\\theta=" + frac(a, c) + "$、$\\cos\\theta=" + frac(b, c) + "$，$\\tan\\theta=$？";
    return mk("geo", T, G, q, F(a, b), [F(b, a), F(a * b, c * c), F(c, b)],
      "$\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}=" + frac(a, c) + "\\div" + frac(b, c) + "=" + frac(a, b) + "$",
      [F(a + b, c), F(c, a)]);
  }

  /* ── ③ 面積 ½ab·sinC ── */
  function gArea() {
    var a, b;
    do { a = 2 + ri(11); b = 2 + ri(11); } while ((a * b) % 4);
    var m = a * b / 4, C = pick([30, 30, 45, 60, 60, 90]), mode = ri(5);
    var S = { 30: String(m), 45: rt(m, 2), 60: rt(m, 3), 90: String(2 * m) };
    if (mode === 0 && C !== 90) {
      /* 平行四邊形：兩個全等三角形 → ab·sinθ */
      var P = { 30: String(2 * m), 45: rt(2 * m, 2), 60: rt(2 * m, 3) };
      return mk("geo", T, G, "平行四邊形的兩鄰邊長 $" + a + "$、$" + b + "$，夾角 $" + deg(C) + "$，面積 = ？", D(P[C]),
        [D(S[C]), D(String(a * b)), D(C === 30 ? rt(2 * m, 3) : String(2 * m))],
        "對角線切成兩個全等三角形：面積 $=2\\times\\dfrac{1}{2}ab\\sin\\theta=" + a + "\\times" + b + "\\times\\sin" + deg(C) + "$");
    }
    var q = "$\\triangle ABC$ 中，$\\overline{CA}=" + a + "$、$\\overline{CB}=" + b + "$，夾角 $\\angle C=" + deg(C) + "$，面積 = ？";
    var wr, tip;
    if (C === 30) { wr = [String(2 * m), rt(m, 3), String(4 * m)]; tip = "$\\dfrac{1}{2}\\times" + a + "\\times" + b + "\\times\\sin30^\\circ=\\dfrac{1}{2}\\times" + a * b + "\\times\\dfrac{1}{2}=" + m + "$"; }
    else if (C === 45) { wr = [rt(2 * m, 2), String(m), String(2 * m)]; tip = "$\\dfrac{1}{2}\\times" + a + "\\times" + b + "\\times\\dfrac{\\sqrt{2}}{2}=" + rt(m, 2) + "$"; }
    else if (C === 60) { wr = [String(m), rt(2 * m, 3), String(2 * m)]; tip = "$\\dfrac{1}{2}\\times" + a + "\\times" + b + "\\times\\dfrac{\\sqrt{3}}{2}=" + rt(m, 3) + "$"; }
    else { wr = [String(4 * m), String(m), rt(m, 3)]; tip = "夾角是直角：兩邊就是底和高，面積 $=\\dfrac{1}{2}\\times" + a + "\\times" + b + "=" + 2 * m + "$"; }
    return mk("geo", T, G, q, D(S[C]), wr.map(D), tip);
  }
  /* 面積反求邊長（夾角 30°：面積 = ab/4） */
  function gAreaInv() {
    var a, b;
    do { a = 2 + ri(11); b = 2 + ri(11); } while ((a * b) % 4 || a === b);
    var S = a * b / 4;
    return mk("geo", T, G, "$\\triangle ABC$ 的面積是 $" + S + "$，$\\overline{CA}=" + a + "$、夾角 $\\angle C=30^\\circ$，$\\overline{CB}=$？",
      String(b), [String(2 * S / a), String(S), String(4 * S)].filter(function (x) { return /^\d+$/.test(x); }),
      "$\\dfrac{1}{2}\\times" + a + "\\times\\overline{CB}\\times\\dfrac{1}{2}=" + S + "$ → $\\overline{CB}=" + S + "\\times4\\div" + a + "=" + b + "$");
  }

  /* ── ① 非特別角：給近似值代入 ── */
  var ANG = [20, 25, 28, 32, 35, 37, 40, 50, 53, 55, 62, 65, 70];
  function gApprox() {
    var t = pick(ANG), rad = t * Math.PI / 180;
    var s = r2(Math.sin(rad)), c = r2(Math.cos(rad)), tn = r2(Math.tan(rad));
    var mode = ri(3), h, ans, wr, q, tip;
    var given = "已知 $\\sin " + deg(t) + "\\approx " + s + "$、$\\cos " + deg(t) + "\\approx " + c + "$、$\\tan " + deg(t) + "\\approx " + tn + "$。";
    if (mode < 2) {
      h = pick([10, 20, 50, 100]);
      var opp = mode === 0;
      q = RT + "$\\angle A=" + deg(t) + "$、斜邊 $\\overline{AB}=" + h + "$，" + given + "$\\overline{" + (opp ? "BC" : "AC") + "}\\approx$？";
      ans = String(r2(h * (opp ? s : c)));
      wr = [String(r2(h * (opp ? c : s))), String(r2(h * tn))];
      tip = (opp ? "$\\overline{BC}$ 是對邊、$\\overline{AB}$ 是斜邊 → 用 $\\sin$" : "$\\overline{AC}$ 是鄰邊、$\\overline{AB}$ 是斜邊 → 用 $\\cos$") +
        "：$" + h + "\\times" + (opp ? s : c) + "=" + ans + "$";
    } else {
      h = pick([10, 20, 100]);
      q = RT + "$\\angle A=" + deg(t) + "$、$\\overline{AC}=" + h + "$，" + given + "$\\overline{BC}\\approx$？";
      ans = String(r2(h * tn));
      wr = [String(r2(h * s)), String(r2(h * c))];
      tip = "$\\overline{AC}$ 是鄰邊、要求對邊 → 用 $\\tan$：$" + h + "\\times" + tn + "=" + ans + "$";
    }
    return mk("geo", T, G, q, ans, wr, tip);
  }

  /* ── 仰角、俯角測高（2026-10-15 老師同意加入）── */
  /* 特別角：樓高／距離，答案用根號 */
  function gElevSpecial() {
    var A = pick([30, 45, 60]), mode = ri(4), k = 2 + ri(9), q, ans, tip, pool;
    if (mode < 2) {
      /* 已知水平距離 d，求高 = d·tanθ（30° 時 d 取 3 的倍數） */
      var d = A === 30 ? 3 * k : k * 5;
      var hS = { 30: rt(d / 3, 3), 45: String(d), 60: rt(d, 3) }[A];
      q = mode === 0
        ? "在地面上離樓底 $" + d + "$ 公尺處，測得樓頂的仰角為 $" + deg(A) + "$（不計眼高），樓高 = ？"
        : "從樓頂看地面上一點的俯角為 $" + deg(A) + "$，這點離樓底 $" + d + "$ 公尺，樓高 = ？";
      ans = D(hS);
      pool = [D(rt(d, 3)), D(String(d)), D(rt(d / 3 === Math.floor(d / 3) ? d / 3 : d, 3)), D(String(2 * d)), D(rt(2 * d, 3))];
      tip = (mode === 1 ? "俯角＝地面那一點看樓頂的仰角（內錯角）；" : "") + "高 ＝ 水平距離 × $\\tan" + deg(A) + "$ $=" + d + "\\tan" + deg(A) + "=" + hS + "$";
    } else {
      /* 已知高 h，求水平距離 = h ÷ tanθ（60° 時 h 取 3 的倍數） */
      var h = A === 60 ? 3 * k : k * 5;
      var dS = { 30: rt(h, 3), 45: String(h), 60: rt(h / 3, 3) }[A];
      q = mode === 2
        ? "在 $" + h + "$ 公尺高的塔頂，測得地面上一艘船的俯角為 $" + deg(A) + "$，船到塔底的距離 = ？"
        : "樓高 $" + h + "$ 公尺，在地面某處測得樓頂仰角為 $" + deg(A) + "$（不計眼高），此處到樓底的距離 = ？";
      ans = D(dS);
      pool = [D(rt(h, 3)), D(String(h)), D(rt(h / 3 === Math.floor(h / 3) ? h / 3 : 2 * h, 3)), D(String(2 * h)), D(rt(2 * h, 3))];
      tip = (mode === 2 ? "俯角搬到船那一端變成仰角（內錯角）；" : "") + "$\\tan" + deg(A) + "=\\dfrac{" + h + "}{\\text{距離}}$ → 距離 $=" + h + "\\div\\tan" + deg(A) + "=" + dS + "$";
    }
    return mk("geo", T, G, q, ans, [], tip, pool);
  }
  /* 非特別角：給近似值代入（含眼高），答案現算四捨五入到兩位 */
  function gElevApprox() {
    var t = pick(ANG.filter(function (x) { return x <= 55; })), rad = t * Math.PI / 180;
    var s = r2(Math.sin(rad)), c = r2(Math.cos(rad)), tn = r2(Math.tan(rad));
    var d = pick([10, 20, 30, 50]), eye = pick([0, 1.5, 1.6]);
    var given = "（$\\sin " + deg(t) + "\\approx " + s + "$、$\\cos " + deg(t) + "\\approx " + c + "$、$\\tan " + deg(t) + "\\approx " + tn + "$）";
    var q = eye
      ? "小明眼睛離地 $" + eye + "$ 公尺，站在離樹 $" + d + "$ 公尺處，看樹頂的仰角為 $" + deg(t) + "$，樹高約多少公尺？" + given
      : "在地面上離旗桿 $" + d + "$ 公尺處，測得桿頂仰角為 $" + deg(t) + "$（不計眼高），旗桿高約多少公尺？" + given;
    var ans = String(r2(eye + d * tn));
    var wr = [String(r2(eye + d * s)), String(r2(eye + d * c))];
    if (eye) wr.unshift(String(r2(d * tn)));
    return mk("geo", T, G, q, ans, wr,
      "高 ＝ " + (eye ? "眼高 ＋ " : "") + "水平距離 × $\\tan$：$" + (eye ? eye + "+" : "") + d + "\\times" + tn + "=" + ans + "$");
  }
  /* 兩次仰角：只用 30°／45°／60°，答案用根號 */
  function gElevTwo() {
    var pr = pick([[30, 60], [30, 60], [30, 45], [45, 60]]), a = pr[0], b = pr[1];
    var m = 1 + ri(10), d = 2 * m, ans, wr, tip;
    var q = "地面上 $P$、$Q$ 兩點與塔底 $C$ 在同一直線上（$Q$ 在 $P$、$C$ 之間），$\\overline{PQ}=" + d + "$。" +
      "在 $P$、$Q$ 測得塔頂的仰角分別為 $" + deg(a) + "$、$" + deg(b) + "$（不計眼高），塔高 = ？";
    if (a === 30 && b === 60) {
      if (ri(3) === 0) {
        q = q.replace("塔高 = ？", "$Q$ 到塔底的距離 $\\overline{QC}=$？");
        return mk("geo", T, G, q, D(String(m)), [D(rt(m, 3)), D(String(d)), D(rt(d, 3))],
          "設 $\\overline{QC}=x$，塔高 $=\\sqrt{3}x$；又 $\\tan30^\\circ=\\dfrac{\\sqrt{3}x}{" + d + "+x}=\\dfrac{\\sqrt{3}}{3}$ → $3x=" + d + "+x$ → $x=" + m + "$（$\\triangle PQB$ 是等腰：$\\overline{QB}=\\overline{PQ}$）");
      }
      ans = rt(m, 3); wr = [String(d), rt(d, 3), String(m)];
      tip = "設塔高 $h$：$\\overline{QC}=\\dfrac{h}{\\sqrt{3}}$、$\\overline{PC}=\\sqrt{3}h$，相減 $\\dfrac{2h}{\\sqrt{3}}=" + d + "$ → $h=" + rt(m, 3) + "$";
    } else if (a === 30) {
      /* 30°、45°：QC = h，PC = √3h → (√3−1)h = d → h = m(√3+1) */
      ans = rt(m, 3) + "+" + m; wr = [rt(m, 3) + "-" + m, rt(d, 3), String(d)];
      tip = "設塔高 $h$：$\\overline{QC}=h$（$45^\\circ$）、$\\overline{PC}=\\sqrt{3}h$，相減 $(\\sqrt{3}-1)h=" + d + "$ → $h=\\dfrac{" + d + "}{\\sqrt{3}-1}=" + ans + "$";
    } else {
      /* 45°、60°：PC = h，QC = h/√3 → h(1−1/√3) = d → h = m(3+√3) */
      ans = rt(m, 3) + "+" + 3 * m; wr = [String(3 * m) + "-" + rt(m, 3), rt(d, 3), String(3 * m)];
      tip = "設塔高 $h$：$\\overline{PC}=h$（$45^\\circ$）、$\\overline{QC}=\\dfrac{h}{\\sqrt{3}}$，相減 $h-\\dfrac{h}{\\sqrt{3}}=" + d + "$ → $h=" + ans + "$";
    }
    return mk("geo", T, G, q, D(ans), wr.map(D), tip);
  }

  /* ── 看圖反射（圖：qf-trig-*） ── */
  function fig(id, ask) {
    var svg = (window.FIGS || {})[id];
    return svg ? '<div class="q-fig">' + svg + '</div><div class="q-ask">' + ask + '</div>' : null;
  }
  var FIGURE = [
    ["qf-trig-sin", "求 $x$，要用哪一個式子？", "$x=12\\sin40^\\circ$",
      ["$x=12\\cos40^\\circ$", "$x=12\\tan40^\\circ$", "$x=\\dfrac{12}{\\sin40^\\circ}$"],
      "$12$ 是斜邊、$x$ 是 $40^\\circ$ 的對邊 → 對邊 ÷ 斜邊 ＝ $\\sin$"],
    ["qf-trig-sin", "圖中 $\\dfrac{x}{12}$ 是哪一個三角比？", "$\\sin40^\\circ$",
      ["$\\cos40^\\circ$", "$\\tan40^\\circ$", "$\\sin50^\\circ$"],
      "$x$ 是 $40^\\circ$ 的對邊、$12$ 是斜邊；它也等於 $\\cos50^\\circ$（$\\angle B=50^\\circ$），但不是 $\\sin50^\\circ$"],
    ["qf-trig-cos", "求 $x$，要用哪一個式子？", "$x=20\\cos35^\\circ$",
      ["$x=20\\sin35^\\circ$", "$x=20\\tan35^\\circ$", "$x=\\dfrac{20}{\\cos35^\\circ}$"],
      "$20$ 是斜邊、$x$ 是 $35^\\circ$ 的鄰邊 → 鄰邊 ÷ 斜邊 ＝ $\\cos$"],
    ["qf-trig-cos", "改站在 $\\angle B$ 看，求 $x$ 要用哪一個式子？", "$x=20\\sin55^\\circ$",
      ["$x=20\\cos55^\\circ$", "$x=20\\tan55^\\circ$", "$x=20\\sin35^\\circ$"],
      "$\\angle B=90^\\circ-35^\\circ=55^\\circ$，$x$ 是 $\\angle B$ 的對邊 → $20\\sin55^\\circ$，和 $20\\cos35^\\circ$ 相等（互餘）"],
    ["qf-trig-tan", "求 $x$，要用哪一個式子？", "$x=15\\tan28^\\circ$",
      ["$x=15\\sin28^\\circ$", "$x=15\\cos28^\\circ$", "$x=\\dfrac{15}{\\tan28^\\circ}$"],
      "$15$ 是鄰邊、$x$ 是對邊，沒有斜邊 → 對邊 ÷ 鄰邊 ＝ $\\tan$"],
    ["qf-trig-30", "$x=$？", "$4$",
      ["$4\\sqrt{3}$", "$8\\sqrt{3}$", "$16$"],
      "$x$ 是 $30^\\circ$ 的對邊：$8\\sin30^\\circ=8\\times\\dfrac{1}{2}=4$（短股是斜邊的一半）"],
    ["qf-trig-area", "要求 $\\triangle ABC$ 的面積，第一個動作是？", "列 $\\dfrac{1}{2}\\times8\\times10\\times\\sin30^\\circ$",
      ["列 $\\dfrac{1}{2}\\times8\\times10$", "列 $8\\times10\\times\\sin30^\\circ$", "列 $\\dfrac{1}{2}\\times8\\times10\\times\\cos30^\\circ$"],
      "兩邊夾一個角 → $\\dfrac{1}{2}ab\\sin C=\\dfrac{1}{2}\\times8\\times10\\times\\dfrac{1}{2}=20$；$8$ 不是高，不能直接當底×高"],
    /* 仰角／俯角 */
    ["qf-trig-elev", "求樓高 $h$，要用哪一個式子？", "$h=40\\tan35^\\circ$",
      ["$h=40\\sin35^\\circ$", "$h=40\\cos35^\\circ$", "$h=\\dfrac{40}{\\tan35^\\circ}$"],
      "仰角 $35^\\circ$ 的對邊是樓高、鄰邊是水平距離 $40$ → 用 $\\tan$"],
    ["qf-trig-depress", "從塔頂 $B$ 看船 $A$ 的俯角是 $30^\\circ$，$x=$？", "$60\\sqrt{3}$",
      ["$20\\sqrt{3}$", "$30$", "$120$"],
      "俯角＝船看塔頂的仰角 $\\angle A=30^\\circ$（內錯角）；$\\tan30^\\circ=\\dfrac{60}{x}$ → $x=60\\sqrt{3}$"],
    ["qf-trig-eye", "求樹高 $\\overline{BD}$，要用哪一個式子？", "$1.5+20\\tan37^\\circ$",
      ["$20\\tan37^\\circ$", "$1.5+20\\sin37^\\circ$", "$20\\tan37^\\circ-1.5$"],
      "$20\\tan37^\\circ$ 只算到眼睛那條水平線以上的 $\\overline{BC}$，還要加上眼高 $\\overline{CD}=1.5$"],
    ["qf-trig-two", "塔高 $h=$？", "$10\\sqrt{3}$",
      ["$20\\sqrt{3}$", "$10$", "$20$"],
      "$\\angle PBQ=60^\\circ-30^\\circ=30^\\circ=\\angle P$ → $\\overline{QB}=\\overline{PQ}=20$；$h=20\\sin60^\\circ=10\\sqrt{3}$"]
  ].map(function (r) {
    var q = fig(r[0], r[1]);
    return q ? [T, G, q, r[2], r[3], r[4]] : null;
  }).filter(Boolean);

  return {
    rows: {
      formula: [
        [T, G, "$\\dfrac{\\text{對邊}}{\\text{斜邊}}$ 是銳角 $\\theta$ 的哪一個三角比？", "$\\sin\\theta$",
          ["$\\cos\\theta$", "$\\tan\\theta$", "$\\sin(90^\\circ-\\theta)$"],
          "正弦 $\\sin$＝對邊比斜邊；$\\sin(90^\\circ-\\theta)$ 其實是 $\\cos\\theta$"],
        [T, G, "$\\dfrac{\\text{鄰邊}}{\\text{斜邊}}$ 是銳角 $\\theta$ 的哪一個三角比？", "$\\cos\\theta$",
          ["$\\sin\\theta$", "$\\tan\\theta$", "$\\cos(90^\\circ-\\theta)$"],
          "餘弦 $\\cos$＝鄰邊比斜邊；$\\cos(90^\\circ-\\theta)$ 其實是 $\\sin\\theta$"],
        [T, G, "$\\dfrac{\\text{對邊}}{\\text{鄰邊}}$ 是銳角 $\\theta$ 的哪一個三角比？", "$\\tan\\theta$",
          ["$\\sin\\theta$", "$\\cos\\theta$", "$\\dfrac{\\cos\\theta}{\\sin\\theta}$"],
          "正切 $\\tan$＝對邊比鄰邊，也等於 $\\dfrac{\\sin\\theta}{\\cos\\theta}$（不是倒過來）"],
        [T, G, "$\\dfrac{1}{2}ab\\sin C$ 算的是什麼？", "$a$、$b$ 夾 $\\angle C$ 的三角形面積",
          ["$a$、$b$ 夾 $\\angle C$ 的第三邊的長", "以 $a$、$b$ 為兩股的斜邊長", "直角三角形中 $\\angle C$ 的對邊長"],
          "$b\\sin C$ 是 $a$ 邊上的高，所以 $\\dfrac{1}{2}\\times a\\times b\\sin C$ 是「底 × 高 ÷ 2」"],
        [T, G, "$\\dfrac{\\sin\\theta}{\\cos\\theta}=$？", "$\\tan\\theta$",
          ["$1$", "$\\theta$", "$\\sin\\theta\\cos\\theta$"],
          "$\\dfrac{a}{c}\\div\\dfrac{b}{c}=\\dfrac{a}{b}$：斜邊約掉，剩下對邊比鄰邊"],
        [T, G, "$\\sin(90^\\circ-\\theta)=$？", "$\\cos\\theta$",
          ["$\\sin\\theta$", "$\\tan\\theta$", "$90^\\circ-\\sin\\theta$"],
          "直角三角形的兩個銳角互餘：一個角的對邊就是另一個角的鄰邊"],
        [T, G, "$\\cos(90^\\circ-\\theta)=$？", "$\\sin\\theta$",
          ["$\\cos\\theta$", "$\\tan\\theta$", "$90^\\circ-\\cos\\theta$"],
          "例：$\\cos60^\\circ=\\sin30^\\circ=\\dfrac{1}{2}$"],
        [T, G, "$30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形中，$\\sin30^\\circ$ 是哪兩邊的比？", "短股：斜邊",
          ["短股：長股", "長股：斜邊", "斜邊：短股"],
          "$30^\\circ$ 的對邊是最短的那一股，所以 $\\sin30^\\circ=\\dfrac{1}{2}$；短股比長股是 $\\tan30^\\circ$"]
      ],
      keyword: [
        [T, G, "已知一個銳角和斜邊，要求這個角的「對邊」", "用 $\\sin$：對邊＝斜邊 × $\\sin\\theta$",
          ["用 $\\cos$：對邊＝斜邊 × $\\cos\\theta$", "用 $\\tan$：對邊＝斜邊 × $\\tan\\theta$", "用 $\\sin$：對邊＝斜邊 ÷ $\\sin\\theta$"],
          "$\\sin\\theta=\\dfrac{\\text{對邊}}{\\text{斜邊}}$，兩邊同乘斜邊"],
        [T, G, "已知一個銳角和斜邊，要求這個角的「鄰邊」", "用 $\\cos$：鄰邊＝斜邊 × $\\cos\\theta$",
          ["用 $\\sin$：鄰邊＝斜邊 × $\\sin\\theta$", "用 $\\tan$：鄰邊＝斜邊 × $\\tan\\theta$", "用 $\\cos$：鄰邊＝斜邊 ÷ $\\cos\\theta$"],
          "$\\cos\\theta=\\dfrac{\\text{鄰邊}}{\\text{斜邊}}$，兩邊同乘斜邊"],
        [T, G, "已知一個銳角和它的「鄰邊」，要求「對邊」", "用 $\\tan$：對邊＝鄰邊 × $\\tan\\theta$",
          ["用 $\\sin$：對邊＝鄰邊 × $\\sin\\theta$", "用 $\\cos$：對邊＝鄰邊 × $\\cos\\theta$", "用 $\\tan$：對邊＝鄰邊 ÷ $\\tan\\theta$"],
          "沒有斜邊的事 → 對邊與鄰邊 → $\\tan\\theta=\\dfrac{\\text{對邊}}{\\text{鄰邊}}$"],
        [T, G, "題目給兩邊長和它們的夾角，要求三角形面積", "$\\dfrac{1}{2}ab\\sin C$",
          ["$\\dfrac{1}{2}ab$", "$ab\\sin C$", "$\\dfrac{1}{2}ab\\cos C$"],
          "$b\\sin C$ 是高；只有夾角是直角時才是 $\\dfrac{1}{2}ab$"],
        [T, G, "一大一小兩個直角三角形，各有一個 $35^\\circ$ 的角，比較它們的 $\\sin35^\\circ$", "一樣大，因為兩者相似",
          ["大的三角形比值比較大", "要先知道斜邊長才能比", "小的三角形比值比較大"],
          "AA 相似 → 對應邊成比例 → 邊長比值相同：三角比只由角度決定"],
        [T, G, "看到「$\\sin A=\\cos B$」（$A$、$B$ 都是銳角）", "$A+B=90^\\circ$",
          ["$A=B$", "$A+B=180^\\circ$", "$A-B=90^\\circ$"],
          "$\\sin A=\\cos(90^\\circ-A)$，所以 $B=90^\\circ-A$；只有 $45^\\circ$ 時才剛好 $A=B$"],
        [T, G, "直角三角形只給兩邊長，要求某個銳角的 $\\tan$", "對邊 ÷ 鄰邊，缺的邊先用畢氏定理",
          ["對邊 ÷ 斜邊，缺的邊先用畢氏定理", "鄰邊 ÷ 對邊，缺的邊先用畢氏定理", "斜邊 ÷ 鄰邊，缺的邊先用畢氏定理"],
          "$\\tan$ 只要兩股；若給的是斜邊和一股，先用畢氏定理把另一股算出來"],
        /* 仰角／俯角 */
        [T, G, "「仰角」是哪兩條線的夾角？", "視線與水平線（目標在上方）",
          ["視線與鉛垂線（目標在上方）", "視線與水平線（目標在下方）", "視線與地面上的斜坡（向上）"],
          "仰角、俯角都從水平線量起；往上看是仰角、往下看是俯角"],
        [T, G, "「俯角」是哪兩條線的夾角？", "視線與水平線（目標在下方）",
          ["視線與鉛垂線（目標在下方）", "視線與水平線（目標在上方）", "視線與建築物的牆面"],
          "從高處往下看，視線與「水平線」的夾角；不是與牆面（鉛垂線）的夾角"],
        [T, G, "為什麼 $B$ 看 $A$ 的俯角等於 $A$ 看 $B$ 的仰角？", "兩條水平線平行，內錯角相等",
          ["兩條鉛垂線平行，同位角相等", "三角形三個內角和是 $180^\\circ$", "兩條視線交叉，對頂角相等"],
          "過 $A$、$B$ 的兩條水平線互相平行，視線是截線，俯角與仰角是一組內錯角"],
        [T, G, "人站在地上用眼睛測樹頂的仰角，題目給了眼睛離地的高度", "算出的高度還要加上眼高",
          ["算出的高度要減掉眼高", "眼高不影響結果，不用管", "把眼高加到水平距離上"],
          "眼睛那條水平線以上用 $d\\tan\\theta$，以下那段就是眼高"],
        [T, G, "地面上兩點測同一個塔頂的仰角（例：$30^\\circ$ 與 $60^\\circ$），兩點相距 $d$", "設塔高 $h$，兩段水平距離都用 $h$ 表示再相減",
          ["把兩個仰角相加，當成一個仰角來算", "設塔高 $h$，兩段水平距離都用 $h$ 表示再相加", "直接用 $d\\tan60^\\circ$ 當成塔高"],
          "遠點到塔底 $=\\dfrac{h}{\\tan30^\\circ}$、近點到塔底 $=\\dfrac{h}{\\tan60^\\circ}$，兩者的差就是 $d$"]
      ],
      geo: [
        [T, G, "直角三角形三邊長為 $3$、$4$、$5$，最小角的 $\\sin$ 值 = ？", "$\\dfrac{3}{5}$",
          ["$\\dfrac{4}{5}$", "$\\dfrac{3}{4}$", "$\\dfrac{4}{3}$"],
          "最小角對最短邊 $3$：$\\sin=\\dfrac{3}{5}$"],
        [T, G, "$\\sin30^\\circ+\\cos60^\\circ=$？", "$1$",
          ["$\\dfrac{1}{2}$", "$\\sqrt{3}$", "$\\dfrac{\\sqrt{3}}{2}$"],
          "$\\dfrac{1}{2}+\\dfrac{1}{2}=1$"],
        [T, G, "$\\sin60^\\circ\\times\\cos30^\\circ=$？", "$\\dfrac{3}{4}$",
          ["$\\dfrac{\\sqrt{3}}{4}$", "$\\dfrac{3}{2}$", "$\\dfrac{1}{4}$"],
          "$\\dfrac{\\sqrt{3}}{2}\\times\\dfrac{\\sqrt{3}}{2}=\\dfrac{3}{4}$"],
        [T, G, "$\\tan30^\\circ\\times\\tan60^\\circ=$？", "$1$",
          ["$\\sqrt{3}$", "$3$", "$\\dfrac{1}{3}$"],
          "$\\dfrac{\\sqrt{3}}{3}\\times\\sqrt{3}=\\dfrac{3}{3}=1$"],
        [T, G, "$\\dfrac{\\sin45^\\circ}{\\cos45^\\circ}=$？", "$1$",
          ["$\\sqrt{2}$", "$\\dfrac{\\sqrt{2}}{2}$", "$\\dfrac{1}{2}$"],
          "$\\dfrac{\\sin45^\\circ}{\\cos45^\\circ}=\\tan45^\\circ=1$（兩股相等）"],
        [T, G, "銳角 $A$ 滿足 $\\sin A=\\dfrac{\\sqrt{3}}{2}$，$\\angle A=$？", "$60^\\circ$",
          ["$30^\\circ$", "$45^\\circ$", "$15^\\circ$"],
          "$1:\\sqrt{3}:2$ 中，$\\sqrt{3}$ 對 $60^\\circ$：$\\sin60^\\circ=\\dfrac{\\sqrt{3}}{2}$"],
        [T, G, "銳角 $A$ 滿足 $\\tan A=1$，$\\angle A=$？", "$45^\\circ$",
          ["$30^\\circ$", "$60^\\circ$", "$15^\\circ$"],
          "$\\tan A=1$ 表示對邊＝鄰邊，是等腰直角三角形"],
        [T, G, "銳角 $A$ 滿足 $\\cos A=\\dfrac{1}{2}$，$\\angle A=$？", "$60^\\circ$",
          ["$30^\\circ$", "$45^\\circ$", "$15^\\circ$"],
          "鄰邊是斜邊的一半：$1:\\sqrt{3}:2$ 中 $60^\\circ$ 的鄰邊是 $1$"],
        [T, G, RT + "$\\sin A=\\dfrac{3}{5}$，$\\cos B=$？", "$\\dfrac{3}{5}$",
          ["$\\dfrac{4}{5}$", "$\\dfrac{3}{4}$", "$\\dfrac{5}{3}$"],
          "$\\angle A$ 的對邊 $\\overline{BC}$ 就是 $\\angle B$ 的鄰邊：$\\cos B=\\sin A$（互餘）"],
        [T, G, "銳角 $A$ 的 $\\sin A=\\dfrac{4}{5}$，$\\cos A=$？", "$\\dfrac{3}{5}$",
          ["$\\dfrac{1}{5}$", "$\\dfrac{5}{4}$", "$\\dfrac{4}{3}$"],
          "畫直角三角形：對邊 $4$、斜邊 $5$，畢氏定理得鄰邊 $3$ → $\\cos A=\\dfrac{3}{5}$"],
        [T, G, "$\\sin\\theta=0.6$、$\\cos\\theta=0.8$，$\\tan\\theta=$？", "$0.75$",
          ["$\\dfrac{4}{3}$", "$0.48$", "$1.4$"],
          "$\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}=\\dfrac{0.6}{0.8}=0.75$"],
        [T, G, "平行四邊形兩鄰邊 $4$、$6$，夾角 $30^\\circ$，面積 = ？", "$12$",
          ["$6$", "$24$", "$12\\sqrt{3}$"],
          "兩個全等三角形：$2\\times\\dfrac{1}{2}\\times4\\times6\\times\\sin30^\\circ=12$"],
        [T, G, "邊長 $6$ 的正三角形，用 $\\dfrac{1}{2}ab\\sin C$ 求面積 = ？", "$9\\sqrt{3}$",
          ["$18$", "$18\\sqrt{3}$", "$9$"],
          "$\\dfrac{1}{2}\\times6\\times6\\times\\sin60^\\circ=18\\times\\dfrac{\\sqrt{3}}{2}=9\\sqrt{3}$"],
        [T, G, RT + "斜邊 $\\overline{AB}=20$、$\\angle A=50^\\circ$，已知 $\\cos50^\\circ\\approx0.64$，$\\overline{AC}\\approx$？", "$12.8$",
          ["$31.25$", "$6.4$", "$15.3$"],
          "$\\overline{AC}$ 是 $\\angle A$ 的鄰邊：$20\\times0.64=12.8$"],
        [T, G, RT + "$\\overline{AC}=\\overline{BC}$，$\\tan A=$？", "$1$",
          ["$\\sqrt{2}$", "$\\dfrac{\\sqrt{2}}{2}$", "$\\dfrac{1}{2}$"],
          "兩股相等 → $\\angle A=45^\\circ$，$\\tan A=\\dfrac{\\overline{BC}}{\\overline{AC}}=1$"],
        /* 仰角／俯角 */
        [T, G, "從樓頂看地面上一輛車的俯角是 $35^\\circ$，從車看樓頂的仰角是？", "$35^\\circ$",
          ["$55^\\circ$", "$65^\\circ$", "$45^\\circ$"],
          "水平線平行 → 俯角與仰角是內錯角，相等；$55^\\circ$ 是視線與牆面的夾角"],
        [T, G, "風箏線長 $50$ 公尺、與水平地面夾 $37^\\circ$（$\\sin37^\\circ\\approx0.6$、$\\cos37^\\circ\\approx0.8$），不計手的高度，風箏離地約多高？", "$30$",
          ["$40$", "$37.5$", "$25$"],
          "線長是斜邊、高度是 $37^\\circ$ 的對邊 → $50\\sin37^\\circ\\approx50\\times0.6=30$"],
        [T, G, "眼睛離地 $1.6$ 公尺，離樓 $30$ 公尺處看樓頂的仰角為 $45^\\circ$，樓高 = ？", "$31.6$",
          ["$30$", "$28.4$", "$31.6\\sqrt{2}$"],
          "$30\\tan45^\\circ=30$ 是眼睛水平線以上的部分，再加眼高 $1.6$"]
      ],
      figure: FIGURE
    },
    gens: {
      geo: [
        { f: gSideRatio, w: 3 }, { f: gSpecialSide, w: 2 }, { f: gCofunction, w: 2 },
        { f: gTanFromSC, w: 1 }, { f: gArea, w: 3 }, { f: gAreaInv, w: 1 }, { f: gApprox, w: 2 },
        { f: gElevSpecial, w: 2 }, { f: gElevApprox, w: 1 }, { f: gElevTwo, w: 1 }
      ],
      calc: [
        { f: gSpecialVal, w: 2 }
      ]
    }
  };
});
