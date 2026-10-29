/* 架構重建卡（國中）07：三角形的三心（第二批第一張，2026-10-30）。格式見高中專案 _scripts/frame_cards/FORMAT.md；數值例由 verify_frames.py（verify_part3.py）驗算。 */
FRAME({
  id: "center", stage: "jh", no: 7, n: "三角形的三心",
  scope: "九年級",
  curr: ["S-9-8", "S-9-9", "S-9-10", "S-9-11"],   // 課綱碼只給資料用，不印在學生看的卡上
  time: 10,
  intro: "外心、內心、重心各由三條線交出來，各自「到哪裡等距」或「分什麼比」。這張卡要你把三個心排成一張表，再補上直角、等腰、正三角形這三種特殊三角形裡它們落在哪裡。每格寫定義、性質、看到什麼時用。想不出來就寫「?」，不要空著。",
  sections: [
    {
      id: "c", title: "A　三心對照表", type: "props", rowH: 26,
      fields: [{ id: "def", n: "由哪三條線交出" }, { id: "dist", n: "到哪裡等距／分什麼比" }, { id: "pos", n: "位置（銳角、直角、鈍角三角形）" }, { id: "key", n: "最常用的公式" }, { id: "when", n: "看到什麼時用" }],
      rows: [
        { id: "1", n: "外心 $O$", ans: { def: "三邊的中垂線", dist: "到三頂點等距：$\\overline{OA}=\\overline{OB}=\\overline{OC}=R$（$R$ 是外接圓半徑）", pos: "銳角三角形在內部；直角三角形在斜邊中點；鈍角三角形在外部", key: "$\\angle A$ 是銳角時 $\\angle BOC=2\\angle A$（$O$ 外心，$\\angle BOC$ 是 $O$ 對 $\\overline{BC}$ 張的角）；直角三角形 $R=\\frac12\\times$斜邊", when: "外接圓、到三個頂點等距、中垂線、求 $R$" },
          tools: ["angle/center/外心 O（三中垂線交點）", "angle/center/尺規作圖：中垂線"], kp: ["center"],
          ex: [{ id: "n1a", q: "$\\triangle ABC$ 的外心 $O$，$\\angle A=50^\\circ$，則 $\\angle BOC=$", a: "$100^\\circ$", val: "100" }, { id: "n1b", q: "兩股 $6$、$8$ 的直角三角形，外接圓半徑 $R=$", a: "$5$（斜邊 $10$ 的一半）", val: "5" }] },
        { id: "2", n: "內心 $I$", ans: { def: "三個內角的角平分線", dist: "到三邊等距：距離 $=r$（$r$ 是內切圓半徑）", pos: "一定在內部", key: "$\\angle BIC=90^\\circ+\\frac12\\angle A$（$I$ 內心）；面積 $=\\frac12\\times r\\times$周長；直角三角形 $r=\\frac{a+b-c}{2}$（$a$、$b$ 兩股，$c$ 斜邊）", when: "內切圓、到三邊等距、角平分線、求 $r$" },
          tools: ["angle/center/內心 I（三角平分線交點）", "angle/center/直角三角形的內切圓半徑", "angle/center/尺規作圖：角平分線"], kp: ["center"],
          ex: [{ id: "n2a", q: "$\\triangle ABC$ 的內心 $I$，$\\angle A=50^\\circ$，則 $\\angle BIC=$", a: "$115^\\circ$", val: "115" }, { id: "n2b", q: "三邊 $3,4,5$ 的直角三角形，$r=$", a: "$1$", val: "1" }, { id: "n2c", q: "三邊 $5,5,6$ 的三角形，$r=$", a: "$\\frac32$（面積 $12$、周長 $16$）", val: "3/2" }] },
        { id: "3", n: "重心 $G$", ans: { def: "三條中線（頂點連對邊中點）", dist: "把每條中線分成 $2:1$：頂點到重心 $:$ 重心到中點 $=2:1$（$\\overline{AG}:\\overline{GM}=2:1$，$M$ 是 $\\overline{BC}$ 中點）", pos: "一定在內部", key: "三中線把三角形分成 $6$ 塊等面積；$\\triangle GAB=\\triangle GBC=\\triangle GCA=\\frac13\\triangle ABC$", when: "中線、重心、平衡點、用中線切面積" },
          tools: ["angle/center/重心 G（三中線交點）", "angle/center/中線"], kp: ["center"],
          ex: [{ id: "n3a", q: "中線 $\\overline{AM}=12$，$G$ 為重心，則 $\\overline{AG}=$", a: "$8$", val: "8" }, { id: "n3b", q: "$\\triangle ABC$ 面積 $36$，$G$ 為重心，則 $\\triangle GBC=$", a: "$12$", val: "12" }] }
      ]
    },
    {
      id: "s", title: "B　三種特殊三角形裡，三心在哪", type: "props", rowH: 15,
      fields: [{ id: "o", n: "外心在哪、$R$ 怎麼算" }, { id: "i", n: "內心在哪、$r$ 怎麼算" }, { id: "g", n: "重心在哪" }],
      rows: [
        { id: "4", n: "直角三角形（兩股 $a$、$b$，斜邊 $c$）", reduce: ["1", "2"], reduceNote: "外心是①的直角情形、$r$ 公式是②的特例", ans: { o: "斜邊中點，$R=\\frac c2$（斜邊中線 $=\\frac c2$）", i: "內部，$r=\\frac{a+b-c}{2}$", g: "斜邊中線上，離直角頂點 $\\frac23$ 中線 $=\\frac c3$" },
          tools: ["angle/center/外心 O（三中垂線交點）", "angle/center/直角三角形的內切圓半徑"], kp: ["center"],
          ex: [{ id: "n4a", q: "兩股 $6$、$8$，重心到斜邊中點的距離", a: "$\\frac53$（斜邊中線 $5$ 的 $\\frac13$）", val: "5/3" }, { id: "n4b", q: "兩股 $6$、$8$，$r=$", a: "$2$", val: "2" }] },
        { id: "5", n: "等腰三角形（$\\overline{AB}=\\overline{AC}$）", reduce: ["1", "2", "3"], reduceNote: "三線合一：頂角平分線＝底邊中線＝底邊中垂線，三心都在這條線上", ans: { o: "頂角 $A$ 的角平分線上（不一定在內部）", i: "同一條線上，在內部", g: "同一條線上，離 $A$ 是這條線（底邊上的高）的 $\\frac23$" },
          tools: ["angle/center/外心 O（三中垂線交點）", "angle/center/內心 I（三角平分線交點）", "angle/center/重心 G（三中線交點）"], kp: ["center", "tri"],
          ex: [{ id: "n5a", q: "$\\overline{AB}=\\overline{AC}=5$、$\\overline{BC}=6$，外接圓半徑 $R=$", a: "$\\frac{25}{8}$（高 $4$，$R=\\frac{5^2}{2\\times4}$）", val: "25/8" }, { id: "n5b", q: "同上，重心到底邊 $\\overline{BC}$ 的距離", a: "$\\frac43$（高 $4$ 的 $\\frac13$）", val: "4/3" }] },
        { id: "6", n: "正三角形（邊長 $a$）", reduce: ["5"], reduceNote: "三邊都等長，三條三線合一的線交於同一點，三心重合", ans: { o: "三心重合在同一點，$R=\\frac{\\sqrt3}{3}a$", i: "同一點，$r=\\frac{\\sqrt3}{6}a$；$R=2r$", g: "同一點，高 $=\\frac{\\sqrt3}{2}a=R+r$" },
          tools: ["angle/center/外心 O（三中垂線交點）", "angle/center/內心 I（三角平分線交點）"], kp: ["center"],
          ex: [{ id: "n6a", q: "邊長 $6$ 的正三角形，$R=$", a: "$2\\sqrt3$", val: "2*sqrt(3)" }, { id: "n6b", q: "同上，$r=$", a: "$\\sqrt3$（$R=2r$）", val: "sqrt(3)" }] }
      ]
    },
    {
      id: "l", title: "延伸（背面）　三條線各有什麼性質，才交出三心", type: "props", back: true, rowH: 10,
      fields: [{ id: "prop", n: "線上每一點有什麼性質" }, { id: "lead", n: "三條交出哪個心、為什麼" }],
      rows: [
        { id: "7", n: "中垂線（線段的）", reduce: ["1"], ans: { prop: "到線段兩端點等距", lead: "外心：兩條中垂線的交點到三個頂點都等距，所以第三條也必過它" },
          tools: ["angle/center/尺規作圖：中垂線"], kp: ["center"],
          ex: [{ id: "n7", q: "$P$ 在 $\\overline{AB}$ 的中垂線上，$\\overline{PA}=7$，則 $\\overline{PB}=$", a: "$7$", val: "7" }] },
        { id: "8", n: "角平分線", reduce: ["2"], ans: { prop: "到角的兩邊等距", lead: "內心：兩條角平分線的交點到三邊都等距，所以第三條也必過它" },
          tools: ["angle/center/尺規作圖：角平分線", "angle/basic/角平分線"], kp: ["center", "basic"],
          ex: [{ id: "n8", q: "$\\angle AOB=60^\\circ$，$P$ 在角平分線上且 $\\overline{OP}=4$，則 $P$ 到 $\\overrightarrow{OA}$ 的距離", a: "$2$（$30^\\circ$ 直角三角形）", val: "2" }] },
        { id: "9", n: "中線", reduce: ["3"], ans: { prop: "把三角形分成面積相等的兩塊（等底同高）", lead: "重心：用等底同高一路推，得每條中線被分成 $2:1$" },
          tools: ["angle/center/中線"], kp: ["center"],
          ex: [{ id: "n9", q: "$\\triangle ABC$ 面積 $20$，$M$ 為 $\\overline{BC}$ 中點，則 $\\triangle ABM=$", a: "$10$", val: "10" }] }
      ]
    }
  ],
  final: [
    { id: "f1", q: "三心裡哪些一定在三角形內部？哪一個可能跑到外面、什麼時候？", ans: "內心、重心一定在內部。外心：銳角三角形在內部、直角三角形在斜邊中點、鈍角三角形在外部。", lines: 2 },
    { id: "f2", q: "三心都降成同一個基本動作，是什麼？（提示：畫兩條線就夠）", ans: "兩條線的交點。中垂線到兩端等距、角平分線到兩邊等距，所以兩條的交點自動滿足第三條；中線用等底同高推出 $2:1$。畫第三條只是檢查。", lines: 2 },
    { id: "f3", q: "直角三角形的 $R=\\frac c2$ 和 $r=\\frac{a+b-c}{2}$ 各從哪裡來？", ans: "$R=\\frac c2$：直角所對的弦是直徑，外心就是斜邊中點。$r=\\frac{a+b-c}{2}$：直角頂點到兩切點都是 $r$（那一角是正方形），其餘切線段兩兩相等，所以 $(a-r)+(b-r)=c$。", lines: 2 }
  ],
  example: { q: "①「外心一定在三角形裡面」②「重心到三邊等距」，各錯在哪？各舉一個反例或改正。", ans: "①鈍角三角形的外心在外面（直角三角形在斜邊中點，也不在裡面）。②到三邊等距的是內心；重心是到三頂點的距離被中線分成 $2:1$，不是等距。", lines: 2 },
  pitfalls: [
    "把 $2:1$ 記成 $1:2$：是頂點到重心比重心到中點。",
    "認定外心一定在三角形內；鈍角三角形的高、外心都可能在外面。",
    "把內心與重心的性質互換（到三邊等距是內心，六塊等面積是重心）。",
    "直角三角形 $r$ 寫成 $\\frac{a+b+c}{2}$（那是周長的一半）。",
    "$\\angle BOC=2\\angle A$ 只在 $\\angle A$ 是銳角時；$\\angle A$ 鈍角時 $\\angle BOC=360^\\circ-2\\angle A$。只給 $\\angle BOC$ 求 $\\angle A$ 要寫兩個答案。",
    "把中線當成角平分線、把高當成中線；只有等腰三角形的頂角那條三線合一。",
    "$R=2r$ 只對正三角形成立。"
  ]
});
