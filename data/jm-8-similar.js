/* 領域 8：畢氏定理與相似形（幾何．以圖為主） */
TM({
  id: "similar", n: "畢氏定理與相似形", icon: "🔺", color: "#8e3b62", geo: true,
  ask: "題目要求「長度」時 —— 先找直角（畢氏），再找相似（比例）。這兩招能算出國中九成的長度；直角三角形再多給一個角，就用三角比。",
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
          l: "做法是畢氏定理用兩次：先在底面求出底面對角線 $\\sqrt{\\ell^2+w^2}$，再與高 $h$ 組成第二個直角三角形。正方體邊長 $a$ 時體對角線為 $\\sqrt{3}a$。",
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
          l: "兩股相等；正方形邊長 $a$ 的對角線是 $\\sqrt{2}a$。",
          fig: "spec-45",
          t: "把正方形對角線寫成 $2a$。"
        }
      ]
    },

    {
      id: "sim", n: "相似形", g: 9, kw: ["相似", "相似多邊形", "反例", "AA", "SAS", "SSS", "A 字型", "X 字型", "共角", "母子", "連比", "比例線段", "中點連線", "縮放", "面積比"],
      flow: "先認「型態」再談判別：題目裡的相似三角形幾乎都是疊在一起的四種型態之一（A 字、X 字、共角、母子），認出型態就知道哪兩個三角形相似、對應順序怎麼寫。",
      fig: "sim-poly-def",
      tools: [
        {
          n: "相似多邊形（定義）",
          d: "兩個多邊形的「對應角都相等」且「對應邊都成比例」，就說它們相似（記作 $\\sim$）；那個共同的比值叫相似比。",
          f: "\\begin{aligned}&\\text{對應角相等} \\\\ &\\text{且 對應邊成比例（比值 } k\\text{）} \\\\ &\\iff \\text{相似}\\end{aligned}",
          w: "判斷兩個四邊形以上的圖形相不相似時：兩個條件都要檢查，缺一個就不能下結論。",
          l: "「且」是關鍵：對應角相等、對應邊成比例，兩個條件要同時成立（見下面兩張反例）。只有三角形例外——三角形的角一旦兩組相等，邊就自動成比例，所以三角形只要 AA 就夠。",
          fig: "sim-poly-def",
          t: "看到四個角都相等就說兩個四邊形相似（矩形和正方形就不相似）。"
        },
        {
          n: "反例①　只有對應角相等，不夠",
          f: "\\begin{aligned}&\\text{矩形與正方形：四個角都是 } 90^\\circ \\\\ &\\text{但 } 9:5\\ne 5:5 \\Rightarrow \\text{不相似}\\end{aligned}",
          w: "題目只給了「各角相等」就問相不相似時，先想這個反例。",
          l: "角相等只保證「形狀的方向」一樣，沒有管邊的長短：矩形可以任意拉長，四個角始終是直角。多邊形（四邊以上）沒有 AA 這種判別法。",
          fig: "sim-poly-angles-only",
          t: "把三角形的 AA 相似套到四邊形上。"
        },
        {
          n: "反例②　只有對應邊成比例，也不夠",
          f: "\\begin{aligned}&\\text{菱形與正方形：四邊都相等（}1:1\\text{）} \\\\ &\\text{但角不相等} \\Rightarrow \\text{不相似}\\end{aligned}",
          w: "題目只給了「各邊成比例」就問相不相似時，先想這個反例。",
          l: "邊成比例只保證「邊的長短」對，沒有管角：菱形可以被壓扁，四邊長度都不變。多邊形（四邊以上）也沒有 SSS 這種判別法；SSS 相似同樣只對三角形成立。",
          fig: "sim-poly-sides-only",
          t: "看到四邊等長就說「這是正方形的縮放」（那可能只是菱形）。"
        },
        {
          n: "AA 相似（兩組角相等）",
          f: "\\begin{aligned}&\\angle A=\\angle D,\\ \\angle B=\\angle E \\\\ &\\Rightarrow \\triangle ABC\\sim\\triangle DEF\\end{aligned}",
          w: "國中最常用的相似判別法：只要兩組角相等就成立。這是三角形獨有的——四邊形以上不能這樣用（見上面的反例①）。",
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
          l: "是三組邊「成比例」不是相等；比值 $k$ 要三組都算出來確認一樣。同樣只對三角形成立（四邊形的反例②：菱形與正方形）。",
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
        },
        {
          n: "相似形的畫法（以一點為中心縮放）",
          f: "\\overline{OA'}=k\\,\\overline{OA},\\ \\overline{OB'}=k\\,\\overline{OB},\\ \\overline{OC'}=k\\,\\overline{OC} \\Rightarrow \\triangle A'B'C'\\sim\\triangle ABC",
          w: "要畫一個圖形的 $k$ 倍放大或縮小圖：取一點 $O$，連到各頂點，在射線上量出 $k$ 倍的位置，再連起來。",
          l: "$O$ 是縮放中心、$k$ 是縮放倍數（$k>1$ 放大、$0<k<1$ 縮小）；新圖形的每一邊都是原來的 $k$ 倍、角度不變，面積變 $k^2$ 倍。方格紙上縮放就是每段長度都乘 $k$。",
          fig: "sim-dilation",
          t: "只把某一邊放大 2 倍，其他邊沒跟著變，畫出來的就不相似。"
        },
        {
          n: "簡易測量①：影長",
          f: "\\frac{\\text{竿高}}{\\text{竿影長}}=\\frac{\\text{樹高}}{\\text{樹影長}}",
          w: "同一時刻、同一地點量竹竿與它的影子，就能算出大樹、旗桿的高度。",
          l: "前提是「同一時刻」，陽光平行，兩個直角三角形 AA 相似；影子要量到底部正下方。",
          fig: "sim-measure-shadow",
          t: "比例式上下配錯：拿竿高比樹影長。"
        },
        {
          n: "簡易測量②：鏡子反射",
          f: "\\frac{\\text{眼高}}{\\text{人到鏡子}}=\\frac{\\text{樹高}}{\\text{樹到鏡子}}",
          w: "地上放一面鏡子，人退到剛好從鏡中看到樹頂，就能求樹高。",
          l: "入射角＝反射角，人、樹都垂直地面，所以兩個直角三角形 AA 相似；量的是「眼睛」的高度，不是身高。",
          fig: "sim-measure-mirror",
          t: "用身高代替眼高，或把人到鏡子、樹到鏡子的距離配反。"
        },
        {
          n: "簡易測量③：標竿（三點一線）",
          f: "\\frac{\\text{竿高}-\\text{眼高}}{\\text{人到竿}}=\\frac{\\text{樹高}-\\text{眼高}}{\\text{人到樹}}",
          w: "眼睛、竿頂、樹頂三點在同一直線上時，用 A 字型相似求樹高。",
          l: "相似的三角形在「眼睛那條水平線以上」，所以竿高、樹高都要先減去眼高，算完樹高再把眼高加回去；人到樹的距離是兩段相加。",
          fig: "sim-measure-pole",
          t: "直接用竿高、樹高列比例，忘了扣掉眼高。"
        }
      ]
    },

    /* 三角比：108 課綱 S-9-4（相似直角三角形邊長比值的不變性）。
     * 範圍依授課老師 2026-10-15 裁定：sin／cos／tan 的定義、30°／45°／60° 特別角、
     * sin 與 cos 的互餘關係、tan = sin ÷ cos、三角形面積 ½ab·sinC；同日老師同意加入仰角、俯角、測高應用。
     * 不收：平方關係當公式、正弦／餘弦定理、和角差角、倍角、弧度、單位圓、鈍角三角比、反三角函數、圖形。 */
    {
      id: "trig", n: "三角比", g: 9,
      kw: ["三角比", "sin", "cos", "tan", "正弦", "餘弦", "正切", "對邊", "鄰邊", "斜邊", "特別角", "30°", "45°", "60°", "互餘", "夾角", "兩邊夾角", "近似值", "仰角", "俯角", "測量", "樓高", "眼高"],
      flow: "直角三角形裡「已知一個銳角＋一邊、求另一邊」：先站在那個角上分清楚對邊、鄰邊、斜邊，再挑「同時含已知邊與所求邊」的那個三角比；給兩邊和夾角求面積，就用 ½ab·sin C。",
      fig: "trig-def",
      tools: [
        {
          n: "三角比的定義（sin、cos、tan）",
          d: "在直角三角形中看一個銳角 $\\theta$：$\\theta$ 的對邊比斜邊叫正弦 $\\sin\\theta$，鄰邊比斜邊叫餘弦 $\\cos\\theta$，對邊比鄰邊叫正切 $\\tan\\theta$。",
          f: "\\begin{aligned}&\\sin\\theta=\\frac{\\text{對邊}}{\\text{斜邊}}=\\frac{a}{c} \\\\ &\\cos\\theta=\\frac{\\text{鄰邊}}{\\text{斜邊}}=\\frac{b}{c} \\\\ &\\tan\\theta=\\frac{\\text{對邊}}{\\text{鄰邊}}=\\frac{a}{b}\\end{aligned}",
          w: "直角三角形中，角度和邊長要互相換算時。例：$\\angle C=90^\\circ$、$\\overline{BC}=3$、$\\overline{AC}=4$、$\\overline{AB}=5$，則 $\\sin A=\\dfrac35$、$\\cos A=\\dfrac45$、$\\tan A=\\dfrac34$。",
          l: "「對邊、鄰邊」是相對於正在看的那個角而言：換成另一個銳角，對邊和鄰邊就對調，斜邊不變。國中只對直角三角形的「銳角」談三角比。",
          fig: "trig-def",
          t: "把 $\\angle B$ 的對邊當成 $\\angle A$ 的對邊；或把 $\\cos\\theta$ 記成「對邊比斜邊」。"
        },
        {
          n: "三角比只由角度決定",
          f: "\\begin{aligned}&\\triangle ABC\\sim\\triangle AB'C' \\\\ &\\Rightarrow \\frac{\\overline{BC}}{\\overline{AB}}=\\frac{\\overline{B'C'}}{\\overline{AB'}}=\\sin A\\end{aligned}",
          w: "說明為什麼 $\\sin30^\\circ$ 是一個固定的數。例：斜邊 $2$ 與斜邊 $10$ 的 $30^\\circ$-$60^\\circ$-$90^\\circ$ 三角形，$30^\\circ$ 的對邊分別是 $1$ 與 $5$，比值都是 $\\dfrac12$。",
          l: "有一個銳角相等的兩個直角三角形一定相似（AA），對應邊成比例，所以邊長的「比值」不因三角形放大縮小而改變，只跟角度有關。",
          fig: "trig-similar",
          x: "這就是相似形的「對應邊成比例」：三角比是把相似比固定成一個看角度就知道的數。",
          t: "以為三角形畫得比較大，$\\sin\\theta$ 就比較大。"
        },
        {
          n: "30°、60° 的三角比",
          f: "\\begin{aligned}&\\sin30^\\circ=\\tfrac12,\\ \\cos30^\\circ=\\tfrac{\\sqrt3}{2} \\\\ &\\tan30^\\circ=\\tfrac{\\sqrt3}{3} \\\\ &\\sin60^\\circ=\\tfrac{\\sqrt3}{2},\\ \\cos60^\\circ=\\tfrac12 \\\\ &\\tan60^\\circ=\\sqrt3\\end{aligned}",
          w: "由 $30^\\circ$-$60^\\circ$-$90^\\circ$ 的邊長比 $1:\\sqrt3:2$ 直接讀出來，不必硬背。例：斜邊 $8$、一個銳角 $30^\\circ$，它的對邊 $=8\\sin30^\\circ=4$、鄰邊 $=8\\cos30^\\circ=4\\sqrt3$。",
          l: "短股 $1$ 對 $30^\\circ$、長股 $\\sqrt3$ 對 $60^\\circ$、斜邊 $2$。$\\tan30^\\circ=\\dfrac{1}{\\sqrt3}$，有理化後寫成 $\\dfrac{\\sqrt3}{3}$。",
          fig: "spec-3060",
          t: "把 $\\sin30^\\circ$ 和 $\\sin60^\\circ$ 記反——畫出三角形，$30^\\circ$ 的對邊是最短的那一邊。"
        },
        {
          n: "45° 的三角比",
          f: "\\begin{aligned}&\\sin45^\\circ=\\cos45^\\circ=\\tfrac{\\sqrt2}{2} \\\\ &\\tan45^\\circ=1\\end{aligned}",
          w: "等腰直角三角形、正方形的對角線。例：等腰直角三角形的斜邊 $6$，一股 $=6\\sin45^\\circ=3\\sqrt2$。",
          l: "由 $1:1:\\sqrt2$ 讀出來：$\\sin45^\\circ=\\dfrac{1}{\\sqrt2}=\\dfrac{\\sqrt2}{2}$；兩股相等，所以 $\\tan45^\\circ=1$。",
          fig: "spec-45",
          t: "把 $\\sin45^\\circ$ 寫成 $\\sqrt2$（那是斜邊比股，倒過來了）。"
        },
        {
          n: "特別角三角比一覽",
          f: "\\begin{array}{c|ccc} & 30^\\circ & 45^\\circ & 60^\\circ \\\\[4pt] \\hline \\rule{0pt}{22pt}\\sin & \\dfrac12 & \\dfrac{\\sqrt2}{2} & \\dfrac{\\sqrt3}{2} \\\\[10pt] \\cos & \\dfrac{\\sqrt3}{2} & \\dfrac{\\sqrt2}{2} & \\dfrac12 \\\\[10pt] \\tan & \\dfrac{\\sqrt3}{3} & 1 & \\sqrt3 \\end{array}",
          w: "考前快速核對；特別角的計算題。例：$\\sin30^\\circ+\\cos60^\\circ=\\dfrac12+\\dfrac12=1$。",
          l: "$\\sin$ 那一列和 $\\cos$ 那一列剛好左右顛倒——這就是下面的互餘關係。忘記時回去畫 $1:\\sqrt3:2$ 與 $1:1:\\sqrt2$ 兩個三角形，比硬背可靠。",
          fig: "trig-special",
          t: "把 $\\tan30^\\circ$ 與 $\\tan60^\\circ$ 對調。"
        },
        {
          n: "sin 與 cos 的互餘關係",
          f: "\\begin{aligned}&\\sin(90^\\circ-\\theta)=\\cos\\theta \\\\ &\\cos(90^\\circ-\\theta)=\\sin\\theta\\end{aligned}",
          w: "兩個角互餘（和為 $90^\\circ$），或要把 $\\sin$ 換成 $\\cos$ 時。例：$\\sin60^\\circ=\\cos30^\\circ$；$\\cos20^\\circ=\\sin70^\\circ$。",
          l: "直角三角形的兩個銳角互餘：$\\angle A$ 的對邊正好是 $\\angle B$ 的鄰邊，所以 $\\sin A=\\cos B$。這裡的 $\\theta$ 是銳角（$0^\\circ < \\theta < 90^\\circ$）。",
          fig: "trig-cofunction",
          t: "寫成 $\\sin(90^\\circ-\\theta)=\\sin\\theta$；或以為 $\\sin A=\\cos B$ 就表示 $A=B$。"
        },
        {
          n: "tan ＝ sin ÷ cos",
          f: "\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}",
          w: "已知 $\\sin\\theta$ 與 $\\cos\\theta$ 要求 $\\tan\\theta$ 時。例：$\\sin\\theta=\\dfrac35$、$\\cos\\theta=\\dfrac45$，則 $\\tan\\theta=\\dfrac35\\div\\dfrac45=\\dfrac34$。",
          l: "理由：$\\dfrac{a}{c}\\div\\dfrac{b}{c}=\\dfrac{a}{b}$，斜邊 $c$ 約掉了，剩下對邊比鄰邊。",
          fig: "trig-def",
          t: "上下顛倒，寫成 $\\dfrac{\\cos\\theta}{\\sin\\theta}$。"
        },
        {
          n: "用三角比求邊長",
          f: "\\begin{aligned}&\\text{對邊}=\\text{斜邊}\\times\\sin\\theta \\\\ &\\text{鄰邊}=\\text{斜邊}\\times\\cos\\theta \\\\ &\\text{對邊}=\\text{鄰邊}\\times\\tan\\theta\\end{aligned}",
          w: "直角三角形已知一個銳角和一邊、求另一邊。例：$\\angle A=32^\\circ$、斜邊 $10$，題目給 $\\sin32^\\circ\\approx0.53$，對邊 $\\approx10\\times0.53=5.3$。",
          l: "先判斷「已知的邊」和「要求的邊」對這個角來說是哪兩種（對邊、鄰邊、斜邊），再挑同時含這兩邊的三角比。不是特別角時，題目會給近似值，直接代入即可。",
          fig: "trig-solve",
          t: "已知斜邊卻用 $\\tan$；或把「斜邊 $\\times\\sin\\theta$」寫成「斜邊 $\\div\\sin\\theta$」。"
        },
        {
          n: "仰角與俯角（測量高度）",
          d: "視線與水平線的夾角：目標在水平線上方叫仰角，在下方叫俯角。",
          f: "\\begin{aligned}&\\text{俯角}=\\text{對方看過來的仰角} \\\\ &\\text{高}=\\text{水平距離}\\times\\tan(\\text{仰角}) \\\\ &\\text{樹高}=\\text{眼高}+d\\tan\\theta\\end{aligned}",
          w: "測樓高、樹高、山高，或從高處看地面物體求距離。例：離樓 $30$ 公尺處測得樓頂仰角 $60^\\circ$（不計眼高），樓高 $=30\\tan60^\\circ=30\\sqrt3$ 公尺。",
          l: "仰角、俯角都從「水平線」量起，不是從鉛垂線。兩條水平線互相平行，所以 B 看 A 的俯角等於 A 看 B 的仰角（內錯角相等），俯角題就能搬到地面上的直角三角形來算。題目說人眼離地多高時，算出的高度要再加上眼高。兩個觀測點的題目：設高為 $h$，把兩段水平距離都用 $h$ 表示再相減。",
          fig: "trig-elevation",
          t: "把俯角畫在視線與牆面（鉛垂線）之間；或忘了加眼高。"
        },
        {
          n: "三角形面積 ½ab·sin C",
          f: "\\begin{aligned}&h=b\\sin C \\\\ &\\text{面積}=\\frac12ab\\sin C\\end{aligned}",
          w: "已知兩邊和它們的「夾角」求三角形面積。例：$a=6$、$b=8$、夾角 $C=30^\\circ$，面積 $=\\dfrac12\\times6\\times8\\times\\dfrac12=12$。",
          l: "角一定要是兩邊的夾角。國中的夾角只用銳角；夾角是直角時，兩邊就是底和高，面積直接是 $\\dfrac12ab$。",
          fig: "trig-area",
          x: "平行四邊形兩鄰邊 $a$、$b$ 夾銳角 $\\theta$：對角線切成兩個全等三角形，面積 $=ab\\sin\\theta$。",
          t: "忘了乘 $\\dfrac12$；或拿不是夾角的角代進去。"
        }
      ]
    }
  ]
});
