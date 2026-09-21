/* 領域 8：畢氏定理與相似形（幾何．以圖為主） */
TM({
  id: "similar", n: "畢氏定理與相似形", icon: "🔺", color: "#8e3b62", geo: true,
  ask: "題目要求「長度」時 —— 先找直角（畢氏），再找相似（比例）。這兩招能算出國中九成的長度。",
  topics: [

    {
      id: "pyth", n: "畢氏定理", g: 8, kw: ["直角三角形", "斜邊", "股", "距離", "對角線"],
      flow: "看到「求長度」，第一個動作永遠是：圖上有沒有直角三角形？沒有就想辦法作一個。",
      fig: "pyth",
      tools: [
        {
          n: "畢氏定理",
          f: "a^2+b^2=c^2\\quad (c \\text{ 為斜邊})",
          w: "直角三角形中已知兩邊求第三邊。",
          l: "$c$ 一定是「直角的對邊」，也是最長邊；先確認直角在哪個頂點。",
          fig: "pyth",
          t: "把某一股當成斜邊代入公式。"
        },
        {
          n: "畢氏定理的面積證明",
          f: "\\begin{aligned}&(a+b)^2=c^2+4\\times\\tfrac12 ab \\\\ &\\Rightarrow a^2+b^2=c^2\\end{aligned}",
          w: "理解「為什麼」成立；也是常見的拼圖型考題。",
          l: "中間傾斜的正方形邊長就是斜邊 $c$。",
          fig: "pyth-proof",
          t: "把中間那個斜放的正方形邊長寫成 $a+b$ 或 $a$（它的邊是直角三角形的斜邊 $c$，面積是 $c^2$）。"
        },
        {
          n: "畢氏定理的逆定理",
          f: "a^2+b^2=c^2 \\Rightarrow \\text{是直角三角形}",
          w: "判斷三邊長能不能圍成直角三角形。",
          l: "要用「最長邊」當 $c$。（補充：$a^2+b^2>c^2$ 時最大角是銳角、$<$ 時是鈍角——課綱只要求判斷是不是直角。）",
          fig: "pyth-345",
          t: "隨便挑一邊當 $c$ 就下結論。"
        },
        {
          n: "常見的畢氏數",
          f: "\\begin{aligned}&(3,4,5),\\ (5,12,13) \\\\ &(8,15,17),\\ (7,24,25)\\end{aligned}",
          w: "看到這些數字組合可以直接判定直角，省下計算。",
          l: "乘上「任何正數」都仍是直角三角形（比例不變、形狀相似），例如 $(6,8,10)$、$(9,12,15)$、$(1.5,2,2.5)$；但倍數不能是 0 或負數。整數倍最常考，因為邊長會保持整數。",
          fig: "pyth-345",
          t: "把 $(3,4,5)$ 加上同一個數（如 $4,5,6$）也當成畢氏數。"
        },
        {
          n: "長方體的體對角線",
          f: "d=\\sqrt{\\ell^2+w^2+h^2}",
          w: "長方體（或正方體）中最長的那條線段；「這根棍子塞不塞得進盒子」。",
          l: "做法是畢氏定理用兩次：先在底面求出底面對角線 $\\sqrt{\\ell^2+w^2}$，再與高 $h$ 組成第二個直角三角形。正方體邊長 $a$ 時體對角線為 $a\\sqrt3$。",
          fig: "sol-box-diagonal",
          t: "只用兩個邊長就開根號（漏掉第三個方向）。"
        },
        {
          n: "特殊直角三角形",
          f: "\\begin{aligned}&45^\\circ\\text{-}45^\\circ\\text{-}90^\\circ \\Rightarrow 1:1:\\sqrt2; \\\\ &30^\\circ\\text{-}60^\\circ\\text{-}90^\\circ \\Rightarrow 1:\\sqrt3:2\\end{aligned}",
          w: "正方形對角線、正三角形的高、菱形問題。",
          l: "$30$-$60$-$90$ 中「1」對的是 $30^\\circ$（最短邊對最小角）。",
          fig: "spec-3060",
          t: "把 $\\sqrt3$ 配到 $30^\\circ$ 的對邊。"
        },
        {
          n: "45-45-90 三角形",
          f: "\\text{斜邊}=\\sqrt2\\times\\text{股}",
          w: "正方形的對角線、等腰直角三角形。",
          l: "兩股相等；正方形邊長 $a$ 的對角線是 $a\\sqrt2$。",
          fig: "spec-45",
          t: "把正方形對角線寫成 $2a$。"
        }
      ]
    },

    {
      id: "sim", n: "相似形", g: 9, kw: ["相似", "AA", "SAS", "SSS", "A 字型", "X 字型", "共角", "母子", "連比", "比例線段", "中點連線", "縮放", "面積比"],
      flow: "先認「型態」再談判別：題目裡的相似三角形幾乎都是疊在一起的四種型態之一（A 字、X 字、共角、母子），認出型態就知道哪兩個三角形相似、對應順序怎麼寫。",
      fig: "sim-aa",
      tools: [
        {
          n: "AA 相似（兩組角相等）",
          f: "\\begin{aligned}&\\angle A=\\angle D,\\ \\angle B=\\angle E \\\\ &\\Rightarrow \\triangle ABC\\sim\\triangle DEF\\end{aligned}",
          w: "國中最常用的相似判別法：只要兩組角相等就成立。",
          l: "第三組角自動相等（內角和 180°），所以不必再找。與全等不同——全等沒有 AAA 這一條。",
          fig: "sim-aa",
          t: "找到兩組角卻把對應順序寫反。"
        },
        {
          n: "SAS 相似（兩邊成比例且夾角相等）",
          f: "\\frac{\\overline{AB}}{\\overline{DE}}=\\frac{\\overline{BC}}{\\overline{EF}} \\text{ 且 } \\angle B=\\angle E",
          w: "題目給的是兩組邊長與一個角時。",
          l: "角必須是那兩邊的「夾角」；若是對角（SSA）不能保證相似。",
          fig: "sim-sas",
          t: "拿非夾角的那個角來套。"
        },
        {
          n: "SSS 相似（三邊成比例）",
          f: "\\frac{\\overline{AB}}{\\overline{DE}}=\\frac{\\overline{BC}}{\\overline{EF}}=\\frac{\\overline{CA}}{\\overline{FD}}",
          w: "題目只給六段邊長時。",
          l: "是三組邊「成比例」不是相等；比值 $k$ 要三組都算出來確認一樣。",
          fig: "sim-sss",
          t: "只算兩組比值相等就下結論。"
        },
        {
          n: "型態① A 字型（DE ∥ BC）",
          f: "\\begin{aligned}&\\overline{DE}\\parallel\\overline{BC} \\Rightarrow \\triangle ADE\\sim\\triangle ABC \\\\ &\\frac{\\overline{AD}}{\\overline{AB}}=\\frac{\\overline{AE}}{\\overline{AC}}=\\frac{\\overline{DE}}{\\overline{BC}}\\end{aligned}",
          w: "三角形內有一條平行於某邊的截線——這是最常出現的型態。",
          l: "兩個三角形共用頂角 $A$，加上同位角相等就是 AA。注意這裡的比是「部分比全體」（$\\overline{AD}:\\overline{AB}$），跟比例線段的「部分比部分」（$\\overline{AD}:\\overline{DB}$）不一樣。",
          fig: "sim-type-a",
          t: "把 $\\overline{DE}:\\overline{BC}$ 寫成 $\\overline{AD}:\\overline{DB}$。"
        },
        {
          n: "型態② X 字型（蝴蝶型）",
          f: "\\begin{aligned}&\\overline{AB}\\parallel\\overline{CD} \\Rightarrow \\triangle OAB\\sim\\triangle OCD \\\\ &\\frac{\\overline{OA}}{\\overline{OC}}=\\frac{\\overline{OB}}{\\overline{OD}}=\\frac{\\overline{AB}}{\\overline{CD}}\\end{aligned}",
          w: "兩條線段交叉、而且有一組對邊平行（梯形的兩條對角線、繩子交叉問題）。",
          l: "靠的是「對頂角相等 + 內錯角相等」。對應順序最容易錯：$A$ 對 $C$、$B$ 對 $D$（隔著交點正對面的那個），不是 $A$ 對 $D$。",
          fig: "sim-type-x",
          t: "對應點配反，把 $\\overline{OA}:\\overline{OD}$ 當成相似比。"
        },
        {
          n: "型態③ 共角型",
          f: "\\begin{aligned}&\\text{共用 } \\angle A \\text{ 且 } \\angle ADE=\\angle ACB \\\\ &\\Rightarrow \\triangle ADE\\sim\\triangle ACB \\\\ &\\Rightarrow \\overline{AD}\\cdot\\overline{AB}=\\overline{AE}\\cdot\\overline{AC}\\end{aligned}",
          w: "兩個三角形共用一個角，但截線「不平行」於對邊時。圓的內接四邊形題目最常用這一型。",
          l: "順序是 $\\triangle ADE\\sim\\triangle A\\mathbf{C}\\mathbf{B}$（$D$ 對 $C$、$E$ 對 $B$），是「交叉」對應不是照著寫。由它可以直接得到 $\\overline{AD}\\cdot\\overline{AB}=\\overline{AE}\\cdot\\overline{AC}$，這在求線段長時非常好用。",
          fig: "sim-type-common-angle",
          t: "看到共用角就照字母順序寫成 $\\triangle ADE\\sim\\triangle ABC$（對應配錯）。"
        },
        {
          n: "型態④ 母子型（直角三角形的高）",
          f: "\\begin{aligned}&\\triangle ACH\\sim\\triangle CBH\\sim\\triangle ABC \\\\ &h^2=pq,\\quad \\overline{AC}^2=\\overline{AB}\\cdot p\\end{aligned}",
          w: "直角三角形中畫出「斜邊上的高」時；求高、求分成的兩段長。",
          l: "三個三角形兩兩相似（大的、左邊小的、右邊小的）。$p$、$q$ 是高把斜邊分成的兩段，$h^2=pq$ 是最常考的一條。",
          fig: "sim-type-right",
          t: "把 $h^2$ 寫成 $p+q$，或把 $\\overline{AC}^2$ 配到錯的那一段。"
        },
        {
          n: "對應邊成比例",
          f: "\\frac{\\overline{AB}}{\\overline{DE}}=\\frac{\\overline{BC}}{\\overline{EF}}=\\frac{\\overline{CA}}{\\overline{FD}}=k",
          w: "由相似求未知邊長。",
          l: "分子分母要固定同一個三角形，不能一下大三角形在上、一下在下。",
          fig: "sim-ratio",
          t: "比例式上下顛倒，算出來的長度剛好倒過來。"
        },
        {
          n: "連比例",
          f: "\\begin{aligned}&a:b=2:3,\\ b:c=4:5 \\\\ &\\Rightarrow a:b:c=8:12:15\\end{aligned}",
          w: "三個量以上的分配問題；相似形把兩組比串起來時也用它。",
          l: "要先把「公共項 $b$」化成相同的數（取最小公倍數）才能串起來。",
          fig: "sim-ratio",
          t: "直接寫成 $2:3:5$。"
        },
        {
          n: "三角形兩邊中點連線定理",
          f: "\\begin{aligned}&\\overline{MN}\\parallel\\overline{BC} \\\\ &\\overline{MN}=\\tfrac12\\overline{BC}\\end{aligned}",
          w: "圖上出現兩個中點時，立刻可得平行與長度關係。",
          l: "必須是「兩邊的中點」；只有一個中點推不出來。",
          fig: "mid-segment",
          t: "把 $\\overline{MN}$ 寫成 $\\overline{BC}$ 的兩倍。"
        },
        {
          n: "平行線截比例線段",
          f: "\\overline{DE}\\parallel\\overline{BC} \\Rightarrow \\frac{\\overline{AD}}{\\overline{DB}}=\\frac{\\overline{AE}}{\\overline{EC}}",
          w: "三角形內有一條平行線時，馬上得到比例關係。",
          l: "注意 $\\dfrac{AD}{DB}$（部分比部分）與 $\\dfrac{AD}{AB}$（部分比全體）不同，別混用。這條定理「不限於三角形」——只要有平行線截兩條直線就成立，見下一張卡。",
          fig: "sim-parallel",
          t: "把「部分:部分」與「部分:全體」混在同一個比例式裡。"
        },
        {
          n: "平行線截比例線段（一般情形）",
          f: "\\begin{aligned}&L_1\\parallel L_2\\parallel L_3 \\\\ &\\Rightarrow \\overline{AB}:\\overline{BC}=\\overline{DE}:\\overline{EF}\\end{aligned}",
          w: "圖上有兩條以上的平行線截過兩條直線時（不必是三角形）。",
          l: "只要「平行」就成立，兩條被截的直線可以完全不相交、也可以交在圖外。上一張卡的三角形其實是這條的特例——把其中一條平行線放到通過頂點的位置就變成三角形。",
          fig: "sim-parallel-lines",
          t: "以為一定要有三角形才能用。"
        },
        {
          n: "對應高的比、周長比與面積比",
          f: "\\begin{aligned}&\\text{邊長比}=k \\\\ &\\Rightarrow \\text{對應高的比}=\\text{周長比}=k \\\\ &\\text{面積比}=k^2\\end{aligned}",
          w: "地圖比例尺、模型與實物、放大縮小的題目。",
          l: "面積比是「平方」不是「兩倍」；由面積比反推邊長比要開根號。（補充：相似立體的體積比是 $k^3$，不在 108 課綱國中範圍。）",
          fig: "sim-ratio",
          t: "邊長變 2 倍就說面積變 2 倍。"
        }
      ]
    }
  ]
});
