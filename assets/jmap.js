/* 國中數學｜工具地圖引擎
 *
 * 與高中版（高中數學教學系統/assets/map.js）的三個差異：
 *   1. 版本切換由「完整版／學測版」改成「年級」——資料裡每個主題都有 g: 7|8|9。
 *   2. 工具多了 fig 欄位，指向 data/figs.js 裡的 SVG；抽屜與總表都會把圖畫出來。
 *   3. 幾何領域（domain.geo === true）的分支頁預設用「圖卡模式」而非表格。
 *
 * 樹的形狀固定三層：根 → 分支 → 葉。左右各半，欄位對齊。
 */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var FS_ROOT = 20, FS_BR = 16, FS_LF = 14;
  var ROW = 34, GAP = 20, PADX = 14;
  var BP = 860;                        // 小於這個寬度自動改用清單模式
  var VIEW_KEY = "jhmath.view";        // 'auto' | 'map' | 'list'
  var GRADE_KEY = "jhmath.grade";      // 'all' | '7' | '8' | '9'

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/\n/g, " ");
  }
  function viewPref() {
    try { return localStorage.getItem(VIEW_KEY) || "auto"; } catch (e) { return "auto"; }
  }
  function setViewPref(v) { try { localStorage.setItem(VIEW_KEY, v); } catch (e) {} }
  function viewMode() {
    var p = viewPref();
    if (p === "map" || p === "list") return p;
    return window.innerWidth < BP ? "list" : "map";
  }

  /* ── 年級 ── */
  function grade() {
    try {
      var g = localStorage.getItem(GRADE_KEY);
      return (g === "7" || g === "8" || g === "9") ? g : "all";
    } catch (e) { return "all"; }
  }
  function setGrade(v) { try { localStorage.setItem(GRADE_KEY, v); } catch (e) {} }
  function gradeList(g) { return g == null ? null : (Array.isArray(g) ? g : [g]); }
  function gradeHit(g, want) {
    var l = gradeList(g);
    if (!l) return true;                       // 沒標年級的一律保留
    return l.indexOf(+want) > -1;
  }
  var GRADE_NAME = { "7": "七年級", "8": "八年級", "9": "九年級" };
  function gradeTag(g) {
    var l = gradeList(g);
    if (!l) return "";
    return l.map(function (x) { return GRADE_NAME[x] || ("G" + x); }).join("・");
  }

  /* 目前年級下可用的領域清單（所有渲染函式都用它，不要直接用 TOOLMAP.domains） */
  function domains() {
    var all = (window.TOOLMAP && TOOLMAP.domains) || [];
    var want = grade();
    if (want === "all") return all;
    var out = [];
    all.forEach(function (d) {
      var topics = [];
      (d.topics || []).forEach(function (t) {
        if (!gradeHit(t.g, want)) return;
        var tools = (t.tools || []).filter(function (x) { return gradeHit(x.g, want); });
        if (!tools.length) return;
        topics.push(assign(t, "tools", tools));
      });
      if (topics.length) out.push(assign(d, "topics", topics));
    });
    return out;
  }
  function assign(obj, key, val) {
    var o = {}, k;
    for (k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) o[k] = obj[k];
    o[key] = val;
    return o;
  }

  /* ── 圖 ── */
  function figSVG(id) { return (window.FIGS && window.FIGS[id]) || ""; }
  function figHTML(id, cls) {
    var s = figSVG(id);
    if (!s) return "";
    return '<div class="fig ' + (cls || "") + '">' + s + "</div>";
  }
  function figCount() {
    var n = 0, k;
    for (k in (window.FIGS || {})) n++;
    return n;
  }
  /* 寬型的圖（例如「兩圓的五種位置關係」）在單欄卡片裡會縮到看不清楚，
   * 讓它在格線裡橫跨兩欄。判斷依據是 SVG 的 viewBox 寬度。 */
  function figWide(id) {
    var m = /viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/.exec(figSVG(id) || "");
    return !!m && +m[1] >= 400 && +m[1] / +m[2] >= 1.5;
  }

  /* 心智圖的節點是純 SVG 文字，不會渲染 LaTeX。
   * 名稱裡若不小心留了 $...$，$ 會原樣顯示出來，所以畫之前先脫掉。 */
  function plain(s) {
    return String(s == null ? "" : s).replace(/\$([^$]*)\$/g, "$1").replace(/\$/g, "");
  }

  /* 估算文字寬度：CJK 視為 1 em，半形視為 0.56 em */
  function textW(s, fs) {
    var w = 0;
    for (var i = 0; i < s.length; i++) w += (s.charCodeAt(i) > 0x2e80) ? 1 : 0.56;
    return w * fs;
  }
  function el(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function shade(hex, amt) {  // amt<1 變深、>1 變亮（往白）
    var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    function m(v) {
      var x = amt <= 1 ? v * amt : v + (255 - v) * (amt - 1);
      return Math.max(0, Math.min(255, Math.round(x)));
    }
    return "rgb(" + m(r) + "," + m(g) + "," + m(b) + ")";
  }

  /* ── 心智圖繪製 ──
   * root = { label, children:[ { label, color, children:[{label}] } ] }
   * onPick(node) 於點擊節點時呼叫
   */
  function drawMindmap(mountId, root, onPick) {
    var mount = document.getElementById(mountId);
    if (!mount) return;
    mount.innerHTML = "";

    var brs = root.children || [];
    // 量寬與繪製都用脫掉數學符號的標籤
    root.label = plain(root.label);
    brs.forEach(function (b) {
      b.label = plain(b.label);
      (b.children || []).forEach(function (k) { k.label = plain(k.label); });
    });
    var leafOf = function (b) { return Math.max(1, (b.children || []).length); };
    var total = brs.reduce(function (s, b) { return s + leafOf(b); }, 0);
    var right = [], left = [], acc = 0;
    brs.forEach(function (b) {
      if (acc < total / 2) { right.push(b); acc += leafOf(b); }
      else left.push(b);
    });

    var rootW = textW(root.label, FS_ROOT) + 34;
    var maxBrW = 0, maxLfW = 0;
    brs.forEach(function (b) {
      maxBrW = Math.max(maxBrW, textW(b.label, FS_BR) + PADX * 2);
      (b.children || []).forEach(function (l) {
        maxLfW = Math.max(maxLfW, textW(l.label, FS_LF) + PADX * 2);
      });
    });

    var COL1 = rootW / 2 + 66;
    var COL2 = COL1 + maxBrW + 74;
    var halfW = COL2 + maxLfW + 30;
    var W = halfW * 2;

    function stack(list) {
      var y = 0, out = [];
      list.forEach(function (b) {
        var kids = b.children || [], h = Math.max(1, kids.length) * ROW;
        var item = { b: b, y: y + h / 2, kids: [] };
        kids.forEach(function (k, i) { item.kids.push({ k: k, y: y + (i + 0.5) * ROW }); });
        out.push(item);
        y += h + GAP;
      });
      return { items: out, h: Math.max(0, y - GAP) };
    }
    var R = stack(right), L = stack(left);
    var H = Math.max(R.h, L.h, 120) + 80;
    var cy = H / 2;
    var offR = cy - R.h / 2, offL = cy - L.h / 2;

    var svg = el("svg", { width: W, height: H, viewBox: "0 0 " + W + " " + H });
    var cx = W / 2;

    function box(g, x, y, w, h, fill, stroke, rx) {
      g.appendChild(el("rect", { x: x, y: y - h / 2, width: w, height: h, rx: rx, fill: fill, stroke: stroke, "stroke-width": 1.5 }));
    }
    function label(g, x, y, s, fs, fill, anchor, weight) {
      var t = el("text", { x: x, y: y + fs * 0.35, "font-size": fs, fill: fill, "text-anchor": anchor || "middle" });
      if (weight) t.setAttribute("font-weight", weight);
      t.textContent = s;
      g.appendChild(t);
    }
    function link(x1, y1, x2, y2, color, w) {
      var mx = (x1 + x2) / 2;
      svg.appendChild(el("path", {
        d: "M" + x1 + "," + y1 + " C" + mx + "," + y1 + " " + mx + "," + y2 + " " + x2 + "," + y2,
        stroke: color, "stroke-width": w, class: "mm-link", "stroke-linecap": "round", opacity: .75
      }));
    }

    function side(pack, off, dir) {  // dir = +1 右、-1 左
      pack.items.forEach(function (it) {
        var b = it.b, by = it.y + off;
        var bw = textW(b.label, FS_BR) + PADX * 2;
        var bx = dir > 0 ? cx + COL1 : cx - COL1 - bw;
        var col = b.color || "#2563eb";

        link(cx + dir * (rootW / 2), cy, dir > 0 ? bx : bx + bw, by, col, 3);

        var g = el("g", { class: "mm-node" });
        box(g, bx, by, bw, 30, shade(col, 1.86), col, 9);
        label(g, bx + bw / 2, by, b.label, FS_BR, shade(col, .68), "middle", 700);
        if (onPick) g.addEventListener("click", function () { onPick(b); });
        svg.appendChild(g);

        it.kids.forEach(function (kk) {
          var ky = kk.y + off, k = kk.k;
          var kw = textW(k.label, FS_LF) + PADX * 2;
          var kx = dir > 0 ? cx + COL2 : cx - COL2 - kw;
          link(dir > 0 ? bx + bw : bx, by, dir > 0 ? kx : kx + kw, ky, col, 1.8);
          var gk = el("g", { class: "mm-node leaf" });
          box(gk, kx, ky, kw, 26, "#ffffff", shade(col, 1.55), 7);
          label(gk, kx + kw / 2, ky, k.label, FS_LF, "#374151", "middle");
          if (onPick) gk.addEventListener("click", function () { onPick(k); });
          svg.appendChild(gk);
        });
      });
    }
    side(R, offR, 1);
    side(L, offL, -1);

    var gr = el("g", { class: "mm-node" });
    box(gr, cx - rootW / 2, cy, rootW, 46, "#5c222b", "#3f161d", 14);   // 牛夫子酒紅
    label(gr, cx, cy, root.label, FS_ROOT, "#ffffff", "middle", 800);
    svg.appendChild(gr);

    mount.appendChild(svg);
    return svg;
  }

  /* ── 明細抽屜 ── */
  function ensureDrawer() {
    var d = document.getElementById("mmDrawer");
    if (d) return d;
    d = document.createElement("div");
    d.id = "mmDrawer";
    d.className = "mm-drawer";
    d.innerHTML = '<div class="dw-head"><h3 id="dwTitle"></h3>' +
      '<button class="dw-x" id="dwX">✕</button></div><div class="dw-body" id="dwBody"></div>';
    document.body.appendChild(d);
    d.querySelector("#dwX").addEventListener("click", function () { d.classList.remove("open"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") d.classList.remove("open"); });
    return d;
  }

  function sec(labCls, labTxt, html, cls) {
    if (!html) return "";
    return '<div class="dw-sec"><div class="dw-lab ' + labCls + '">' + labTxt + '</div>' +
      '<div class="' + (cls || "dw-txt") + '">' + html + "</div></div>";
  }

  /* tool = {n,f,w,l,t,x,fig,g}
   * 除了 fig（我們自己產生的 SVG）以外，所有欄位都要經過 esc()：
   * 數學敘述裡的 "<"（如 $0<a<1$）若直接塞進 innerHTML，會被當成標籤起始而吃掉後面的內容。
   */
  function openTool(tool, path) {
    var d = ensureDrawer();
    d.querySelector("#dwTitle").innerHTML =
      esc(tool.n) +
      (tool.g ? '<span class="g-chip">' + esc(gradeTag(tool.g)) + "</span>" : "") +
      (path ? '<div class="h-p" style="font-weight:400">' + esc(path) + "</div>" : "");
    var html =
      (tool.fig ? '<div class="dw-sec">' + figHTML(tool.fig, "fig-lg") + "</div>" : "") +
      // 幾何圖形一律「先定義、再性質」
      sec("lab-d", "定義", esc(tool.d), "dw-def") +
      sec("lab-f", tool.d ? "性質／公式" : "公式／敘述",
        tool.f ? "$$" + esc(tool.f) + "$$" : "", "dw-formula") +
      sec("lab-w", "什麼時候用", esc(tool.w)) +
      sec("lab-l", "限制／前提", esc(tool.l)) +
      // 「常見錯誤」配一隻瞪大眼睛的牛夫子，讓最該記住的那一欄最醒目
      sec("lab-t", "常見錯誤",
        tool.t ? '<img class="cow-mini" src="assets/mascot/web/cow_float.png" alt="瞪大眼睛的牛夫子">' + esc(tool.t) : "") +
      sec("lab-x", "延伸連結", esc(tool.x));
    var body = d.querySelector("#dwBody");
    body.innerHTML = html || '<p class="dw-txt">（此節點為分類，點它下面的葉節點看工具細節）</p>';
    if (window.renderMathInElement) {
      renderMathInElement(body, {
        delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }],
        throwOnError: false
      });
    }
    d.classList.add("open");
  }

  /* ── 網址參數 ──
   * 同時支援 ?d=xxx 與 #d=xxx。用 # 是為了讓「直接雙擊 HTML 檔（file://）」也能帶參數，
   * 部分瀏覽器在 file:// 下會忽略 query string。
   */
  function param(name) {
    var q = new URLSearchParams(location.search).get(name);
    if (q) return q;
    var h = location.hash.replace(/^#/, "");
    return new URLSearchParams(h).get(name);
  }

  /* ── 資料工具 ── */
  function domainById(id) {
    var ds = domains();
    for (var i = 0; i < ds.length; i++) if (ds[i].id === id) return ds[i];
    return null;
  }
  function allTools() {
    var out = [];
    domains().forEach(function (d) {
      (d.topics || []).forEach(function (t) {
        (t.tools || []).forEach(function (tool) { out.push({ tool: tool, topic: t, dom: d }); });
      });
    });
    return out;
  }

  var Map = {
    drawMindmap: drawMindmap,
    openTool: openTool,
    domainById: domainById,
    allTools: allTools,
    param: param,
    grade: grade,
    gradeTag: gradeTag,
    domains: domains,
    figHTML: figHTML,
    figCount: figCount,
    viewMode: viewMode,

    /* 年級切換按鈕（放在 topbar） */
    mountGradeSwitch: function (elId) {
      var box = document.getElementById(elId);
      if (!box) return;
      var g = grade();
      var opts = [["all", "全部"], ["7", "七年級"], ["8", "八年級"], ["9", "九年級"]];
      box.innerHTML = '<span class="ed-sw">' + opts.map(function (o) {
        return '<button data-v="' + o[0] + '"' + (g === o[0] ? ' class="on"' : "") + ">" + o[1] + "</button>";
      }).join("") + "</span>";
      box.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          if (b.getAttribute("data-v") === grade()) return;
          setGrade(b.getAttribute("data-v"));
          location.reload();
        });
      });
    },

    /* 年級說明橫幅 */
    renderGradeBanner: function (mountId) {
      var mount = document.getElementById(mountId);
      if (!mount) return;
      var g = grade();
      if (g === "all") { mount.innerHTML = ""; return; }
      var ds = domains(), nT = 0, nX = 0;
      ds.forEach(function (d) {
        nT += d.topics.length;
        d.topics.forEach(function (t) { nX += t.tools.length; });
      });
      mount.innerHTML = '<div class="ed-banner"><div class="ed-title">🎒 目前只顯示「' +
        GRADE_NAME[g] + '」的內容：' + ds.length + " 個領域、" + nT + " 個主題、" + nX + " 項工具</div>" +
        '<p class="ed-unc">年級是依 108 課綱的一般教學順序標註在 <code>data/jm-*.js</code> 的 <code>g</code> 欄位，' +
        "各校進度略有差異時可自行調整。想看全部內容請切回「全部」。</p></div>";
    },

    /* ── 圖表／清單 切換控制 ── */
    viewController: function (btnId, render) {
      var last = null;
      function apply() {
        var m = viewMode();
        if (m === last) return;
        last = m;
        render(m);
        var b = document.getElementById(btnId);
        if (b) b.textContent = m === "map" ? "☰ 改用清單模式" : "🌳 改用圖表模式";
      }
      var b = document.getElementById(btnId);
      if (b) b.addEventListener("click", function () {
        setViewPref(viewMode() === "map" ? "list" : "map");
        last = null; apply();
      });
      // matchMedia 比 resize 可靠（某些環境改變視窗寬度不會派送 resize 事件）
      if (window.matchMedia) {
        var mq = window.matchMedia("(max-width: " + (BP - 1) + "px)");
        if (mq.addEventListener) mq.addEventListener("change", apply);
        else if (mq.addListener) mq.addListener(apply);
      }
      var timer;
      window.addEventListener("resize", function () {
        clearTimeout(timer); timer = setTimeout(apply, 220);
      });
      window.addEventListener("orientationchange", function () { setTimeout(apply, 260); });
      apply();
    },

    /* 總圖：根 → 領域 → 主題 */
    renderMaster: function (mountId) {
      var doms = domains();
      var root = {
        label: "國中數學",
        children: doms.map(function (d) {
          return {
            label: d.icon + " " + d.n, color: d.color, _d: d,
            children: (d.topics || []).map(function (t) { return { label: t.n, _d: d, _t: t }; })
          };
        })
      };
      drawMindmap(mountId, root, function (node) {
        if (node._t) location.href = "branch.html#d=" + node._d.id + "&t=" + node._t.id;
        else if (node._d) location.href = "branch.html#d=" + node._d.id;
      });
    },

    /* 分支圖：領域 → 主題 → 工具 */
    renderBranch: function (mountId, dom) {
      var root = {
        label: dom.icon + " " + dom.n,
        children: (dom.topics || []).map(function (t) {
          return {
            label: t.n, color: dom.color, _t: t,
            children: (t.tools || []).map(function (tool) { return { label: tool.n, _t: t, _tool: tool }; })
          };
        })
      };
      drawMindmap(mountId, root, function (node) {
        if (node._tool) openTool(node._tool, dom.n + " ▸ " + node._t.n);
        else if (node._t) openTopic(node._t, dom);
      });
    },

    /* 總圖的清單版（窄螢幕用） */
    renderMasterList: function (mountId) {
      var mount = document.getElementById(mountId);
      if (!mount) return;
      mount.innerHTML = '<div class="lv">' + domains().map(function (d) {
        return '<details class="lv-item" style="border-left-color:' + d.color + '">' +
          '<summary><span style="color:' + d.color + '">' + d.icon + " " + esc(d.n) + "</span>" +
          '<span class="lv-n">' + d.topics.length + " 主題</span></summary>" +
          '<div class="lv-body"><p class="lv-ask">' + esc(d.ask) + "</p>" +
          d.topics.map(function (t) {
            return '<a class="lv-chip" href="branch.html#d=' + d.id + "&t=" + t.id + '">' +
              esc(t.n) + "</a>";
          }).join("") +
          '<a class="lv-go" style="color:' + d.color + '" href="branch.html#d=' + d.id +
          '">看這個領域的完整工具 →</a></div></details>';
      }).join("") + "</div>";
    },

    /* 分支圖的清單版（窄螢幕用） */
    renderBranchList: function (mountId, dom) {
      var mount = document.getElementById(mountId);
      if (!mount) return;
      mount.innerHTML = '<div class="lv">' + (dom.topics || []).map(function (t, ti) {
        return '<details class="lv-item"' + (ti === 0 ? " open" : "") +
          ' style="border-left-color:' + dom.color + '">' +
          '<summary><span style="color:' + dom.color + '">▍' + esc(t.n) + "</span>" +
          '<span class="lv-n">' + t.tools.length + " 個工具</span></summary>" +
          '<div class="lv-body">' +
          (t.flow ? '<p class="lv-ask">💡 ' + esc(t.flow) + "</p>" : "") +
          t.tools.map(function (tool, xi) {
            return '<button class="lv-tool" data-t="' + ti + '" data-x="' + xi + '">' +
              (tool.fig ? '<span class="lv-thumb">' + figSVG(tool.fig) + "</span>" : "") +
              "<b>" + esc(tool.n) + "</b>" +
              (tool.w ? "<span>👉 " + esc(tool.w) + "</span>" : "") + "</button>";
          }).join("") + "</div></details>";
      }).join("") + "</div>";
      mount.querySelectorAll(".lv-tool").forEach(function (b) {
        b.addEventListener("click", function () {
          var t = dom.topics[+b.dataset.t];
          openTool(t.tools[+b.dataset.x], dom.n + " ▸ " + t.n);
        });
      });
    },

    /* 全域關鍵字搜尋 */
    bindSearch: function (inputId, listId) {
      var inp = document.getElementById(inputId), list = document.getElementById(listId);
      if (!inp || !list) return;
      var data = allTools();
      function run() {
        var q = inp.value.trim();
        list.innerHTML = "";
        if (!q) return;
        var keys = q.split(/[\s,，、]+/).filter(Boolean);
        var hits = data.filter(function (r) {
          var hay = [r.tool.n, r.tool.d, r.tool.w, r.tool.f, r.tool.l, r.tool.t, r.topic.n,
            (r.topic.kw || []).join(" "), r.dom.n].join(" ");
          return keys.every(function (k) { return hay.indexOf(k) > -1; });
        }).slice(0, 40);
        if (!hits.length) {
          list.innerHTML = '<div class="cow-empty"><img src="assets/mascot/web/cow_question.png" alt="疑惑的牛夫子">' +
            "<b>牛夫子也想不到耶……</b><span>試試更短的關鍵字，例如「平行」「全等」「面積」「至少」。</span></div>";
          return;
        }
        hits.forEach(function (r) {
          var div = document.createElement("div");
          div.className = "hit";
          div.style.borderLeftColor = r.dom.color;
          div.innerHTML =
            (r.tool.fig ? '<span class="hit-thumb">' + figSVG(r.tool.fig) + "</span>" : "") +
            '<span class="hit-main"><span class="h-t">' + esc(r.tool.n) + "</span>" +
            '<span class="h-p">' + esc(r.dom.icon + " " + r.dom.n + " ▸ " + r.topic.n) + "</span>" +
            (r.tool.w ? '<span class="h-w">👉 ' + esc(r.tool.w) + "</span>" : "") + "</span>";
          div.addEventListener("click", function () { openTool(r.tool, r.dom.n + " ▸ " + r.topic.n); });
          list.appendChild(div);
        });
      }
      inp.addEventListener("input", run);
      run();
    },

    /* 領域卡片（總圖下方圖例） */
    renderDomainCards: function (mountId) {
      var mount = document.getElementById(mountId);
      if (!mount) return;
      var grid = document.createElement("div");
      grid.className = "dom-grid";
      domains().forEach(function (d) {
        var a = document.createElement("a");
        a.className = "dom-card";
        a.href = "branch.html#d=" + d.id;
        a.style.borderLeftColor = d.color;
        a.innerHTML = '<span class="dc-t" style="color:' + d.color + '">' + esc(d.icon + " " + d.n) +
          (d.geo ? '<span class="geo-chip">圖解</span>' : "") + "</span>" +
          '<span class="dc-a">' + esc(d.ask) + "</span>" +
          '<span class="dc-k">🔑 ' + esc((d.topics || []).map(function (t) { return t.n; }).join("・")) + "</span>";
        grid.appendChild(a);
      });
      mount.appendChild(grid);
    },

    /* 分支頁：圖卡模式（幾何領域用） */
    renderFigCards: function (mountId, dom) {
      var mount = document.getElementById(mountId);
      if (!mount) return;
      mount.innerHTML = (dom.topics || []).map(function (t, ti) {
        var cards = (t.tools || []).map(function (x, xi) {
          return '<button class="fig-card' + (x.fig && figWide(x.fig) ? " wide" : "") +
            '" data-t="' + ti + '" data-x="' + xi + '">' +
            '<span class="fc-fig">' + (x.fig ? figSVG(x.fig) : '<span class="fc-nofig">（無圖）</span>') + "</span>" +
            '<span class="fc-n">' + esc(x.n) + "</span>" +
            (x.d ? '<span class="fc-d">📖 定義：' + esc(x.d) + "</span>" : "") +
            (x.w ? '<span class="fc-w">👉 ' + esc(x.w) + "</span>" : "") +
            (x.l ? '<span class="fc-l">⚠️ ' + esc(x.l) + "</span>" : "") +
            "</button>";
        }).join("");
        return '<h3 class="topic-h"><span style="color:' + dom.color + '">▍' + esc(t.n) + "</span>" +
          '<span class="th-kw">' + esc(gradeTag(t.g)) + "　關鍵字：" + esc((t.kw || []).join("、")) + "</span></h3>" +
          (t.flow ? '<div class="callout idea"><b>思路：</b>' + esc(t.flow) + "</div>" : "") +
          '<div class="fig-grid">' + cards + "</div>";
      }).join("");
      mount.querySelectorAll(".fig-card").forEach(function (b) {
        b.addEventListener("click", function () {
          var t = dom.topics[+b.dataset.t];
          openTool(t.tools[+b.dataset.x], dom.n + " ▸ " + t.n);
        });
      });
      if (window.renderMathInElement) {
        renderMathInElement(mount, {
          delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }],
          throwOnError: false
        });
      }
    },

    /* 分支頁的工具總表（可列印、可遮欄自測） */
    renderToolTable: function (mountId, dom) {
      var mount = document.getElementById(mountId);
      if (!mount) return;
      mount.innerHTML = "";
      var hasFig = (dom.topics || []).some(function (t) {
        return (t.tools || []).some(function (x) { return x.fig; });
      });
      (dom.topics || []).forEach(function (t) {
        var h = document.createElement("h3");
        h.className = "topic-h";
        h.innerHTML = '<span style="color:' + dom.color + '">▍' + esc(t.n) + "</span>" +
          '<span class="th-kw">' + esc(gradeTag(t.g)) + "　關鍵字：" + esc((t.kw || []).join("、")) + "</span>";
        mount.appendChild(h);
        if (t.flow) {
          var p = document.createElement("div");
          p.className = "callout idea";
          p.innerHTML = "<b>思路：</b>" + esc(t.flow);
          mount.appendChild(p);
        }
        var wrap = document.createElement("div");
        wrap.className = "tbl-scroll";
        var rows = (t.tools || []).map(function (x) {
          return "<tr>" +
            (hasFig ? "<td class='t-fig' data-l='圖'>" + (x.fig ? figSVG(x.fig) : "—") + "</td>" : "") +
            "<td class='t-n' data-l='工具'>" + esc(x.n) +
            "</td><td data-l='" + (x.d ? "定義與性質" : "公式") + "'>" +
            (x.d ? "<span class='t-def'>【定義】" + esc(x.d) + "</span>" : "") +
            (x.f ? "$" + esc(x.f) + "$" : (x.d ? "" : "—")) +
            "</td><td data-l='什麼時候用'>" + (esc(x.w) || "—") +
            "</td><td class='t-l' data-l='限制／前提'>" + (esc(x.l) || "—") +
            "</td><td data-l='常見錯誤'>" + (esc(x.t) || "—") + "</td></tr>";
        }).join("");
        wrap.innerHTML = "<table class='tools'><thead><tr>" +
          (hasFig ? "<th>圖</th>" : "") +
          "<th>工具</th><th>定義／公式</th><th>什麼時候用</th>" +
          "<th>限制／前提</th><th>常見錯誤</th></tr></thead><tbody>" + rows + "</tbody></table>";
        mount.appendChild(wrap);
      });
      if (window.renderMathInElement) {
        renderMathInElement(mount, {
          delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }],
          throwOnError: false
        });
      }
    },

    /* 圖解牆：把所有有圖的工具依領域排成一面牆 */
    renderGallery: function (mountId, opts) {
      var mount = document.getElementById(mountId);
      if (!mount) return;
      opts = opts || {};
      var only = opts.geoOnly, skip = opts.exclude || [];
      var html = "", shown = 0;
      domains().forEach(function (d) {
        if (only && !d.geo) return;
        if (skip.indexOf(d.id) > -1) return;
        var blocks = (d.topics || []).map(function (t) {
          var cards = (t.tools || []).filter(function (x) { return x.fig; }).map(function (x, xi) {
            shown++;
            return '<button class="fig-card' + (figWide(x.fig) ? " wide" : "") +
              '" data-d="' + d.id + '" data-t="' + t.id +
              '" data-n="' + esc(x.n) + '">' +
              '<span class="fc-fig">' + figSVG(x.fig) + "</span>" +
              '<span class="fc-n">' + esc(x.n) + "</span></button>";
          }).join("");
          if (!cards) return "";
          return '<h3 class="topic-h"><span style="color:' + d.color + '">▍' + esc(t.n) + "</span>" +
            '<span class="th-kw">' + esc(gradeTag(t.g)) + "</span></h3>" +
            '<div class="fig-grid tight">' + cards + "</div>";
        }).join("");
        if (!blocks) return;
        html += '<h2 class="sec" id="g-' + d.id + '"><span class="tag" style="background:' +
          d.color + '22;color:' + d.color + '">' + d.icon + "</span>" + esc(d.n) + "</h2>" + blocks;
      });
      mount.innerHTML = html || '<p class="kw-hint">這個年級沒有幾何圖形。</p>';
      mount.querySelectorAll(".fig-card").forEach(function (b) {
        b.addEventListener("click", function () {
          var d = domainById(b.dataset.d);
          if (!d) return;
          (d.topics || []).forEach(function (t) {
            if (t.id !== b.dataset.t) return;
            (t.tools || []).forEach(function (x) {
              if (x.n === b.dataset.n) openTool(x, d.n + " ▸ " + t.n);
            });
          });
        });
      });
      return shown;
    }
  };

  /* 點主題節點時，抽屜顯示主題本身的說明 */
  function openTopic(t, dom) {
    openTool({
      n: t.n, g: t.g, fig: t.fig,
      w: (t.kw || []).map(function (k) { return "「" + k + "」"; }).join("、"),
      l: t.flow || ""
    }, dom.n);
  }

  window.MathMap = Map;
})();
