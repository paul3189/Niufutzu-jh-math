/* 牛夫子直覺道場（國中版）— 題庫
 * 五大題型：秒算直覺／公式辨識／關鍵字反射／圖形性質／坐標與函數
 * 每一題都標了「單元 + 年級」，才能依「年級／單元／全範圍」出題。
 * 計算題由產生器即時出題（數字每次不同）；觀念題手寫。
 * 輸出格式：{ cat, t(單元id), g(年級), q, choices:[html...], ans:index, tip, key }
 */
(function () {
  "use strict";

  /* ────────── 小工具 ────────── */
  function ri(n) { return Math.floor(Math.random() * n); }
  function pick(a) { return a[ri(a.length)]; }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = ri(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  /* 組題：誘答去重、剔除與正解相同者。
   * 補齊順序：呼叫端給的候選池 pool → 數值題用鄰近數字，確保一定有四個相異選項。 */
  function mk(cat, t, g, q, ans, wrongs, tip, pool) {
    var uniq = [];
    (wrongs || []).concat(pool || []).forEach(function (w) {
      if (w != null && w !== ans && uniq.indexOf(w) < 0 && uniq.length < 3) uniq.push(w);
    });
    var n = parseFloat(ans);
    var numeric = !isNaN(n) && String(n) === String(ans).trim();
    for (var d = 1; uniq.length < 3 && numeric && d < 40; d++) {
      [n + d, n - d].forEach(function (c) {
        var s = String(c);
        if (uniq.length < 3 && s !== ans && uniq.indexOf(s) < 0) uniq.push(s);
      });
    }
    var ch = shuffle([ans].concat(uniq.slice(0, 3)));
    return { cat: cat, t: t, g: g, q: q, choices: ch, ans: ch.indexOf(ans), tip: tip, key: cat + "|" + q };
  }
  /* 角度題專用：選項都是「N°」，不足三個時用 ±10°、±20° 補齊 */
  function r1(n) { return Math.round(n * 10) / 10; }
  function mkDeg(cat, t, g, q, ansN, wrongNs, tip) {
    var a = r1(ansN), seen = {}, out = [];
    seen[a] = 1;
    (wrongNs || []).forEach(function (w) {
      var v = r1(w);
      if (v > 0 && !seen[v] && out.length < 3) { seen[v] = 1; out.push(v); }
    });
    /* 內角和之類的答案會超過 360°，所以只擋非正值 */
    [10, -10, 20, -20, 30, -30, 45, 15, 180, -180].forEach(function (d) {
      var v = r1(a + d);
      if (out.length < 3 && v > 0 && !seen[v]) { seen[v] = 1; out.push(v); }
    });
    return mk(cat, t, g, q, a + "°", out.map(function (v) { return v + "°"; }), tip);
  }
  /* 分數／機率題的備援選項池 */
  var FRAC_POOL = ["$\\dfrac{1}{2}$", "$\\dfrac{1}{3}$", "$\\dfrac{2}{3}$", "$\\dfrac{1}{4}$",
    "$\\dfrac{3}{4}$", "$\\dfrac{1}{6}$", "$\\dfrac{5}{6}$", "$\\dfrac{3}{2}$", "$1$", "$2$"];
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  /* 分數的 LaTeX（自動約分、處理負號與整數） */
  function frac(n, d) {
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(n, d) || 1;
    n /= g; d /= g;
    if (d === 1) return String(n);
    return (n < 0 ? "-" : "") + "\\dfrac{" + Math.abs(n) + "}{" + d + "}";
  }
  function sgn(n) { return n < 0 ? "(" + n + ")" : String(n); }

  /* ────────── 題型 ────────── */
  var CATS = [
    { id: "calc",    name: "秒算直覺",   icon: "⚡", timeMul: 1.30,
      desc: "整數、分數、指數、根式、方程式的心算" },
    { id: "formula", name: "公式辨識",   icon: "🧩", timeMul: 1.05,
      desc: "看到這個式子，這是誰的公式" },
    { id: "keyword", name: "關鍵字反射", icon: "🔑", timeMul: 1.20,
      desc: "看到這句話，手要自動往哪個方向動" },
    { id: "geo",     name: "圖形性質",   icon: "📐", timeMul: 1.15,
      desc: "性質與判別法：知道它是什麼就能用什麼" },
    { id: "graph",   name: "坐標與函數", icon: "📈", timeMul: 1.15,
      desc: "象限、直線圖形、拋物線的直覺" }
  ];

  /* ────────── 單元表（對應 data/jm-*.js 的 領域.主題） ────────── */
  var TOPICS = [
    { id: "number.int",       d: "數與量",         n: "整數與數線",         g: 7 },
    { id: "number.ratio",     d: "數與量",         n: "分數、比與比例式",   g: 7 },
    { id: "number.exp",       d: "數與量",         n: "指數律與科學記號",   g: 7 },
    { id: "number.root",      d: "數與量",         n: "平方根與根式",       g: 8 },
    { id: "algebra.expr",     d: "代數式與規律",   n: "代數式與化簡",       g: 7 },
    { id: "algebra.mul",      d: "代數式與規律",   n: "乘法公式",           g: 8 },
    { id: "algebra.factor",   d: "代數式與規律",   n: "因式分解",           g: 8 },
    { id: "algebra.seq",      d: "代數式與規律",   n: "數列與級數",         g: 8 },
    { id: "equation.linear1", d: "方程式與不等式", n: "一元一次方程式",     g: 7 },
    { id: "equation.linear2", d: "方程式與不等式", n: "二元一次聯立方程式", g: 7 },
    { id: "equation.quad",    d: "方程式與不等式", n: "一元二次方程式",     g: 8 },
    { id: "equation.ineq",    d: "方程式與不等式", n: "一元一次不等式",     g: 7 },
    { id: "function.coord",   d: "坐標與函數",     n: "直角坐標平面",       g: 7 },
    { id: "function.linear",  d: "坐標與函數",     n: "線型函數（一次函數）", g: 8 },
    { id: "function.quadfn",  d: "坐標與函數",     n: "二次函數 y=ax²",     g: 9 },
    /* 餘角、補角、對頂角、角平分線是七年級；八下才進到平行線截角 */
    { id: "angle.basic",      d: "線、角與三角形", n: "角的關係",           g: 7 },
    { id: "angle.life",       d: "線、角與三角形", n: "生活中的幾何",       g: 7 },
    { id: "angle.parallel",   d: "線、角與三角形", n: "平行線與截角",       g: 8 },
    { id: "angle.tri",        d: "線、角與三角形", n: "三角形的邊角性質",   g: 8 },
    { id: "angle.cong",       d: "線、角與三角形", n: "三角形全等",         g: 8 },
    { id: "angle.center",     d: "線、角與三角形", n: "三角形的特殊線與心", g: 9 },
    { id: "quad.para",        d: "四邊形與多邊形", n: "平行四邊形",         g: 8 },
    { id: "quad.special",     d: "四邊形與多邊形", n: "矩形、菱形與正方形", g: 8 },
    { id: "quad.trap",        d: "四邊形與多邊形", n: "梯形、箏形與中點連線", g: 8 },
    { id: "quad.poly",        d: "四邊形與多邊形", n: "多邊形的角",         g: 8 },
    { id: "circle.parts",     d: "圓",             n: "圓的基本元素",       g: 9 },
    { id: "circle.angle",     d: "圓",             n: "圓周角與圓心角",     g: 9 },
    { id: "circle.tangent",   d: "圓",             n: "切線與位置關係",     g: 9 },
    { id: "circle.arc",       d: "圓",             n: "弧長與扇形面積",     g: 9 },
    { id: "similar.pyth",     d: "畢氏定理與相似形", n: "畢氏定理",         g: 8 },
    { id: "similar.sim",      d: "畢氏定理與相似形", n: "相似形",           g: 9 },
    { id: "solid.prism",      d: "立體圖形與測量", n: "柱體",               g: 9 },
    { id: "solid.pyramid",    d: "立體圖形與測量", n: "錐體",               g: 9 },
    { id: "stat.chart",       d: "統計與機率",     n: "統計圖表",           g: 7 },
    { id: "stat.center",      d: "統計與機率",     n: "資料的代表值與離散", g: 8 },
    { id: "stat.prob",        d: "統計與機率",     n: "機率",               g: 9 }
  ];
  var TMAP = {};
  TOPICS.forEach(function (t) { TMAP[t.id] = t; });

  /* ══════════════ 一、秒算直覺（產生器） ══════════════ */

  /* 有理數四則：先乘除後加減、負號陷阱 */
  function gIntArith() {
    var mode = ri(5);
    var a, b, c, ans, q, wr;
    if (mode === 0) {                                   /* a + b×c */
      a = ri(19) - 9; b = ri(9) - 4 || 3; c = ri(9) - 4 || 2;
      ans = a + b * c;
      q = "$" + a + " + " + sgn(b) + " \\times " + sgn(c) + " = \\ ?$";
      wr = [String((a + b) * c), String(a + b + c), String(a - b * c)];
      return mk("calc", "number.int", 7, q, String(ans), wr, "先乘除後加減：先算 " + b + "×" + c + " = " + b * c);
    }
    if (mode === 1) {                                   /* (a + b) × c */
      a = ri(15) - 7; b = ri(15) - 7; c = ri(7) - 3 || 2;
      ans = (a + b) * c;
      q = "$(" + a + " + " + sgn(b) + ") \\times " + sgn(c) + " = \\ ?$";
      wr = [String(a + b * c), String(a + b + c), String((a - b) * c)];
      return mk("calc", "number.int", 7, q, String(ans), wr, "括號先算：(" + a + ")+(" + b + ") = " + (a + b));
    }
    if (mode === 2) {                                   /* −a² vs (−a)² */
      a = 2 + ri(7);
      if (ri(2)) {
        return mk("calc", "number.int", 7, "$(-" + a + ")^2 = \\ ?$", String(a * a),
          [String(-a * a), String(-2 * a), String(2 * a)],
          "括號裡的負號也被平方了，負負得正 → " + a * a);
      }
      return mk("calc", "number.int", 7, "$-" + a + "^2 = \\ ?$", String(-a * a),
        [String(a * a), String(-2 * a), String(2 * a)],
        "沒有括號時「次方先做」：先算 " + a + "² 再加負號 → " + (-a * a));
    }
    if (mode === 3) {                                   /* a − (b − c) */
      a = ri(19) - 9; b = ri(19) - 9; c = ri(15) - 7;
      ans = a - (b - c);
      q = "$" + a + " - (" + b + " - " + sgn(c) + ") = \\ ?$";
      wr = [String(a - b - c), String(a + b - c), String(a - b + c === ans ? ans + 2 : a - b - c - 1)];
      return mk("calc", "number.int", 7, q, String(ans), wr, "去括號時括號前是減號，裡面每一項都要變號");
    }
    b = 2 + ri(8); ans = ri(15) - 7; a = b * ans;       /* a ÷ b */
    var d = ri(15) - 7;
    return mk("calc", "number.int", 7, "$" + a + " \\div " + b + " + " + sgn(d) + " = \\ ?$",
      String(ans + d), [String((a + d) / b), String(ans - d), String(a / (b + d))].filter(function (x) { return x.indexOf(".") < 0; }),
      "先除後加：" + a + "÷" + b + " = " + ans);
  }

  /* 絕對值與數線距離 */
  function gAbs() {
    var a = ri(21) - 10, b = ri(21) - 10;
    if (ri(2)) {
      return mk("calc", "number.int", 7, "$|" + a + "| = \\ ?$", String(Math.abs(a)),
        [String(-Math.abs(a)), String(a * 2), String(0)],
        "絕對值＝數線上到原點的距離，結果不會是負的");
    }
    return mk("calc", "number.int", 7,
      "數線上 $" + a + "$ 與 $" + b + "$ 兩點的距離 = ?", String(Math.abs(a - b)),
      [String(a - b), String(a + b), String(Math.abs(a + b))],
      "兩點距離 $=|a-b|=|" + a + "-(" + b + ")|=" + Math.abs(a - b));
  }

  /* 最大公因數／最小公倍數 */
  function gGcdLcm() {
    var a = 4 + ri(45), b = 4 + ri(45);
    var g = gcd(a, b), l = a * b / g;
    if (ri(2)) {
      return mk("calc", "number.int", 7, "$" + a + "$ 與 $" + b + "$ 的最大公因數 = ?",
        String(g), [String(l), String(a > b ? a - b : b - a), String(g * 2)],
        "短除法：共同的質因數取最低次方 → " + g);
    }
    return mk("calc", "number.int", 7, "$" + a + "$ 與 $" + b + "$ 的最小公倍數 = ?",
      String(l), [String(g), String(a * b), String(l / 2)],
      "最小公倍數 $=\\dfrac{a\\times b}{\\gcd}=\\dfrac{" + a + "\\times" + b + "}{" + g + "}=" + l);
  }

  /* 分數四則 */
  function gFrac() {
    var d1 = pick([2, 3, 4, 5, 6, 8]), d2 = pick([2, 3, 4, 5, 6, 8]);
    var n1 = 1 + ri(d1 - 1), n2 = 1 + ri(d2 - 1);
    var op = ri(4);
    var N, D, sym, tip;
    if (op === 0) { N = n1 * d2 + n2 * d1; D = d1 * d2; sym = "+"; tip = "先通分再加分子：分母不能直接相加"; }
    else if (op === 1) { N = n1 * d2 - n2 * d1; D = d1 * d2; sym = "-"; tip = "先通分再減分子"; }
    else if (op === 2) { N = n1 * n2; D = d1 * d2; sym = "\\times"; tip = "分子乘分子、分母乘分母，最後約分"; }
    else { N = n1 * d2; D = d1 * n2; sym = "\\div"; tip = "除以一個分數＝乘它的倒數"; }
    var ans = frac(N, D);
    var wrongs = [frac(n1 + n2, d1 + d2), frac(N + D, D), frac(D, N), frac(N, D + 1), frac(N + 1, D)];
    if (op === 0) wrongs[0] = frac(n1 + n2, d1 === d2 ? d1 : d1 + d2);
    return mk("calc", "number.ratio", 7,
      "$\\dfrac{" + n1 + "}{" + d1 + "} " + sym + " \\dfrac{" + n2 + "}{" + d2 + "} = \\ ?$",
      "$" + ans + "$", wrongs.map(function (w) { return "$" + w + "$"; }), tip, FRAC_POOL);
  }

  /* 比例式 */
  function gRatio() {
    var a = 2 + ri(8), b = 2 + ri(8), k = 2 + ri(6);
    if (a === b) b = a + 1 + ri(3);        /* a:b 相同的話題目沒有意義 */
    var c = a * k, x = b * k;
    if (ri(2)) {
      return mk("calc", "number.ratio", 7,
        "$" + a + " : " + b + " = " + c + " : x$，$x = \\ ?$", String(x),
        [String(c + b - a), String(a * b), String(Math.round(c * a / b))],
        "交叉相乘：$" + a + "x = " + b + "\\times" + c + "$ → $x=" + x + "$");
    }
    var total = (a + b) * k;
    return mk("calc", "number.ratio", 7,
      "把 $" + total + "$ 元依 $" + a + " : " + b + "$ 分給甲乙，甲得多少元？", String(a * k),
      [String(b * k), String(total / 2), String(a * b)],
      "設兩份為 " + a + "k 與 " + b + "k：$(" + a + "+" + b + ")k=" + total + "$ → $k=" + k + "$，甲得 " + a + "×" + k);
  }

  /* 指數律 */
  function gExpLaw() {
    var base = pick([2, 3, 5, 10]);
    var m = 2 + ri(5), n = 2 + ri(4);
    var mode = ri(4);
    if (mode === 0) {
      return mk("calc", "number.exp", 7,
        "$" + base + "^{" + m + "} \\times " + base + "^{" + n + "} = " + base + "^{\\,?}$",
        String(m + n), [String(m * n), String(m - n), String(Math.abs(m - n) + 1)],
        "同底數相乘 → 指數相加：" + m + "+" + n + " = " + (m + n));
    }
    if (mode === 1) {
      return mk("calc", "number.exp", 7,
        "$(" + base + "^{" + m + "})^{" + n + "} = " + base + "^{\\,?}$",
        String(m * n), [String(m + n), String(Math.pow(m, n)), String(m - n)],
        "次方的次方 → 指數相乘：" + m + "×" + n + " = " + m * n);
    }
    if (mode === 2) {
      var big = m + n + 1;
      return mk("calc", "number.exp", 7,
        "$" + base + "^{" + big + "} \\div " + base + "^{" + n + "} = " + base + "^{\\,?}$",
        String(big - n), [String(big / n | 0), String(big + n), String(n - big)],
        "同底數相除 → 指數相減：" + big + "−" + n + " = " + (big - n));
    }
    var e = 1 + ri(3);
    return mk("calc", "number.exp", 7, "$" + base + "^{-" + e + "} = \\ ?$",
      "$\\dfrac{1}{" + Math.pow(base, e) + "}$",
      ["$-" + Math.pow(base, e) + "$", "$" + Math.pow(base, e) + "$", "$-\\dfrac{1}{" + Math.pow(base, e) + "}$"],
      "負指數代表倒數，不是負數：$" + base + "^{-" + e + "}=\\dfrac{1}{" + base + "^{" + e + "}}$");
  }

  /* 科學記號 */
  function gSci() {
    var mant = (1 + ri(9)) + "." + (1 + ri(9));
    var e = 2 + ri(6);
    if (ri(3) === 0) {
      /* 保證乘積 ≥ 10（需要進位）、且 e1+e2 ≠ e1×e2，四個選項才會互異 */
      var a = 3 + ri(6), b = 4 + ri(5), e1 = 2 + ri(5), e2 = 3 + ri(4);
      var prod = a * b, ee = e1 + e2;
      var ansTex = (prod / 10) + " \\times 10^{" + (ee + 1) + "}";
      return mk("calc", "number.exp", 7,
        "$(" + a + "\\times10^{" + e1 + "}) \\times (" + b + "\\times10^{" + e2 + "}) = \\ ?$",
        "$" + ansTex + "$",
        ["$" + prod + " \\times 10^{" + ee + "}$",
         "$" + prod + " \\times 10^{" + (e1 * e2) + "}$",
         "$" + (a + b) + " \\times 10^{" + ee + "}$"],
        "數字相乘、10 的次方相加：" + a + "×" + b + "=" + prod + "，超過 10 所以再進一位");
    }
    var val = Number(mant) * Math.pow(10, e);
    var shown = String(Math.round(val));
    return mk("calc", "number.exp", 7, "$" + shown + "$ 的科學記號是？",
      "$" + mant + "\\times10^{" + e + "}$",
      ["$" + mant + "\\times10^{" + (e + 1) + "}$", "$" + mant + "\\times10^{" + (e - 1) + "}$",
       "$" + r1(Number(mant) * 10) + "\\times10^{" + (e - 1) + "}$"],
      "科學記號規定前面那個數要在 1 到 10 之間；小數點往左移了 " + e + " 位");
  }

  /* 根式化簡 */
  var ROOTS = [
    [8, 2, 2], [12, 2, 3], [18, 3, 2], [20, 2, 5], [24, 2, 6], [27, 3, 3], [32, 4, 2],
    [45, 3, 5], [48, 4, 3], [50, 5, 2], [72, 6, 2], [75, 5, 3], [98, 7, 2], [108, 6, 3],
    [128, 8, 2], [147, 7, 3], [200, 10, 2]
  ];
  function gRoot() {
    var r = pick(ROOTS);
    var ans = r[1] + "\\sqrt{" + r[2] + "}";
    /* 8=2√2、27=3√3 這種係數與根號內相同的，交換型誘答會等於正解 */
    var swap = r[1] === r[2] ? (r[1] + 1) + "\\sqrt{" + r[2] + "}" : r[2] + "\\sqrt{" + r[1] + "}";
    return mk("calc", "number.root", 8, "化到最簡：$\\sqrt{" + r[0] + "} = \\ ?$", "$" + ans + "$",
      ["$" + swap + "$", "$" + (r[1] * r[2]) + "$", "$" + r[1] + "\\sqrt{" + (r[2] * 2) + "}$"],
      "把平方因數提出根號：$\\sqrt{" + r[0] + "}=\\sqrt{" + (r[1] * r[1]) + "\\times" + r[2] + "}=" + ans + "$");
  }
  function gRootOp() {
    var mode = ri(4);
    if (mode === 0) {
      var r = pick(ROOTS), k = r[2];
      var prod = r[0] * k;                                  /* √n × √k */
      var v = r[1] * k;                                     /* = r1·k */
      return mk("calc", "number.root", 8,
        "$\\sqrt{" + r[0] + "} \\times \\sqrt{" + k + "} = \\ ?$", String(v),
        [String(r[0] * k), String(r[0] + k), String(r[1] + k)],
        "根號可以合併：$\\sqrt{" + r[0] + "\\times" + k + "}=\\sqrt{" + prod + "}=" + v + "$");
    }
    if (mode === 1) {
      var a = 2 + ri(7), b = 2 + ri(7), s = pick([2, 3, 5, 6, 7]);
      return mk("calc", "number.root", 8,
        "$" + a + "\\sqrt{" + s + "} + " + b + "\\sqrt{" + s + "} = \\ ?$",
        "$" + (a + b) + "\\sqrt{" + s + "}$",
        ["$" + (a + b) + "\\sqrt{" + (s * 2) + "}$", "$" + (a * b) + "\\sqrt{" + s + "}$",
         "$" + (a + b) + "$", "$" + (a + b + 1) + "\\sqrt{" + s + "}$"],
        "同類方根就像同類項：係數相加，根號裡不變");
    }
    if (mode === 2) {
      var m = pick([2, 3, 5, 7]), c = 2 + ri(6);
      return mk("calc", "number.root", 8,
        "$" + c + "\\sqrt{" + m + "} \\times \\sqrt{" + m + "} = \\ ?$", String(c * m),
        [String(c * m * m), String(c + m), String(c * Math.round(Math.sqrt(m * m)))].filter(function (x, i, arr) { return arr.indexOf(x) === i; }),
        "$\\sqrt{" + m + "}\\times\\sqrt{" + m + "}=" + m + "$，再乘 " + c);
    }
    var q = pick([[50, 2, 5], [72, 2, 6], [48, 3, 4], [45, 5, 3], [98, 2, 7], [108, 3, 6]]);
    return mk("calc", "number.root", 8,
      "$\\sqrt{" + q[0] + "} \\div \\sqrt{" + q[1] + "} = \\ ?$", String(q[2]),
      [String(q[0] / q[1] + 1), String(q[0] - q[1]), String(q[2] * q[1])],
      "根號可以合併：$\\sqrt{" + q[0] + "\\div" + q[1] + "}=\\sqrt{" + q[0] / q[1] + "}=" + q[2] + "$");
  }
  function gSqrtEst() {
    var n = 5 + ri(140);
    var k = Math.floor(Math.sqrt(n));
    if (k * k === n) n += 1, k = Math.floor(Math.sqrt(n));
    return mk("calc", "number.root", 8,
      "$\\sqrt{" + n + "}$ 介於哪兩個連續整數之間？",
      "$" + k + "$ 與 $" + (k + 1) + "$",
      ["$" + (k - 1) + "$ 與 $" + k + "$", "$" + (k + 1) + "$ 與 $" + (k + 2) + "$", "$" + Math.round(n / 2) + "$ 附近"],
      "$" + k + "^2=" + k * k + " < " + n + " < " + (k + 1) * (k + 1) + "=" + (k + 1) + "^2$");
  }

  /* 乘法公式展開 */
  function gExpand() {
    var a = 1 + ri(8), mode = ri(3);
    if (mode === 0) {
      return mk("calc", "algebra.mul", 8, "$(x+" + a + ")^2 = \\ ?$",
        "$x^2+" + (2 * a) + "x+" + (a * a) + "$",
        ["$x^2+" + (a * a) + "$", "$x^2+" + a + "x+" + (a * a) + "$",
         "$x^2+" + (2 * a) + "x-" + (a * a) + "$"],
        "$(x+a)^2=x^2+2ax+a^2$：中間的 $2ax$ 最常被漏掉");
    }
    if (mode === 1) {
      return mk("calc", "algebra.mul", 8, "$(x-" + a + ")^2 = \\ ?$",
        "$x^2-" + (2 * a) + "x+" + (a * a) + "$",
        ["$x^2-" + (a * a) + "$", "$x^2-" + (2 * a) + "x-" + (a * a) + "$", "$x^2+" + (2 * a) + "x+" + (a * a) + "$"],
        "$(x-a)^2=x^2-2ax+a^2$：最後一項是加號（負負得正）");
    }
    return mk("calc", "algebra.mul", 8, "$(x+" + a + ")(x-" + a + ") = \\ ?$",
      "$x^2-" + (a * a) + "$",
      ["$x^2+" + (a * a) + "$", "$x^2-" + (2 * a) + "x-" + (a * a) + "$", "$x^2-" + (a * a) + "x$"],
      "平方差：$(x+a)(x-a)=x^2-a^2$，中間項對消");
  }

  /* 因式分解 */
  function gFactor() {
    var p = 1 + ri(8), q = 1 + ri(8);
    if (ri(3) === 0) {
      var a = 2 + ri(8);
      return mk("calc", "algebra.factor", 8, "分解：$x^2-" + (a * a) + " = \\ ?$",
        "$(x+" + a + ")(x-" + a + ")$",
        ["$(x-" + a + ")^2$", "$(x+" + a + ")^2$", "$x(x-" + (a * a) + ")$"],
        "平方差公式：$a^2-b^2=(a+b)(a-b)$");
    }
    var b = p + q, c = p * q;
    /* 誘答不能是「換個順序寫的同一個答案」，所以只用變號與換數字的版本 */
    return mk("calc", "algebra.factor", 8,
      "分解：$x^2+" + b + "x+" + c + " = \\ ?$",
      "$(x+" + p + ")(x+" + q + ")$",
      ["$(x-" + p + ")(x-" + q + ")$", "$(x+" + b + ")(x+" + c + ")$",
       "$(x+" + p + ")(x-" + q + ")$", "$(x-" + p + ")(x+" + q + ")$"],
      "找兩個數相乘 = " + c + "、相加 = " + b + " → " + p + " 與 " + q);
  }

  /* 一元一次方程式 */
  function gLinear1() {
    var a = 2 + ri(7), x = ri(15) - 7, b = ri(19) - 9;
    var c = a * x + b;
    return mk("calc", "equation.linear1", 7,
      "$" + a + "x " + (b < 0 ? "-" : "+") + " " + Math.abs(b) + " = " + c + "$，$x = \\ ?$",
      String(x), [String((c + b) / a), String(c - b), String((c - b) * a)]
        .filter(function (s) { return s.indexOf(".") < 0; }),
      "移項：$" + a + "x = " + c + (b < 0 ? "+" : "-") + Math.abs(b) + " = " + (c - b) + "$ → $x=" + x + "$");
  }

  /* 二元一次聯立 */
  function gLinear2() {
    var x = ri(11) - 5, y = ri(11) - 5;
    var s = x + y, d = x - y;
    return mk("calc", "equation.linear2", 7,
      "$\\begin{cases} x+y=" + s + " \\\\ x-y=" + d + " \\end{cases}$，$x = \\ ?$",
      String(x), [String(y), String(s - d), String((s + d) * 2)],
      "兩式相加消去 y：$2x=" + (s + d) + "$ → $x=" + x + "$");
  }

  /* 一元二次方程式 */
  function gQuad() {
    var p = ri(11) - 5, q = ri(11) - 5;
    if (p === q) q = p + 1;
    var b = -(p + q), c = p * q;
    /* 係數 1 不寫、係數 0 整項不寫 */
    var xt = b === 0 ? "" : (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "x";
    var ct = c === 0 ? "" : (c < 0 ? " - " : " + ") + Math.abs(c);
    var body = "x^2" + xt + ct;
    var fac = function (v) { return v < 0 ? "(x+" + (-v) + ")" : "(x-" + v + ")"; };
    if (ri(2)) {
      return mk("calc", "equation.quad", 8, "$" + body + " = 0$ 的兩根之和 = ?",
        String(p + q), [String(p * q), String(b), String(-c)],
        "先分解成 $" + fac(p) + fac(q) + "=0$ → 兩根 " + p + "、" + q +
        "（也可以用根與係數：兩根和 $=-\\dfrac{b}{a}$）");
    }
    return mk("calc", "equation.quad", 8, "$" + body + " = 0$ 的較大根 = ?",
      String(Math.max(p, q)), [String(Math.min(p, q)), String(p + q), String(p * q)],
      "分解成 $" + fac(p) + fac(q) + "=0$ → 兩根 " + p + "、" + q);
  }

  /* 一元一次不等式（負數變號） */
  function gIneq() {
    var a = 2 + ri(6), x = ri(13) - 6;
    if (x === 0) x = 4;                    /* x=0 時 x 與 −x 相同，選項會重複 */
    var negA = ri(2) === 0;
    var coef = negA ? -a : a;
    var c = coef * x;
    var dir = negA ? ">" : "<";           /* 原式 coef·x < c */
    var flip = negA ? ">" : "<";
    var q = "$" + coef + "x " + "<" + " " + c + "$ 的解是？";
    var ans = "$x " + (negA ? ">" : "<") + " " + x + "$";
    var wr = ["$x " + (negA ? "<" : ">") + " " + x + "$", "$x " + (negA ? ">" : "<") + " " + (-x) + "$",
              "$x " + (negA ? "<" : ">") + " " + (-x) + "$"];
    return mk("calc", "equation.ineq", 7, q, ans, wr,
      negA ? "兩邊同除以負數 " + coef + "，不等號要反向！" : "兩邊同除以正數，不等號方向不變");
  }

  /* 等差數列 */
  function gSeq() {
    var a1 = ri(15) - 7, d = 2 + ri(6), n = 5 + ri(12);
    if (ri(2)) {
      return mk("calc", "algebra.seq", 8,
        "等差數列首項 $" + a1 + "$、公差 $" + d + "$，第 $" + n + "$ 項 = ?",
        String(a1 + (n - 1) * d), [String(a1 + n * d), String(a1 + (n - 2) * d), String(n * d)],
        "$a_n=a_1+(n-1)d$：是 " + (n - 1) + " 個公差，不是 " + n + " 個");
    }
    var m = 4 + ri(7);
    var last = a1 + (m - 1) * d;
    var sum = m * (a1 + last) / 2;
    return mk("calc", "algebra.seq", 8,
      "等差數列 $" + a1 + ", " + (a1 + d) + ", " + (a1 + 2 * d) + ", \\dots$ 前 $" + m + "$ 項的和 = ?",
      String(sum), [String(m * last), String((a1 + last) / 2), String(sum + d)],
      "和 $=\\dfrac{項數\\times(首項+末項)}{2}=\\dfrac{" + m + "\\times(" + a1 + "+" + last + ")}{2}=" + sum);
  }

  /* 統計代表值 */
  function gStat() {
    var arr = [], i;
    for (i = 0; i < 5; i++) arr.push(2 + ri(28));
    var sorted = arr.slice().sort(function (a, b) { return a - b; });
    var mode = ri(2);
    if (mode === 0) {
      return mk("calc", "stat.center", 8, "$" + arr.join(",\\ ") + "$ 的中位數 = ?",
        String(sorted[2]), [String(arr[2]), String(sorted[0]), String(sorted[4])],
        "中位數要<b>先排序</b>再取中間那一筆：排序後 " + sorted.join(", "));
    }
    var six = arr.concat([2 + ri(28)]);
    var s6 = six.slice().sort(function (a, b) { return a - b; });
    var med = (s6[2] + s6[3]) / 2;
    return mk("calc", "stat.center", 8, "$" + six.join(",\\ ") + "$（共 6 筆）的中位數 = ?",
      String(med), [String(s6[2]), String(s6[3]), String((s6[0] + s6[5]) / 2)],
      "偶數筆 → 取中間<b>兩筆的平均</b>：$(" + s6[2] + "+" + s6[3] + ")\\div2=" + med + "$");
  }

  /* 機率 */
  function gProb() {
    var mode = ri(3);
    if (mode === 0) {
      var t = pick([[2, "偶數"], [2, "奇數"], [3, "3 的倍數"], [6, "6"]]);
      var favor = t[0] === 2 ? 3 : t[0] === 3 ? 2 : 1;
      return mk("calc", "stat.prob", 9, "擲一顆公正骰子，出現「" + t[1] + "」的機率 = ?",
        "$" + frac(favor, 6) + "$",
        ["$" + frac(favor, 12) + "$", "$" + frac(6, favor) + "$", "$" + frac(favor + 1, 6) + "$"],
        "機率 = 有利情形 ÷ 全部情形 = " + favor + " ÷ 6", FRAC_POOL);
    }
    var r = 2 + ri(6), w = 2 + ri(6);
    return mk("calc", "stat.prob", 9,
      "袋中有 " + r + " 顆紅球、" + w + " 顆白球，任取一顆是紅球的機率 = ?",
      "$" + frac(r, r + w) + "$",
      ["$" + frac(r, w) + "$", "$" + frac(w, r + w) + "$", "$" + frac(1, r + w) + "$"],
      "分母是<b>全部</b> " + (r + w) + " 顆，不是另一種顏色的數量", FRAC_POOL);
  }

  /* ══════════════ 二、坐標與函數（產生器） ══════════════ */

  function gQuadrantPt() {
    var x = (ri(9) - 4) || 3, y = (ri(9) - 4) || 2;
    var q = x > 0 ? (y > 0 ? 1 : 4) : (y > 0 ? 2 : 3);
    var names = ["第一象限", "第二象限", "第三象限", "第四象限"];
    return mk("graph", "function.coord", 7, "點 $(" + x + "," + y + ")$ 在第幾象限？",
      names[q - 1], names.filter(function (n) { return n !== names[q - 1]; }),
      "x " + (x > 0 ? "正" : "負") + "、y " + (y > 0 ? "正" : "負") + " → " + names[q - 1] +
      "（象限從右上角逆時針數）");
  }

  function gSymPt() {
    var x = (ri(11) - 5) || 3, y = (ri(11) - 5) || 2;
    /* |x|=|y| 時「交換座標」會和其他選項重疊 */
    if (Math.abs(x) === Math.abs(y)) y = (Math.abs(y) % 5) + 1;
    var kind = ri(3);
    var ans, tip;
    if (kind === 0) { ans = "$(" + x + "," + (-y) + ")$"; tip = "對 x 軸對稱：x 不動、y 變號"; }
    else if (kind === 1) { ans = "$(" + (-x) + "," + y + ")$"; tip = "對 y 軸對稱：y 不動、x 變號"; }
    else { ans = "$(" + (-x) + "," + (-y) + ")$"; tip = "對原點對稱：兩個座標都變號"; }
    var all = ["$(" + x + "," + (-y) + ")$", "$(" + (-x) + "," + y + ")$",
               "$(" + (-x) + "," + (-y) + ")$", "$(" + y + "," + x + ")$"];
    return mk("graph", "function.coord", 7,
      "點 $(" + x + "," + y + ")$ 對 " + ["$x$ 軸", "$y$ 軸", "原點"][kind] + "對稱的點是？",
      ans, all.filter(function (a) { return a !== ans; }), tip);
  }

  function gSlope() {
    var m = pick([1, 2, 3, -1, -2, -3]), b = ri(11) - 5;
    if (b === 0 || b === m || b === -m) b = Math.abs(m) + 5;   /* 避免 (0,b) 與誘答重疊 */
    var mode = ri(3);
    var eq = "y = " + (m === 1 ? "" : m === -1 ? "-" : m) + "x " + (b < 0 ? "-" : "+") + " " + Math.abs(b);
    if (mode === 0) {
      return mk("graph", "function.linear", 8,
        "$" + eq + "$ 的圖形中，$x$ 每增加 1，$y$ 增加多少？", String(m),
        [String(b), String(-m), String(m + b)],
        "$y=ax+b$ 中 $x$ 的係數 $a$ 就是「$x$ 增加 1 時 $y$ 的增加量」→ " + m);
    }
    if (mode === 1) {
      return mk("graph", "function.linear", 8, "$" + eq + "$ 與 y 軸的交點座標？",
        "$(0," + b + ")$", ["$(" + b + ",0)$", "$(0," + m + ")$", "$(0," + (-b) + ")$"],
        "與 y 軸相交 → 代 $x=0$ → $y=" + b + "$");
    }
    var x1 = ri(9) - 4, dx = pick([1, 2, -1, -2]);
    var x2 = x1 + dx, y1 = ri(9) - 4, y2 = y1 + dx * m;
    return mk("graph", "function.linear", 8,
      "直線過 $(" + x1 + "," + y1 + ")$、$(" + x2 + "," + y2 + ")$，"
      + "$x$ 每增加 1 時 $y$ 增加多少？", String(m),
      [String(-m), String(y2 - y1), String(x2 - x1)],
      "$y$ 的變化量 ÷ $x$ 的變化量 $=\\dfrac{" + (y2 - y1) + "}{" + (x2 - x1) + "}=" + m + "$");
  }

  function gQuadFn() {
    var a = pick([1, 2, 3, -1, -2, -3, 0.5, -0.5]);
    var mode = ri(3);
    /* a = ±1 時係數不寫出來，才不會出現「1x²」 */
    var aTex = a === 0.5 ? "\\dfrac{1}{2}" : a === -0.5 ? "-\\dfrac{1}{2}"
      : a === 1 ? "" : a === -1 ? "-" : String(a);
    if (mode === 0) {
      return mk("graph", "function.quadfn", 9, "$y = " + aTex + "x^2$ 的開口方向？",
        a > 0 ? "向上" : "向下", [a > 0 ? "向下" : "向上", "向左", "向右"],
        "$a" + (a > 0 ? ">" : "<") + "0$ → 開口" + (a > 0 ? "向上" : "向下") + "，跟 a 的大小無關");
    }
    if (mode === 1) {
      var b = pick([2, 3, 4].filter(function (v) { return v !== Math.abs(a); }));
      var mine = "y=" + aTex + "x^2", other = "y=" + b + "x^2";
      var narrow = Math.abs(a) > b ? mine : other;
      return mk("graph", "function.quadfn", 9,
        "$" + mine + "$ 與 $" + other + "$，哪一條的開口比較窄？",
        "$" + narrow + "$",
        ["$" + (narrow === mine ? other : mine) + "$", "兩條一樣寬", "無法比較"],
        "$|a|$ 越大開口越窄（只看絕對值，正負只決定朝上朝下）");
    }
    var h = (ri(9) - 4) || 3, k = (ri(9) - 4) || 2;
    return mk("graph", "function.quadfn", 9,
      "$y = " + aTex + "(x" + (h < 0 ? "+" + (-h) : "-" + h) + ")^2 " + (k < 0 ? "-" + (-k) : "+" + k) + "$ 的頂點座標？",
      "$(" + h + "," + k + ")$",
      ["$(" + (-h) + "," + k + ")$", "$(" + h + "," + (-k) + ")$", "$(" + (-h) + "," + (-k) + ")$"],
      "$y=a(x-h)^2+k$ 的頂點是 $(h,k)$：括號裡的號相反，外面的不變");
  }

  /* ══════════════ 三、圖形性質（產生器） ══════════════ */

  function gPolyAngle() {
    var n = 5 + ri(8);
    var mode = ri(3);
    if (mode === 0) {
      return mkDeg("geo", "quad.poly", 8, "$" + n + "$ 邊形的內角和 = ?", (n - 2) * 180,
        [n * 180, (n - 1) * 180, 360],
        "內角和 $=(n-2)\\times180^\\circ=(" + n + "-2)\\times180^\\circ$（從一個頂點可以切出 " + (n - 2) + " 個三角形）");
    }
    if (mode === 1) {
      return mkDeg("geo", "quad.poly", 8, "正 $" + n + "$ 邊形的一個外角 = ?", 360 / n,
        [(n - 2) * 180 / n, 180 / n, 360],
        "外角和永遠是 $360^\\circ$ → 一個外角 $=360^\\circ\\div" + n + "$");
    }
    return mkDeg("geo", "quad.poly", 8, "正 $" + n + "$ 邊形的一個內角 = ?", (n - 2) * 180 / n,
      [360 / n, (n - 2) * 180, 180 - 720 / n],
      "一個內角 $=180^\\circ-$ 一個外角 $=180^\\circ-" + r1(360 / n) + "^\\circ$");
  }

  function gParallelAngle() {
    var x = 30 + ri(110);
    if (x === 90) x = 65;                       /* 90° 時「相等」與「互補」同值 */
    var kind = ri(3);
    var names = ["同位角", "內錯角", "同側內角"];
    var ans = kind === 2 ? 180 - x : x;
    return mkDeg("geo", "angle.parallel", 8,
      "兩直線平行，$\\angle 1 = " + x + "^\\circ$，與它成「" + names[kind] + "」的角 = ?",
      ans, [kind === 2 ? x : 180 - x, 90, 360 - x],
      kind === 2 ? "同側內角<b>互補</b>：$180^\\circ-" + x + "^\\circ$" : names[kind] + "<b>相等</b>");
  }

  function gTriAngle() {
    var a = 20 + ri(80), b = 20 + ri(180 - a - 21);
    var mode = ri(3);
    if (mode === 0) {
      return mkDeg("geo", "angle.tri", 8,
        "三角形兩內角是 $" + a + "^\\circ$、$" + b + "^\\circ$，第三個內角 = ?",
        180 - a - b, [a + b, 360 - a - b, 90],
        "三角形內角和 $=180^\\circ$");
    }
    if (mode === 1) {
      return mkDeg("geo", "angle.tri", 8,
        "三角形的一個外角 = 兩個不相鄰內角 $" + a + "^\\circ$、$" + b + "^\\circ$，這個外角 = ?",
        a + b, [180 - a - b, 180 - a, (a + b) / 2],
        "外角定理：外角 = 兩個<b>不相鄰</b>內角的和");
    }
    var top = 20 + ri(120);
    return mkDeg("geo", "angle.tri", 8,
      "等腰三角形的頂角是 $" + top + "^\\circ$，一個底角 = ?",
      (180 - top) / 2, [180 - top, top, 90 - top / 2 + 10],
      "兩底角相等：$(180^\\circ-" + top + "^\\circ)\\div2$");
  }

  var TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15], [20, 21, 29], [12, 16, 20]];
  function gPyth() {
    var t = pick(TRIPLES);
    if (ri(2)) {
      return mk("geo", "similar.pyth", 8,
        "直角三角形兩股長 $" + t[0] + "$、$" + t[1] + "$，斜邊長 = ?", String(t[2]),
        [String(t[0] + t[1]), String(t[2] - 1), String(t[1] - t[0])],
        "$" + t[0] + "^2+" + t[1] + "^2=" + (t[0] * t[0] + t[1] * t[1]) + "=" + t[2] + "^2$");
    }
    return mk("geo", "similar.pyth", 8,
      "直角三角形斜邊長 $" + t[2] + "$、一股長 $" + t[1] + "$，另一股 = ?", String(t[0]),
      [String(t[2] - t[1]), String(t[2] + t[1]), String(t[0] + 1)],
      "$" + t[2] + "^2-" + t[1] + "^2=" + (t[2] * t[2] - t[1] * t[1]) + "=" + t[0] + "^2$（斜邊是最長的那一邊）");
  }
  function gPythInv() {
    var t = pick(TRIPLES);
    var d = pick([-2, -1, 0, 0, 1, 2]);
    var c = t[2] + d;
    var lhs = t[0] * t[0] + t[1] * t[1], rhs = c * c;
    var ans = lhs === rhs ? "直角三角形" : lhs > rhs ? "銳角三角形" : "鈍角三角形";
    return mk("geo", "similar.pyth", 8,
      "三邊長 $" + t[0] + ", " + t[1] + ", " + c + "$ 的三角形是？（$" + c + "$ 為最長邊）",
      ans, ["直角三角形", "銳角三角形", "鈍角三角形", "不能構成三角形"]
        .filter(function (x) { return x !== ans; }),
      "畢氏逆定理：$" + t[0] + "^2+" + t[1] + "^2=" + lhs + "$，$" + c + "^2=" + rhs + "$ → " +
      (lhs === rhs ? "相等，是直角" : lhs > rhs ? "左邊大，最大角是銳角" : "右邊大，最大角是鈍角"));
  }

  function gCircleAngle() {
    var mode = ri(3);
    if (mode === 0) {
      var x = 2 * (20 + ri(70));
      if (x === 120) x = 100;                  /* x/2 與 180−x 同值 */
      return mkDeg("geo", "circle.angle", 9,
        "同一段弧所對的圓心角是 $" + x + "^\\circ$，圓周角 = ?", x / 2,
        [x, 2 * x, 180 - x], "圓周角 = 圓心角的一半（同一段弧）");
    }
    if (mode === 1) {
      return mkDeg("geo", "circle.angle", 9, "直徑所對的圓周角 = ?", 90,
        [60, 180, 45], "半圓所對的圓周角一定是直角——看到直徑就想到 $90^\\circ$");
    }
    var a = 40 + ri(100);
    if (a === 90) a = 70;                      /* 90° 時對角也是 90° */
    return mkDeg("geo", "circle.angle", 9,
      "圓內接四邊形的一個內角是 $" + a + "^\\circ$，它的對角 = ?", 180 - a,
      [a, 360 - a, 90], "圓內接四邊形：<b>對角互補</b>（相加 $180^\\circ$）");
  }

  function gArcSector() {
    var r = pick([3, 4, 6, 9, 12]);            /* 不放 2：r=2 時弧長與扇形面積同值 */
    var deg = pick([30, 45, 60, 90, 120, 180]);
    /* 候選誘答給多一點，mk 會挑出前三個相異的（半徑與角度的組合偶爾會撞號） */
    var cands = ["$" + frac(r * r * deg, 360) + "\\pi$", "$" + (2 * r) + "\\pi$", "$" + (r * r) + "\\pi$",
                 "$" + frac(r * deg, 360) + "\\pi$", "$" + frac(2 * r * deg, 180) + "\\pi$",
                 "$" + r + "\\pi$", "$" + frac(r * r * deg, 720) + "\\pi$"];
    if (ri(2)) {
      return mk("geo", "circle.arc", 9,
        "半徑 $" + r + "$、圓心角 $" + deg + "^\\circ$ 的弧長 = ?",
        "$" + frac(2 * r * deg, 360) + "\\pi$", cands,
        "弧長 $=2\\pi r\\times\\dfrac{" + deg + "}{360}$");
    }
    return mk("geo", "circle.arc", 9,
      "半徑 $" + r + "$、圓心角 $" + deg + "^\\circ$ 的扇形面積 = ?",
      "$" + frac(r * r * deg, 360) + "\\pi$",
      ["$" + frac(2 * r * deg, 360) + "\\pi$"].concat(cands),
      "扇形面積 $=\\pi r^2\\times\\dfrac{" + deg + "}{360}$");
  }

  function gSimRatio() {
    var a = 1 + ri(5), b = a + 1 + ri(4);
    if (ri(2)) {
      return mk("geo", "similar.sim", 9,
        "兩相似三角形的邊長比是 $" + a + ":" + b + "$，面積比 = ?",
        "$" + (a * a) + ":" + (b * b) + "$",
        ["$" + a + ":" + b + "$", "$" + (a * a * a) + ":" + (b * b * b) + "$", "$" + (2 * a) + ":" + (2 * b) + "$"],
        "面積比 = 邊長比的<b>平方</b>：$" + a + "^2:" + b + "^2$");
    }
    return mk("geo", "similar.sim", 9,
      "兩相似立體的邊長比是 $" + a + ":" + b + "$，體積比 = ?",
      "$" + (a * a * a) + ":" + (b * b * b) + "$",
      ["$" + (a * a) + ":" + (b * b) + "$", "$" + a + ":" + b + "$", "$" + (3 * a) + ":" + (3 * b) + "$"],
      "體積比 = 邊長比的<b>立方</b>：$" + a + "^3:" + b + "^3$");
  }

  function gSolid() {
    var r = pick([2, 3, 4, 5, 6]), h = pick([3, 4, 6, 9, 12]);
    var mode = ri(2);
    var P = function (x) { return "$" + (typeof x === "string" ? x : x) + "\\pi$"; };
    if (mode === 0) {
      return mk("geo", "solid.prism", 9,
        "底半徑 $" + r + "$、高 $" + h + "$ 的圓柱體積 = ?", P(r * r * h),
        [P(frac(r * r * h, 3)), P(2 * r * h), P(r * h), P(2 * r * r * h), P(r * r), P(r * r * h * 3)],
        "柱體體積 = 底面積 × 高 $=\\pi\\times" + r + "^2\\times" + h + "$");
    }
    return mk("geo", "solid.pyramid", 9,
      "底半徑 $" + r + "$、高 $" + h + "$ 的圓錐體積 = ?", P(frac(r * r * h, 3)),
      [P(r * r * h), P(frac(r * r * h, 2)), P(frac(2 * r * h, 3)), P(r * h), P(frac(r * r * h, 6))],
      "錐體是同底同高柱體的 $\\dfrac{1}{3}$");
  }

  /* ══════════════ 四、圖形性質（手寫） ══════════════ */
  /* [單元id, 年級, 題目, 正解, [三個誘答], 理由] */
  var GEO = [
    ["quad.para", 8, "已知 ABCD 是平行四邊形，下列哪一項<b>一定</b>成立？",
      "對角線互相平分", ["對角線互相垂直", "對角線等長", "四邊等長"],
      "平行四邊形：兩組對邊平行且相等、兩組對角相等、對角線互相平分。垂直是菱形、等長是矩形"],
    ["quad.special", 8, "菱形的對角線有什麼性質？",
      "互相垂直平分", ["等長但不垂直", "只平分不垂直", "與邊平行"],
      "菱形面積也可以用「對角線相乘 ÷ 2」算"],
    ["quad.special", 8, "矩形的對角線有什麼性質？",
      "等長且互相平分", ["互相垂直", "垂直且等長", "平分內角"],
      "矩形＝有一個直角的平行四邊形；等長是它獨有的（正方形才又垂直）"],
    ["quad.special", 8, "正方形的對角線有什麼性質？",
      "等長、互相垂直平分，且平分內角", ["只有等長", "只有垂直", "與邊等長"],
      "正方形同時是矩形也是菱形，兩邊的性質全部繼承"],
    ["quad.trap", 8, "等腰梯形有什麼性質？",
      "同一底上的兩底角相等，且兩對角線等長", ["對角線互相平分", "對角線互相垂直", "兩腰平行"],
      "梯形只有一組對邊平行；兩腰平行的話就變成平行四邊形了"],
    ["quad.trap", 8, "三角形兩邊中點的連線段有什麼性質？",
      "平行第三邊，且長度是第三邊的一半", ["等於第三邊", "垂直第三邊", "平分第三邊的角"],
      "中點連線定理；看到「兩個中點」就想到它"],
    ["angle.cong", 8, "兩個三角形三邊對應相等，可以判定全等嗎？用哪一個？",
      "可以，SSS", ["可以，SAS", "可以，AAA", "不一定全等"],
      "三邊定了形狀就定了；AAA 只能判定<b>相似</b>不能判定全等"],
    ["angle.cong", 8, "兩邊及<b>夾角</b>對應相等，用哪一個判別法？",
      "SAS", ["SSA", "ASA", "AAS"],
      "角必須是<b>兩邊夾的</b>那個角；不是夾角（SSA）不成立"],
    ["angle.cong", 8, "兩角及<b>夾邊</b>對應相等，用哪一個判別法？",
      "ASA", ["AAS", "SAS", "SSS"],
      "邊在兩角中間是 ASA；邊不在中間是 AAS（兩者其實都能用，因為第三角自動相等）"],
    ["angle.cong", 8, "兩個直角三角形的斜邊與一股對應相等，用哪一個判別法？",
      "RHS", ["SSA，所以不成立", "SAS", "AAS"],
      "直角是 SSA 唯一的例外：有直角時斜邊與一股就能鎖定形狀"],
    ["angle.cong", 8, "兩邊及<b>非夾角</b>對應相等（SSA），一定全等嗎？",
      "不一定，可能有兩種三角形", ["一定全等", "一定不全等", "只在鈍角時全等"],
      "SSA 會出現「模稜兩可」：兩個可能的角互補。只有直角時（RHS）才唯一"],
    ["similar.sim", 9, "兩個三角形有兩組角對應相等，可以判定？",
      "相似（AA）", ["全等（AAA）", "不能判定", "只有等腰時才相似"],
      "角決定形狀不決定大小；要全等還需要一組邊"],
    ["angle.tri", 8, "三角形任意兩邊之和與第三邊的關係？",
      "兩邊之和 > 第三邊", ["兩邊之和 = 第三邊", "兩邊之和 < 第三邊", "沒有一定關係"],
      "三角形不等式；判斷「三個長度能不能圍成三角形」就靠它（檢查最長邊即可）"],
    ["angle.tri", 8, "三角形中，大邊對的角與小邊對的角，哪個大？",
      "大邊對大角", ["小邊對大角", "一樣大", "與邊長無關"],
      "邊角大小順序一致；等腰三角形兩腰等長 → 兩底角相等就是特例"],
    ["angle.center", 9, "三角形三條<b>中線</b>的交點叫什麼？有什麼性質？",
      "重心，把每條中線分成 2:1", ["外心，到三頂點等距", "內心，到三邊等距", "垂心"],
      "重心離頂點比較遠的那段是 2、靠邊的那段是 1"],
    ["angle.center", 9, "三角形三邊<b>中垂線</b>的交點叫什麼？",
      "外心，到三頂點等距", ["內心，到三邊等距", "重心", "垂心"],
      "到三頂點等距 → 可以當外接圓圓心"],
    ["angle.center", 9, "三角形三個<b>內角平分線</b>的交點叫什麼？",
      "內心，到三邊等距", ["外心，到三頂點等距", "重心", "垂心"],
      "到三邊等距 → 可以當內切圓圓心"],
    ["circle.parts", 9, "從圓心向弦作垂線，會發生什麼？",
      "平分這條弦", ["平分這條弦所對的圓周角", "與弦等長", "通過弦的一端"],
      "垂徑定理：圓心 → 弦的垂線平分弦，也平分弧"],
    ["circle.tangent", 9, "圓的切線與過切點的半徑有什麼關係？",
      "互相垂直", ["互相平行", "夾 45°", "等長"],
      "看到切線就把半徑畫出來，馬上得到一個直角"],
    ["circle.tangent", 9, "從圓外一點向圓作兩條切線，兩條切線長的關係？",
      "相等", ["其中一條較長", "和為直徑", "無法確定"],
      "切線長相等；連圓心後兩個直角三角形全等（RHS）"],
    ["angle.parallel", 8, "要證明兩直線平行，可以用什麼？",
      "同位角相等（或內錯角相等、同側內角互補）", ["兩線都很長", "同側內角相等", "同位角互補"],
      "平行的判別與性質是反過來用的同一組角"],
    ["angle.basic", 7, "兩角互餘是什麼意思？",
      "兩角相加等於 90°", ["兩角相加等於 180°", "兩角相等", "兩角相加等於 360°"],
      "互<b>餘</b> 90°、互<b>補</b> 180°，兩個字很容易記反"],
    ["quad.para", 8, "要證明一個四邊形是平行四邊形，下列哪一個<b>不夠</b>？",
      "一組對邊平行、另一組對邊相等", ["兩組對邊分別平行", "一組對邊平行且相等", "對角線互相平分"],
      "「一組平行、另一組相等」可能是等腰梯形——這是最常見的陷阱"],
    ["stat.center", 8, "一組資料每一筆都加上 5，會怎樣？",
      "平均數加 5，全距不變", ["平均數與全距都加 5", "平均數不變、全距加 5", "兩者都不變"],
      "整體平移不改變資料的分散程度（全距不變）"]
  ];

  /* ══════════════ 五、公式辨識（手寫） ══════════════ */
  var FORMULA = [
    ["algebra.mul", 8, "$a^2+2ab+b^2$ 可以寫成？", "$(a+b)^2$", ["$(a-b)^2$", "$a^2+b^2$", "$(a+b)(a-b)$"],
      "完全平方公式；中間是 $+2ab$ 就是 $(a+b)^2$"],
    ["algebra.mul", 8, "$a^2-2ab+b^2$ 可以寫成？", "$(a-b)^2$", ["$(a+b)^2$", "$a^2-b^2$", "$(a-b)(a+b)$"],
      "中間是 $-2ab$ → 括號裡就是減號"],
    ["algebra.factor", 8, "$a^2-b^2$ 可以分解成？", "$(a+b)(a-b)$", ["$(a-b)^2$", "$(a+b)^2$", "不能分解"],
      "平方差公式，是國中最常用的分解招式"],
    ["algebra.factor", 8, "$x^2+(p+q)x+pq$ 可以分解成？", "$(x+p)(x+q)$", ["$(x+p)(x-q)$", "$(x+pq)(x+p+q)$", "$(x+p)^2$"],
      "十字交乘的原理：相乘得常數項、相加得一次項係數"],
    ["similar.pyth", 8, "直角三角形中的 $a^2+b^2=c^2$ 是什麼？", "畢氏定理",
      ["相似形的性質", "三角形不等式", "中點連線定理"],
      "c 必須是<b>斜邊</b>（最長邊）"],
    ["circle.parts", 9, "$\\pi r^2$ 是什麼？", "圓面積", ["圓周長", "圓柱側面積", "扇形面積"],
      "圓周長是 $2\\pi r$，兩個很容易記反：面積有平方"],
    ["circle.parts", 9, "$2\\pi r$ 是什麼？", "圓周長", ["圓面積", "直徑", "弧長"],
      "圓周長 = 直徑 × π = $2\\pi r$"],
    ["circle.arc", 9, "$2\\pi r\\times\\dfrac{\\theta}{360}$ 是什麼？", "弧長", ["扇形面積", "圓面積", "圓心角"],
      "先算這個扇形佔整個圓的幾分之幾，再乘整圓的量"],
    ["circle.arc", 9, "$\\pi r^2\\times\\dfrac{\\theta}{360}$ 是什麼？", "扇形面積", ["弧長", "圓周長", "圓心角"],
      "同一個「佔幾分之幾」的想法，乘的是圓面積"],
    ["solid.prism", 9, "「底面積 × 高」是什麼？", "柱體體積", ["錐體體積", "柱體表面積", "柱體側面積"],
      "所有柱體（圓柱、角柱）通用"],
    ["solid.pyramid", 9, "「底面積 × 高 ÷ 3」是什麼？", "錐體體積", ["柱體體積", "柱體側面積", "錐體表面積"],
      "同底同高時，錐體是柱體的三分之一"],
    ["solid.pyramid", 9, "$\\pi r\\ell$ 是什麼？（$\\ell$ 為母線）", "圓錐的側面積",
      ["圓錐的底面積", "圓柱的側面積", "圓錐的體積"],
      "側面攤開是扇形；底面積是 $\\pi r^2$，別跟側面積搞混"],
    ["quad.poly", 8, "$(n-2)\\times180^\\circ$ 是什麼？", "n 邊形的內角和", ["n 邊形的外角和", "正 n 邊形的一個內角", "n 邊形的對角線數"],
      "從一個頂點切成 $(n-2)$ 個三角形"],
    ["quad.poly", 8, "多邊形的外角和是多少？", "$360^\\circ$（與邊數無關）", ["$(n-2)\\times180^\\circ$", "$180^\\circ$", "隨邊數增加"],
      "繞一圈剛好轉回原方向，所以永遠是 $360^\\circ$"],
    ["equation.quad", 8, "$x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$ 是什麼？", "一元二次方程式的公式解",
      ["判別式", "根與係數關係", "配方法"],
      "分解不出來時就用它；分母是 $2a$ 不是 $2$"],
    ["equation.quad", 8, "$b^2-4ac$ 是什麼？", "判別式（決定實根個數）", ["公式解", "兩根之和", "兩根之積"],
      "$>0$ 兩相異實根、$=0$ 重根、$<0$ 沒有實根"],
    ["quad.trap", 8, "「(上底 + 下底) × 高 ÷ 2」是什麼？", "梯形面積", ["平行四邊形面積", "菱形面積", "三角形面積"],
      "也可以看成「中線 × 高」"],
    ["quad.special", 8, "「兩對角線相乘 ÷ 2」是什麼？", "菱形（或箏形）的面積", ["矩形面積", "梯形面積", "平行四邊形面積"],
      "對角線互相垂直的四邊形都適用"],
    ["algebra.seq", 8, "$a_1+(n-1)d$ 是什麼？", "等差數列的第 n 項", ["等差級數的和", "公差", "等比數列的第 n 項"],
      "是 $(n-1)$ 個公差，不是 n 個"],
    ["algebra.seq", 8, "$\\dfrac{n(a_1+a_n)}{2}$ 是什麼？", "等差級數前 n 項的和", ["第 n 項", "平均數", "公差"],
      "「首末相加乘項數除以二」，就是高斯配對的做法"],
    ["function.quadfn", 9, "$y=a(x-h)^2+k$ 中的 $(h,k)$ 是什麼？", "拋物線的頂點", ["與 y 軸的交點", "與 x 軸的交點", "對稱軸的位置"],
      "括號裡的號要相反：$(x-h)$ 對應 $x=h$"],
    ["stat.prob", 9, "「有利情形數 ÷ 全部情形數」是什麼？", "機率", ["次數", "相對次數", "百分比"],
      "前提是每個結果<b>等機會</b>發生"],
    ["stat.center", 8, "「所有資料相加 ÷ 筆數」是什麼？", "平均數", ["中位數", "眾數", "全距"],
      "中位數要先排序取中間、眾數是出現最多次的"],
    ["similar.sim", 9, "相似形邊長比 $k$，面積比是多少？", "$k^2$", ["$k$", "$k^3$", "$2k$"],
      "面積是二維 → 平方；體積是三維 → 立方"],
    ["number.root", 8, "$\\sqrt{a^2}$ 等於什麼？", "$|a|$", ["$a$", "$\\pm a$", "$a^2$"],
      "根號的結果不會是負的，所以要加絕對值"],
    ["number.exp", 7, "$a^0$（$a\\neq0$）等於多少？", "$1$", ["$0$", "$a$", "沒有意義"],
      "從 $a^n\\div a^n=a^0$ 就能推出來"]
  ];

  /* ══════════════ 六、關鍵字反射（手寫） ══════════════ */
  var KEYWORD = [
    ["number.int", 7, "看到 $-3^2$ 與 $(-3)^2$", "分清楚：前者是 $-9$、後者是 $9$",
      ["兩個都是 9", "兩個都是 −9", "兩個都要先算負號"],
      "沒有括號時「次方先做」，負號留到最後"],
    ["number.int", 7, "要求兩個數的最大公因數", "短除法（或質因數分解取共同質因數的最低次方）",
      ["把兩數相乘", "把兩數相減", "取比較小的那個數"],
      "最小公倍數則是所有質因數取最高次方"],
    ["number.ratio", 7, "題目說「甲乙的比是 3:4」", "設成 $3k$ 與 $4k$",
      ["設成 3 和 4", "設成 $x$ 和 $x+1$", "設成 $x$ 和 $\\dfrac{3}{4}x$，然後不管 k"],
      "設 k 之後總量、差量都能用 k 表示，一個未知數就解決"],
    ["number.ratio", 7, "看到比例式 $a:b=c:d$", "交叉相乘：$ad=bc$",
      ["$ac=bd$", "$a+d=b+c$", "$a-b=c-d$"],
      "內項相乘 = 外項相乘"],
    ["number.exp", 7, "要比較很大或很小的兩個數", "都化成科學記號，先比 10 的次方",
      ["直接數位數", "四捨五入到整數", "取倒數再比"],
      "次方一樣大時才比前面的數字"],
    ["number.root", 8, "根號裡有平方因數（如 $\\sqrt{48}$）", "把平方因數開出來，化成最簡根式",
      ["直接按計算機取小數", "拆成 $\\sqrt{40}+\\sqrt{8}$", "兩邊平方"],
      "$\\sqrt{48}=\\sqrt{16\\times3}=4\\sqrt{3}$；根號不能拆成加法"],
    ["number.root", 8, "分母有根號（如 $\\dfrac{1}{\\sqrt{2}}$）", "分母有理化：分子分母同乘那個根號",
      ["直接約掉根號", "分子分母同時平方", "把根號移到分子外面"],
      "$\\dfrac{1}{\\sqrt2}=\\dfrac{\\sqrt2}{2}$；答案通常要求分母不含根號"],
    ["algebra.mul", 8, "要展開 $(a+b)^2$", "平方 + 兩倍乘積 + 平方，共三項",
      ["$a^2+b^2$ 兩項就好", "$a^2+ab+b^2$", "$2a+2b$"],
      "漏掉中間的 $2ab$ 是國中最常見的錯誤"],
    ["algebra.factor", 8, "因式分解的第一步", "先看有沒有<b>公因式</b>可以提",
      ["直接十字交乘", "先套平方差", "先移項"],
      "提完公因式之後才輪到平方差、完全平方、十字交乘"],
    ["algebra.factor", 8, "看到 $x^2-$（某個平方數）", "平方差公式 $(x+a)(x-a)$",
      ["完全平方公式", "十字交乘找兩個數", "不能分解"],
      "只有<b>相減</b>才能用平方差；$x^2+a^2$ 在國中不能分解"],
    ["equation.linear1", 7, "應用題不知道要設什麼", "問什麼就設什麼，再把題目翻成等量關係",
      ["設最大的那個量", "設 x 和 y 兩個未知數", "先猜一個答案代代看"],
      "列式的關鍵是找到「什麼 = 什麼」的那一句話"],
    ["equation.linear2", 7, "兩個未知數、兩個式子", "加減消去法或代入消去法",
      ["兩式相乘", "先猜一個未知數", "分別解兩個一元一次方程式"],
      "係數相同或成倍數時用加減；有一式已經解出某個未知數時用代入"],
    ["equation.quad", 8, "拿到一元二次方程式", "先移項成 $=0$，再試著因式分解",
      ["直接用公式解", "兩邊開根號", "兩邊同除 x"],
      "兩邊同除 x 會<b>弄丟 x=0 這個根</b>；分解不出來才用公式解"],
    ["equation.ineq", 7, "不等式兩邊同乘或同除<b>負數</b>", "不等號方向要反過來",
      ["方向不變", "改成等號", "兩邊都變號但不等號不變"],
      "這是不等式與方程式唯一的差別，考試最愛考"],
    ["equation.ineq", 7, "不等式的解要畫在數線上", "空心圈表示不含（&lt;、&gt;），實心點表示包含（≤、≥）",
      ["一律用實心點", "一律用空心圈", "兩端都要畫箭頭"],
      "有等號就把那個點塗滿"],
    ["function.coord", 7, "點 $(a,b)$ 對 x 軸對稱", "y 座標變號 → $(a,-b)$",
      ["x 座標變號", "兩個都變號", "交換 x 與 y"],
      "對誰對稱，另一個座標就變號：對 x 軸 → 動 y"],
    ["function.linear", 8, "給兩個點求直線方程式", "把兩點分別代入 $y=ax+b$，解聯立求出 $a$ 與 $b$",
      ["直接把兩點相加", "設 $y=ax^2+b$", "求中點"],
      "也可以先算「$x$ 增加 1 時 $y$ 的增加量」得到 $a$，再代一點求 $b$"],
    ["function.linear", 8, "題目說兩直線<b>平行</b>", "兩個 $a$ 相同、$b$ 不同",
      ["兩個 $a$ 相乘 = −1", "兩個 $a$ 互為倒數", "兩個 $b$ 相同"],
      "$y=ax+b$ 中 $a$ 相同、$b$ 也相同的話會變成同一條線（重合）"],
    ["function.quadfn", 9, "$y=ax^2$ 中的 $|a|$ 變大", "開口變窄",
      ["開口變寬", "圖形往上移", "頂點會移動"],
      "$y=ax^2$ 的頂點永遠在原點；$a$ 只管開口方向與寬窄"],
    ["angle.parallel", 8, "圖上有平行線", "馬上找同位角、內錯角（相等）與同側內角（互補）",
      ["先量角度", "先證全等", "先用畢氏定理"],
      "平行線題型幾乎都靠這三組角搬運角度"],
    ["angle.parallel", 8, "有平行線但角度搬不過去", "過那個點作一條平行的輔助線",
      ["直接放棄用其他方法", "把圖形旋轉", "假設角度是 90°"],
      "作平行輔助線把折線拆成兩組平行線截角"],
    ["angle.tri", 8, "看到三角形的<b>外角</b>", "外角 = 兩個不相鄰內角的和",
      ["外角 = 內角和的一半", "外角 = 相鄰內角", "外角一定是 90°"],
      "也可以用「外角 + 相鄰內角 = 180°」推出來"],
    ["angle.tri", 8, "給兩邊長，問第三邊可能是多少", "介於「兩邊之差」與「兩邊之和」之間",
      ["等於兩邊之和", "小於兩邊之差", "任何正數都可以"],
      "三角形不等式，選擇題常拿來刪答案"],
    ["angle.cong", 8, "要證明兩線段（或兩角）相等", "先證兩個三角形全等，再用「對應邊／對應角相等」",
      ["直接用尺量", "假設它們相等再驗證", "用相似就夠了"],
      "相似只能得到「成比例」，要相等必須全等"],
    ["quad.para", 8, "要證明四邊形是平行四邊形", "用五個判別法之一（兩組對邊平行／兩組對邊相等／一組對邊平行且相等／對角線互相平分／兩組對角相等）",
      ["只要有一組對邊平行", "只要對角線相等", "只要有兩個直角"],
      "「一組對邊平行、另一組對邊相等」不夠——可能是等腰梯形"],
    ["quad.trap", 8, "圖上出現兩個<b>中點</b>", "中點連線定理：平行第三邊且等於一半",
      ["畢氏定理", "先證全等", "用相似比 1:3"],
      "看到中點就把連線畫出來，常常一畫就解決"],
    ["quad.poly", 8, "求正 n 邊形的一個內角", "先用外角：$180^\\circ-\\dfrac{360^\\circ}{n}$",
      ["$(n-2)\\times180^\\circ$", "$\\dfrac{360^\\circ}{n}$", "$\\dfrac{180^\\circ}{n}$"],
      "也可以用 $\\dfrac{(n-2)\\times180^\\circ}{n}$，但走外角通常比較快"],
    ["circle.angle", 9, "同一段弧所對的圓周角", "都相等，且等於圓心角的一半",
      ["都等於圓心角", "隨位置不同而不同", "都是 90°"],
      "圓周角定理；「同弧」是前提"],
    ["circle.angle", 9, "圖上出現<b>直徑</b>", "直徑所對的圓周角是 $90^\\circ$",
      ["直徑所對的圓周角是 $180^\\circ$", "直徑會平分所有弦", "直徑與切線平行"],
      "看到直徑就先把那個直角標起來，常常可以接畢氏定理"],
    ["circle.tangent", 9, "圖上出現<b>切線</b>", "連圓心到切點，得到一個直角",
      ["連圓心到切線兩端", "直接用弧長公式", "假設切線與直徑平行"],
      "切線⊥半徑；這條輔助線幾乎是切線題的標準第一步"],
    ["circle.arc", 9, "求弧長或扇形面積", "先算圓心角佔 $360^\\circ$ 的幾分之幾",
      ["直接乘半徑", "用畢氏定理", "先求圓周角"],
      "弧長乘 $2\\pi r$、面積乘 $\\pi r^2$，同一個比例"],
    ["similar.pyth", 8, "直角三角形要求邊長", "畢氏定理，先確認哪一邊是<b>斜邊</b>",
      ["用相似比", "用內角和推算", "假設一定是 3:4:5"],
      "斜邊是直角對面那一邊，也是最長的一邊"],
    ["similar.pyth", 8, "給三邊長，問是不是直角三角形", "畢氏逆定理：最長邊平方 vs 另兩邊平方和",
      ["三邊相加看是不是 180", "看有沒有 3、4、5", "量角度"],
      "相等是直角、左邊大是銳角、右邊大是鈍角"],
    ["similar.sim", 9, "兩個相似圖形問面積", "面積比 = 邊長比的平方",
      ["面積比 = 邊長比", "面積比 = 邊長比的立方", "面積比要另外量"],
      "立方是體積比；這兩個最常搞混"],
    ["similar.sim", 9, "圖上有平行線切出兩個三角形", "找 AA 相似，再列對應邊比例式",
      ["直接用全等", "用畢氏定理", "假設是等腰"],
      "平行 → 同位角相等 → 兩組角相等 → AA 相似"],
    ["solid.prism", 9, "求柱體的表面積", "兩個底面積 + 側面積（側面攤開是長方形）",
      ["底面積 × 高", "底面周長 × 高 ÷ 3", "底面積 × 2"],
      "圓柱側面攤開後的長 = 底面圓周長 $2\\pi r$"],
    ["solid.prism", 9, "題目給「容器裝水的高度」要求體積", "底面積 × 水的高度（不是容器的高）",
      ["底面積 × 容器高", "容器體積 ÷ 2", "底面周長 × 水高"],
      "倒水、放入物體使水面上升的題目，變化量也是用「底面積 × 上升高度」"],
    ["stat.center", 8, "資料筆數是偶數，要求中位數", "排序後取中間兩筆的<b>平均</b>",
      ["取中間偏左那一筆", "取眾數", "取平均數"],
      "不論奇偶，第一步都是<b>排序</b>"],
    ["stat.center", 8, "有一筆資料特別大（極端值）", "用中位數當代表值比平均數合適",
      ["用平均數比較準", "把極端值刪掉再算平均", "改用眾數"],
      "平均數會被極端值拉走，中位數不會"],
    ["stat.prob", 9, "算機率之前要先確認", "每個結果是不是<b>等機會</b>發生",
      ["結果總數是不是偶數", "有沒有超過 1", "資料有沒有排序"],
      "不等機會時不能直接用「有利 ÷ 全部」"],
    ["stat.prob", 9, "問「至少一個」的機率", "用 $1-$（一個都沒有的機率）",
      ["把每種情形一個一個加", "用乘法", "用平均數"],
      "反面只有一種情形，最好算"]
  ];

  /* ══════════════ 補充題源 ══════════════
   * 目標：每個單元至少 4 個題源，單元練習才不會一直碰到同一題。 */

  /* 角的關係：餘角、補角、對頂角（七年級） */
  function gAngleBasic() {
    var x = 10 + ri(70);
    var mode = ri(3);
    if (mode === 0) {
      return mkDeg("geo", "angle.basic", 7, "$" + x + "^\\circ$ 的餘角 = ?", 90 - x,
        [180 - x, x, 90 + x], "互<b>餘</b>是相加 $90^\\circ$（互<b>補</b>才是 $180^\\circ$）");
    }
    if (mode === 1) {
      var y = 10 + ri(160);
      return mkDeg("geo", "angle.basic", 7, "$" + y + "^\\circ$ 的補角 = ?", 180 - y,
        [90 - y, y, 360 - y], "互補是相加 $180^\\circ$");
    }
    var z = 20 + ri(140);
    return mkDeg("geo", "angle.basic", 7,
      "兩直線相交，其中一個角是 $" + z + "^\\circ$，它的<b>對頂角</b> = ?", z,
      [180 - z, 90 - z, 360 - z], "對頂角相等；與它相鄰的角才是補角（$180^\\circ-" + z + "^\\circ$）");
  }

  /* 二元一次聯立：係數不同的加減消去（七年級） */
  function gLinear2b() {
    var x = ri(9) - 4, y = ri(9) - 4;
    var a = 1 + ri(3), b = 1 + ri(3), c = 1 + ri(3), d = -(1 + ri(3));
    var e1 = a * x + b * y, e2 = c * x + d * y;
    var t = function (n, v) { return (n < 0 ? "-" : "+") + (Math.abs(n) === 1 ? "" : Math.abs(n)) + v; };
    return mk("calc", "equation.linear2", 7,
      "$\\begin{cases} " + (a === 1 ? "" : a) + "x" + t(b, "y") + "=" + e1 +
      " \\\\ " + (c === 1 ? "" : c) + "x" + t(d, "y") + "=" + e2 + " \\end{cases}$，$x = \\ ?$",
      String(x), [String(y), String(x + y), String(e1 - e2)],
      "把兩式的 y 係數湊成相反數再相加（或用代入消去），解得 $x=" + x + "$、$y=" + y + "$");
  }

  /* 三角形的重心：中線 2:1（九年級） */
  function gCentroid() {
    var m = 3 * (2 + ri(6));
    if (ri(2)) {
      return mk("geo", "angle.center", 9,
        "三角形的一條中線長 $" + m + "$，重心到<b>頂點</b>的距離 = ?", String(2 * m / 3),
        [String(m / 3), String(m / 2), String(m)],
        "重心把中線分成 2:1，靠頂點那段是 $\\dfrac{2}{3}$ → $" + m + "\\times\\dfrac{2}{3}$");
    }
    return mk("geo", "angle.center", 9,
      "三角形的一條中線長 $" + m + "$，重心到<b>對邊中點</b>的距離 = ?", String(m / 3),
      [String(2 * m / 3), String(m / 2), String(m)],
      "靠邊那段是 $\\dfrac{1}{3}$ → $" + m + "\\times\\dfrac{1}{3}$");
  }

  /* 代數式化簡：合併同類項與代入求值（七年級） */
  function gExprSimplify() {
    var a = 1 + ri(6), b = 1 + ri(6), c = 1 + ri(6), d = 1 + ri(6);
    if (ri(2)) {
      return mk("calc", "algebra.expr", 7,
        "化簡 $" + a + "x + " + b + "y - " + c + "x + " + d + "y = \\ ?$",
        (a - c === 0 ? "" : (a - c) + "x") + ((b + d) > 0 && (a - c) !== 0 ? " + " : "") + (b + d) + "y",
        [(a + c) + "x + " + (b + d) + "y", (a - c) + "x - " + (b + d) + "y",
         (a + b + c + d) + "xy"].map(function (s) { return "$" + s + "$"; })
          .concat(["$" + (a - c) + "x + " + (b + d - 1) + "y$"]),
        "只有<b>同類項</b>才能合併：x 歸 x、y 歸 y，$" + a + "-" + c + "=" + (a - c) + "$");
    }
    var x = ri(9) - 4;
    return mk("calc", "algebra.expr", 7,
      "當 $x=" + x + "$ 時，$" + a + "x^2 - " + b + "x$ 的值 = ?",
      String(a * x * x - b * x),
      [String(a * x * x + b * x), String((a * x) * (a * x) - b * x), String(a * x - b * x)],
      "先算 $x^2=" + (x * x) + "$（負數平方是正的），再代入：$" + a + "\\times" + (x * x) +
      " - " + b + "\\times(" + x + ")$");
  }

  GEO = GEO.concat([
    ["solid.prism", 9, "$n$ 角柱有幾個<b>面</b>？",
      "$n+2$ 個（n 個側面 + 上下兩個底面）", ["$n$ 個", "$2n$ 個", "$n+1$ 個"],
      "頂點 $2n$ 個、邊 $3n$ 條；$n$ 角錐則是 $n+1$ 個面"],
    ["angle.basic", 7, "兩直線相交形成的四個角中，「對頂角」有什麼性質？",
      "相等", ["互補", "互餘", "相加 360°"],
      "相鄰的兩個角才互補；對頂角（正對面那個）相等"],
    ["circle.parts", 9, "圓心到弦的距離（弦心距）愈長，弦會怎樣？",
      "愈短", ["愈長", "不變", "與直徑等長"],
      "弦心距、半徑、半弦長構成直角三角形：$r^2=d^2+\\left(\\dfrac{弦}{2}\\right)^2$"],
    ["circle.tangent", 9, "兩圓<b>外切</b>時，圓心距 $d$ 與兩半徑的關係？",
      "$d=r_1+r_2$", ["$d=|r_1-r_2|$", "$d=0$", "$d>r_1+r_2$"],
      "外離 $d>r_1+r_2$、外切 $=$、相交介於中間、內切 $d=|r_1-r_2|$、內離更小"],
    ["quad.para", 8, "平行四邊形的兩組<b>對角</b>有什麼關係？",
      "對角相等、鄰角互補", ["四個角都相等", "對角互補", "鄰角相等"],
      "四個角都相等的話就是矩形了"],
    ["function.quadfn", 9, "$y=ax^2$ 的圖形對稱軸是哪一條？",
      "$y$ 軸（$x=0$）", ["$x$ 軸", "$y=x$", "沒有對稱軸"],
      "頂點在原點；平移成 $y=a(x-h)^2+k$ 後對稱軸才變成 $x=h$"],
    ["angle.center", 9, "三角形的<b>內心</b>到三邊的距離有什麼特性？",
      "三段距離相等（可以當內切圓半徑）", ["到三頂點等距", "把中線分成 2:1", "一定在三角形外"],
      "外心才是到三頂點等距；鈍角三角形的外心會跑到外面"]
  ]);

  FORMULA = FORMULA.concat([
    ["equation.linear1", 7, "解方程式時「兩邊同加同減、同乘同除（不為 0）」的依據是什麼？",
      "等量公理", ["移項法則", "分配律", "交換律"],
      "移項其實就是兩邊同加同減的簡寫，所以過去的項要變號"],
    ["algebra.seq", 8, "等差數列中 $a_{n+1}-a_n$ 是什麼？", "公差 $d$", ["首項", "項數", "總和"],
      "差固定是等差；比固定才是等比"],
    ["circle.parts", 9, "$r^2=d^2+\\left(\\dfrac{L}{2}\\right)^2$（d 為弦心距、L 為弦長）是什麼？",
      "半徑、弦心距與半弦長的關係", ["圓面積公式", "扇形面積公式", "切線長公式"],
      "本質就是畢氏定理，求弦長的題目幾乎都靠它"],
    ["number.int", 7, "$|a-b|$ 在數線上代表什麼？", "a 與 b 兩點的距離",
      ["a 與 b 的和", "a、b 的中點", "a 到原點的距離"],
      "$|a|$ 就是 a 到原點（0）的距離，是它的特例"]
  ]);

  KEYWORD = KEYWORD.concat([
    ["equation.linear1", 7, "方程式裡有分數係數", "兩邊同乘所有分母的最小公倍數，先把分數清掉",
      ["直接通分後只留分子", "把分母移到等號另一邊", "四捨五入成整數"],
      "同乘時<b>每一項</b>都要乘，包括沒有分母的常數項"],
    ["equation.linear1", 7, "題目問「幾年後父親年齡是兒子的 2 倍」", "設 x 年後，兩人年齡都要加 x 再列式",
      ["只把父親的年齡加 x", "設父親年齡為 x", "用比例式直接算"],
      "年齡問題的陷阱是「兩個人都會變老」"],
    ["equation.linear2", 7, "聯立方程式中有一式已經是 $y=\\ldots$ 的形式", "用代入消去法最快",
      ["一定要用加減消去", "兩式相乘", "先畫圖找交點"],
      "係數成倍數時用加減；已經解出一個未知數時用代入"],
    ["angle.basic", 7, "題目說某條射線是「角平分線」", "把該角分成兩個相等的角，設成 $x$ 與 $x$",
      ["分成互補的兩個角", "把角變成 90°", "與對頂角相等"],
      "配合三角形內角和，常常一條等式就解出來"],
    ["circle.tangent", 9, "問兩圓有幾個交點", "比較圓心距 $d$ 與 $r_1+r_2$、$|r_1-r_2|$",
      ["比較兩圓半徑大小", "聯立兩圓方程式", "比較兩圓面積"],
      "相交 2 個、相切 1 個、外離或內離 0 個"],
    ["function.quadfn", 9, "$y=ax^2$ 要平移", "左右加在 $x$ 上（號相反）、上下加在最後面",
      ["左右加在最後面", "上下乘在 $a$ 上", "平移不會改變頂點"],
      "$y=a(x-h)^2+k$：右移 h、上移 k"],
    ["stat.center", 8, "看到「累積次數分配圖」要找中位數", "找累積相對次數到達 0.5 的那一組",
      ["找最高的那一組", "取全距的一半", "把所有組中點平均"],
      "最高的那一組是<b>眾數</b>所在，不是中位數"],
    ["stat.chart", 7, "資料要看「各部分佔整體的比例」", "用圓形圖（百分比、圓心角 = 比例 × 360°)",
      ["用折線圖", "用直方圖", "用莖葉圖"],
      "折線圖看趨勢、長條圖比大小、圓形圖看佔比"],
    ["stat.chart", 7, "要看「隨時間變化的趨勢」", "用折線圖",
      ["用圓形圖", "用長條圖", "用直方圖"],
      "折線越陡，代表變化越快"],
    ["stat.chart", 7, "直方圖與長條圖有什麼不同", "直方圖的長條相鄰（處理連續型分組資料）",
      ["兩者完全相同", "直方圖的長條一定要分開", "長條圖只能畫百分比"],
      "分組資料是連續的，所以直方圖沒有間隔"],
    ["similar.pyth", 8, "求「正方體對角線長」", "連兩次畢氏定理，邊長 $a$ 時對角線 $=\\sqrt{3}\\,a$",
      ["$2a$", "$\\sqrt{2}\\,a$", "$3a$"],
      "先求底面對角線 $\\sqrt2 a$，再與高組成直角三角形"],
    ["algebra.expr", 7, "化簡代數式的第一步", "把<b>同類項</b>合併（文字與次方都一樣才算同類）",
      ["把所有項相加", "把文字都改成 x", "先代數字進去"],
      "$3x$ 與 $3x^2$ 不是同類項，不能合併"],
    ["algebra.expr", 7, "要把數字代進一個很長的代數式", "先化簡，再代入",
      ["直接代入硬算", "先把每一項分別代入再相加", "先把式子平方"],
      "化簡後常常只剩兩三項，計算量差很多也不容易算錯"],
    ["algebra.expr", 7, "去括號時括號前面是負號", "括號裡<b>每一項</b>都要變號",
      ["只有第一項變號", "只有最後一項變號", "括號直接去掉就好"],
      "$-(a-b)=-a+b$，漏掉第二項是最常見的錯誤"],
    ["equation.ineq", 7, "解出 $x>2.4$，但題目問「最少幾個」", "答案要取<b>整數解</b>：最少 3 個",
      ["答 2.4 個", "四捨五入成 2 個", "答 2 個"],
      "應用題的答案必須符合實際意義（人數、個數不能是小數）"],
    ["function.coord", 7, "求兩點 $(a,c)$ 與 $(b,c)$ 的距離（y 相同）", "$|a-b|$，就是水平方向的距離",
      ["$|a+b|$", "$|c|$", "$\\sqrt{a^2+b^2}$"],
      "同一條水平線或鉛直線上的兩點，距離就是另一個座標的差的絕對值"],
    ["circle.angle", 9, "同一段弧所對的圓周角，位置不同時", "大小都相等",
      ["離弧愈近的角愈大", "全部都是 90°", "會互補"],
      "所以看到「同弧」就可以把角度搬到方便計算的位置"]
  ]);

  /* ══════════════ 依 113 年版單元對照表補齊 ══════════════
   * 比對三大書商（翰林／康軒／南一）113 年版單元後，補上原本沒有題目的部分：
   * 正比與反比、線對稱、三視圖、垂直平分線與角平分線、連比例與比例線段、多項式的乘除。 */

  /* 正比與反比（七下 3-2） */
  function gProportion() {
    var k = 2 + ri(8), x1 = 1 + ri(5), x2 = x1 + 1 + ri(4);
    if (ri(2)) {
      return mk("calc", "number.ratio", 7,
        "$y$ 與 $x$ 成<b>正比</b>，$x=" + x1 + "$ 時 $y=" + (k * x1) + "$，則 $x=" + x2 + "$ 時 $y = \\ ?$",
        String(k * x2),
        [String(k * x1 + (x2 - x1)), String(k * x1 * x2), String(k)],
        "正比 $y=kx$：先由 $" + (k * x1) + "=k\\times" + x1 + "$ 求出 $k=" + k + "$");
    }
    var p = k * x1 * x2;
    return mk("calc", "number.ratio", 7,
      "$y$ 與 $x$ 成<b>反比</b>，$x=" + x1 + "$ 時 $y=" + (p / x1) + "$，則 $x=" + x2 + "$ 時 $y = \\ ?$",
      String(p / x2),
      [String(p * x2), String(p / x1 - (x2 - x1)), String(p)],
      "反比 $y=\\dfrac{k}{x}$：乘積固定 $=" + p + "$，所以 $y=" + p + "\\div" + x2 + "$");
  }

  GEO = GEO.concat([
    ["angle.basic", 7, "線對稱圖形沿對稱軸對摺後會怎樣？",
      "兩邊完全重合", ["面積變成一半", "變成全等的兩個三角形才算", "周長不變但形狀改變"],
      "對稱軸垂直平分每一組對應點的連線"],
    ["angle.parallel", 8, "兩直線被截線所截，若<b>同側內角互補</b>，可以推出什麼？",
      "這兩條直線平行", ["這兩條直線垂直", "這兩條直線相交", "無法判斷"],
      "這是平行線的<b>判別</b>（性質是反過來用）"],
    ["angle.tri", 8, "線段<b>垂直平分線</b>上的點有什麼性質？",
      "到線段兩端點等距", ["到線段兩端的連線互相垂直", "到線段中點最遠", "在線段上"],
      "反過來也成立：到兩端等距的點一定在中垂線上（外心就是這樣來的）"],
    ["angle.tri", 8, "<b>角平分線</b>上的點有什麼性質？",
      "到角的兩邊等距", ["到角的頂點等距", "到兩邊的連線等長", "把對邊平分"],
      "反過來也成立：到兩邊等距的點在角平分線上（內心就是這樣來的）"],
    ["angle.center", 9, "幾何證明中要說明「兩線段相等」，最常見的做法是？",
      "先證兩個三角形全等，再說對應邊相等", ["用尺量再說明", "假設相等後推出矛盾即可", "只要看起來相等就好"],
      "推理與證明的核心：每一步都要有性質或判別法當理由"],
    ["circle.angle", 9, "圓周角所對的弧愈大，圓周角會？",
      "愈大（圓周角與弧成正比）", ["愈小", "不變", "與弧無關"],
      "圓周角 = 圓心角的一半，而圓心角與弧成正比"],
    ["quad.poly", 8, "多邊形邊數增加時，外角和會怎樣？",
      "永遠是 $360^\\circ$，不會改變", ["跟著變大", "跟著變小", "等於內角和"],
      "內角和才會隨邊數增加（每多一邊多 $180^\\circ$）"],
    ["solid.pyramid", 9, "同底同高的柱體與錐體，體積關係為？",
      "錐體是柱體的 $\\dfrac{1}{3}$", ["錐體是柱體的 $\\dfrac{1}{2}$", "兩者相等", "錐體是柱體的 $\\dfrac{2}{3}$"],
      "所以錐體體積公式才會多一個 $\\dfrac{1}{3}$"],
    ["angle.life", 7, "從正前方、正上方、正側方看一個立體所畫出的圖，合稱為？",
      "三視圖", ["透視圖", "展開圖", "截面圖"],
      "三視圖只記錄輪廓與長度，不畫遠近變形"],
    ["solid.prism", 9, "$n$ 角柱有幾個<b>面</b>？",
      "$n+2$ 個（n 個側面 + 上下兩底面）", ["$n$ 個", "$2n$ 個", "$n+1$ 個"],
      "頂點 $2n$ 個、邊 $3n$ 條；$n$ 角錐則是 $n+1$ 個面"],
    ["stat.chart", 7, "長條圖與圓形圖，哪一種比較適合比較「各項的多寡」？",
      "長條圖（比高度最直接）", ["圓形圖", "折線圖", "兩者一樣好"],
      "圓形圖強調的是「佔整體的比例」，不是絕對數量"]
  ]);

  FORMULA = FORMULA.concat([
    ["number.ratio", 7, "$y=kx$（k 為定值）代表什麼關係？", "正比", ["反比", "平方關係", "一次函數的截距"],
      "正比圖形是過原點的直線；反比 $y=\\dfrac{k}{x}$ 的圖形是雙曲線"],
    ["number.ratio", 7, "$xy=k$（k 為定值）代表什麼關係？", "反比", ["正比", "相等", "一次函數"],
      "反比的特徵是「乘積固定」，所以 x 變兩倍時 y 變一半"],
    ["similar.sim", 9, "$a:b=c:d=e:f$ 這種寫法叫什麼？", "連比例",
      ["比例中項", "相似比", "倒數關係"],
      "連比例常寫成 $a:c:e=b:d:f$，可以設成 $ak,\\ ck,\\ ek$ 來解"],
    ["similar.sim", 9, "平行線截兩條直線所得的對應線段", "成比例（平行線截比例線段）",
      ["長度相等", "互相垂直", "和為定值"],
      "這是相似三角形最常用的來源"],
    ["function.linear", 8, "$y=ax+b$ 中的 $b$ 代表什麼？", "圖形與 y 軸交點的 y 座標（截距）",
      ["圖形與 x 軸交點", "斜率", "圖形的最低點"],
      "代 $x=0$ 就看得出來；$a$ 才是斜率"],
    ["algebra.mul", 8, "多項式除法中的「被除式 = 除式 × 商式 + 餘式」", "除法原理",
      ["乘法公式", "因式定理", "分配律"],
      "餘式的次數一定要比除式低"]
  ]);

  KEYWORD = KEYWORD.concat([
    ["number.ratio", 7, "題目說「兩量成反比」", "乘積固定：$x_1y_1=x_2y_2$",
      ["相除固定", "相加固定", "相減固定"],
      "正比是「相除固定」$\\dfrac{y}{x}=k$，兩者剛好相反"],
    ["angle.basic", 7, "題目給線對稱圖形問對應點座標", "對稱軸垂直平分兩對應點的連線",
      ["兩對應點到原點等距", "兩對應點的座標相加為 0", "對稱軸通過原點"],
      "對 x 軸對稱動 y、對 y 軸對稱動 x"],
    ["angle.tri", 8, "題目要求「用尺規作圖」作出角平分線", "以頂點為圓心畫弧，再以兩交點為圓心畫等半徑弧",
      ["用量角器量一半", "隨手畫一條中線", "作對邊的中垂線"],
      "尺規作圖只能用<b>無刻度直尺與圓規</b>，作法背後就是全等（SSS）"],
    ["angle.life", 7, "題目給三視圖要還原立體形狀", "先由俯視圖決定底面排列，再用前視／側視圖決定高度",
      ["先數總方塊數", "從透視圖推回去", "假設是正方體"],
      "三視圖的每個方向只看得到輪廓，要三個一起對照"],
    ["algebra.mul", 8, "多項式相乘後要檢查有沒有算錯", "看最高次項與常數項（首尾兩項最好驗算）",
      ["把 x 代 0 就夠了", "數一數項數", "看係數是否為整數"],
      "代 $x=1$ 檢查係數和也是很快的驗算法"]
  ]);

  /* ────────── 題源索引 ────────── */
  var GENS = {
    calc: [
      { f: gIntArith, w: 4, ts: ["number.int"] },
      { f: gAbs,      w: 2, ts: ["number.int"] },
      { f: gGcdLcm,   w: 2, ts: ["number.int"] },
      { f: gFrac,     w: 3, ts: ["number.ratio"] },
      { f: gRatio,    w: 2, ts: ["number.ratio"] },
      { f: gExpLaw,   w: 3, ts: ["number.exp"] },
      { f: gSci,      w: 2, ts: ["number.exp"] },
      { f: gRoot,     w: 2, ts: ["number.root"] },
      { f: gRootOp,   w: 3, ts: ["number.root"] },
      { f: gSqrtEst,  w: 1, ts: ["number.root"] },
      { f: gExpand,   w: 3, ts: ["algebra.mul"] },
      { f: gFactor,   w: 3, ts: ["algebra.factor"] },
      { f: gLinear1,  w: 2, ts: ["equation.linear1"] },
      { f: gLinear2,  w: 2, ts: ["equation.linear2"] },
      { f: gQuad,     w: 2, ts: ["equation.quad"] },
      { f: gIneq,     w: 2, ts: ["equation.ineq"] },
      { f: gSeq,      w: 2, ts: ["algebra.seq"] },
      { f: gStat,     w: 2, ts: ["stat.center"] },
      { f: gProb,     w: 2, ts: ["stat.prob"] },
      /* 補充：讓題源太少的單元也練得下去 */
      { f: gExprSimplify, w: 2, ts: ["algebra.expr"] },
      { f: gLinear2b,     w: 2, ts: ["equation.linear2"] },
      { f: gProportion,   w: 2, ts: ["number.ratio"] }
    ],
    graph: [
      { f: gQuadrantPt, w: 2, ts: ["function.coord"] },
      { f: gSymPt,      w: 2, ts: ["function.coord"] },
      { f: gSlope,      w: 3, ts: ["function.linear"] },
      { f: gQuadFn,     w: 3, ts: ["function.quadfn"] }
    ],
    geo: [
      { f: gPolyAngle,     w: 2, ts: ["quad.poly"] },
      { f: gParallelAngle, w: 2, ts: ["angle.parallel"] },
      { f: gTriAngle,      w: 2, ts: ["angle.tri"] },
      { f: gPyth,          w: 2, ts: ["similar.pyth"] },
      { f: gPythInv,       w: 1, ts: ["similar.pyth"] },
      { f: gCircleAngle,   w: 2, ts: ["circle.angle"] },
      { f: gArcSector,     w: 2, ts: ["circle.arc"] },
      { f: gSimRatio,      w: 1, ts: ["similar.sim"] },
      { f: gSolid,         w: 2, ts: ["solid.prism", "solid.pyramid"] },
      { f: gAngleBasic,    w: 2, ts: ["angle.basic"] },
      { f: gCentroid,      w: 2, ts: ["angle.center"] }
    ]
  };
  var STATICS = { keyword: KEYWORD, formula: FORMULA, geo: GEO };

  /* geo 同時有產生器與手寫題 */
  function inScope(id, set) { return !set || set.has(id); }
  function statRows(cat, set) {
    return (STATICS[cat] || []).filter(function (r) { return inScope(r[0], set); });
  }
  function genList(cat, set) {
    return (GENS[cat] || []).filter(function (g) {
      return g.ts.some(function (t) { return inScope(t, set); });
    });
  }
  function pickW(list) {
    var total = 0, i;
    for (i = 0; i < list.length; i++) total += list[i].w;
    var r = Math.random() * total;
    for (i = 0; i < list.length; i++) { r -= list[i].w; if (r <= 0) return list[i]; }
    return list[list.length - 1];
  }

  /* ────────── 對外 API ────────── */
  window.REFLEX_BANK = {
    cats: CATS,
    grades: [7, 8, 9],
    gradeName: { 7: "七年級", 8: "八年級", 9: "九年級" },

    labelOf: function (id) {
      var t = TMAP[id];
      return t ? t.d + "｜" + t.n : id;
    },
    shortOf: function (id) {
      var t = TMAP[id];
      return t ? t.n : id;
    },
    pageOf: function (id) {
      if (!TMAP[id]) return null;
      var p = id.split(".");
      return "branch.html#d=" + p[0] + "&t=" + p[1];
    },

    /* 有題目的單元清單，n = 題源數 */
    topics: function () {
      var idx = {};
      function bump(t) { idx[t] = (idx[t] || 0) + 1; }
      Object.keys(STATICS).forEach(function (c) { STATICS[c].forEach(function (r) { bump(r[0]); }); });
      Object.keys(GENS).forEach(function (c) { GENS[c].forEach(function (g) { g.ts.forEach(bump); }); });
      return TOPICS.filter(function (t) { return idx[t.id]; })
        .map(function (t) { return { id: t.id, d: t.d, n: t.n, g: t.g, num: idx[t.id] }; });
    },

    /* 範圍 → Set（null = 不限）。topic 可傳單一 id 或 id 陣列（複選） */
    scopeSet: function (kind, val) {
      if (kind === "all") return null;
      if (kind === "topic") return new Set(Array.isArray(val) ? val : [val]);
      var s = new Set();
      this.topics().forEach(function (t) { if (String(t.g) === String(val)) s.add(t.id); });
      return s;
    },

    availableCats: function (set) {
      return CATS.filter(function (c) {
        return statRows(c.id, set).length > 0 || genList(c.id, set).length > 0;
      }).map(function (c) { return c.id; });
    },

    /* 出一題；範圍內出不了題時回傳 null */
    make: function (cat, set) {
      var rows = statRows(cat, set);
      var gs = genList(cat, set);
      if (!rows.length && !gs.length) return null;
      /* geo 兩者都有時，各半 */
      var useStatic = rows.length && (!gs.length || Math.random() < 0.5);
      if (useStatic) {
        var r = rows[ri(rows.length)];
        return mk(cat, r[0], r[1], r[2], r[3], r[4], r[5]);
      }
      for (var i = 0; i < 40; i++) {
        var it = pickW(gs).f();
        if (inScope(it.t, set)) return it;
      }
      return null;
    },

    size: { keyword: KEYWORD.length, formula: FORMULA.length, geo: GEO.length }
  };
})();
