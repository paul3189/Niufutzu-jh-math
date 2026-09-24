/* 牛夫子直覺道場（國中版）— 遊戲引擎
 * 限時反射作答 → 打怪 → 結算弱點診斷（題型別＋單元別）。
 * 純 vanilla JS，紀錄存 localStorage。
 */
(function () {
  "use strict";

  var STORE = "jhmath.reflex.v1";
  var $ = function (id) { return document.getElementById(id); };
  var TOTAL = 10;
  var MAX_HP = 5;

  var DIFFS = [
    { id: "s20", sec: 20, name: "見習", mul: 1.0, tagline: "想清楚再按",
      note: "容許你在紙上算一下。先確認觀念是對的。" },
    { id: "s15", sec: 15, name: "熟手", mul: 1.3, tagline: "還來得及檢查",
      note: "會算但要繞一下的題目，這裡開始會卡。" },
    { id: "s10", sec: 10, name: "應試", mul: 1.7, tagline: "會考的真實節奏",
      note: "會考一題平均就是這個秒數，含讀題與畫卡。" },
    { id: "s5",  sec: 5,  name: "高手", mul: 2.2, tagline: "只夠做一個動作",
      note: "沒空慢慢算，只能直接取用記住的結果。" },
    { id: "s3",  sec: 3,  name: "大師", mul: 2.8, tagline: "只能靠反射",
      note: "來不及思考，答案必須自己浮出來。" }
  ];

  var MONSTERS = {
    slime:     { name: "根號史萊姆", img: "assets/monsters/slime.png", hp: 62,
                 quip: "化不到最簡就黏住你" },
    butterfly: { name: "比例幻蝶",   img: "assets/monsters/butterfly.png", hp: 84,
                 quip: "翅膀一拍就換一種比" },
    turtle:    { name: "畢氏磐石龜", img: "assets/monsters/turtle.png", hp: 110,
                 quip: "公式不熟就打不動牠" }
  };
  var ORDER = ["slime", "butterfly", "turtle"];

  var SCOPES = [
    { id: "all",   name: "國中全範圍", desc: "七～九年級全開，等於會考範圍" },
    { id: "grade", name: "指定年級",   desc: "七／八／九年級，適合期末總複習" },
    { id: "topic", name: "指定單元",   desc: "單一單元猛練，適合段考前" }
  ];

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; }
  }
  function save(d) { try { localStorage.setItem(STORE, JSON.stringify(d)); } catch (e) {} }

  /* ── 音效 ── */
  var AC = null, muted = false;
  function beep(freq, dur, type, vol) {
    if (muted) return;
    try {
      if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
      var o = AC.createOscillator(), g = AC.createGain();
      o.type = type || "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(vol || 0.06, AC.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + dur);
      o.connect(g); g.connect(AC.destination);
      o.start(); o.stop(AC.currentTime + dur);
    } catch (e) {}
  }
  var SFX = {
    hit:  function () { beep(660, 0.10, "triangle", 0.07); setTimeout(function () { beep(990, 0.09, "triangle", 0.05); }, 60); },
    miss: function () { beep(180, 0.24, "sawtooth", 0.05); },
    kill: function () { [523, 659, 784, 1046].forEach(function (f, i) { setTimeout(function () { beep(f, 0.12, "square", 0.05); }, i * 80); }); },
    tick: function () { beep(1200, 0.03, "sine", 0.03); },
    over: function () { [440, 350, 260].forEach(function (f, i) { setTimeout(function () { beep(f, 0.25, "sine", 0.06); }, i * 180); }); }
  };

  function rm(el) {
    if (window.renderMathInElement) {
      renderMathInElement(el, {
        delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }],
        throwOnError: false
      });
    }
  }
  function show(id) {
    ["scrMenu", "scrPlay", "scrEnd"].forEach(function (s) { $(s).classList.toggle("hide", s !== id); });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function catOf(id) { return REFLEX_BANK.cats.filter(function (c) { return c.id === id; })[0]; }
  function diffOf(id) { return DIFFS.filter(function (d) { return d.id === id; })[0] || DIFFS[2]; }

  var G = null;
  var sel = { diff: "s10", cats: null, scope: "all", grade: 7, topics: [], ext: false };

  function currentSet() {
    return REFLEX_BANK.scopeSet(sel.scope, sel.scope === "grade" ? sel.grade : sel.topics);
  }
  /* 使用者勾選的題型 ∩ 此範圍真的有題目的題型；交集為空時就全開 */
  function effectiveCats(avail) {
    var use = (sel.cats || []).filter(function (c) { return avail.indexOf(c) >= 0; });
    return use.length ? use : avail.slice();
  }
  function scopeLabel() {
    if (sel.scope === "all") return "國中全範圍";
    if (sel.scope === "grade") return REFLEX_BANK.gradeName[sel.grade];
    var n = sel.topics.length;
    if (!n) return "尚未選單元";
    if (n === 1) return REFLEX_BANK.shortOf(sel.topics[0]);
    var names = sel.topics.slice(0, 2).map(function (id) { return REFLEX_BANK.shortOf(id); });
    return n + " 單元：" + names.join("、") + (n > 2 ? " 等" : "");
  }

  /* ══════════ 選單 ══════════ */
  function buildMenu() {
    REFLEX_BANK.setIncludeExt(sel.ext);      /* 要在算單元清單之前設定 */
    var cats = REFLEX_BANK.cats;
    var topicList = REFLEX_BANK.topics();
    if (!sel.cats) sel.cats = cats.map(function (c) { return c.id; });

    var set = currentSet();
    var avail = REFLEX_BANK.availableCats(set);
    /* sel.cats 保存「使用者想練的題型」，不因為換範圍而被永久刪掉；
     * 實際能出的是它與此範圍可用題型的交集，範圍放寬時原本的勾選會自己回來。 */
    var use = effectiveCats(avail);

    /* 難度 */
    var dw = $("diffCards");
    dw.innerHTML = "";
    DIFFS.forEach(function (d) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "rx-diff" + (sel.diff === d.id ? " on" : "");
      b.innerHTML =
        '<div class="d-sec">' + d.sec + '<small>秒</small></div>' +
        '<div class="d-name">' + d.name + '</div>' +
        '<div class="d-tag">' + d.tagline + '</div>' +
        '<div class="d-note">' + d.note + '</div>' +
        '<div class="d-mul">分數 ×' + d.mul.toFixed(1) + '</div>';
      b.addEventListener("click", function () { sel.diff = d.id; buildMenu(); });
      dw.appendChild(b);
    });

    /* 範圍 */
    var sw = $("scopeCards");
    sw.innerHTML = "";
    SCOPES.forEach(function (s) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "rx-scope" + (sel.scope === s.id ? " on" : "");
      b.innerHTML = '<div class="s-name">' + s.name + '</div><div class="s-desc">' + s.desc + '</div>';
      b.addEventListener("click", function () { sel.scope = s.id; buildMenu(); });
      sw.appendChild(b);
    });

    var pick = $("scopePick");
    pick.classList.toggle("hide", sel.scope === "all");
    if (sel.scope === "grade") {
      pick.innerHTML = '<label>年級：</label><span id="gradeBtns"></span>';
      var gb = $("gradeBtns");
      REFLEX_BANK.grades.forEach(function (g) {
        var n = topicList.filter(function (t) { return t.gs.indexOf(g) >= 0; }).length;
        var b = document.createElement("button");
        b.type = "button";
        b.className = "rx-grade" + (sel.grade === g ? " on" : "");
        b.innerHTML = REFLEX_BANK.gradeName[g] + '<small>' + n + ' 單元</small>';
        b.addEventListener("click", function () { sel.grade = g; buildMenu(); });
        gb.appendChild(b);
      });
    } else if (sel.scope === "topic") {
      /* 單元複選：點一下加入／移除，整個領域一鍵切換 */
      var doms = [];
      topicList.forEach(function (t) {
        var d0 = doms.filter(function (x) { return x.name === t.d; })[0];
        if (!d0) { d0 = { name: t.d, items: [] }; doms.push(d0); }
        d0.items.push(t);
      });
      var html = '<div class="pick-head">已選 <b>' + sel.topics.length + '</b> 單元' +
        '<span class="pick-acts"><button type="button" data-act="all">全選</button>' +
        '<button type="button" data-act="none">清除</button></span></div>';
      doms.forEach(function (d0, di) {
        var allOn = d0.items.every(function (t) { return sel.topics.indexOf(t.id) >= 0; });
        html += '<div class="pick-sem"><button type="button" class="ps-name' + (allOn ? " on" : "") +
          '" data-dom="' + di + '">' + d0.name + '</button><div class="ps-chips">' +
          d0.items.map(function (t) {
            return '<button type="button" class="ps-chip' + (sel.topics.indexOf(t.id) >= 0 ? " on" : "") +
              '" data-id="' + t.id + '" title="' +
              t.gs.map(function (x) { return REFLEX_BANK.gradeName[x]; }).join("・") + '．' + t.num +
              ' 種題源">' + t.n + '<small>' + t.gs.join("・") + '</small></button>';
          }).join("") + '</div></div>';
      });
      pick.innerHTML = html;

      pick.querySelectorAll(".ps-chip").forEach(function (b) {
        b.addEventListener("click", function () {
          var id = b.getAttribute("data-id");
          var i = sel.topics.indexOf(id);
          if (i >= 0) sel.topics.splice(i, 1); else sel.topics.push(id);
          buildMenu();
        });
      });
      pick.querySelectorAll(".ps-name").forEach(function (b) {
        b.addEventListener("click", function () {
          var d0 = doms[+b.getAttribute("data-dom")];
          var allOn = d0.items.every(function (t) { return sel.topics.indexOf(t.id) >= 0; });
          d0.items.forEach(function (t) {
            var i = sel.topics.indexOf(t.id);
            if (allOn && i >= 0) sel.topics.splice(i, 1);
            else if (!allOn && i < 0) sel.topics.push(t.id);
          });
          buildMenu();
        });
      });
      pick.querySelectorAll(".pick-acts button").forEach(function (b) {
        b.addEventListener("click", function () {
          sel.topics = b.getAttribute("data-act") === "all"
            ? topicList.map(function (t) { return t.id; }) : [];
          buildMenu();
        });
      });
    }

    /* 補充題開關：超出 108 課綱國中範圍的題目預設不出 */
    var ex = $("extToggle");
    if (ex) {
      ex.innerHTML = '<label class="rx-ext"><input type="checkbox" id="extChk"' + (sel.ext ? " checked" : "") +
        '> 包含<b>補充題</b>（超出 108 課綱國中範圍：錐體體積、兩圓位置關係、相似立體體積比…，共 ' +
        REFLEX_BANK.extCount() + ' 種題源）</label>';
      $("extChk").addEventListener("change", function () { sel.ext = this.checked; buildMenu(); });
    }

    /* 題型 */
    var cw = $("catChips");
    cw.innerHTML = "";
    cats.forEach(function (c) {
      var ok = avail.indexOf(c.id) >= 0;
      var on = use.indexOf(c.id) >= 0;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "rx-chip" + (on ? " on" : "") + (ok ? "" : " dead");
      b.disabled = !ok;
      b.innerHTML = '<span class="c-ic">' + c.icon + '</span><span class="c-nm">' + c.name +
        '</span><span class="c-ds">' + (ok ? c.desc : "此範圍沒有這類題目") + '</span>';
      b.addEventListener("click", function () {
        var i = sel.cats.indexOf(c.id);
        if (i >= 0) { if (use.length > 1) sel.cats.splice(i, 1); }
        else sel.cats.push(c.id);
        buildMenu();
      });
      cw.appendChild(b);
    });

    /* 摘要 */
    var src = 0;
    topicList.forEach(function (t) { if (!set || set.has(t.id)) src += t.num; });
    var d = diffOf(sel.diff);
    var empty = sel.scope === "topic" && !sel.topics.length;
    $("btnStart").disabled = empty;
    $("btnStart").classList.toggle("off", empty);
    $("setupLine").innerHTML = empty
      ? '<span class="warn-src">⚠ 請至少選一個單元</span>'
      : '<b>' + d.sec + ' 秒</b>（' + d.name + '）　▸　<b>' + scopeLabel() + '</b>　▸　' +
        use.length + ' 種題型　▸　題源 ' + src + ' 個' +
        (src < 4 ? '<span class="warn-src">　⚠ 範圍很窄，10 題內會重複出現</span>' : "");

    /* 紀錄 */
    var db = load();
    var rows = DIFFS.map(function (dd) {
      var b = (db.best || {})[dd.id];
      return '<tr><td>' + dd.sec + ' 秒｜' + dd.name + '</td>' +
        '<td>' + (b ? b.score : "—") + '</td>' +
        '<td>' + (b ? b.acc + "%" : "—") + '</td>' +
        '<td>' + (b ? b.combo : "—") + '</td>' +
        '<td>' + (b ? b.avg + " 秒" : "—") + '</td>' +
        '<td class="rec-scope">' + (b && b.scope ? b.scope : "—") + '</td></tr>';
    }).join("");
    $("records").innerHTML =
      '<table class="rx-rec"><tr><th>難度</th><th>最高分</th><th>正確率</th><th>最高連擊</th><th>平均反應</th><th>當時範圍</th></tr>' +
      rows + '</table>';

    var st = db.stats || {};
    var any = cats.some(function (c) { return st[c.id] && st[c.id].n >= 3; });
    $("lifetime").innerHTML = !any ? "" :
      '<div class="rx-life"><b>你的長期熟練度（累積所有場次）</b>' +
      cats.map(function (c) {
        var s = st[c.id];
        if (!s || !s.n) return "";
        var acc = Math.round(100 * s.ok / s.n);
        return '<div class="lf"><span class="lf-n">' + c.icon + ' ' + c.name + '</span>' +
          '<span class="lf-bar"><i style="width:' + acc + '%"></i></span>' +
          '<span class="lf-v">' + acc + '%．平均 ' + (s.ms / s.n / 1000).toFixed(1) + ' 秒．' + s.n + ' 題</span></div>';
      }).join("") + '</div>';

    if (!$("lineup").childElementCount) {
      $("lineup").innerHTML = ORDER.map(function (k, i) {
        var m = MONSTERS[k];
        return '<div class="lu"><img src="' + m.img + '" alt="' + m.name + '">' +
          '<div class="lu-n">' + m.name + '</div><div class="lu-h">HP ' + m.hp + '</div>' +
          '<div class="lu-q">' + m.quip + '</div></div>' +
          (i < ORDER.length - 1 ? '<div class="lu-ar">▸</div>' : "");
      }).join("");
    }
    rm(cw);
  }

  /* ══════════ 雲端：帳號與排行榜 ══════════
   * 全部透過 window.ReflexCloud；它不存在或 ready=false 時這一段什麼都不畫。 */
  var C = window.ReflexCloud || null;
  var cloudOn = false;
  var boardSel = { kind: "week", diff: null };
  var boardCache = {};

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderAccount() {
    var box = $("cloudAccount");
    if (!box || !cloudOn) return;
    var u = C.user(), nick = C.nick();
    var html = '<div class="rx-sec">👤 帳號 <small>登入後成績會上榜；排行榜只顯示暱稱，不會出現 Email</small></div>';
    if (!u) {
      var remembered = C.rememberedEmail();
      html += '<div class="rx-cloud">' +
        '<div class="cl-row"><input type="email" id="clEmail" placeholder="你的 Email" value="' + esc(remembered) + '" autocomplete="email">' +
        '<button type="button" id="clSend">寄登入連結給我</button>' +
        (C.mode() === "mock" ? '<button type="button" id="clMock">（測試）直接登入</button>' : "") + '</div>' +
        '<div class="cl-note" id="clMsg">不用設密碼：輸入 Email 會收到一封信，點信裡的連結就登入了（用同一台裝置開信最順）。<b>只要收這一次信</b>——之後在這台裝置、這個瀏覽器會一直保持登入。</div></div>';
      box.innerHTML = html;
      $("clSend").addEventListener("click", sendLink);
      $("clEmail").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); sendLink(); } });
      if ($("clMock")) $("clMock").addEventListener("click", function () { C.mockLogin(); });
      return;
    }
    html += '<div class="rx-cloud">' +
      '<div class="cl-row"><span class="cl-who">✅ 已登入　<span class="cl-mail">' + esc(u.email) + '</span></span>' +
      '<button type="button" class="cl-out" id="clOut">登出</button></div>' +
      '<div class="cl-row"><label for="clNick">暱稱</label>' +
      '<input type="text" id="clNick" maxlength="12" placeholder="排行榜上顯示的名字（1～12 字）" value="' + esc(nick) + '">' +
      '<button type="button" id="clNickSave">' + (nick ? "改暱稱" : "設定暱稱") + '</button></div>' +
      '<div class="cl-note" id="clMsg">這台裝置會一直保持登入，下次來不必再收信；按「登出」或換 Email 才需要重新登入。</div></div>';
    box.innerHTML = html;
    $("clOut").addEventListener("click", function () { C.signOut(); });
    $("clNickSave").addEventListener("click", saveNick);
    $("clNick").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); saveNick(); } });
  }
  function sendLink() {
    var email = ($("clEmail").value || "").trim().toLowerCase();
    if (!C.validEmail(email)) { $("clMsg").textContent = "Email 格式不對，再看一下。"; return; }
    $("clSend").disabled = true;
    $("clMsg").textContent = "寄送中…";
    C.sendLink(email).then(function () {
      $("clMsg").innerHTML = "📨 已寄到 <b>" + esc(email) + "</b>。打開那封信、點裡面的連結就會回到這裡並登入。沒收到請看垃圾信匣。";
    }).catch(function (e) {
      $("clSend").disabled = false;
      $("clMsg").textContent = "寄送失敗：" + friendly(e);
    });
  }
  function saveNick() {
    var n = C.cleanNick($("clNick").value);
    if (!n) { $("clMsg").textContent = "暱稱不能是空的（1～12 字）。"; return; }
    $("clNickSave").disabled = true;
    C.setNick(n).then(function () {
      boardCache = {};
      renderAccount(); renderBoard();
    }).catch(function (e) { $("clNickSave").disabled = false; $("clMsg").textContent = "儲存失敗：" + friendly(e); });
  }
  function friendly(e) {
    var m = (e && e.code) || (e && e.message) || String(e);
    if (/unauthorized-domain/.test(m)) return "這個網域還沒加進 Firebase 的「已授權網域」。";
    if (/invalid-email/.test(m)) return "Email 格式不對。";
    if (/too-many-requests/.test(m)) return "寄太頻繁了，等一下再試。";
    if (/permission-denied/.test(m)) return "沒有權限（安全規則擋下來了）。";
    if (/network/.test(m)) return "網路連不上。";
    return m;
  }

  function renderBoard() {
    var box = $("cloudBoard");
    if (!box || !cloudOn) return;
    if (!boardSel.diff) boardSel.diff = sel.diff;
    var html = '<div class="rx-sec">🏆 排行榜 <small>每個難度一個榜；本週榜每週一重新開始，總榜是歷史最高分</small></div>' +
      '<div class="rx-cloud"><div class="bd-tabs">' +
      '<span class="bd-kind"><button type="button" data-k="week"' + (boardSel.kind === "week" ? ' class="on"' : "") + '>本週榜</button>' +
      '<button type="button" data-k="all"' + (boardSel.kind === "all" ? ' class="on"' : "") + '>總榜</button></span>' +
      '<span class="bd-diff">' + DIFFS.map(function (d) {
        return '<button type="button" data-d="' + d.id + '"' + (boardSel.diff === d.id ? ' class="on"' : "") + '>' + d.sec + ' 秒<small>' + d.name + '</small></button>';
      }).join("") +
      '<button type="button" data-d="sum"' + (boardSel.diff === "sum" ? ' class="on sum"' : ' class="sum"') +
      '>綜合<small>五個難度合計</small></button></span></div>' +
      '<div id="bdBody" class="bd-body">載入中…</div></div>';
    box.innerHTML = html;
    box.querySelectorAll(".bd-kind button").forEach(function (b) {
      b.addEventListener("click", function () { boardSel.kind = b.getAttribute("data-k"); renderBoard(); });
    });
    box.querySelectorAll(".bd-diff button").forEach(function (b) {
      b.addEventListener("click", function () { boardSel.diff = b.getAttribute("data-d"); renderBoard(); });
    });
    var key = boardSel.kind + "|" + boardSel.diff;
    var p = boardCache[key] || (boardCache[key] = C.board(boardSel.kind, boardSel.diff));
    p.then(function (r) {
      if (key !== boardSel.kind + "|" + boardSel.diff) return;
      paintBoard(r);
    }).catch(function (e) {
      delete boardCache[key];
      $("bdBody").innerHTML = '<div class="rx-none">排行榜載入失敗：' + esc(friendly(e)) + '</div>';
    });
  }
  function paintBoard(r) {
    var rows = r.rows || [];
    var me = r.myUid;
    var sum = !!r.sum;
    var playLabel = boardSel.kind === "week" ? "本週場次" : "總場次";
    var inTop = rows.some(function (x) { return x.uid === me; });
    var head = sum
      ? '<tr><th>名次</th><th>暱稱</th><th>總分</th><th>' + playLabel + '</th><th>上榜難度</th></tr>'
      : '<tr><th>名次</th><th>暱稱</th><th>分數</th><th>正確率</th><th>連擊</th><th>' + playLabel + '</th><th>範圍</th></tr>';
    var html = !rows.length ? '<div class="rx-none">這個榜還沒有人上榜——打一場就是第一名！</div>' :
      '<table class="bd-tbl' + (sum ? " sum" : "") + '">' + head +
      rows.map(function (x, i) {
        var medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : (i + 1);
        var who = '<td>' + medal + '</td><td>' + esc(x.nick) +
          (x.uid === me ? '<span class="bd-me">我</span>' : "") + '</td><td class="bd-s">' + x.score + '</td>';
        var rest = sum
          ? '<td>' + (x.plays || 0) + '</td><td>' + x.levels + ' / ' + DIFFS.length + '</td>'
          : '<td>' + x.acc + '%</td><td>' + x.combo + '</td><td>' + (x.plays || "—") +
            '</td><td class="bd-sc">' + esc(x.scope) + '</td>';
        return '<tr' + (x.uid === me ? ' class="me"' : "") + '>' + who + rest + '</tr>';
      }).join("") + '</table>' +
      (sum ? '<div class="cl-note">綜合榜＝五個難度各自的最佳分數相加，所以每個難度都練過的人分數會比較高。</div>' : "");
    if (me && r.me && !inTop) html += '<div class="cl-note">你在這個榜的最佳是 <b>' + r.me.score + '</b> 分，還沒進前 ' + rows.length + ' 名，再衝！</div>';
    if (!me) html += '<div class="cl-note">登入並設定暱稱後，你的成績也會出現在這裡。</div>';
    $("bdBody").innerHTML = html;
  }

  /* 結算後上傳；回傳要塞進結算畫面的那一段 HTML（用 Promise） */
  function cloudSubmit(run) {
    if (!cloudOn) return Promise.resolve("");
    var u = C.user();
    if (!u) return Promise.resolve('<div class="rx-cloud end"><b>☁️ 這一場沒有上榜</b>：回選單用 Email 登入，之後的成績就會進排行榜。</div>');
    if (!C.nick()) return Promise.resolve('<div class="rx-cloud end"><b>☁️ 這一場沒有上榜</b>：暱稱還沒設定好，回選單看一下「👤 帳號」。</div>');
    return C.submit(run).then(function (r) {
      boardCache = {};
      renderBoard();                       /* 選單雖然還沒顯示，先把榜更新好 */
      function line(name, x) {
        var where = x.rank ? "第 <b>" + x.rank + "</b> 名" : "前 100 名之外";
        var plays = x.plays ? "　累計 " + x.plays + " 場" : "";
        return "<div>" + name + "：" + where +
          (x.improved ? '<span class="bd-new">刷新個人最佳！</span>' : "（個人最佳 " + x.best + " 分）") + plays + "</div>";
      }
      return '<div class="rx-cloud end"><b>☁️ 成績已上傳</b>' + line("本週榜", r.week) + line("總榜", r.all) + '</div>';
    }).catch(function (e) {
      return '<div class="rx-cloud end"><b>☁️ 上傳失敗</b>：' + esc(friendly(e)) + '（本機紀錄已存）</div>';
    });
  }

  function bootCloud() {
    if (!C || !C.ready) return;
    C.ready.then(function (ok) {
      cloudOn = ok;
      if (!ok) return;
      C.onAuth(function () { boardCache = {}; renderAccount(); renderBoard(); });
      /* 從登入信的連結回來 */
      C.finishLink().then(function (r) {
        if (r === "need-email") {
          var email = prompt("請輸入你收到登入連結的那個 Email：");
          if (email) C.finishLink(email.trim().toLowerCase()).catch(function (e) { alert("登入失敗：" + friendly(e)); });
        }
      }).catch(function (e) { alert("登入失敗：" + friendly(e) + "\n連結可能已過期，請重新寄一封。"); });
    });
  }

  /* ══════════ 開場 ══════════ */
  function startGame() {
    REFLEX_BANK.setIncludeExt(sel.ext);
    var d = diffOf(sel.diff);
    var set = currentSet();
    var use = effectiveCats(REFLEX_BANK.availableCats(set));
    if (!use.length) return;

    G = {
      d: d, cats: use, set: set, scope: scopeLabel(),
      i: 0, hp: MAX_HP, score: 0, combo: 0, maxCombo: 0,
      ok: 0, msSum: 0, kills: 0, wave: 0,
      per: {}, perT: {}, wrongs: [],
      used: {}, lastCat: null,
      mon: null, monHp: 0, monMax: 0,
      timerId: null, hidAt: 0, item: null, locked: true, waitNext: false
    };
    G.cats.forEach(function (c) { G.per[c] = { n: 0, ok: 0, ms: 0 }; });
    spawnMonster(true);
    show("scrPlay");
    $("hudDiff").textContent = d.sec + " 秒｜" + d.name + "　" + G.scope;
    nextQuestion();
  }

  function spawnMonster(first) {
    var m = MONSTERS[ORDER[G.wave % ORDER.length]];
    var scale = 1 + 0.3 * Math.floor(G.wave / ORDER.length);
    G.mon = m;
    G.monMax = Math.round(m.hp * scale);
    G.monHp = G.monMax;
    var img = $("monImg");
    img.src = m.img; img.alt = m.name;
    $("monName").textContent = m.name + (scale > 1 ? "（強化 ×" + scale.toFixed(1) + "）" : "");
    $("monQuip").textContent = m.quip;
    img.classList.remove("dead");
    if (!first) { img.classList.add("spawn"); setTimeout(function () { img.classList.remove("spawn"); }, 500); }
    paintMonHp();
  }
  function paintMonHp() {
    $("monHpFill").style.width = Math.max(0, G.monHp / G.monMax * 100) + "%";
    $("monHpTxt").textContent = Math.max(0, G.monHp) + " / " + G.monMax;
  }
  function paintHud() {
    var h = "";
    for (var i = 0; i < MAX_HP; i++) h += '<span class="hp' + (i < G.hp ? "" : " off") + '">❤</span>';
    $("hudHp").innerHTML = h;
    $("hudScore").textContent = G.score;
    $("hudCombo").innerHTML = G.combo >= 2 ? '<b>' + G.combo + '</b> 連擊' : "連擊 " + G.combo;
    $("hudCombo").classList.toggle("hot", G.combo >= 5);
    $("hudProg").textContent = G.i + " / " + TOTAL;
    $("hudProgFill").style.width = (G.i / TOTAL * 100) + "%";
  }

  /* ══════════ 出題 ══════════ */
  function pickItem() {
    var order = G.cats.slice();
    if (order.length > 1) {
      order = order.filter(function (c) { return c !== G.lastCat; });
      if (Math.random() < 0.25) order = G.cats.slice();
    }
    for (var attempt = 0; attempt < order.length + 2; attempt++) {
      var c = order[Math.floor(Math.random() * order.length)];
      var it = null;
      for (var t = 0; t < 18; t++) {
        it = REFLEX_BANK.make(c, G.set);
        if (!it) break;
        if (!G.used[it.key]) break;
      }
      if (it) { G.lastCat = c; G.used[it.key] = 1; return it; }
      order = order.filter(function (x) { return x !== c; });
      if (!order.length) order = G.cats.slice();
    }
    return null;
  }

  function nextQuestion() {
    if (G.i >= TOTAL || G.hp <= 0) { endGame(); return; }
    G.waitNext = false;
    $("fb").className = "rx-fb";
    $("fb").innerHTML = "";
    var it = pickItem();
    if (!it) { endGame(); return; }
    G.item = it;
    var cat = catOf(it.cat);

    $("qCat").innerHTML = cat.icon + " " + cat.name +
      '<span class="q-ch">' + REFLEX_BANK.shortOf(it.t) + '｜' + REFLEX_BANK.gradeName[it.g] +
      (it.ext ? '｜<b class="q-ext">補充</b>' : "") + '</span>';
    $("qText").innerHTML = it.q;
    var cw = $("choices");
    cw.innerHTML = "";
    it.choices.forEach(function (ch, i) {
      var b = document.createElement("button");
      b.className = "rx-opt";
      b.type = "button";
      b.innerHTML = '<span class="k">' + (i + 1) + '</span><span class="v">' + ch + '</span>';
      b.addEventListener("click", function () { answer(i); });
      cw.appendChild(b);
    });
    rm($("qCat")); rm($("qText")); rm(cw);
    paintHud();

    var sec = Math.round(G.d.sec * cat.timeMul * 10) / 10;
    $("timerFill").style.width = "100%";
    $("timerNum").textContent = sec.toFixed(1);
    setTimeout(function () { armTimer(sec); }, 220);
  }

  function armTimer(sec) {
    G.limit = sec * 1000;
    G.t0 = performance.now();
    G.locked = false;
    G.warned = false;
    $("timerWrap").classList.remove("warn", "danger");
    stopTimer();
    G.timerId = setInterval(tick, 40);
  }
  function stopTimer() {
    if (G && G.timerId) { clearInterval(G.timerId); G.timerId = null; }
  }
  function tick() {
    var left = Math.max(0, G.limit - (performance.now() - G.t0));
    var r = left / G.limit;
    $("timerFill").style.width = (r * 100) + "%";
    $("timerNum").textContent = (left / 1000).toFixed(1);
    $("timerWrap").classList.toggle("warn", r <= 0.5 && r > 0.25);
    $("timerWrap").classList.toggle("danger", r <= 0.25);
    if (r <= 0.25 && !G.warned) { G.warned = true; SFX.tick(); }
    if (left <= 0) answer(-1);
  }

  document.addEventListener("visibilitychange", function () {
    if (!G || G.locked) return;
    if (document.hidden) G.hidAt = performance.now();
    else if (G.hidAt) { G.t0 += performance.now() - G.hidAt; G.hidAt = 0; }
  });

  /* ══════════ 作答 ══════════ */
  function answer(idx) {
    if (G.locked) return;
    G.locked = true;
    stopTimer();
    var used = Math.min(performance.now() - G.t0, G.limit);
    var it = G.item;
    var ok = idx === it.ans;
    var timeout = idx === -1;

    G.i++;
    var p = G.per[it.cat];
    p.n++; p.ms += used;
    var pt = G.perT[it.t] || (G.perT[it.t] = { n: 0, ok: 0, ms: 0 });
    pt.n++; pt.ms += used;
    G.msSum += used;
    if (ok) { p.ok++; pt.ok++; }

    $("choices").querySelectorAll(".rx-opt").forEach(function (b, i) {
      b.classList.add("done");
      if (i === it.ans) b.classList.add("right");
      else if (i === idx) b.classList.add("wrong");
    });

    if (ok) {
      G.ok++;
      G.combo++;
      if (G.combo > G.maxCombo) G.maxCombo = G.combo;
      var speed = 1 - used / G.limit;
      var dmg = Math.round(10 + 12 * speed + Math.min(G.combo, 10));
      G.score += Math.round(dmg * 10 * G.d.mul);
      G.monHp -= dmg;
      SFX.hit();
      floatDmg("-" + dmg, "dmg");
      $("monImg").classList.add("hit");
      setTimeout(function () { $("monImg").classList.remove("hit"); }, 380);
      paintMonHp();
      var extra = speed > 0.7 ? '<span class="fb-bonus">⚡ 反射級！速度加成 +' + Math.round(12 * speed) + '</span>' : "";
      $("fb").className = "rx-fb ok show";
      $("fb").innerHTML = '<div class="fb-h">✔ 正解　<span class="fb-t">' + (used / 1000).toFixed(2) + ' 秒</span>' + extra + '</div>' +
        (it.tip ? '<div class="fb-tip">' + it.tip + '</div>' : "");
      rm($("fb"));
      if (G.monHp <= 0) { killMonster(); return; }
      paintHud();
      setTimeout(nextQuestion, speed > 0.5 ? 850 : 1250);
      return;
    }

    G.combo = 0;
    G.hp--;
    SFX.miss();
    $("arena").classList.add("shake");
    setTimeout(function () { $("arena").classList.remove("shake"); }, 420);
    G.wrongs.push({ cat: it.cat, t: it.t, g: it.g, q: it.q, ans: it.choices[it.ans], tip: it.tip, timeout: timeout });
    $("fb").className = "rx-fb no show";
    $("fb").innerHTML = '<div class="fb-h">' + (timeout ? "⏱ 時間到" : "✘ 答錯") +
      '　<span class="fb-t">正解：' + it.choices[it.ans] + '</span></div>' +
      (it.tip ? '<div class="fb-tip">' + it.tip + '</div>' : "") +
      '<button class="fb-next" id="fbNext">繼續 ▶（Enter）</button>';
    rm($("fb"));
    paintHud();
    if (G.hp <= 0) {
      setTimeout(function () { SFX.over(); endGame(); }, 1400);
      return;
    }
    G.waitNext = true;
    $("fbNext").addEventListener("click", goNext);
    G.autoNext = setTimeout(goNext, 3200);
  }

  function goNext() {
    if (!G.waitNext) return;
    G.waitNext = false;
    clearTimeout(G.autoNext);
    nextQuestion();
  }

  function killMonster() {
    G.kills++;
    var bonus = Math.round((300 + 100 * G.wave) * G.d.mul);
    G.score += bonus;
    SFX.kill();
    $("monImg").classList.add("dead");
    floatDmg("擊倒！+" + bonus, "kill");
    paintMonHp();
    paintHud();
    setTimeout(function () {
      G.wave++;
      if (G.i >= TOTAL || G.hp <= 0) { endGame(); return; }
      spawnMonster(false);
      nextQuestion();
    }, 1100);
  }

  function floatDmg(txt, cls) {
    var s = document.createElement("span");
    s.className = "rx-float " + cls;
    s.textContent = txt;
    s.style.left = (35 + Math.random() * 30) + "%";
    $("monBox").appendChild(s);
    setTimeout(function () { s.remove(); }, 1000);
  }

  /* ══════════ 結算 ══════════ */
  function endGame() {
    stopTimer();
    clearTimeout(G.autoNext);
    G.locked = true;
    var n = G.i || 1;
    var acc = Math.round(100 * G.ok / n);
    var avg = (G.msSum / n / 1000).toFixed(2);

    var db = load();
    db.best = db.best || {};
    var b = db.best[G.d.id];
    if (!b || G.score > b.score) {
      db.best[G.d.id] = { score: G.score, acc: acc, combo: G.maxCombo, avg: avg, scope: G.scope, ts: Date.now() };
    }
    db.stats = db.stats || {};
    Object.keys(G.per).forEach(function (c) {
      var s = db.stats[c] || { n: 0, ok: 0, ms: 0 };
      s.n += G.per[c].n; s.ok += G.per[c].ok; s.ms += G.per[c].ms;
      db.stats[c] = s;
    });
    save(db);

    var rank, cow, word;
    if (G.hp <= 0) { rank = "被打倒了"; cow = "cow_zzz.png"; word = "血量歸零。先把難度調低一級，把「想得出來」練成「不用想」。"; }
    else if (acc >= 90 && G.d.sec <= 3) { rank = "反射大師"; cow = "cow_scholar.png"; word = "3 秒內 9 成正確——這些觀念已經變成本能了。"; }
    else if (acc >= 90) { rank = "身手俐落"; cow = "cow_scholar.png"; word = "正確率很漂亮，下一步是把難度往上推一級，逼出真正的反射。"; }
    else if (acc >= 70) { rank = "漸入佳境"; cow = "cow_teach.png"; word = "會的部分已經穩了，弱點就在下面那張表——針對它練最省時間。"; }
    else { rank = "還在思考"; cow = "cow_question.png"; word = "現在多半是「算得出來但來不及」，那代表還在算、還沒變成記憶。"; }

    var diag = REFLEX_BANK.cats.filter(function (c) { return G.per[c.id] && G.per[c.id].n > 0; })
      .map(function (c) {
        var s = G.per[c.id];
        var a = Math.round(100 * s.ok / s.n);
        var lv = a >= 80 ? "good" : a >= 50 ? "mid" : "bad";
        return '<div class="dg ' + lv + '">' +
          '<div class="dg-n">' + c.icon + ' ' + c.name + '</div>' +
          '<div class="dg-bar"><i style="width:' + a + '%"></i></div>' +
          '<div class="dg-v">' + s.ok + '/' + s.n + '（' + a + '%）．平均 ' +
          (s.ms / s.n / 1000).toFixed(1) + ' 秒' + (a >= 80 ? "．已經很穩" : "") + '</div></div>';
      }).join("");

    var weak = Object.keys(G.perT).filter(function (id) { return G.perT[id].ok < G.perT[id].n; });
    weak.sort(function (x, y) { return (G.perT[x].ok / G.perT[x].n) - (G.perT[y].ok / G.perT[y].n); });
    var tDiag = !weak.length
      ? '<div class="rx-none">這一場涵蓋的單元全部答對，沒有需要回頭補的地方 🎉</div>'
      : weak.map(function (id) {
        var s = G.perT[id];
        return '<div class="chd">' +
          '<span class="chd-n">' + REFLEX_BANK.labelOf(id) + '</span>' +
          '<span class="chd-v">' + s.ok + '/' + s.n + '　平均 ' + (s.ms / s.n / 1000).toFixed(1) + ' 秒</span>' +
          '<a class="chd-go" href="' + REFLEX_BANK.pageOf(id) + '">去工具地圖看這個單元 →</a></div>';
      }).join("");

    var wrongList = !G.wrongs.length
      ? '<div class="rx-none">這一場全對，沒有錯題可以檢討 🎉</div>'
      : G.wrongs.map(function (w) {
        var c = catOf(w.cat);
        return '<div class="wr"><div class="wr-c">' + c.icon + ' ' + c.name +
          (w.timeout ? '<span class="wr-to">超時</span>' : '<span class="wr-x">答錯</span>') +
          '<span class="wr-ch">' + REFLEX_BANK.shortOf(w.t) + '｜' + REFLEX_BANK.gradeName[w.g] + '</span></div>' +
          '<div class="wr-q">' + w.q + '</div>' +
          '<div class="wr-a">正解：' + w.ans + '</div>' +
          (w.tip ? '<div class="wr-t">' + w.tip + '</div>' : "") + '</div>';
      }).join("");

    $("endBody").innerHTML =
      '<div class="rx-end-head">' +
        '<img class="end-cow" src="assets/mascot/web/' + cow + '" alt="牛夫子">' +
        '<div><div class="end-rank">' + rank + '　<span class="end-cond">' +
          G.d.sec + ' 秒｜' + G.scope + '</span></div>' +
        '<div class="end-score">' + G.score + ' 分</div>' +
        '<div class="end-word">' + word + '</div></div>' +
      '</div>' +
      '<div class="rx-stats">' +
        '<div><b>' + acc + '%</b><span>正確率（' + G.ok + '/' + G.i + '）</span></div>' +
        '<div><b>' + avg + ' 秒</b><span>平均反應</span></div>' +
        '<div><b>' + G.maxCombo + '</b><span>最高連擊</span></div>' +
        '<div><b>' + G.kills + '</b><span>擊倒怪物</span></div>' +
        '<div><b>' + G.hp + ' / ' + MAX_HP + '</b><span>剩餘生命</span></div>' +
      '</div>' +
      '<h3 class="rx-h3">🔍 題型診斷</h3><div class="rx-diag">' + diag + '</div>' +
      '<h3 class="rx-h3">📚 該回去補的單元</h3><div class="rx-chdiag">' + tDiag + '</div>' +
      '<h3 class="rx-h3">📓 錯題回顧</h3><div class="rx-wrongs">' + wrongList + '</div>';

    rm($("endBody"));
    show("scrEnd");

    /* 雲端上傳（有登入才會真的傳）；結果補在分數下面 */
    var slot = document.createElement("div");
    slot.id = "cloudResult";
    var head = $("endBody").querySelector(".rx-end-head");
    head.parentNode.insertBefore(slot, head.nextSibling);
    cloudSubmit({ diff: G.d.id, score: G.score, acc: acc, combo: G.maxCombo, avg: avg, scope: G.scope })
      .then(function (html) { slot.innerHTML = html; });
  }

  /* ══════════ 鍵盤 ══════════ */
  document.addEventListener("keydown", function (e) {
    var playing = !$("scrPlay").classList.contains("hide");
    if (!playing) {
      if (e.key === "Enter" && !$("scrMenu").classList.contains("hide") &&
          document.activeElement && document.activeElement.tagName !== "SELECT") {
        e.preventDefault(); startGame();
      }
      return;
    }
    if (G && G.waitNext && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); goNext(); return; }
    if (e.key >= "1" && e.key <= "4") {
      var b = $("choices").querySelectorAll(".rx-opt")[+e.key - 1];
      if (b && !G.locked) { e.preventDefault(); answer(+e.key - 1); }
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    var db = load();
    muted = !!db.muted;
    $("btnMute").textContent = muted ? "🔇 音效關" : "🔊 音效開";
    $("btnMute").addEventListener("click", function () {
      muted = !muted;
      var d = load(); d.muted = muted; save(d);
      $("btnMute").textContent = muted ? "🔇 音效關" : "🔊 音效開";
      if (!muted) SFX.tick();
    });
    $("btnStart").addEventListener("click", startGame);
    $("btnAgain").addEventListener("click", startGame);
    $("btnMenu").addEventListener("click", function () { buildMenu(); show("scrMenu"); });
    $("btnGiveUp").addEventListener("click", function () {
      if (!G) return;
      stopTimer();
      if (G.i > 0) endGame();
      else { G.locked = true; buildMenu(); show("scrMenu"); }
    });
    buildMenu();
    bootCloud();
  });
})();
