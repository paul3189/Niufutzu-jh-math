/* 架構重建卡（國中）04：相似形（三種判別、四種型態、比）。格式見高中專案 _scripts/frame_cards/FORMAT.md；數值例由 verify_frames.py 驗算。 */
FRAME({
  id: "sim", stage: "jh", no: 4, n: "相似形：判別、型態與比",
  scope: "九年級",
  curr: ["S-9-1", "S-9-2", "S-9-3"],   // 課綱碼只給資料用，不印在學生看的卡上
  time: 10,
  intro: "相似形有三層：怎麼判定相似（和全等比一比，哪些條件變少了）、題目裡的相似三角形長什麼樣（四種型態，認出型態就知道對應順序）、相似之後比怎麼用（邊、高、周長、面積）。每格寫條件或公式、看到什麼時用、前提。想不出來就寫「?」，不要空著。",
  sections: [
    {
      id: "crit", col: 1, title: "A　判別：和全等比一比", type: "table", rowH: 18,
      fields: [{ id: "cond", n: "條件" }, { id: "vs", n: "和全等的哪一條對應？差在哪" }, { id: "pre", n: "前提" }],
      rows: [
        { id: "1", n: "AA 相似", ans: { cond: "$\\triangle ABC$ 對 $\\triangle DEF$（$A$ 對 $D$、$B$ 對 $E$、$C$ 對 $F$）：$\\angle A=\\angle D$、$\\angle B=\\angle E$", vs: "全等沒有 AAA 這條；相似只管形狀，兩角就夠（第三角自動相等）", pre: "只對三角形成立；對應順序照相等的角寫" },
          tools: ["similar/sim/AA 相似（兩組角相等）"], kp: ["sim"],
          ex: [{ id: "s1", q: "$\\angle A=\\angle D$、$\\angle B=\\angle E$，$\\overline{AB}=6$、$\\overline{DE}=9$、$\\overline{BC}=4$，則 $\\overline{EF}=$", a: "$6$（相似比 $2:3$）", val: "6" }] },
        { id: "2", n: "SAS 相似", reduce: ["1"], reduceNote: "兩邊成比例＋夾角相等，畫出來第三邊也成比例，角就全對上", ans: { cond: "$\\triangle ABC$ 對 $\\triangle DEF$：$\\dfrac{\\overline{AB}}{\\overline{DE}}=\\dfrac{\\overline{BC}}{\\overline{EF}}$ 且夾角 $\\angle B=\\angle E$", vs: "全等的 SAS 把「邊相等」改成「邊成比例」", pre: "角必須是兩邊的夾角（SSA 一樣不行）" },
          tools: ["similar/sim/SAS 相似（兩邊成比例且夾角相等）"], kp: ["sim"],
          ex: [{ id: "s2", q: "$\\overline{AB}=2$、$\\overline{BC}=3$、$\\angle B=60^\\circ$；$\\overline{DE}=4$、$\\overline{EF}=6$、$\\angle E=60^\\circ$，則 $\\overline{DF}=$", a: "$2\\sqrt7$（$\\overline{AC}=\\sqrt7$ 的 $2$ 倍）", val: "2*sqrt(7)" }] },
        { id: "3", n: "SSS 相似", reduce: ["1"], ans: { cond: "$\\triangle ABC$ 對 $\\triangle DEF$：$\\dfrac{\\overline{AB}}{\\overline{DE}}=\\dfrac{\\overline{BC}}{\\overline{EF}}=\\dfrac{\\overline{CA}}{\\overline{FD}}$", vs: "全等的 SSS 把「相等」改成「成比例」", pre: "三組比值都要算出來確認一樣；只算兩組不夠" },
          tools: ["similar/sim/SSS 相似（三邊成比例）"], kp: ["sim"],
          ex: [{ id: "s3", q: "$4.5,6,7.5$ 與 $3,4,5$ 的相似比", a: "$\\dfrac32$（三組都是）", val: "3/2" }] },
        { id: "4", n: "多邊形（四邊以上）", ans: { cond: "對應角相等「且」對應邊成比例，兩個都要", vs: "沒有 AA、沒有 SSS 這種捷徑，那是三角形獨有的", pre: "反例：矩形與正方形（角全等、邊不成比例）；菱形與正方形（邊成比例、角不等）" },
          tools: ["similar/sim/相似多邊形（定義）", "similar/sim/反例①　只有對應角相等，不夠", "similar/sim/反例②　只有對應邊成比例，也不夠"], kp: ["sim"],
          ex: [{ id: "s4", q: "$9\\times5$ 的矩形與 $5\\times5$ 的正方形相似嗎", a: "不相似（四角都 $90^\\circ$，但 $9:5\\ne5:5$）", val: "no" }] }
      ]
    },
    {
      id: "shape", col: 2, title: "B　四種型態：看到什麼線、對應順序怎麼寫", type: "table", rowH: 18,
      fields: [{ id: "see", n: "看到什麼" }, { id: "order", n: "對應順序（$\\sim$ 兩邊怎麼寫）" }, { id: "ratio", n: "比例式（部分比全體？部分比部分？）" }],
      rows: [
        { id: "5", n: "A 字型", reduce: ["1"], reduceNote: "共用頂角＋同位角相等，就是 AA", ans: { see: "$\\triangle ABC$ 內一條截線平行於某邊：$D$ 在 $\\overline{AB}$ 上、$E$ 在 $\\overline{AC}$ 上，$\\overline{DE}\\parallel\\overline{BC}$", order: "$\\triangle ADE\\sim\\triangle ABC$", ratio: "$\\dfrac{\\overline{AD}}{\\overline{AB}}=\\dfrac{\\overline{AE}}{\\overline{AC}}=\\dfrac{\\overline{DE}}{\\overline{BC}}$，是部分比全體" },
          tools: ["similar/sim/型態① A 字型（DE ∥ BC）", "similar/sim/平行線截比例線段"], kp: ["sim"],
          ex: [{ id: "s5", q: "$\\overline{AD}=2$、$\\overline{DB}=4$、$\\overline{DE}\\parallel\\overline{BC}$、$\\overline{BC}=9$，則 $\\overline{DE}=$", a: "$3$（$\\overline{AD}:\\overline{AB}=2:6$，不是 $2:4$）", val: "3" }] },
        { id: "6", n: "X 字型（蝴蝶型）", reduce: ["1"], reduceNote: "對頂角＋內錯角相等，就是 AA", ans: { see: "$\\overline{AC}$、$\\overline{BD}$ 交於 $O$，且 $\\overline{AB}\\parallel\\overline{CD}$（梯形的兩條對角線）", order: "$\\triangle OAB\\sim\\triangle OCD$，$A$ 對 $C$、$B$ 對 $D$（隔著交點正對面）", ratio: "$\\dfrac{\\overline{OA}}{\\overline{OC}}=\\dfrac{\\overline{OB}}{\\overline{OD}}=\\dfrac{\\overline{AB}}{\\overline{CD}}$" },
          tools: ["similar/sim/型態② X 字型（蝴蝶型）"], kp: ["sim"],
          ex: [{ id: "s6", q: "$\\overline{AB}\\parallel\\overline{CD}$，$\\overline{OA}=2$、$\\overline{OC}=6$、$\\overline{AB}=3$，則 $\\overline{CD}=$", a: "$9$", val: "9" }] },
        { id: "7", n: "共角型", reduce: ["1"], reduceNote: "共用角＋題目給的一組角，就是 AA", ans: { see: "$\\triangle ABC$ 中 $D$ 在 $\\overline{AB}$ 上、$E$ 在 $\\overline{AC}$ 上，$\\overline{DE}$ 不平行 $\\overline{BC}$ 但 $\\angle ADE=\\angle ACB$；圓內接四邊形題最常見", order: "$\\triangle ADE\\sim\\triangle ACB$（交叉對應：$D$ 對 $C$、$E$ 對 $B$）", ratio: "$\\overline{AD}\\cdot\\overline{AB}=\\overline{AE}\\cdot\\overline{AC}$" },
          tools: ["similar/sim/型態③ 共角型"], kp: ["sim"],
          ex: [{ id: "s7", q: "$\\overline{AD}=3$、$\\overline{AB}=8$、$\\overline{AE}=4$，則 $\\overline{AC}=$", a: "$6$", val: "6" }] },
        { id: "8", n: "母子型", reduce: ["1"], reduceNote: "都有直角，再各共用一個銳角，就是 AA", ans: { see: "$\\triangle ABC$ 中 $\\angle ACB=90^\\circ$，$H$ 是 $C$ 到斜邊 $\\overline{AB}$ 的垂足（$\\overline{CH}$ 是斜邊上的高）", order: "$\\triangle ACH\\sim\\triangle CBH\\sim\\triangle ABC$，三個兩兩相似", ratio: "$h=\\overline{CH}$、$p=\\overline{AH}$、$q=\\overline{BH}$：$h^2=pq$、$\\overline{AC}^2=\\overline{AB}\\cdot p$" },
          tools: ["similar/sim/型態④ 母子型（直角三角形的高）"], kp: ["sim"],
          ex: [{ id: "s8", q: "斜邊上的高把斜邊分成 $4$ 與 $9$，高 $h=$", a: "$6$", val: "6" }] }
      ]
    },
    {
      id: "ratio", title: "延伸（背面）　相似之後，比怎麼變", type: "props", back: true, rowH: 14,
      fields: [{ id: "h", n: "對應高的比" }, { id: "p", n: "周長比" }, { id: "a", n: "面積比" }, { id: "back", n: "由面積比反推邊長比要做什麼" }],
      rows: [
        { id: "9", n: "邊長比 $k$（$k$＝對應邊的比值）", ans: { h: "$k$", p: "$k$", a: "$k^2$", back: "開根號" },
          tools: ["similar/sim/對應高的比、周長比與面積比"], kp: ["sim"],
          ex: [{ id: "s9", q: "邊長比 $2:3$ 的兩個相似三角形，面積比", a: "$4:9$", val: "4/9" }] },
        { id: "10", n: "兩邊中點連線（平行線截比例的特例）", reduce: ["5"], reduceNote: "就是 A 字型取 $\\overline{AD}:\\overline{AB}=1:2$", ans: { h: "（$M$、$N$ 是 $\\triangle ABC$ 的 $\\overline{AB}$、$\\overline{AC}$ 中點：$\\overline{MN}\\parallel\\overline{BC}$）", p: "（$\\overline{MN}=\\frac12\\overline{BC}$）", a: "$\\triangle AMN:\\triangle ABC=1:4$", back: "必須是「兩邊的中點」，一個中點推不出來" },
          tools: ["similar/sim/三角形兩邊中點連線定理"], kp: ["sim"],
          ex: [{ id: "s10", q: "$M$、$N$ 為 $\\overline{AB}$、$\\overline{AC}$ 中點，$\\overline{BC}=10$，則 $\\overline{MN}=$", a: "$5$", val: "5" }] }
      ]
    }
  ],
  final: [
    { id: "f1", q: "B 的四種型態，最後都降成 A 的哪一條？各靠哪兩組角？", ans: "全部是 AA。A 字型：共用頂角＋同位角；X 字型：對頂角＋內錯角；共角型：共用角＋題目給的一組角；母子型：直角＋共用的銳角。", lines: 3 },
    { id: "f2", q: "全等的五條判別法，到相似變成幾條？少掉的是哪些、為什麼？", ans: "三條。ASA、AAS 都併進 AA（角夠就相似，不需要邊）；RHS 併進 AA（直角＋一個銳角）。而全等沒有的 AAA，在相似變成最常用的 AA。", lines: 2 },
    { id: "f3", q: "「部分比全體」和「部分比部分」各出現在哪一型？", ans: "A 字型相似寫的是部分比全體（$\\overline{AD}:\\overline{AB}$）；平行線截比例線段寫的是部分比部分（$\\overline{AD}:\\overline{DB}$）。同一張圖兩種都對，但不能混在同一個比例式裡。", lines: 2 }
  ],
  example: { q: "舉兩個四邊形的反例，說明「只有角相等」或「只有邊成比例」都不能說相似。", ans: "矩形 $9\\times5$ 與正方形 $5\\times5$：四角都是直角，邊不成比例，不相似。菱形與正方形：四邊都相等（$1:1$），角不相等，不相似。所以四邊形以上沒有 AA、SSS 這種捷徑。", lines: 3 },
  pitfalls: [
    "找到兩組角卻把對應順序寫反；共角型照字母順序寫成 $\\triangle ADE\\sim\\triangle ABC$。",
    "SAS 相似拿非夾角的角來套；SSS 相似只算兩組比值就下結論。",
    "把三角形的 AA 相似套到四邊形上。",
    "A 字型把 $\\overline{DE}:\\overline{BC}$ 寫成 $\\overline{AD}:\\overline{DB}$（部分比部分）。",
    "X 字型對應點配反，拿 $\\overline{OA}:\\overline{OD}$ 當相似比。",
    "母子型把 $h^2$ 寫成 $p+q$。",
    "邊長變 $2$ 倍就說面積變 $2$ 倍；由面積比反推邊長比忘了開根號。",
    "把兩邊中點連線寫成第三邊的兩倍。"
  ]
});
