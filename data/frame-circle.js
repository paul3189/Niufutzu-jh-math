/* 架構重建卡（國中）05：圓的角與線。格式見高中專案 _scripts/frame_cards/FORMAT.md；數值例由 verify_frames.py 驗算。兩圓的位置關係是補充（S-9-7 只有點與圓、直線與圓），不收。 */
FRAME({
  id: "circle", stage: "jh", no: 5, n: "圓的角與線",
  scope: "九年級；兩圓屬補充不收",
  curr: ["S-9-6", "S-9-7"],   // 課綱碼只給資料用，不印在學生看的卡上
  time: 10,
  intro: "圓的定理看起來很多，其實分兩半：「角」那一半全部都在講弧的度數；「線」那一半每一條都藏著一個直角三角形。每格寫關係或公式、看到什麼時用、前提。右下兩張位置關係表的列名先遮住了，請自己寫出共有幾種。想不出來就寫「?」，不要空著。",
  sections: [
    {
      id: "ang", col: 1, title: "A　角：都在講弧", type: "props", rowH: 15,
      fields: [{ id: "rel", n: "關係或公式" }, { id: "when", n: "看到什麼時用" }, { id: "pre", n: "前提" }],
      rows: [
        { id: "1", n: "圓心角與弧", ans: { rel: "圓心角 $=$ 所對弧的度數；同圓中圓心角相等 $\\iff$ 弧相等 $\\iff$ 弦相等", when: "比較弧長、弦長，或由弧反推角度", pre: "同一個圓或等圓；弧的「度數」和「長度」是兩回事" },
          tools: ["circle/parts/圓心角與弧"], kp: ["parts"],
          ex: [{ id: "r1", q: "半徑 $6$，圓心角 $60^\\circ$ 所對的弦長", a: "$6$（正三角形）", val: "6" }] },
        { id: "2", n: "圓周角", reduce: ["1"], reduceNote: "圓周角是圓心角的一半，所以也是看弧", ans: { rel: "圓周角 $=\\frac12$ 圓心角 $=\\frac12$ 所對弧的度數", when: "圖上同時有圓心角與圓周角、或要比較兩個角", pre: "頂點在圓上；兩個角對同一段弧" },
          tools: ["circle/angle/圓周角定理"], kp: ["angle"],
          ex: [{ id: "r2", q: "弧 $AB$ 的度數 $80^\\circ$，$C$ 是圓上另一點，圓周角 $\\angle ACB=$", a: "$40^\\circ$", val: "40" }] },
        { id: "3", n: "同弧上的圓周角", reduce: ["2"], ans: { rel: "同側相等；另一側的兩角互補", when: "很多個角對著同一段弧時自由代換", pre: "頂點在弧的同一側才相等" },
          tools: ["circle/angle/同弧上的圓周角相等"], kp: ["angle"],
          ex: [{ id: "r3a", q: "$C$、$D$ 在弧 $AB$ 同側，$\\angle ACB=35^\\circ$，則 $\\angle ADB=$", a: "$35^\\circ$", val: "35" }, { id: "r3b", q: "$D$ 改到另一側", a: "$145^\\circ$", val: "145" }] },
        { id: "4", n: "直徑所對的圓周角", reduce: ["2"], reduceNote: "直徑對的弧是 $180^\\circ$，一半就是 $90^\\circ$", ans: { rel: "$\\overline{AB}$ 為直徑 $\\Rightarrow\\angle ACB=90^\\circ$；反過來也成立", when: "看到直徑立刻找直角三角形，接畢氏定理", pre: "一定要是直徑，普通的弦不行" },
          tools: ["circle/angle/直徑所對的圓周角是直角"], kp: ["angle"],
          ex: [{ id: "r4", q: "$\\overline{AB}$ 為直徑，$\\overline{AC}=6$、$\\overline{BC}=8$，半徑 $=$", a: "$5$", val: "5" }] },
        { id: "5", n: "圓內接四邊形", reduce: ["2"], reduceNote: "對角對的兩段弧合起來是一整圓 $360^\\circ$，各取一半", ans: { rel: "對角互補；外角 $=$ 內對角", when: "四個頂點都在圓上", pre: "是對角不是鄰角" },
          tools: ["circle/angle/圓內接四邊形對角互補"], kp: ["angle"],
          ex: [{ id: "r5", q: "圓內接四邊形 $\\angle A=70^\\circ$，則 $\\angle C=$", a: "$110^\\circ$", val: "110" }] }
      ]
    },
    {
      id: "line", col: 2, title: "B　線：每條都藏一個直角三角形", type: "props", rowH: 15,
      fields: [{ id: "rel", n: "關係或公式" }, { id: "when", n: "看到什麼時用" }, { id: "pre", n: "前提（直角三角形在哪）" }],
      rows: [
        { id: "6", n: "弦心距", ans: { rel: "圓心到弦的垂線平分弦；弦長 $=2\\sqrt{r^2-d^2}$（$r$ 半徑、$d$ 弦心距）", when: "已知半徑與弦心距求弦長，或反過來", pre: "直角三角形：半徑、弦心距、半弦" },
          tools: ["circle/parts/垂直於弦的直徑平分弦"], kp: ["parts"],
          ex: [{ id: "r6", q: "$r=5$、弦心距 $3$，弦長", a: "$8$", val: "8" }] },
        { id: "7", n: "切線 $\\perp$ 過切點的半徑", reduce: ["6"], reduceNote: "相切就是 $d=r$ 的弦心距，弦長縮成 $0$", ans: { rel: "$\\overline{OA}\\perp$ 切線（$O$ 圓心、$A$ 切點）", when: "看到「相切」立刻在切點畫半徑", pre: "直角三角形：半徑、切線段、圓心到外點" },
          tools: ["circle/tangent/切線垂直於過切點的半徑"], kp: ["tangent"],
          ex: [{ id: "r7", q: "圓心 $O$、半徑 $r=5$，圓外一點 $P$ 到 $O$ 的距離 $\\overline{OP}=13$，切線段 $\\overline{PA}=$（$A$ 切點）", a: "$12$", val: "12" }] },
        { id: "8", n: "切線長相等", reduce: ["7"], reduceNote: "兩個直角三角形共用 $\\overline{OP}$（$O$ 圓心、$P$ 圓外點）、半徑相等，RHS 全等", ans: { rel: "自圓外一點作兩切線，兩切線段相等", when: "求周長、證等腰、內切圓分邊的問題", pre: "兩切線段要從同一個圓外點出發" },
          tools: ["circle/tangent/切線長相等"], kp: ["tangent"],
          ex: [{ id: "r8", q: "$\\triangle ABC$ 三邊切一圓，切點 $D$、$E$、$F$ 分別在 $\\overline{BC}$、$\\overline{CA}$、$\\overline{AB}$ 上，$\\overline{AF}=3$、$\\overline{BD}=4$、$\\overline{CE}=5$，周長 $=$", a: "$24$", val: "24" }] }
      ]
    },
    {
      id: "pc", title: "C　點與圓：共有幾種？（$O$ 圓心、$r$ 半徑、$P$ 那個點，拿 $\\overline{OP}$ 與 $r$ 比）", type: "table", col: 2, hideNames: true, short: "點與圓", rowH: 7,
      fields: [{ id: "cond", n: "條件" }, { id: "tan", n: "過這點的切線幾條" }],
      rows: [
        { id: "9", n: "圓內", ans: { cond: "$\\overline{OP}<r$", tan: "$0$" }, tools: ["circle/tangent/點與圓的位置關係"], kp: ["tangent"],
          ex: [{ id: "r9", q: "$\\overline{OP}=3$、$r=5$，過 $P$ 的切線條數", a: "$0$", val: "0" }] },
        { id: "10", n: "圓上", ans: { cond: "$\\overline{OP}=r$", tan: "$1$" }, tools: ["circle/tangent/點與圓的位置關係"], kp: ["tangent"],
          ex: [{ id: "r10", q: "$\\overline{OP}=5$、$r=5$", a: "$1$", val: "1" }] },
        { id: "11", n: "圓外", ans: { cond: "$\\overline{OP}>r$", tan: "$2$" }, tools: ["circle/tangent/點與圓的位置關係"], kp: ["tangent"],
          ex: [{ id: "r11", q: "$\\overline{OP}=7$、$r=5$", a: "$2$", val: "2" }] }
      ]
    },
    {
      id: "lc", title: "D　直線與圓：共有幾種？（圓心到直線的距離 $d$ 與半徑 $r$ 比）", type: "table", col: 2, hideNames: true, short: "直線與圓", rowH: 7,
      fields: [{ id: "cond", n: "條件" }, { id: "pts", n: "交點數" }],
      rows: [
        { id: "12", n: "相離", ans: { cond: "$d>r$", pts: "$0$" }, tools: ["circle/tangent/直線與圓的位置關係"], kp: ["tangent"],
          ex: [{ id: "r12", q: "圓 $r=5$（圓心原點）與 $3x+4y=30$ 的交點數", a: "$0$（$d=6$）", val: "0" }] },
        { id: "13", n: "相切", reduce: ["7"], ans: { cond: "$d=r$", pts: "$1$" }, tools: ["circle/tangent/直線與圓的位置關係"], kp: ["tangent"],
          ex: [{ id: "r13", q: "同上，改 $3x+4y=25$", a: "$1$（$d=5$）", val: "1" }] },
        { id: "14", n: "相交", reduce: ["6"], reduceNote: "弦長 $2\\sqrt{r^2-d^2}$", ans: { cond: "$d<r$", pts: "$2$" }, tools: ["circle/tangent/直線與圓的位置關係"], kp: ["tangent"],
          ex: [{ id: "r14", q: "同上，改 $3x+4y=0$，弦長", a: "$10$（$d=0$，直徑）", val: "10" }] }
      ]
    }
  ],
  final: [
    { id: "f1", q: "A 的五列最後都降成哪一句話？畫出箭頭。", ans: "全部降成「看所對弧的度數」：圓心角 $=$ 弧，圓周角 $=\\frac12$ 弧；同弧相等、直徑對直角、內接四邊形對角互補都是它的特例。", lines: 2 },
    { id: "f2", q: "B 的三列各藏一個直角三角形，三邊分別是什麼？接下來要用哪條定理？", ans: "弦心距：半徑、弦心距、半弦。切線：半徑、切線段、$\\overline{OP}$。切線長相等：兩個這樣的直角三角形 RHS 全等。接下來都用畢氏定理。", lines: 2 },
    { id: "f3", q: "C、D 兩張位置關係表都在比什麼？「相切」在 B 的哪一列？", ans: "都是「一個距離和半徑比」：點與圓比 $\\overline{OP}$，直線與圓比圓心到直線的距離 $d$。相切 $d=r$ 就是 B 的切線那一列。", lines: 2 }
  ],
  example: { q: "圓內接四邊形 $\\angle A=70^\\circ$，有人說 $\\angle B=110^\\circ$，哪裡錯？另外，頂點不在圓上的角，還能說它等於弧的一半嗎？", ans: "互補的是對角 $\\angle C$，不是鄰角 $\\angle B$（$\\angle B$ 由題目另給）。圓周角定理的前提是頂點在圓上；頂點在圓內或圓外的角不等於弧的一半，要先補線做成圓周角才能用。", lines: 3 },
  pitfalls: [
    "頂點不在圓上也套圓周角定理；頂點跑到弧的另一側還說相等。",
    "只是弦（不是直徑）也說對的圓周角是 $90^\\circ$。",
    "內接四邊形把鄰角寫成互補。",
    "把弦心距 $d$ 當成圓心到弦端點的距離（那是半徑）。",
    "把任一條半徑都當成垂直於切線；從不同的點作切線也說相等。",
    "點與圓拿點到圓周上某一點的距離去比；直線與圓用圓心到直線上某一點的距離當 $d$。",
    "拿兩個不同半徑的圓比較弧長（度數相等長度不一定相等）。"
  ]
});
