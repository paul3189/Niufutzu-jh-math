/* 直覺道場外掛題組：坐標與函數＋統計與機率（2026-10-13，取材自國中題庫段考／會考／基測題，改寫成反射題） */
(window.REFLEX_PLUS = window.REFLEX_PLUS || []).push(function (H) {
  "use strict";
  var ri = H.ri, pick = H.pick, mk = H.mk, frac = H.frac;

  /* 係數排版：term(3,"x",true) → "3x"、term(-1,"y") → "-y"、term(1,"y") → "+y"，係數 0 不寫 */
  function term(c, v, first) {
    if (c === 0) return "";
    var s = c < 0 ? "-" : (first ? "" : "+");
    var m = Math.abs(c);
    return s + (m === 1 ? "" : m) + v;
  }
  function lin(a, b, c) { return term(a, "x", true) + term(b, "y", false) + "=" + c; }
  function yaxb(a, b) { return "y=" + term(a, "x", true) + (b > 0 ? "+" + b : b < 0 ? String(b) : ""); }
  function pt(x, y) { return "$(" + x + "," + y + ")$"; }
  function nz(n, lo) { var v; do { v = ri(2 * n + 1) - n; } while (v === 0 || Math.abs(v) < (lo || 1)); return v; }
  var QN = ["第一象限", "第二象限", "第三象限", "第四象限"];
  function quadOf(sx, sy) { return sx > 0 ? (sy > 0 ? 0 : 3) : (sy > 0 ? 1 : 2); }
  var FPOOL = ["$\\dfrac{1}{2}$", "$\\dfrac{1}{3}$", "$\\dfrac{2}{3}$", "$\\dfrac{1}{4}$",
    "$\\dfrac{3}{4}$", "$\\dfrac{1}{6}$", "$\\dfrac{5}{6}$", "$\\dfrac{1}{5}$", "$\\dfrac{2}{5}$"];
  /* 二次函數 a 的排版 */
  function aTex(a) {
    return a === 0.5 ? "\\dfrac{1}{2}" : a === -0.5 ? "-\\dfrac{1}{2}" : a === 1 ? "" : a === -1 ? "-" : String(a);
  }
  function vform(a, h, k) {
    return "y=" + aTex(a) + "(x" + (h < 0 ? "+" + (-h) : "-" + h) + ")^2" + (k < 0 ? String(k) : k > 0 ? "+" + k : "");
  }

  /* ══════════ 坐標平面 ══════════ */

  /* RCT-365／RCT-407 類：P(a,b) 在某象限，變號或交換後的點在哪一象限 */
  function gQuadSign() {
    var q = ri(4), sa = (q === 0 || q === 3) ? 1 : -1, sb = q < 2 ? 1 : -1;
    var T = [
      ["(-a,b)", function () { return [-sa, sb]; }],
      ["(a,-b)", function () { return [sa, -sb]; }],
      ["(-a,-b)", function () { return [-sa, -sb]; }],
      ["(b,a)", function () { return [sb, sa]; }],
      ["(-b,a)", function () { return [-sb, sa]; }],
      ["(ab,\\ b)", function () { return [sa * sb, sb]; }],
      ["(a^2,\\ b)", function () { return [1, sb]; }],
      ["(a,\\ -b^2)", function () { return [sa, -1]; }]
    ];
    var t = pick(T), s = t[1](), ans = QN[quadOf(s[0], s[1])];
    var sg = function (v) { return v > 0 ? "正" : "負"; };
    return mk("graph", "function.coord", 7,
      "點 $P(a,b)$ 在" + QN[q] + "，點 $" + t[0] + "$ 在哪裡？", ans,
      QN.filter(function (n) { return n !== ans; }),
      QN[q] + "：$a$ 為" + sg(sa) + "、$b$ 為" + sg(sb) + " → 新點的 x 坐標" + sg(s[0]) + "、y 坐標" + sg(s[1]) +
      " → " + ans + "。只看正負號，不必管數字");
  }

  /* RCT-106／RCT-324 類：平移與反推 */
  function gMovePt() {
    var x = ri(13) - 6, y = ri(13) - 6, dx, dy;
    do { dx = nz(6); dy = nz(6); } while (Math.abs(dx) === Math.abs(dy));
    var h = (dx > 0 ? "向右" : "向左") + "移 " + Math.abs(dx) + " 單位",
        v = (dy > 0 ? "向上" : "向下") + "移 " + Math.abs(dy) + " 單位";
    if (ri(2)) {
      return mk("graph", "function.coord", 7,
        "點 " + pt(x, y) + " 先" + h + "、再" + v + "，到達哪一點？",
        pt(x + dx, y + dy), [pt(x - dx, y + dy), pt(x + dx, y - dy), pt(x + dy, y + dx), pt(x - dx, y - dy)],
        "左右動 x、上下動 y：右加左減、上加下減");
    }
    return mk("graph", "function.coord", 7,
      "某點先" + h + "、再" + v + "，到達 " + pt(x, y) + "。原來的點是？",
      pt(x - dx, y - dy), [pt(x + dx, y + dy), pt(x - dx, y + dy), pt(x + dx, y - dy)],
      "反推要<b>倒著走</b>：x " + (dx > 0 ? "減 " : "加 ") + Math.abs(dx) + "、y " + (dy > 0 ? "減 " : "加 ") + Math.abs(dy));
  }

  /* RCT-618／RCT-362 類：點到兩軸的距離 */
  function gAxisDist() {
    var x, y;
    do { x = nz(9); y = nz(9); } while (Math.abs(x) === Math.abs(y));
    var toX = ri(2);
    var ans = Math.abs(toX ? y : x), other = Math.abs(toX ? x : y);
    return mk("graph", "function.coord", 7,
      "點 " + pt(x, y) + " 到 " + (toX ? "$x$" : "$y$") + " 軸的距離 = ?", String(ans),
      [String(other), String(-ans), String(ans + other)],
      "到 x 軸的距離看 <b>y 坐標</b>、到 y 軸的距離看 <b>x 坐標</b>，再取絕對值（距離不會是負的）");
  }

  /* ══════════ 一次函數與直線圖形 ══════════ */

  /* RCT-096／RCT-311 類：過一點的水平線、鉛垂線 */
  function gHVLine() {
    var p, q;
    do { p = nz(8); q = nz(8); } while (p === q);
    var horiz = ri(2);
    var say = horiz ? pick(["與 $x$ 軸平行", "與 $y$ 軸垂直"]) : pick(["與 $y$ 軸平行", "與 $x$ 軸垂直"]);
    var ans = horiz ? "$y=" + q + "$" : "$x=" + p + "$";
    return mk("graph", "function.linear", 7,
      "通過 " + pt(p, q) + " 且" + say + "的直線方程式？", ans,
      ["$y=" + q + "$", "$x=" + p + "$", "$y=" + p + "$", "$x=" + q + "$"].filter(function (s) { return s !== ans; }),
      horiz ? "水平線上每一點的 y 坐標都一樣 → $y=" + q + "$" : "鉛垂線上每一點的 x 坐標都一樣 → $x=" + p + "$");
  }

  /* RCT-130／RCT-371 類：點在直線上，反求係數 */
  function gPointOnLine() {
    var a, B, p, q, C, w1;
    do {
      a = nz(5); B = nz(5); p = nz(5); q = nz(5);
    } while (Math.abs(p) === Math.abs(q));
    C = a * p + B * q;
    var ws = [-a];
    w1 = (C - B * p) / q;              /* 把 x、y 代反 */
    if (Number.isInteger(w1)) ws.push(w1);
    var w2 = (C + B * q) / p;          /* 移項忘了變號 */
    if (Number.isInteger(w2)) ws.push(w2);
    return mk("graph", "function.linear", 7,
      "點 " + pt(p, q) + " 在直線 $ax" + term(B, "y", false) + "=" + C + "$ 上，$a=$？", String(a),
      ws.map(String),
      "點在線上 → 代 $x=" + p + "$、$y=" + q + "$：$" + term(p, "a", true) + (B * q < 0 ? "" : "+") + (B * q) + "=" + C + "$，$a=" + a + "$");
  }

  /* RCT-248／RCT-310 類：與兩軸的交點 */
  function gIntercept() {
    var x0, y0;
    do { x0 = nz(6); y0 = nz(6); } while (x0 === y0);
    var g = H.gcd(x0, y0) * (y0 < 0 ? -1 : 1);
    var a = y0 / g, b = x0 / g, c = x0 * y0 / g;
    var eq = "$" + lin(a, b, c) + "$";
    var all = [pt(x0, 0), pt(0, x0), pt(y0, 0), pt(0, y0)];
    if (ri(2)) {
      return mk("graph", "function.linear", 7, "直線 " + eq + " 與 $x$ 軸的交點？", all[0], all.slice(1),
        "與 x 軸相交 → 令 $y=0$ → $x=" + x0 + "$，交點寫成 $(" + x0 + ",0)$");
    }
    return mk("graph", "function.linear", 7, "直線 " + eq + " 與 $y$ 軸的交點？", all[3], all.slice(0, 3),
      "與 y 軸相交 → 令 $x=0$ → $y=" + y0 + "$，交點寫成 $(0," + y0 + ")$");
  }

  /* RCT-266／RCT-413 類：y=ax+b 不經過哪一象限 */
  function gLineQuadrant() {
    var a = nz(4), b = nz(7);
    var miss = a > 0 ? (b > 0 ? 3 : 1) : (b > 0 ? 2 : 0);
    var ans = QN[miss];
    return mk("graph", "function.linear", 8,
      "$" + yaxb(a, b) + "$ 的圖形<b>不經過</b>哪一個象限？", ans,
      QN.filter(function (n) { return n !== ans; }),
      "$a" + (a > 0 ? ">0$ 往右上" : "<0$ 往右下") + "、與 y 軸交在 $(0," + b + ")$（" + (b > 0 ? "上方" : "下方") +
      "）→ 畫個草圖就知道缺" + ans);
  }

  /* LFN-012 類：一次函數的函數值 */
  function gFnValue() {
    var a = nz(5), b = nz(9), n = nz(6, 2);
    var v = a * n + b;
    return mk("graph", "function.linear", 8,
      "一次函數 $" + yaxb(a, b) + "$，當 $x=" + n + "$ 時的函數值 = ?", String(v),
      [String(a * n - b), String(-a * n + b), String(a * (-n) - b)],
      "函數值就是把 $x=" + n + "$ 代進去算出的 $y$：$" + a + "\\times" + H.sgn(n) + (b > 0 ? "+" : "") + b + "=" + v + "$");
  }

  /* ══════════ 二次函數 ══════════ */

  /* QF2-093 類：已配方好的式子求最大值／最小值 */
  function gQuadExt() {
    var a = pick([1, 2, 3, -1, -2, -3, 0.5, -0.5]), h, k;
    do { h = nz(6); k = nz(9); } while (h === k);
    var up = a > 0;
    var T = up ? "最小值" : "最大值", F = up ? "最大值" : "最小值";
    return mk("graph", "function.quadfn", 9,
      "$" + vform(a, h, k) + "$ 有最大值還是最小值？是多少？",
      T + " $" + k + "$", [F + " $" + k + "$", T + " $" + h + "$", F + " $" + h + "$"],
      "$a" + (up ? ">0$ 開口向上 → 有最小值" : "<0$ 開口向下 → 有最大值") + "；最值是頂點的 <b>y 坐標</b> $k=" + k + "$（在 $x=" + h + "$ 時發生）");
  }

  /* QF2-056／QF2-101 類：同高的兩點 → 對稱軸在正中間 */
  function gSymAxis() {
    var p, q, t = ri(19) - 9;
    do { p = ri(17) - 8; q = p + 2 * (1 + ri(6)); } while (p === 0 || p + q === 0 || q === -3 * p);
    var m = (p + q) / 2;
    return mk("graph", "function.quadfn", 9,
      "某二次函數的圖形通過 " + pt(p, t) + " 與 " + pt(q, t) + "，對稱軸是？",
      "$x=" + m + "$", ["$x=" + ((q - p) / 2) + "$", "$x=" + (p + q) + "$", "$y=" + t + "$"],
      "y 坐標相同的兩點對稱於對稱軸 → 對稱軸在兩個 x 的<b>正中間</b>：$\\dfrac{" + p + (q < 0 ? "" : "+") + q + "}{2}=" + m + "$");
  }

  /* QF2-097／QF2-008 類：平移 */
  function gShift() {
    var a = pick([1, 2, 3, -1, -2, -3, 0.5, -0.5]), dx, dy;
    do { dx = nz(5); dy = nz(6); } while (Math.abs(dx) === Math.abs(dy));
    var hs = (dx > 0 ? "向右" : "向左") + "平移 " + Math.abs(dx) + " 單位、" + (dy > 0 ? "向上" : "向下") + "平移 " + Math.abs(dy) + " 單位";
    if (ri(2)) {
      return mk("graph", "function.quadfn", 9,
        "$y=" + aTex(a) + "x^2$ 的圖形" + hs + "，得到哪一個式子？",
        "$" + vform(a, dx, dy) + "$",
        ["$" + vform(a, -dx, dy) + "$", "$" + vform(a, dx, -dy) + "$", "$" + vform(a, dy, dx) + "$"],
        "右移 h → 括號裡寫 $(x-h)$（號相反）；上移 k → 最後面 $+k$");
    }
    var h, k;
    do { h = nz(5); k = nz(6); } while (h + dx === 0 && k + dy === 0);
    return mk("graph", "function.quadfn", 9,
      "$" + vform(a, h, k) + "$ 的圖形" + hs + "後，頂點是？",
      pt(h + dx, k + dy), [pt(h - dx, k + dy), pt(h + dx, k - dy), pt(-h + dx, k + dy), pt(h + dy, k + dx)],
      "先讀出原頂點 $(" + h + "," + k + ")$，再把頂點左右、上下搬 → $(" + (h + dx) + "," + (k + dy) + ")$");
  }

  /* ══════════ 統計圖表 ══════════ */

  /* STG-077／STG-358 類：圓形圖的圓心角 */
  function gPieAngle() {
    var p = pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 60, 65, 70, 75, 80]);
    var N = pick([40, 60, 80, 100, 120, 160, 200, 240, 300, 400, 500, 600].filter(function (n) { return n * p % 100 === 0; }));
    var k = N * p / 100, ang = 3.6 * p;
    if (ri(2)) {
      return H.mkDeg("calc", "stat.chart", 7,
        "全部 " + N + " 人中有 " + k + " 人選 A，畫成圓形圖時 A 的圓心角 = ?",
        ang, [p, 1.8 * p, 360 - ang],
        "$\\dfrac{" + k + "}{" + N + "}=" + p + "\\%$，圓心角 $=360^\\circ\\times" + p + "\\%=" + ang + "^\\circ$（是乘 360，不是 100）");
    }
    var ws = [2 * N, N - k];
    if (N % 2 === 0) ws.push(N / 2);
    return mk("calc", "stat.chart", 7,
      "圓形圖中 A 佔 " + k + " 人、圓心角 $" + ang + "^\\circ$，全部共有幾人？", String(N), ws.map(String),
      "$" + ang + "^\\circ\\div360^\\circ=" + p + "\\%$，所以 $" + k + "\\div" + p + "\\%=" + N + "$ 人");
  }

  /* STA-233／STA-139 類：相對次數 */
  function gRelFreq() {
    var p = pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 60, 75]);
    var N = pick([20, 40, 60, 80, 120, 200, 240, 300, 400].filter(function (n) { return n * p % 100 === 0; }));
    var k = N * p / 100;
    if (ri(2)) {
      return mk("calc", "stat.chart", 8,
        "全部 " + N + " 人，某一組有 " + k + " 人，這組的相對次數是多少 %？", String(p),
        [String(k), String(100 - p), String(N)],
        "相對次數 $=\\dfrac{\\text{該組次數}}{\\text{總次數}}=\\dfrac{" + k + "}{" + N + "}=" + p + "\\%$");
    }
    return mk("calc", "stat.chart", 8,
      "某一組有 " + k + " 人，相對次數是 $" + p + "\\%$，總共有幾人？", String(N),
      [String(N - k), String(2 * N), String(k * 100 % (100 - p) === 0 ? k * 100 / (100 - p) : N / 2)],
      "總次數 $=\\text{該組次數}\\div\\text{相對次數}=" + k + "\\div" + p + "\\%=" + N + "$");
  }

  /* STA-072 類：累積相對次數的兩個點 */
  function gCumRel() {
    var w = pick([5, 10]), x1 = w * (4 + ri(6)), x2 = x1 + w;
    var p1 = 5 * (2 + ri(9)), p2 = p1 + 5 * (1 + ri(6));
    if (p2 >= 100) p2 = 95;
    var head = "累積相對次數分配圖上有 $(" + x1 + "," + p1 + ")$、$(" + x2 + "," + p2 + ")$ 兩點，";
    var mode = ri(3);
    if (mode === 0) {
      return mk("calc", "stat.chart", 8, head + "「" + x1 + "～" + x2 + "」這一組佔幾 %？", String(p2 - p1),
        [String(p2), String(p1), String(100 - p2)],
        "累積相對次數相減：$" + p2 + "-" + p1 + "=" + (p2 - p1) + "$（%）");
    }
    if (mode === 1) {
      return mk("calc", "stat.chart", 8, head + "「" + x2 + " 以上」的佔幾 %？", String(100 - p2),
        [String(p2), String(100 - p1), String(p2 - p1)],
        "點 $(" + x2 + "," + p2 + ")$ 表示「不滿 " + x2 + "」佔 $" + p2 + "\\%$，其餘 $100-" + p2 + "=" + (100 - p2) + "$（%）");
    }
    var N = pick([20, 40, 60, 80, 100, 200]);
    return mk("calc", "stat.chart", 8, head + "全部 " + N + " 人中「不滿 " + x2 + "」的有幾人？", String(N * p2 / 100),
      [String(N * p1 / 100), String(N * (p2 - p1) / 100), String(p2)],
      "不滿 " + x2 + " 佔 $" + p2 + "\\%$ → $" + N + "\\times" + p2 + "\\%=" + (N * p2 / 100) + "$ 人");
  }

  /* 累積次數 ⇄ 次數 */
  function gCumFreq() {
    var n = 4 + ri(2), f = [], c = [], s = 0, i;
    for (i = 0; i < n; i++) { f.push(1 + ri(9)); s += f[i]; c.push(s); }
    var j = 1 + ri(n - 2);               /* 第 j+1 組，不是第一組也不是最後一組 */
    if (ri(2)) {
      return mk("calc", "stat.chart", 8,
        "各組次數由小到大依序為 $" + f.join(",\\ ") + "$，第 " + (j + 1) + " 組的累積次數 = ?", String(c[j]),
        [String(f[j]), String(c[j - 1]), String(s)],
        "累積次數＝從第 1 組一路加到這一組：$" + f.slice(0, j + 1).join("+") + "=" + c[j] + "$");
    }
    return mk("calc", "stat.chart", 8,
      "各組累積次數由小到大依序為 $" + c.join(",\\ ") + "$，第 " + (j + 1) + " 組的次數 = ?", String(f[j]),
      [String(c[j]), String(c[j + 1] - c[j]), String(c[j] + c[j - 1])],
      "次數＝這一組的累積次數 − 前一組的累積次數：$" + c[j] + "-" + c[j - 1] + "=" + f[j] + "$");
  }

  /* 組中點 */
  function gMidpoint() {
    var w = pick([4, 5, 6, 10, 20]), a = w * (2 + ri(12)), b = a + w;
    return mk("calc", "stat.chart", 7,
      "「" + a + "～" + b + "」這一組的組中點 = ?", String((a + b) / 2),
      [String(a), String(b), String(w)],
      "組中點 $=\\dfrac{\\text{上限}+\\text{下限}}{2}=\\dfrac{" + a + "+" + b + "}{2}=" + ((a + b) / 2) + "$");
  }

  /* ══════════ 代表值與離散 ══════════ */

  /* STG-377 類：看錯一筆資料 */
  function gMeanError() {
    var n = pick([4, 5, 8, 10, 20, 25]), M = 50 + ri(41), dd = n * (1 + ri(5));
    var Y = 20 + ri(50), X = Y + dd;
    return mk("calc", "stat.center", 7,
      n + " 筆資料求平均時，把其中一筆 " + X + " 看成 " + Y + "，算出平均 " + M + "。正確的平均數 = ?",
      String(M + dd / n), [String(M - dd / n), String(M + dd), String(M)],
      "總和少算了 $" + X + "-" + Y + "=" + dd + "$，平均就少了 $" + dd + "\\div" + n + "=" + (dd / n) + "$");
  }

  /* STG-012 類：換掉一個人 */
  function gMeanReplace() {
    var n = pick([4, 5, 6, 8, 10]), m = 150 + ri(31), d = n * nz(3);
    var x = 150 + ri(31), y = x + d;
    return mk("calc", "stat.center", 7,
      n + " 人平均身高 " + m + " 公分，其中一位 " + x + " 公分的換成 " + y + " 公分的，新的平均 = ?",
      String(m + d / n), [String(m - d / n), String(m + d), String(Math.round((m + y) / 2))],
      "總和變化 $" + y + "-" + x + "=" + d + "$，平均變化 $" + d + "\\div" + n + "=" + (d / n) + "$");
  }

  /* STG-400 類：最後一次要考幾分 */
  function gMeanNeed() {
    var k, a, b, need;
    do { k = 2 + ri(4); a = 50 + 5 * ri(7); b = a + 5 * (1 + ri(3)); need = (k + 1) * b - k * a; } while (need > 100);
    return mk("calc", "stat.center", 7,
      "前 " + k + " 次小考平均 " + a + " 分，想讓 " + (k + 1) + " 次的平均達到 " + b + " 分，第 " + (k + 1) + " 次至少要考？",
      String(need), [String(2 * b - a), String(b), String(b + (b - a) * (k - 1))],
      "目標總分 $" + (k + 1) + "\\times" + b + "=" + ((k + 1) * b) + "$，已有 $" + k + "\\times" + a + "=" + (k * a) + "$，差 " + need + " 分");
  }

  /* PMP-205／PMP-370 類：全距 */
  function gRange() {
    var n = 6 + ri(2), arr = [], i;
    for (i = 0; i < n; i++) arr.push(3 + ri(60));
    var mx = Math.max.apply(null, arr), mn = Math.min.apply(null, arr);
    if (mx - mn < 5) return gRange();
    return mk("calc", "stat.center", 9,
      "$" + arr.join(",\\ ") + "$ 的全距 = ?", String(mx - mn),
      [String(Math.abs(arr[n - 1] - arr[0])), String(mx), String(mx + mn)],
      "全距 = 最大值 − 最小值 $=" + mx + "-" + mn + "=" + (mx - mn) + "$（不是最後一個減第一個）");
  }

  /* PMP-084／PMP-501 類：排好序的資料求 Q1、Q3（工具地圖的規則：n×1/4 是整數取兩筆平均，不是整數無條件進位） */
  function gQuartile() {
    var n = 7 + ri(4), arr = [], v = 1 + ri(5), i;
    for (i = 0; i < n; i++) { v += 1 + ri(5); arr.push(v); }
    var q3 = ri(2), pos = n * (q3 ? 3 : 1) / 4, ans;
    if (Number.isInteger(pos)) ans = (arr[pos - 1] + arr[pos]) / 2;
    else ans = arr[Math.ceil(pos) - 1];
    var med = n % 2 ? arr[(n - 1) / 2] : (arr[n / 2 - 1] + arr[n / 2]) / 2;
    var p0 = Math.ceil(pos) - 1;
    return mk("calc", "stat.center", 9,
      "排好序的 " + n + " 筆資料 $" + arr.join(",\\ ") + "$，" + (q3 ? "$Q_3$" : "$Q_1$") + " = ?", String(ans),
      [String(med), String(arr[Math.max(0, p0 - 1)]), String(arr[Math.min(n - 1, p0 + 1)]), String(arr[p0])],
      "$" + n + "\\times\\dfrac{" + (q3 ? 3 : 1) + "}{4}=" + pos + "$，" +
      (Number.isInteger(pos) ? "是整數 → 取第 " + pos + "、" + (pos + 1) + " 筆的平均" : "不是整數 → 進位取第 " + Math.ceil(pos) + " 筆"));
  }

  /* PMP-074／PMP-359 類：四分位數的人數意義 */
  function gQ3Count() {
    var N = pick([200, 240, 280, 300, 320, 360, 400, 480, 500, 600, 800, 1000]), S = 60 + ri(36);
    var mode = ri(3);
    if (mode === 0) {
      return mk("calc", "stat.center", 9, N + " 人的成績 $Q_3=" + S + "$ 分，至少有幾人 ≥ " + S + " 分？",
        String(N / 4), [String(3 * N / 4), String(N / 2), String(N / 4 - 1)],
        "$Q_3$ 以上（含）至少有 $\\dfrac14$：$" + N + "\\times\\dfrac14=" + (N / 4) + "$");
    }
    if (mode === 1) {
      return mk("calc", "stat.center", 9, N + " 人的成績 $Q_1=" + S + "$ 分，至少有幾人 ≥ " + S + " 分？",
        String(3 * N / 4), [String(N / 4), String(N / 2), String(3 * N / 4 - 1)],
        "$Q_1$ 以上（含）至少有 $\\dfrac34$：$" + N + "\\times\\dfrac34=" + (3 * N / 4) + "$");
    }
    return mk("calc", "stat.center", 9, N + " 人的成績中位數為 " + S + " 分，至少有幾人 ≤ " + S + " 分？",
      String(N / 2), [String(N / 4), String(3 * N / 4), String(N / 2 - 1)],
      "中位數就是 $Q_2$：以下（含）至少有一半 $=" + (N / 2) + "$ 人");
  }

  /* ══════════ 機率 ══════════ */

  /* PMP-469／PMP-510 類：兩顆骰子的點數和 */
  function gDiceSum() {
    var s = 2 + ri(11), c = 6 - Math.abs(s - 7);
    return mk("calc", "stat.prob", 9,
      "同時擲兩顆公正骰子，點數和為 " + s + " 的機率 = ?", "$" + frac(c, 36) + "$",
      ["$" + frac(1, 11) + "$", "$" + frac(c, 12) + "$", "$" + frac(c + 1, 36) + "$", "$" + frac(c, 6) + "$"],
      "全部有 $6\\times6=36$ 種（不是「和」的 11 種，那 11 種不等機會）；和為 " + s + " 有 " + c + " 種", FPOOL);
  }

  /* PMP-543／PMP-554 類：抽籤抽到 k 的倍數 */
  function gMultiples() {
    var k = 2 + ri(6), N, m;
    do { N = 10 + ri(41); } while (N % k === 0 && ri(3));
    m = Math.floor(N / k);
    return mk("calc", "stat.prob", 9,
      "1～" + N + " 號的籤任抽一支，抽到 " + k + " 的倍數的機率 = ?", "$" + frac(m, N) + "$",
      ["$" + frac(1, k) + "$", "$" + frac(m + 1, N) + "$", "$" + frac(m, N - m) + "$"],
      "$" + N + "\\div" + k + "$ 取整數部分 → 有 " + m + " 個 " + k + " 的倍數，機率 $=\\dfrac{" + m + "}{" + N + "}" + (H.gcd(m, N) > 1 ? "=" + frac(m, N) : "") + "$" +
      (N % k ? "（$" + N + "$ 不是 " + k + " 的倍數，所以不是剛好 $\\dfrac{1}{" + k + "}$）" : ""), FPOOL);
  }

  /* PMP-195／PMP-360 類：三種顏色的球 */
  function gBalls3() {
    var cs = ["紅", "白", "黃", "藍"], a = 2 + ri(7), b = 2 + ri(7), c = 2 + ri(7);
    var names = H.shuffle(cs).slice(0, 3), T = a + b + c;
    return mk("calc", "stat.prob", 9,
      "袋中有" + names[0] + "球 " + a + " 顆、" + names[1] + "球 " + b + " 顆、" + names[2] + "球 " + c + " 顆，任取一顆是" + names[1] + "球的機率 = ?",
      "$" + frac(b, T) + "$", ["$" + frac(b, a + c) + "$", "$" + frac(1, 3) + "$", "$" + frac(a + c, T) + "$", "$" + frac(1, T) + "$"],
      "分母是<b>全部</b> $" + a + "+" + b + "+" + c + "=" + T + "$ 顆；三種顏色不等量，所以不是 $\\dfrac13$", FPOOL);
  }

  /* 餘事件 */
  function gComplement() {
    var q = pick([5, 6, 7, 8, 9, 10, 11, 12]), p;
    do { p = 1 + ri(q - 1); } while (H.gcd(p, q) !== 1);
    return mk("calc", "stat.prob", 9,
      "事件 A 發生的機率是 $" + frac(p, q) + "$，A <b>不</b>發生的機率 = ?", "$" + frac(q - p, q) + "$",
      ["$" + frac(q, p) + "$", "$-" + frac(p, q) + "$", "$" + frac(p, q) + "$"],
      "發生＋不發生 = 1 → $1-" + frac(p, q) + "=" + frac(q - p, q) + "$", FPOOL);
  }

  return {
    rows: {
      keyword: [
        /* ── 坐標平面 ── */
        /* RCT-235 */ ["function.coord", 7, "點 $(2m+1,\\ 6m-5)$ 在 $y$ 軸上，第一個動作？",
          "令 x 坐標 $2m+1=0$", ["令 y 坐標 $6m-5=0$", "令兩個坐標相等", "令兩個坐標相加為 0"],
          "在 y 軸上 → x 坐標是 0；在 x 軸上 → y 坐標是 0"],
        /* RCT-364 */ ["function.coord", 7, "已知 $ab=0$，點 $(a,b)$ 在哪裡？",
          "坐標軸上", ["一定是原點", "第一或第三象限", "第二或第四象限"],
          "$ab=0$ → $a=0$ 或 $b=0$ → 在 y 軸或 x 軸上（兩個都是 0 才是原點）"],
        /* RCT-139 */ ["function.coord", 7, "已知 $ab>0$，點 $(a,b)$ 在哪裡？",
          "第一或第三象限", ["第二或第四象限", "只會在第一象限", "坐標軸上"],
          "$ab>0$ → 同號：$(+,+)$ 或 $(-,-)$"],
        /* RCT-324 */ ["function.coord", 7, "「從 E 點先向右 6、再向下 3 到達 F」，已知 F 求 E",
          "F 倒著走：x 減 6、y 加 3", ["F 照著走：x 加 6、y 減 3", "F 倒著走：x 加 3、y 減 6", "F 的坐標直接變號"],
          "反推起點就是把移動倒過來做一次"],
        /* RCT-377 */ ["function.coord", 7, "坐標平面上與原點距離為 5 的點有幾個？",
          "無限多個", ["只有 4 個", "只有 2 個", "只有 1 個"],
          "$(5,0)$、$(0,5)$、$(3,4)$……全部連起來是一個圓，有無限多個"],
        /* 自編 */ ["function.coord", 7, "點向<b>上</b>移 4 單位，坐標怎麼變？",
          "y 坐標加 4", ["x 坐標加 4", "y 坐標減 4", "兩個坐標都加 4"],
          "上下動 y、左右動 x"],

        /* ── 直線圖形 ── */
        /* RCT-130 */ ["function.linear", 7, "題目說「點 $(5,-2)$ 在直線 $-2x+ay=4$ 上」，第一個動作？",
          "代 $x=5$、$y=-2$ 求 $a$", ["代 $x=-2$、$y=5$ 求 $a$", "令 $a=0$ 再畫圖", "令 $y=0$ 求 $x$"],
          "點在線上 ⇔ 坐標代進方程式會成立"],
        /* RCT-029 */ ["function.linear", 7, "判斷二元一次方程式的圖形會不會通過原點",
          "代 $(0,0)$ 看等式是否成立", ["看 $x$ 的係數是不是正數", "看 $x$、$y$ 的係數是否相等", "令 $y=0$ 求出 $x$"],
          "其實就是看<b>常數項是不是 0</b>：$2x=3y$ 會過原點，$2x-3y=6$ 不會"],
        /* RCT-248 */ ["function.linear", 7, "要求直線與 $x$ 軸的交點",
          "令 $y=0$", ["令 $x=0$", "令 $x=y$", "令常數項為 0"],
          "x 軸上的點 y 坐標都是 0；求與 y 軸的交點才令 $x=0$"],
        /* RCT-722 */ ["function.linear", 7, "兩條直線的交點坐標是什麼？",
          "兩方程式的聯立解", ["兩方程式相加的結果", "兩條直線的截距相加", "兩直線與 x 軸的交點"],
          "交點同時在兩條線上，所以同時滿足兩個方程式"],
        /* LFN-005 */ ["function.linear", 8, "$y=ax+b$ 中 $a<0$，$x$ 越大時 $y$ 會？",
          "越小", ["越大", "不變", "先變大再變小"],
          "$a<0$ → 圖形往右下；例：$y=-3x+1$，$x$ 每增加 1，$y$ 減少 3"],
        /* LFN-011 */ ["function.linear", 8, "「$x=3$ 時的函數值」指的是？",
          "把 $x=3$ 代入得到的 $y$", ["使 $y=3$ 的 $x$", "圖形與 $x$ 軸交點的 $x$ 坐標", "$x$ 的係數乘以 3"],
          "函數值就是 $y$ 值"],

        /* ── 二次函數 ── */
        /* QF2-051 */ ["function.quadfn", 9, "$y=a(x-h)^2+k$ 的圖形完全在 $x$ 軸<b>下方</b>，條件是？",
          "$a<0$ 且 $k<0$", ["$a>0$ 且 $k<0$", "$a<0$ 且 $k>0$", "$a>0$ 且 $k>0$"],
          "開口向下、頂點又在 x 軸下方，整條拋物線才會都在下方"],
        /* 自編 */ ["function.quadfn", 9, "題目問二次函數的「最大值」，答案是頂點的哪一個坐標？",
          "$y$ 坐標", ["$x$ 坐標", "兩個坐標的和", "對稱軸與 $x$ 軸的交點"],
          "最值是 $y$ 的值 $k$；$x=h$ 只是「在哪裡發生」"],
        /* QF2-013 */ ["function.quadfn", 9, "點在 $y=2x^2$ 上、且到 $x$ 軸距離為 8，第一個動作？",
          "令 $y=8$ 解 $x$", ["令 $x=8$ 求 $y$", "令 $y=-8$ 解 $x$", "令 $x=0$"],
          "$y=2x^2\\ge0$，圖形在 x 軸上方，所以 $y=8$，$x=\\pm2$"],

        /* ── 統計圖表 ── */
        /* STA-197 */ ["stat.chart", 8, "累積相對次數分配圖上的一點 $(40,55)$ 代表？",
          "不滿 40 的佔 55%", ["恰好是 40 的佔 55%", "不滿 40 的有 55 人", "40 以上的佔 55%"],
          "累積相對次數圖：橫坐標是組的<b>上限</b>，縱坐標是「到這裡為止」的百分比"],
        /* STA-027 */ ["stat.chart", 8, "要一眼看出「不及格的人佔全班多少比例」，用哪一種圖？",
          "累積相對次數分配圖", ["次數分配折線圖", "累積次數分配圖", "相對次數分配折線圖"],
          "「佔多少比例」→ 相對；「60 分以下全部」→ 累積"],
        /* STG-376 */ ["stat.chart", 7, "次數分配折線圖上的點 $(25,30)$，組距 10，代表？",
          "20～30 這一組有 30 人", ["剛好 25 公斤的有 30 人", "不滿 25 的有 30 人", "20～30 這一組佔 30%"],
          "次數分配折線圖的橫坐標是<b>組中點</b>，縱坐標是該組次數"],
        /* 自編 */ ["stat.chart", 7, "分組寫成「60～70」，通常表示？",
          "60 以上、未滿 70", ["超過 60、70 以下", "60 以上、70 以下", "超過 60、未滿 70"],
          "下限包含、上限不包含，這樣 70 分才不會同時落在兩組"],
        /* 自編 */ ["stat.chart", 7, "要同時依「性別」和「是否近視」兩種分類整理人數，用？",
          "列聯表", ["圓形圖", "折線圖", "直方圖"],
          "列聯表的列與欄各是一種分類，交叉格子填人數"],
        /* 自編 */ ["stat.chart", 7, "直方圖中每一條長條的高度代表？",
          "該組的次數", ["該組的組中點", "組距", "累積次數"],
          "橫軸是分組、縱軸是次數；長條相連沒有空隙"],

        /* ── 代表值與離散 ── */
        /* STG-024 */ ["stat.center", 7, "平均數、中位數、眾數中，哪一個最容易被極端值拉走？",
          "平均數", ["中位數", "眾數", "三個一樣"],
          "平均數要把每一筆加起來，一筆特別大就整個被拉高"],
        /* 自編 */ ["stat.center", 7, "統計「最受歡迎的飲料口味」，代表值該用？",
          "眾數", ["平均數", "中位數", "全距"],
          "口味是類別資料，不能相加也不能排大小，只能數哪一個最多"],
        /* PMP-006 */ ["stat.center", 9, "每個人的成績都加 15 分，哪一個統計量<b>不變</b>？",
          "四分位距", ["中位數", "平均數", "第 3 四分位數"],
          "整體平移：位置（平均、中位數、$Q_1$、$Q_3$）都加 15，距離（全距、四分位距）不變"],
        /* PMP-531 */ ["stat.center", 9, "甲組的全距比乙組大，甲的四分位距也一定比較大嗎？",
          "不一定", ["一定比較大", "一定比較小", "一定相等"],
          "全距只看兩個端點，一筆極端值就能讓全距變很大，中間 50% 的分散程度不受影響"]
      ],

      formula: [
        /* RCT-362 */ ["function.coord", 7, "點 $(a,b)$ 到 $x$ 軸的距離是？", "$|b|$", ["$|a|$", "$b$", "$|a|+|b|$"],
          "到 x 軸要<b>上下</b>量 → 看 y 坐標，取絕對值"],
        /* 自編 */ ["function.coord", 7, "點 $(a,b)$ 對<b>原點</b>對稱的點是？", "$(-a,-b)$", ["$(-a,b)$", "$(a,-b)$", "$(b,a)$"],
          "對原點對稱：兩個坐標都變號"],
        /* 自編 */ ["function.coord", 7, "第四象限的點，坐標的符號是？", "$(+,-)$", ["$(-,+)$", "$(-,-)$", "$(+,+)$"],
          "象限從右上角開始逆時針數：一 $(+,+)$、二 $(-,+)$、三 $(-,-)$、四 $(+,-)$"],
        /* RCT-020 */ ["function.linear", 7, "與 $x$ 軸平行的直線，方程式的樣子？", "$y=$ 常數", ["$x=$ 常數", "$y=x$", "$y=ax$（$a\\ne0$）"],
          "水平線上每一點的 y 坐標都一樣；與 y 軸平行的鉛垂線才是 $x=$ 常數"],
        /* RCT-267 */ ["function.linear", 7, "$ax+by=0$（$a$、$b$ 都不是 0）的圖形是？", "通過原點的直線",
          ["平行 $x$ 軸的直線", "平行 $y$ 軸的直線", "不通過原點的直線"],
          "常數項是 0 → 代 $(0,0)$ 會成立"],
        /* 自編 */ ["function.linear", 8, "$y=ax+b$ 中 $a=0$ 時，叫做什麼函數？", "常數函數", ["一次函數", "二次函數", "正比函數"],
          "$y=b$ 的圖形是一條水平線；一次函數與常數函數合稱線型函數"],
        /* 自編 */ ["function.linear", 8, "$y=ax$（$a\\ne0$）的圖形一定通過哪一點？", "$(0,0)$", ["$(1,0)$", "$(0,1)$", "$(a,0)$"],
          "沒有常數項 → 代 $x=0$ 得 $y=0$，一定過原點"],
        /* QF2-002 */ ["function.quadfn", 9, "$y=ax^2+bx+c$ 要是二次函數，條件是？", "$a\\ne0$", ["$b\\ne0$", "$c\\ne0$", "$a>0$"],
          "$a=0$ 就沒有 $x^2$ 項，變成線型函數；$a$ 可正可負"],
        /* QF2-049 */ ["function.quadfn", 9, "$y=a(x-h)^2+k$ 的對稱軸是？", "$x=h$", ["$x=-h$", "$y=k$", "$y=h$"],
          "對稱軸是一條<b>鉛垂線</b>，通過頂點 $(h,k)$"],
        /* 自編 */ ["function.quadfn", 9, "$y=ax^2+k$ 的頂點是？", "$(0,k)$", ["$(k,0)$", "$(0,0)$", "$(a,k)$"],
          "就是 $y=ax^2$ 上下平移 $k$，頂點從原點搬到 $(0,k)$"],
        /* 自編 */ ["stat.chart", 7, "圓形圖中扇形的圓心角 = ？", "百分率 × 360°", ["百分率 × 100°", "百分率 × 180°", "次數 × 360°"],
          "全部是 360°，佔幾 % 就分到幾 % 的 360°"],
        /* STA-116 */ ["stat.chart", 7, "一組的「組中點」怎麼算？", "(上限 + 下限) ÷ 2", ["上限 − 下限", "上限 ÷ 2", "(上限 − 下限) ÷ 2"],
          "上限 − 下限是<b>組距</b>，不是組中點"],
        /* 自編 */ ["stat.chart", 8, "相對次數 = ？", "該組次數 ÷ 總次數", ["總次數 ÷ 該組次數", "該組次數 ÷ 組數", "累積次數 ÷ 總次數"],
          "所有組的相對次數加起來是 100%"],
        /* 自編 */ ["stat.chart", 8, "最後一組的累積次數等於？", "總次數", ["最後一組的次數", "第一組的次數", "組數"],
          "一路加到最後一組，就把所有人都加進來了（累積相對次數則是 100%）"],
        /* PMP-259 */ ["stat.center", 9, "盒狀圖是由哪五個數畫出來的？", "最小值、$Q_1$、$Q_2$、$Q_3$、最大值",
          ["平均數、$Q_1$、$Q_2$、$Q_3$、眾數", "最小值、$Q_1$、平均數、$Q_3$、最大值", "全距、$Q_1$、$Q_2$、$Q_3$、四分位距"],
          "五個數都是「排序後的位置」，沒有平均數"],
        /* PMP-269 */ ["stat.center", 9, "第 2 四分位數 $Q_2$ 就是？", "中位數", ["平均數", "眾數", "全距的一半"],
          "$Q_1$、$Q_2$、$Q_3$ 把排好序的資料切成四等份"],
        /* PMP-257 */ ["stat.prob", 9, "不可能發生的事件，機率是？", "$0$", ["$1$", "$-1$", "$\\dfrac12$"],
          "一定發生的機率是 1；機率一定在 0 與 1 之間"],
        /* 自編 */ ["stat.prob", 9, "機率 $P$ 的範圍？", "$0\\le P\\le1$", ["$0<P<1$", "$-1\\le P\\le1$", "$0\\le P\\le100$"],
          "可以等於 0（不可能）也可以等於 1（一定）"],
        /* 自編 */ ["stat.prob", 9, "已知事件 A 的機率 $P(A)$，A 不發生的機率？", "$1-P(A)$", ["$-P(A)$", "$\\dfrac{1}{P(A)}$", "$P(A)-1$"],
          "發生與不發生的機率加起來是 1"]
      ],

      geo: [
        /* QF2-004 */ ["function.quadfn", 9, "$y=3x^2$ 與 $y=-3x^2$ 的圖形有什麼關係？", "對稱於 $x$ 軸",
          ["對稱於 $y$ 軸", "完全重合", "開口方向相同"],
          "$a$ 變號 → 上下翻轉；開口大小一樣（$|a|$ 相同）"],
        /* 自編 */ ["function.quadfn", 9, "$y=ax^2$（$a>0$）的圖形除了原點外，落在哪些象限？", "第一、二象限",
          ["第三、四象限", "第一、三象限", "第二、四象限"],
          "$x^2\\ge0$，$a>0$ 時 $y\\ge0$，圖形在 x 軸上方"],
        /* 自編 */ ["function.quadfn", 9, "$a>0$ 的拋物線，在對稱軸<b>左側</b>，$x$ 越大 $y$ 會？", "越小",
          ["越大", "不變", "先變大再變小"],
          "開口向上：從左邊往頂點走是下坡，過了頂點才上坡"],
        /* RCT-361 */ ["function.coord", 7, "坐標軸上的點（例如 $(3,0)$）屬於第幾象限？", "不屬於任何象限",
          ["第一象限", "第一或第四象限", "依 y 坐標正負決定"],
          "四個象限都不含坐標軸"],
        /* 自編 */ ["function.coord", 7, "兩點的 x 坐標相同，例如 $(2,5)$、$(2,-1)$，連線會？", "與 $y$ 軸平行",
          ["與 $x$ 軸平行", "通過原點", "與兩軸都相交"],
          "x 不變只動 y → 鉛垂線；距離 $=|5-(-1)|=6$"],
        /* 自編 */ ["function.linear", 8, "$y=b$（常數函數）的圖形是？", "水平線", ["鉛垂線", "通過原點的斜線", "拋物線"],
          "不管 $x$ 是多少，$y$ 都是 $b$"],
        /* RCT-028 */ ["function.linear", 7, "方程式 $y=0$ 的圖形是？", "$x$ 軸", ["$y$ 軸", "原點", "通過原點的斜線"],
          "x 軸上每一點的 y 坐標都是 0"],
        /* 自編 */ ["stat.chart", 7, "圓形圖所有扇形的圓心角加起來是？", "360°", ["180°", "100°", "依資料而定"],
          "百分率加起來是 100%，角度加起來是 360°"],
        /* 自編 */ ["stat.chart", 8, "累積次數分配折線圖的形狀？", "不會往下降", ["一定先升後降", "一定是一條直線", "可以上下起伏"],
          "每一組次數都 ≥ 0，越加只會越多或不變"],
        /* PMP-288 */ ["stat.center", 9, "從盒狀圖<b>看不出</b>哪一個？", "平均數", ["中位數", "第 1 四分位數", "最大值"],
          "盒狀圖只有五個位置數；平均數要知道每一筆資料才算得出來"],
        /* 自編 */ ["stat.center", 9, "盒狀圖中「盒子」的長度代表？", "四分位距", ["全距", "最大值減最小值的一半", "中位數的兩倍"],
          "盒子從 $Q_1$ 到 $Q_3$，長度 $=Q_3-Q_1$；整條（含鬍鬚）才是全距"],
        /* 自編 */ ["stat.center", 9, "每一筆資料都乘以 2，全距會？", "變成 2 倍", ["不變", "加 2", "變成 4 倍"],
          "最大值、最小值都變 2 倍，相減也變 2 倍；加減一個數全距才不變"],
        /* 自編 */ ["stat.center", 7, "偶數筆資料的中位數，一定是資料中的某一筆嗎？", "不一定",
          ["一定是", "一定是較小的那一筆", "一定等於平均數"],
          "例：$1,3,5,9$ 的中位數是 $4$，不在資料裡"],
        /* PMP-258 */ ["stat.prob", 9, "同時擲 20 枚公正硬幣，一定出現 10 正 10 反嗎？", "不一定",
          ["一定", "一定不會", "一定是正面較多"],
          "機率 $\\dfrac12$ 是「長期來看」的比例，不保證每一次剛好一半"],
        /* PMP-653 */ ["stat.prob", 9, "公正骰子已經連續擲出兩次 1 點，第三次出現 1 點的機率？", "還是 $\\dfrac16$",
          ["比 $\\dfrac16$ 小", "比 $\\dfrac16$ 大", "$0$"],
          "骰子沒有記憶，每一次都重新開始"],
        /* PMP-533 */ ["stat.prob", 9, "公正硬幣連擲 50 次全部正面，這可能嗎？", "可能，只是機率很小",
          ["不可能，機率是 0", "一定會，機率是 1", "第 50 次一定是反面"],
          "機率很小 ≠ 不可能；只有不可能的事件機率才是 0"],
        /* 自編 */ ["stat.prob", 9, "同時擲兩顆骰子，所有可能的情形有幾種？", "36 種", ["12 種", "11 種", "6 種"],
          "第一顆 6 種 × 第二顆 6 種；點數和的 11 種不等機會，不能拿來當分母"],
        /* 自編 */ ["stat.prob", 9, "同時擲兩枚公正硬幣，一正一反的機率？", "$\\dfrac12$", ["$\\dfrac13$", "$\\dfrac14$", "$\\dfrac23$"],
          "正反、反正是兩種，四種情形中佔 2 種；寫成「兩正、兩反、一正一反」三種是錯的（不等機會）"],
        /* PMP-665 */ ["stat.prob", 9, "兩人猜拳一次，平手的機率？", "$\\dfrac13$", ["$\\dfrac19$", "$\\dfrac12$", "$\\dfrac23$"],
          "共 $3\\times3=9$ 種，平手 3 種（剪剪、石石、布布）"],
        /* 自編 */ ["stat.prob", 9, "擲一枚硬幣三次，所有可能的情形有幾種？", "8 種", ["6 種", "4 種", "9 種"],
          "每次 2 種：$2\\times2\\times2=8$；畫樹狀圖會有 8 條路徑"]
      ]
    },
    gens: {
      graph: [
        { f: gQuadSign, w: 2 }, { f: gMovePt, w: 2 }, { f: gAxisDist, w: 1 },
        { f: gHVLine, w: 1 }, { f: gPointOnLine, w: 1 }, { f: gIntercept, w: 1 }, { f: gLineQuadrant, w: 1 }, { f: gFnValue, w: 1 },
        { f: gQuadExt, w: 2 }, { f: gSymAxis, w: 1 }, { f: gShift, w: 2 }
      ],
      calc: [
        { f: gPieAngle, w: 2 }, { f: gRelFreq, w: 2 }, { f: gCumRel, w: 2 }, { f: gCumFreq, w: 1 }, { f: gMidpoint, w: 1 },
        { f: gMeanError, w: 1 }, { f: gMeanReplace, w: 1 }, { f: gMeanNeed, w: 1 }, { f: gRange, w: 1 }, { f: gQuartile, w: 1 }, { f: gQ3Count, w: 1 },
        { f: gDiceSum, w: 1 }, { f: gMultiples, w: 1 }, { f: gBalls3, w: 1 }, { f: gComplement, w: 1 }
      ]
    }
  };
});
