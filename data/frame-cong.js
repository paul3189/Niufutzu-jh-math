/* 架構重建卡（國中）01：三角形全等判別。格式見 _scripts/frame_cards/FORMAT.md（高中專案）；數值例由 _scripts/frame_cards/verify_frames.py 驗算。 */
FRAME({
  id: "cong", stage: "jh", no: 1, n: "三角形全等判別",
  scope: "八年級",
  curr: ["S-8-4", "S-8-5"],   // 課綱碼只給資料用，不印在學生看的卡上
  time: 10,
  intro: "兩個三角形各有三邊三角，要「湊齊三個條件」才能判定全等，國中的判別法只有五條。每一條寫三件事：條件怎麼寫（用 $\\triangle ABC$ 與 $\\triangle DEF$）、看到什麼時用、前提（哪個角或哪條邊一定要在特定位置）。最後兩列是「不行」的兩種，要你自己說出為什麼。想不出來就寫「?」，不要空著。",
  sections: [
    {
      id: "ok", title: "A　五條判別法", type: "table", rowH: 17,
      fields: [{ id: "cond", n: "條件（$\\triangle ABC$ 對 $\\triangle DEF$：$A$ 對 $D$、$B$ 對 $E$、$C$ 對 $F$）" }, { id: "when", n: "看到什麼時用" }, { id: "pre", n: "前提" }],
      rows: [
        { id: "1", n: "SSS", ans: { cond: "$\\triangle ABC$ 的三邊對 $\\triangle DEF$ 的三邊：$\\overline{AB}=\\overline{DE}$、$\\overline{BC}=\\overline{EF}$、$\\overline{CA}=\\overline{FD}$", when: "三組邊都知道時", pre: "字母順序一一對應，$\\cong$ 兩邊的頂點順序決定後面「對應角相等」抄哪個角" },
          tools: ["angle/cong/SSS（邊邊邊）"], kp: ["cong"],
          ex: [{ id: "c1", q: "$\\overline{AB}=\\overline{AC}$、$D$ 為 $\\overline{BC}$ 中點，$\\triangle ABD\\cong\\triangle ACD$ 用哪一條", a: "SSS（$\\overline{AD}$ 共用）", val: "SSS" }] },
        { id: "2", n: "SAS", ans: { cond: "$\\triangle ABC$ 對 $\\triangle DEF$：$\\overline{AB}=\\overline{DE}$、$\\angle B=\\angle E$、$\\overline{BC}=\\overline{EF}$（$\\angle B$ 是 $\\overline{AB}$、$\\overline{BC}$ 的夾角）", when: "兩邊與夾的一角皆相等", pre: "角必須是夾角；角若是某一邊的對角就是 SSA，不能用" },
          tools: ["angle/cong/SAS（邊角邊）"], kp: ["cong"],
          ex: [{ id: "c2", q: "$\\overline{AB}=\\overline{DE}=5$、$\\angle B=\\angle E=60^\\circ$、$\\overline{BC}=\\overline{EF}=8$，則 $\\overline{AC}=\\overline{DF}=$", a: "$7$", val: "7" }] },
        { id: "3", n: "ASA", ans: { cond: "$\\triangle ABC$ 對 $\\triangle DEF$：$\\angle A=\\angle D$、$\\overline{AB}=\\overline{DE}$、$\\angle B=\\angle E$（$\\overline{AB}$ 是 $\\angle A$、$\\angle B$ 的夾邊）", when: "兩角與夾的一邊相等", pre: "邊必須是夾邊" },
          tools: ["angle/cong/ASA（角邊角）"], kp: ["cong"],
          ex: [{ id: "c3", q: "$\\angle A=\\angle D=40^\\circ$、$\\overline{AB}=\\overline{DE}$、$\\angle B=\\angle E=60^\\circ$，則 $\\angle F=$", a: "$80^\\circ$", val: "80" }] },
        { id: "4", n: "AAS", reduce: ["3"], reduceNote: "兩角相等時第三角自動相等，「對邊」換成「夾邊」就是 ASA", ans: { cond: "$\\triangle ABC$ 對 $\\triangle DEF$：$\\angle A=\\angle D$、$\\angle B=\\angle E$、$\\overline{BC}=\\overline{EF}$（$\\overline{BC}$ 是 $\\angle A$ 的對邊）", when: "兩角和「其中一角的對邊」相等", pre: "那條邊在兩個三角形裡要對到同一個角（都是 $\\angle A$ 的對邊，或都是 $\\angle B$ 的對邊）" },
          tools: ["angle/cong/AAS（角角邊）"], kp: ["cong"],
          ex: [{ id: "c4", q: "$\\angle A=30^\\circ$、$\\angle B=90^\\circ$、$\\overline{AC}=10$（$\\angle B$ 的對邊），則 $\\overline{BC}=$", a: "$5$", val: "5" }] },
        { id: "5", n: "RHS", reduce: ["1"], reduceNote: "斜邊、一股知道了，第三邊由畢氏定理唯一決定，所以其實是 SSS", ans: { cond: "$\\triangle ABC$ 對 $\\triangle DEF$：$\\angle C=\\angle F=90^\\circ$、$\\overline{AB}=\\overline{DE}$（斜邊）、$\\overline{CA}=\\overline{FD}$（一股）", when: "兩個直角三角形，斜邊與一股相等", pre: "只能用在直角三角形，相等的那組邊必須含斜邊；兩股相等不叫 RHS，那是 SAS（直角是夾角）" },
          tools: ["angle/cong/RHS（直角、斜邊、股）"], kp: ["cong"],
          ex: [{ id: "c5", q: "斜邊 $13$、一股 $5$ 的直角三角形，另一股 $=$", a: "$12$（兩個三角形三邊都是 $5,12,13$）", val: "12" }] }
      ]
    },
    {
      id: "no", title: "B　兩條「不行」的", type: "table", rowH: 22,
      fields: [{ id: "why", n: "為什麼不行（畫或舉一個反例）" }, { id: "ok", n: "什麼情況其實可以／它能得到什麼" }],
      rows: [
        { id: "6", n: "SSA ✗", fig: "ssa-two", ans: { why: "固定 $\\angle A=30^\\circ$、$\\overline{AB}=8$，從 $A$ 畫一條射線 $AX$，以 $B$ 為圓心、半徑 $5$（$=\\overline{BC}$）畫弧：$B$ 到射線的距離是 $4$，$5>4$ 所以弧和射線交在兩個點 $C_1$、$C_2$，兩個三角形邊、邊、角完全相同卻不全等", ok: "已知角是直角或鈍角、或對邊不比鄰邊短時才唯一。直角那一種就是 RHS" },
          tools: ["angle/cong/⚠️ SSA 為什麼不成立", "angle/cong/⚠️ SSA 兩解的兩個角互補", "angle/cong/直角時為什麼沒有兩解"], kp: ["cong"],
          ex: [
            { id: "c6a", q: "$\\angle A=30^\\circ$、$\\overline{AB}=8$、$\\overline{BC}=5$，這樣的三角形有幾個", a: "$2$ 個（$\\overline{AC}=4\\sqrt3\\pm3$，兩個 $\\angle C$ 互補）", val: "2" },
            { id: "c6b", q: "同上，改 $\\overline{BC}=4$", a: "$1$ 個（直角）", val: "1" },
            { id: "c6c", q: "同上，改 $\\overline{BC}=3$", a: "$0$ 個", val: "0" },
            { id: "c6d", q: "同上，改 $\\overline{BC}=9$", a: "$1$ 個（另一個交點在 $A$ 另一側）", val: "1" }
          ] },
        { id: "7", n: "AAA ✗", ans: { why: "邊長 $3,4,5$ 與 $6,8,10$ 的兩個直角三角形，三個角完全相等，但不全等", ok: "只能得到相似（九年級 AA 相似）；全等還要大小一樣，三個角管不到大小" },
          tools: ["angle/cong/AAS（角角邊）"], kp: ["cong", "sim"],
          ex: [{ id: "c7", q: "$3,4,5$ 與 $6,8,10$ 三角相等，相似比（大比小）$=$", a: "$2$（相似不全等）", val: "2" }] }
      ]
    }
  ],
  final: [
    { id: "f1", q: "五條裡哪兩條其實可以互推？為什麼？", ans: "ASA 與 AAS。兩角相等時第三角自動相等（內角和 $180^\\circ$），「夾邊」和「對邊」只是同一組條件換一條邊講。", lines: 2 },
    { id: "f2", q: "RHS 明明是「邊邊角」，為什麼能成立？它可以降成五條裡的哪一條？", ans: "直角時弧與射線只有一個交點；而且斜邊、一股知道了，第三邊由畢氏定理唯一決定，所以降成 SSS。", lines: 2 },
    { id: "f3", q: "畫出降維箭頭：五條判別法最少只要幾個基本動作？", ans: "三個：SSS、SAS、ASA（AAS → ASA，RHS → SSS）。兩個「不行」的：SSA 會畫出兩個三角形，AAA 管不到大小。", lines: 2 }
  ],
  example: { q: "給你「兩邊一角」$\\overline{AB}=8$、$\\overline{BC}=5$、$\\angle A=30^\\circ$，畫出兩個不全等的三角形，並說明兩個 $\\angle C$ 的關係。", ans: "從 $A$ 畫射線 $AX$，以 $B$ 為圓心、半徑 $5$ 畫弧交射線於 $C_1$、$C_2$（$B$ 到射線距離 $4<5<8$）。$\\triangle BC_1C_2$ 等腰，底角相等，所以 $\\angle AC_1B+\\angle AC_2B=180^\\circ$：一個銳角三角形、一個鈍角三角形。", lines: 4 },
  pitfalls: [
    "字母順序寫錯，後面的對應角配錯。",
    "看到「兩邊一角」直接寫全等，沒檢查那個角是不是夾角（SSA）。",
    "ASA、AAS 混用：一邊用夾邊、另一邊用對邊。",
    "用 AAA 說兩個三角形全等（那是相似）。",
    "把兩股相等叫 RHS（那是 SAS）。",
    "還沒證出全等就先用對應邊相等。",
    "SSA 兩解題只算銳角那一解，漏掉鈍角那一組。"
  ]
});
