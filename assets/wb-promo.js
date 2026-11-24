/* 外站頁首「牛夫子錯題本」導流條（2026-11-24，T-261124-jh1；老師 11-24 圈選表乙 17）
 * 和高中外站同一支（高中數學教學系統/assets/wb-promo.js，T-261124-hs1），只差來源代號 jh_site。
 * 只在國中外站（Niufutzu-jh-math）由 build-dist.ps1 加進 dist 的頁面；專案裡的原始頁不載入這支。
 * 從錯題本連過來的人（wb-back.js 記的 sessionStorage wb.back）不顯示；按 × 收起後，這個分頁裡換頁都不再顯示。
 * 和高中那支只差三處：來源代號、「去看看 →」不拆行、網址／上一頁的判斷移到 try 外面（窄手機原本箭頭會單獨掉到第二行）。
 * 連結帶 ?from=jh_site，錯題本那邊可以看出是從國中外站來的。 */
(function () {
  "use strict";
  var URL = "https://wrongbook.niufutzu.com/?from=jh_site", KEY = "wb.promo.x";
  /* 網址和上一頁的判斷不靠 sessionStorage，放在 try 外面：sessionStorage 被擋（無痕、內建瀏覽器）時也照樣判斷（R-1124-11 第 6 點） */
  if (/[?&]wb=/.test(location.search) || /^https:\/\/wrongbook\.niufutzu\.com\//.test(document.referrer || "")) return;
  try {
    if (sessionStorage.getItem("wb.back") || sessionStorage.getItem(KEY)) return;
  } catch (e) {}
  function add() {
    if (document.getElementById("wbPromo")) return;
    var bar = document.createElement("div");
    bar.id = "wbPromo";
    bar.setAttribute("style", "display:flex;align-items:center;gap:8px;background:#5c222b;color:#fff;" +
      "font:600 14px/1.45 'Noto Sans TC','Microsoft JhengHei',sans-serif;padding:7px 12px;position:relative;z-index:60");
    var a = document.createElement("a");
    a.href = URL;
    a.setAttribute("style", "color:#fff;text-decoration:none;flex:1;min-width:0;text-align:center");
    a.innerHTML = "<b>牛夫子錯題本</b>：拍照收錯題、五級模擬卷 <span style=\"text-decoration:underline;white-space:nowrap\">去看看 →</span>";
    var x = document.createElement("button");
    x.type = "button"; x.setAttribute("aria-label", "收起"); x.textContent = "×";
    x.setAttribute("style", "flex:none;background:none;border:0;color:#fff;font:400 20px/1 sans-serif;padding:0 4px;cursor:pointer;opacity:.8");
    x.onclick = function () { try { sessionStorage.setItem(KEY, "1"); } catch (e) {} bar.remove(); };
    bar.appendChild(a); bar.appendChild(x);
    var st = document.createElement("style");
    st.textContent = "@media print{#wbPromo{display:none!important}}";
    bar.appendChild(st);
    document.body.insertBefore(bar, document.body.firstChild);
  }
  if (document.body) add(); else document.addEventListener("DOMContentLoaded", add);
})();
