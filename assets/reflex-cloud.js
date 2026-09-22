/* 牛夫子直覺道場 — 雲端（Firebase）：Email 登入、成績上傳、排行榜
 *
 * 對外只暴露 window.ReflexCloud，reflex.js 只跟它講話，不直接碰 Firebase。
 * 沒有設定（assets/firebase-config.js 的 FIREBASE_CONFIG 為 null）或載入失敗時，
 * ReflexCloud.ready 會解析成 false，道場所有雲端功能自動隱藏，遊戲本身不受影響。
 *
 * 資料結構（Firestore）
 *   users/{uid}                          { nick, email, createdAt }
 *   boards/{boardId}/entries/{uid}       個人在某個榜上的最佳成績（一人一筆，只會往上更新）
 *       boardId = "all_s10"（總榜，依難度）或 "w2026-39_s10"（本週榜，ISO 週）
 *       { uid, nick, score, acc, combo, avg, diff, scope, ts }
 *   runs/{autoId}                        每一場的完整紀錄（老師在主控台看／匯出用，學生讀不到）
 *
 * 榜的 id 把「難度」和「週」編進集合名稱，查詢時只要 orderBy(score) 一個欄位，
 * 不必到主控台建複合索引。
 *
 * 登入方式：Email 連結（免密碼）。學生輸入 Email → 收信 → 點連結 → 回到這頁就登入了。
 * 在網址加 ?cloud=mock 會改用「記憶體假後端」，方便沒有 Firebase 時試畫面。
 */
(function () {
  "use strict";

  var SDK = "https://www.gstatic.com/firebasejs/11.6.0/";
  var DIFFS = ["s20", "s15", "s10", "s5", "s3"];
  var EMAIL_KEY = "jhmath.reflex.email";
  var TOP = 30;                 // 榜上顯示幾名
  var RANK_SCAN = 100;          // 算「第幾名」時最多往下看幾筆

  /* ISO 週：星期一開始；學生都在台灣，用本地日期就好 */
  function weekKey(now) {
    var d = new Date(now || Date.now());
    var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    var y = t.getUTCFullYear();
    var w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7);
    return "w" + y + "-" + (w < 10 ? "0" : "") + w;
  }
  function boardId(kind, diff) { return (kind === "week" ? weekKey() : "all") + "_" + diff; }
  function cleanNick(s) {
    return String(s || "").replace(/[<>&"'\u0000-\u001f]/g, "").trim().slice(0, 12);
  }
  function validEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }

  var listeners = [];
  var state = { user: null, nick: "", mode: null };
  function emit() { listeners.forEach(function (f) { try { f(state.user, state.nick); } catch (e) {} }); }

  var api = {
    weekKey: weekKey,
    boardId: boardId,
    cleanNick: cleanNick,
    validEmail: validEmail,
    onAuth: function (f) { listeners.push(f); if (state.mode) f(state.user, state.nick); },
    user: function () { return state.user; },
    nick: function () { return state.nick; },
    mode: function () { return state.mode; },
    rememberedEmail: function () { try { return localStorage.getItem(EMAIL_KEY) || ""; } catch (e) { return ""; } }
  };
  window.ReflexCloud = api;

  /* ══════════ 記憶體假後端（?cloud=mock） ══════════ */
  function mockBackend() {
    var db = { users: {}, boards: {}, runs: [] };
    var uid = "mock-me";
    ["小明", "阿華", "小美", "大雄", "靜香"].forEach(function (n, i) {
      DIFFS.forEach(function (d) {
        ["all", "week"].forEach(function (k) {
          var b = db.boards[boardId(k, d)] = db.boards[boardId(k, d)] || {};
          b["mock-" + i] = { uid: "mock-" + i, nick: n, score: 1200 + i * 730 + DIFFS.indexOf(d) * 90,
            acc: 60 + i * 8, combo: 3 + i, avg: (5 - i * 0.6).toFixed(2), diff: d, scope: "國中全範圍", ts: Date.now() - i * 864e5 };
        });
      });
    });
    function top(id) {
      return Object.keys(db.boards[id] || {}).map(function (k) { return db.boards[id][k]; })
        .sort(function (a, b) { return b.score - a.score; });
    }
    return {
      init: function () { state.mode = "mock"; state.user = null; emit(); return Promise.resolve(true); },
      sendLink: function (email) { try { localStorage.setItem(EMAIL_KEY, email); } catch (e) {} return Promise.resolve(); },
      finishLink: function () { return Promise.resolve(false); },
      mockLogin: function () {
        state.user = { uid: uid, email: api.rememberedEmail() || "me@example.com" };
        state.nick = db.users[uid] ? db.users[uid].nick : "";
        emit();
      },
      signOut: function () { state.user = null; state.nick = ""; emit(); return Promise.resolve(); },
      setNick: function (n) {
        db.users[uid] = { nick: n };
        Object.keys(db.boards).forEach(function (id) { if (db.boards[id][uid]) db.boards[id][uid].nick = n; });
        state.nick = n; emit(); return Promise.resolve();
      },
      submit: function (run) {
        db.runs.push(run);
        var out = {};
        ["all", "week"].forEach(function (k) {
          var id = boardId(k, run.diff), b = db.boards[id] = db.boards[id] || {};
          var old = b[uid];
          var improved = !old || run.score > old.score;
          if (improved) b[uid] = Object.assign({}, run, { uid: uid, nick: state.nick });
          var rows = top(id), best = (b[uid] || old).score;
          out[k] = { improved: improved, best: best, rank: rows.findIndex(function (r) { return r.uid === uid; }) + 1, total: rows.length };
        });
        return Promise.resolve(out);
      },
      board: function (kind, diff) {
        var rows = top(boardId(kind, diff)).slice(0, TOP);
        return Promise.resolve({ rows: rows, me: (db.boards[boardId(kind, diff)] || {})[uid] || null, myUid: uid });
      }
    };
  }

  /* ══════════ 真的 Firebase ══════════ */
  function firebaseBackend(cfg) {
    var A, F, auth, fs;
    function load() {
      return Promise.all([
        import(SDK + "firebase-app.js"),
        import(SDK + "firebase-auth.js"),
        import(SDK + "firebase-firestore.js")
      ]).then(function (m) {
        A = m[1]; F = m[2];
        var app = m[0].initializeApp(cfg);
        auth = A.getAuth(app);
        fs = F.getFirestore(app);
        A.setPersistence(auth, A.browserLocalPersistence).catch(function () {});
      });
    }
    function userDoc(uid) { return F.doc(fs, "users", uid); }
    function entryDoc(id, uid) { return F.doc(fs, "boards", id, "entries", uid); }

    function loadNick(u) {
      return F.getDoc(userDoc(u.uid)).then(function (s) {
        state.nick = s.exists() ? (s.data().nick || "") : "";
      }).catch(function () { state.nick = ""; });
    }

    return {
      init: function () {
        return load().then(function () {
          state.mode = "firebase";
          return new Promise(function (resolve) {
            var first = true;
            A.onAuthStateChanged(auth, function (u) {
              state.user = u ? { uid: u.uid, email: u.email } : null;
              (u ? loadNick(u) : Promise.resolve(state.nick = "")).then(function () {
                emit();
                if (first) { first = false; resolve(true); }
              });
            });
          });
        });
      },
      /* 寄登入連結。連結會帶回這一頁（去掉 hash 與 query），同一台裝置點開就直接登入。 */
      sendLink: function (email) {
        try { localStorage.setItem(EMAIL_KEY, email); } catch (e) {}
        var url = location.origin + location.pathname;
        return A.sendSignInLinkToEmail(auth, email, { url: url, handleCodeInApp: true });
      },
      /* 頁面載入時：這個網址是不是登入連結？是的話完成登入。回傳 "done" / "need-email" / false */
      finishLink: function (emailFromUser) {
        if (!A.isSignInWithEmailLink(auth, location.href)) return Promise.resolve(false);
        var email = emailFromUser || api.rememberedEmail();
        if (!email) return Promise.resolve("need-email");
        return A.signInWithEmailLink(auth, email, location.href).then(function () {
          try { localStorage.setItem(EMAIL_KEY, email); } catch (e) {}
          history.replaceState(null, "", location.origin + location.pathname);
          return "done";
        });
      },
      signOut: function () { return A.signOut(auth); },
      setNick: function (n) {
        var u = state.user;
        if (!u) return Promise.reject(new Error("not signed in"));
        return F.setDoc(userDoc(u.uid), { nick: n, email: u.email, updatedAt: F.serverTimestamp() }, { merge: true })
          .then(function () {
            state.nick = n; emit();
            /* 已經在榜上的名字一起改（沒有那筆就略過） */
            var ids = [];
            DIFFS.forEach(function (d) { ids.push(boardId("all", d), boardId("week", d)); });
            return Promise.all(ids.map(function (id) {
              return F.updateDoc(entryDoc(id, u.uid), { nick: n }).catch(function () {});
            }));
          });
      },
      /* 上傳一場：寫 runs、更新兩個榜（只在破個人最佳時），回傳名次 */
      submit: function (run) {
        var u = state.user;
        if (!u || !state.nick) return Promise.reject(new Error("not signed in"));
        var entry = { uid: u.uid, nick: state.nick, score: run.score, acc: run.acc, combo: run.combo,
          avg: run.avg, diff: run.diff, scope: run.scope, ts: F.serverTimestamp() };
        var out = {};
        return F.addDoc(F.collection(fs, "runs"), Object.assign({ week: weekKey(), email: u.email }, entry))
          .catch(function () {})
          .then(function () {
            return Promise.all(["all", "week"].map(function (k) {
              var id = boardId(k, run.diff), ref = entryDoc(id, u.uid);
              return F.getDoc(ref).then(function (s) {
                var old = s.exists() ? s.data().score : -1;
                var improved = run.score > old;
                var p = improved ? F.setDoc(ref, entry) : Promise.resolve();
                return p.then(function () { return rank(id, u.uid); }).then(function (r) {
                  out[k] = { improved: improved, best: Math.max(old, run.score), rank: r.rank, total: r.total };
                });
              });
            }));
          }).then(function () { return out; });
      },
      board: function (kind, diff) {
        var id = boardId(kind, diff);
        var q = F.query(F.collection(fs, "boards", id, "entries"), F.orderBy("score", "desc"), F.limit(TOP));
        var me = state.user ? F.getDoc(entryDoc(id, state.user.uid)).then(function (s) { return s.exists() ? s.data() : null; }) : Promise.resolve(null);
        return Promise.all([F.getDocs(q), me]).then(function (r) {
          return { rows: r[0].docs.map(function (d) { return d.data(); }), me: r[1], myUid: state.user ? state.user.uid : null };
        });
      }
    };
    function rank(id, uid) {
      var q = F.query(F.collection(fs, "boards", id, "entries"), F.orderBy("score", "desc"), F.limit(RANK_SCAN));
      return F.getDocs(q).then(function (s) {
        var i = s.docs.findIndex(function (d) { return d.id === uid; });
        return { rank: i + 1, total: s.size };            /* rank 0 = 前 RANK_SCAN 名之外 */
      });
    }
  }

  /* ══════════ 啟動 ══════════ */
  var useMock = /[?&]cloud=mock(&|$)/.test(location.search);
  var cfg = window.FIREBASE_CONFIG;
  var backend = useMock ? mockBackend() : (cfg && cfg.apiKey ? firebaseBackend(cfg) : null);

  api.ready = !backend ? Promise.resolve(false)
    : backend.init().then(function () {
        Object.keys(backend).forEach(function (k) { if (k !== "init") api[k] = backend[k]; });
        return true;
      }).catch(function (e) {
        if (window.console) console.warn("[reflex-cloud] 雲端啟動失敗，改用純本機模式：", e && e.message);
        state.mode = null;
        return false;
      });
})();
