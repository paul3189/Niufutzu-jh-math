/* 架構重建卡（國中）12：角的關係與平行線截角（第二批第 6 張，2026-11-02）。格式見高中專案 _scripts/frame_cards/FORMAT.md；數值例由 verify_frames.py（verify_part3.py）驗算。 */
FRAME({
  id: "angle", stage: "jh", no: 12, n: "角的關係與平行線截角",
  scope: "八年級",
  curr: ["S-8-1", "S-8-2", "S-8-3"],   // 課綱碼只給資料用，不印在學生看的卡上
  time: 10,
  intro: "角度題有兩組基本工具：A 表是「不靠平行」就成立的角關係（互餘、互補、對頂角、角平分線），B 表是「兩直線平行被同一條截線所截」才成立的三種截角（F、Z、C 字）。背面延伸表整理平行線間距離、折線轉角與三角形外角定理。想不出來就寫「?」，不要空著。",
  sections: [
    {
      id: "a", title: "A　兩角的基本關係與角平分線（不需平行）", type: "table", rowH: 15,
      fields: [{ id: "cond", n: "定義或圖形特徵" }, { id: "rel", n: "度數關係（相等或相加幾度）" }, { id: "pre", n: "前提或易錯" }],
      rows: [
        { id: "1", n: "互餘（餘角）",
          ans: {
            cond: "兩個角的度數和是一個直角（常見於直角被分成兩角，或直角三角形的兩銳角）",
            rel: "$\\angle 1+\\angle 2=90^\\circ$（稱 $\\angle 1$、$\\angle 2$ 互為餘角）",
            pre: "餘角是相加 $90^\\circ$，別和補角（$180^\\circ$）記反；只要度數和為 $90^\\circ$ 就互餘，不必相鄰"
          },
          tools: ["angle/basic/補角與餘角"], kp: ["basic"],
          ex: [
            { id: "ag1", q: "$\\angle A=35^\\circ$，則 $\\angle A$ 的餘角幾度", a: "$90^\\circ-35^\\circ=55^\\circ$", val: "55" }
          ]
        },
        { id: "2", n: "互補（補角）",
          ans: {
            cond: "兩個角的度數和是一個平角（圖上最常見的是「同在一直線上」的相鄰兩角）",
            rel: "$\\angle 1+\\angle 2=180^\\circ$（稱 $\\angle 1$、$\\angle 2$ 互為補角）",
            pre: "一直線上的鄰角必互補；同一個角的補角比它的餘角剛好大 $90^\\circ$（角小於 $90^\\circ$ 時）"
          },
          tools: ["angle/basic/補角與餘角"], kp: ["basic"],
          ex: [
            { id: "ag2a", q: "$\\angle A=35^\\circ$，則 $\\angle A$ 的補角幾度", a: "$180^\\circ-35^\\circ=145^\\circ$", val: "145" },
            { id: "ag2b", q: "$\\angle A=40^\\circ$，$\\angle B$ 與 $\\angle A$ 互餘、$\\angle C$ 與 $\\angle B$ 互補，則 $\\angle C=$", a: "$130^\\circ$（$=90^\\circ+40^\\circ$）", val: "130" }
          ]
        },
        { id: "3", n: "對頂角", reduce: ["2"], reduceNote: "$\\angle 1$ 和 $\\angle 3$ 都與同一個鄰角 $\\angle 2$ 互補（同角的補角相等）",
          ans: {
            cond: "兩條直線相交於一點，相對（兩邊互為反向延長線）的兩個角",
            rel: "$\\angle 1=\\angle 3$（對頂角必相等）",
            pre: "只要「兩條直線相交」就一定相等，不需要平行；隔壁相鄰的角是②互補，不是對頂角"
          },
          tools: ["angle/basic/對頂角相等"], kp: ["basic"],
          ex: [
            { id: "ag3", q: "兩直線相交，$\\angle 1=65^\\circ$，則對頂角 $\\angle 3$ 與鄰角 $\\angle 2$ 依序為幾度", a: "$(65^\\circ,115^\\circ)$", val: "(65,115)" }
          ]
        },
        { id: "4", n: "角平分線",
          ans: {
            cond: "把一個角分成兩個相等角的射線（常在折紙對摺、尺規作圖出現）",
            rel: "射線 $OR$ 平分 $\\angle AOB\\iff \\angle AOR=\\angle BOR=\\dfrac12\\angle AOB$；角平分線上任一點到角兩邊距離相等（八年級尺規與幾何推理、九年級內心都會用到）",
            pre: "角平分線平分的是「角」，不是三角形的對邊（連對邊中點的是中線）"
          },
          tools: ["angle/basic/角平分線"], kp: ["basic"],
          ex: [
            { id: "ag4", q: "一直線上相鄰兩互補角 $\\angle AOB$ 與 $\\angle BOC$，兩角平分線的夾角幾度", a: "$\\dfrac12\\times 180^\\circ=90^\\circ$", val: "90" }
          ]
        }
      ]
    },
    {
      id: "b", title: "B　兩直線被截線所截：三種截角（F、Z、C 字）", type: "table", rowH: 16,
      fields: [{ id: "pos", n: "位置怎麼認（截線哪側、兩線之間或同方向）" }, { id: "rel", n: "$L_1\\parallel L_2$ 時的度數關係" }, { id: "pre", n: "前提與逆用（判別平行）" }],
      rows: [
        { id: "5", n: "同位角（F 字）",
          ans: {
            pos: "在同一條截線的「同一側」，且在兩被截直線的「同一方向」（如都在左上，形狀像字母 F）",
            rel: "$L_1\\parallel L_2\\Rightarrow$ 同位角相等",
            pre: "前提：兩直線必須平行，且角在「同一條截線」上；逆用：同位角相等 $\\Rightarrow L_1\\parallel L_2$"
          },
          tools: ["angle/parallel/八個角的位置命名", "angle/parallel/同位角相等", "angle/parallel/平行線的判別（逆用）"], kp: ["parallel"],
          ex: [
            { id: "ag5", q: "$L_1\\parallel L_2$，截線與 $L_1$ 左上角為 $72^\\circ$，則與 $L_2$ 左上的同位角幾度", a: "$72^\\circ$", val: "72" }
          ]
        },
        { id: "6", n: "內錯角（Z 字）", reduce: ["3", "5"], reduceNote: "先用⑤同位角搬過去，再用③對頂角相等，就得到內錯角相等",
          ans: {
            pos: "在同一條截線的「兩側（交錯）」，且都在兩被截直線「之間（內部）」（形狀像字母 Z 或 N）",
            rel: "$L_1\\parallel L_2\\Rightarrow$ 內錯角相等",
            pre: "前提：$L_1\\parallel L_2$，且兩角都在兩直線「內部」；逆用：內錯角相等 $\\Rightarrow L_1\\parallel L_2$"
          },
          tools: ["angle/parallel/八個角的位置命名", "angle/parallel/內錯角相等", "angle/parallel/平行線的判別（逆用）"], kp: ["parallel"],
          ex: [
            { id: "ag6", q: "$L_1\\parallel L_2$，一組內錯角為 $(3x-10)^\\circ$ 與 $(2x+25)^\\circ$，則 $x=$", a: "$35$（兩角皆為 $95^\\circ$）", val: "35" }
          ]
        },
        { id: "7", n: "同側內角（C／U 字）", reduce: ["2", "5"], reduceNote: "先用⑤同位角搬過去，就跟它在同一條直線上成②鄰角互補",
          ans: {
            pos: "在同一條截線的「同一側」，且都在兩被截直線「之間（內部）」（形狀像字母 C 或 U）",
            rel: "$L_1\\parallel L_2\\Rightarrow$ 同側內角互補（相加 $=180^\\circ$，不是相等！）",
            pre: "前提：$L_1\\parallel L_2$；三種截角裡唯一「互補」而非相等的一組；逆用：同側內角互補 $\\Rightarrow L_1\\parallel L_2$"
          },
          tools: ["angle/parallel/八個角的位置命名", "angle/parallel/同側內角互補", "angle/parallel/平行線的判別（逆用）"], kp: ["parallel"],
          ex: [
            { id: "ag7", q: "$L_1\\parallel L_2$，一組同側內角為 $65^\\circ$ 與 $\\angle 2$，則 $\\angle 2=$", a: "$180^\\circ-65^\\circ=115^\\circ$", val: "115" }
          ]
        }
      ]
    },
    {
      id: "c", title: "延伸（背面）　平行線間距離、折線轉角與三角形外角", type: "table", back: true, rowH: 13,
      fields: [{ id: "when", n: "看到什麼圖形" }, { id: "how", n: "核心性質或作法" }, { id: "pre", n: "前提或易錯" }],
      rows: [
        { id: "8", n: "兩平行線間的距離與同底等高",
          ans: {
            when: "兩平行線 $L_1\\parallel L_2$ 間畫垂直線段，或頂點在平行線上移動的三角形面積",
            how: "$L_1\\parallel L_2\\Rightarrow$ 任一點到另一條的垂直線段長處處相等（高固定 $\\Rightarrow$ 同底三角形面積相等）",
            pre: "量的必須是「垂直」線段；斜線段不是距離，會隨位置改變"
          },
          tools: ["angle/parallel/兩平行線間的距離處處相等", "angle/life/垂直與點到直線的距離"], kp: ["parallel", "life"],
          ex: [
            { id: "ag8", q: "$L_1\\parallel L_2$ 距離為 $6$，$\\overline{AB}=8$ 在 $L_2$ 上，$P$ 在 $L_1$ 上，則 $\\triangle PAB$ 面積", a: "$\\dfrac12\\times 8\\times 6=24$", val: "24" }
          ]
        },
        { id: "9", n: "平行線間的折線角（閃電／M 字型）", reduce: ["6", "7"], reduceNote: "過轉折點作平行輔助線，拆成兩組⑥內錯角或⑦同側內角",
          ans: {
            when: "兩平行線之間有折線轉彎（拐角、閃電圖、鉛筆頭圖），沒有一條截線直接貫穿",
            how: "過轉折頂點作平行線，把轉折角拆成上下兩個角，分別用內錯角相等（或同側內角互補）搬過來",
            pre: "不要硬背口訣，多轉一次彎就多作一條平行線；轉折點在平行線外側時同樣作平行線拆角"
          },
          tools: ["angle/parallel/內錯角相等", "angle/parallel/同側內角互補", "angle/proof/什麼時候補輔助線"], kp: ["parallel", "proof"],
          ex: [
            { id: "ag9", q: "$L_1\\parallel L_2$，折線 $A\\text{-}P\\text{-}B$，$A$ 在 $L_1$ 上、$B$ 在 $L_2$ 上、$P$ 在兩平行線之間，$\\angle A=35^\\circ$、$\\angle B=48^\\circ$（都是折線與平行線在 $P$ 那一側的夾角），則 $\\angle APB=$", a: "$35^\\circ+48^\\circ=83^\\circ$", val: "83" }
          ]
        },
        { id: "10", n: "三角形內角和與外角定理", reduce: ["2", "5", "6"], reduceNote: "過頂點作對邊的平行線，用⑤同位角與⑥內錯角把兩內角搬到外角處",
          ans: {
            when: "三角形已知兩角求第三角，或圖上有邊「延長出去」出現外角時",
            how: "內角和 $\\angle A+\\angle B+\\angle C=180^\\circ$；外角定理：任一外角 $=$ 不相鄰的兩個內角和",
            pre: "外角等於「不相鄰」的兩內角和；與外角「相鄰」的那個內角則是跟它互補（相加 $180^\\circ$）"
          },
          tools: ["angle/tri/三角形內角和 180°", "angle/tri/外角定理"], kp: ["tri"],
          ex: [
            { id: "ag10", q: "$\\triangle ABC$ 中 $\\angle A=50^\\circ$、$\\angle B=65^\\circ$，則 $\\angle C$ 的外角幾度", a: "$50^\\circ+65^\\circ=115^\\circ$", val: "115" }
          ]
        }
      ]
    }
  ],
  final: [
    { id: "f1", q: "平行線的三種截角裡，只要承認⑤「同位角相等」，為什麼⑥「內錯角相等」和⑦「同側內角互補」都不用另外背？（畫出降維箭頭）", ans: "⑥內錯角：先用⑤同位角搬到另一條平行線，再用③對頂角相等（⑤＋③ → ⑥）。⑦同側內角：先用⑤同位角搬過去，就跟旁邊的角在同一條直線上成②鄰角互補（⑤＋② → ⑦）。", lines: 2 },
    { id: "f2", q: "三角形的外角定理「$\\angle C$ 的外角 $=\\angle A+\\angle B$」，和③對頂角相等為什麼其實是同一個道理？", ans: "都是「同一個角的補角相等」：內角和給出 $(\\angle A+\\angle B)+\\angle C=180^\\circ$，而平角互補給出 $(\\angle C\\text{ 的外角})+\\angle C=180^\\circ$，兩者都和 $\\angle C$ 互補，所以必然相等。", lines: 2 }
  ],
  example: { q: "①「兩直線被一條截線所截，同位角一定相等、內錯角一定相等」對嗎？②「$L_1\\parallel L_2$，但 $\\angle 1$ 是截線 $M_1$ 與 $L_1$ 左上的夾角、$\\angle 2$ 是另一條截線 $M_2$ 與 $L_2$ 左上的夾角，所以 $\\angle 1=\\angle 2$」對嗎？", ans: "①不對。沒有「兩被截直線平行」這個前提，同位角、內錯角只是位置名稱，度數不一定相等（反例：兩條相交直線被第三條直線所截）。②不對。同位角必須是「同一條截線」與兩平行線所截出的角；不同截線傾斜方向不同，夾角不一定相等。", lines: 2 },
  pitfalls: [
    "把餘角（和為 $90^\\circ$）與補角（和為 $180^\\circ$）記反，看到直角卻用 $180^\\circ$ 去減。",
    "把一直線上的相鄰角（互補）誤當成對頂角（相等）。",
    "兩條被截直線沒有平行，卻直接說同位角相等、內錯角相等。",
    "把同側內角（C 字型，相加 $180^\\circ$ 互補）也當成「相等」來算。",
    "圖中有兩條以上截線時，把不同截線上的角配成同位角或內錯角。",
    "平行線間出現折線轉角（閃電型）時，沒過轉折點作平行輔助線就直接把上下角當內錯角相等。",
    "三角形外角定理寫成「外角＝相鄰的內角」（應為不相鄰的兩個內角和）。"
  ]
});
