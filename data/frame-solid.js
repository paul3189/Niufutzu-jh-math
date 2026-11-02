/* 架構重建卡（國中）16：立體圖形（第二批第 10 張，2026-11-02）。格式見高中專案 _scripts/frame_cards/FORMAT.md；數值例由 verify_frames.py（verify_part3.py）驗算。
 * 課綱界線：錐體體積與空間中兩直線歪斜屬補充，卡上標明「補充」。 */
FRAME({
  id: "solid", stage: "jh", no: 16, n: "立體圖形",
  scope: "九年級",
  curr: ["S-9-12", "S-9-13"],   // 課綱碼只給資料用，不印在學生看的卡上
  time: 10,
  intro: "立體圖形分成「柱體」（上下兩個全等平行的底面）和「錐體」（一個底面配一個頂點）。A 表把角柱、圓柱、正角錐、圓錐的展開圖、表面積與體積排在一起比對；背面延伸表用長方體模型整理空間中直線與平面的平行、垂直與歪斜。想不出來就寫「?」，不要空著。",
  sections: [
    {
      id: "a", title: "A　柱體與錐體：展開圖、表面積與體積對照表", type: "props", rowH: 28,
      fields: [{ id: "net", n: "展開圖長什麼樣（底面＋側面）" }, { id: "area", n: "表面積 $S$（攤平加總）" }, { id: "vol", n: "體積 $V$ 與前提" }],
      rows: [
        { id: "1", n: "角柱（含長方體、正方體）",
          ans: {
            net: "上下 $2$ 個全等的多邊形底面 $+$ $n$ 個長方形側面（側面全部接在一起是一大片長方形，長 $=$ 底面周長、寬 $=$ 柱高 $h$）",
            area: "$S=2\\times\\text{底面積}+\\text{底面周長}\\times h$；長方體（長 $\\ell$、寬 $w$、高 $h$）$S=2(\\ell w+wh+h\\ell)$",
            vol: "$V=\\text{底面積}\\times h$（長方體 $V=\\ell wh$）；高 $h$ 必須垂直於底面，別把底面三角形自己的高跟柱高搞混"
          },
          tools: ["solid/prism/柱體體積通式", "solid/prism/長方體（四角柱）", "solid/prism/展開圖"], kp: ["prism"],
          ex: [
            { id: "sd1a", q: "長 $5$、寬 $4$、高 $3$ 的長方體，體積與表面積依序為", a: "$(60,\\ 94)$", val: "(60,94)" },
            { id: "sd1b", q: "底面為兩股 $3,4$（斜邊 $5$）的直角三角形、柱高 $10$ 的三角柱，體積與表面積依序為", a: "$(60,\\ 132)$", val: "(60,132)" }
          ]
        },
        { id: "2", n: "圓柱（底半徑 $r$、高 $h$）", reduce: ["1"], reduceNote: "把①的底面換成圓：底面積 $\\pi r^2$、底面周長 $2\\pi r$",
          ans: {
            net: "上下 $2$ 個半徑 $r$ 的圓 $+$ $1$ 個長方形側面（長方形的長 $=$ 底圓周長 $2\\pi r$、寬 $=$ 柱高 $h$）",
            area: "$S=2\\pi r^2+2\\pi rh$（兩底圓面積 $+$ 側面長方形面積）",
            vol: "$V=\\pi r^2h$；側面長方形的長是底圓周長 $2\\pi r$，不是直徑 $2r$"
          },
          tools: ["solid/prism/圓柱", "solid/prism/圓柱的展開圖"], kp: ["prism"],
          ex: [
            { id: "sd2", q: "底圓半徑 $r=3$、高 $h=5$ 的圓柱，體積與表面積依序為（以 $\\pi$ 表示，填 $\\pi$ 的係數）", a: "$(45\\pi,\\ 48\\pi)$", val: "(45,48)" }
          ]
        },
        { id: "3", n: "正角錐（底面正 $n$ 邊形）",
          ans: {
            net: "$1$ 個正 $n$ 邊形底面 $+$ $n$ 個全等的等腰三角形側面（側面三角形的高叫「斜高」）",
            area: "$S=\\text{底面積}+n\\times\\left(\\dfrac12\\times\\text{底邊長}\\times\\text{斜高}\\right)$",
            vol: "（補充）$V=\\dfrac13\\times\\text{底面積}\\times\\text{錐高 }h$；算側面積用「斜高」，算體積用垂直底面的「錐高 $h$」"
          },
          tools: ["solid/pyramid/正角錐的展開圖與表面積", "solid/pyramid/四角錐與三角錐", "solid/pyramid/錐體體積通式"], kp: ["pyramid"],
          ex: [
            { id: "sd3", q: "底面邊長 $6$、側面斜高 $5$ 的正四角錐，表面積 $S=$", a: "$6^2+4\\times\\left(\\dfrac12\\times 6\\times 5\\right)=96$", val: "96" }
          ]
        },
        { id: "4", n: "圓錐（底半徑 $r$、錐高 $h$、母線 $\\ell$）", reduce: ["3"], reduceNote: "側面扇形面積 $\\dfrac12\\times 2\\pi r\\times\\ell=\\pi r\\ell$，和③的 $\\dfrac12\\times\\text{底周長}\\times\\text{斜高}$ 一模一樣",
          ans: {
            net: "$1$ 個半徑 $r$ 的底圓 $+$ $1$ 個扇形側面（扇形半徑 $=$ 母線 $\\ell$，扇形弧長 $=$ 底圓周長 $2\\pi r$，圓心角 $\\theta=360^\\circ\\times\\dfrac{r}{\\ell}$）",
            area: "$S=\\pi r^2+\\pi r\\ell$（底圓面積 $+$ 側面扇形面積）",
            vol: "母線 $\\ell=\\sqrt{r^2+h^2}$；（補充）體積 $V=\\dfrac13\\pi r^2h$；側面積是 $\\pi r\\ell$，別誤代錐高 $h$"
          },
          tools: ["solid/pyramid/圓錐", "solid/pyramid/錐體體積通式"], kp: ["pyramid"],
          ex: [
            { id: "sd4a", q: "底圓半徑 $r=3$、母線 $\\ell=9$ 的圓錐，側面展開扇形的圓心角幾度", a: "$360^\\circ\\times\\dfrac39=120^\\circ$", val: "120" },
            { id: "sd4b", q: "同上（$r=3,\\ell=9$），圓錐總表面積為幾 $\\pi$（填 $\\pi$ 的係數）", a: "$9\\pi+27\\pi=36\\pi$", val: "36" }
          ]
        }
      ]
    },
    {
      id: "b", title: "延伸（背面）　空間中的線與平面關係（拿長方體盒子的稜線與面來想）", type: "table", back: true, rowH: 13,
      fields: [{ id: "cond", n: "定義與判定" }, { id: "box", n: "在長方體 $ABCD\\text{-}EFGH$ 上的例子" }, { id: "pre", n: "前提或易錯" }],
      rows: [
        { id: "5", n: "空間中兩直線：平行與相交（垂直）",
          ans: {
            cond: "兩直線「在同一個平面上（共面）」時，不相交就平行，相交成 $90^\\circ$ 就垂直",
            box: "同一側面上的 $\\overline{AB}\\parallel\\overline{EF}$；共用頂點 $B$ 的 $\\overline{AB}\\perp\\overline{BC}$",
            pre: "必須先在同一個平面上，才能談平行或相交"
          },
          tools: ["solid/space/空間中兩直線的平行與垂直"], kp: ["space"],
          ex: [
            { id: "sd5", q: "長方體 $ABCD\\text{-}EFGH$（$E,F,G,H$ 依序在 $A,B,C,D$ 正下方）的 $12$ 條稜中，與稜 $\\overline{AB}$ 平行的有幾條", a: "$3$ 條（$\\overline{CD},\\overline{EF},\\overline{GH}$）", val: "3" }
          ]
        },
        { id: "6", n: "空間中兩直線：歪斜（補充）",
          ans: {
            cond: "兩直線「既不平行、也不相交」（找不到任何一個平面同時裝下這兩條線）",
            box: "長方體上 $\\overline{AB}$ 與 $\\overline{CG}$（或 $\\overline{DH}$）：一橫一豎且不相交",
            pre: "空間中「兩直線不相交」有兩種可能：平行或歪斜，不能直接說平行"
          },
          tools: ["solid/space/歪斜"], kp: ["space"],
          ex: [
            { id: "sd6", q: "長方體的 $12$ 條稜線中，與 $\\overline{AB}$ 歪斜的稜線有幾條", a: "$4$ 條（$\\overline{CG},\\overline{DH},\\overline{FG},\\overline{EH}$）", val: "4" }
          ]
        },
        { id: "7", n: "直線與平面的垂直與平行",
          ans: {
            cond: "直線 $L\\perp$ 平面 $E\\iff L$ 與平面 $E$ 上「通過垂足的每一條直線」都垂直（至少要與面上兩條相交直線垂直）；$L\\parallel E\\iff L$ 不在 $E$ 上且與 $E$ 沒有交點",
            box: "高 $\\overline{AE}\\perp$ 底面 $EFGH\\Rightarrow \\overline{AE}\\perp\\overline{EF}$、$\\overline{AE}\\perp\\overline{EH}$ 且 $\\overline{AE}\\perp$ 底面對角線 $\\overline{EG}$",
            pre: "只和平面上的「一條」直線垂直，還不足以保證垂直整個平面"
          },
          tools: ["solid/space/直線與平面的垂直、平行"], kp: ["space"],
          ex: [
            { id: "sd7", q: "長方體中 $\\overline{AE}\\perp$ 底面 $EFGH$，則 $\\angle AEG$ 為幾度", a: "$90^\\circ$", val: "90" }
          ]
        }
      ]
    }
  ],
  final: [
    { id: "f1", q: "角柱①和圓柱②的「側面積」與「體積」，為什麼其實是同一套公式？", ans: "只要把角柱與圓柱都看成「柱體」：側面攤平都是一個大長方形，長都是「底面周長」、寬都是「柱高 $h$」，所以側面積都是「底面周長 $\\times h$」；體積都是「底面積 $\\times h$」。", lines: 2 },
    { id: "f2", q: "圓錐④側面展開扇形的圓心角 $\\theta=360^\\circ\\times\\dfrac{r}{\\ell}$ 與側面積 $\\pi r\\ell$，是從哪一條等式推出來的？", ans: "從「側面扇形的弧長 $=$ 底圓的周長」：$2\\pi\\ell\\times\\dfrac{\\theta}{360^\\circ}=2\\pi r\\Rightarrow \\dfrac{\\theta}{360^\\circ}=\\dfrac{r}{\\ell}$；代回扇形面積 $\\pi\\ell^2\\times\\dfrac{\\theta}{360^\\circ}=\\pi\\ell^2\\times\\dfrac{r}{\\ell}=\\pi r\\ell$。", lines: 2 }
  ],
  example: { q: "①「空間中兩條不相交的直線一定互相平行」對嗎？②「正四角錐底面邊長 $6$、錐高 $4$，所以一個側面三角形面積 $=\\dfrac12\\times 6\\times 4=12$」對嗎？", ans: "①不對。在空間中兩直線不相交，還可能是「歪斜」（不在同一平面上，如長方體的 $\\overline{AB}$ 與 $\\overline{CG}$）。②不對。算側面三角形面積要用側面上的「斜高」$\\sqrt{4^2+3^2}=5$，面積應為 $\\dfrac12\\times 6\\times 5=15$，不能直接拿垂直底面的錐高 $4$ 來算。", lines: 2 },
  pitfalls: [
    "算柱體表面積時只加一個底面（忘了上下有兩個底面），或圓柱側面長方形的長誤代直徑 $2r$（應為底圓周長 $2\\pi r$）。",
    "三角柱求體積時，把「底面三角形的高」跟「三角柱的柱高」搞混。",
    "正角錐與圓錐算側面積時，誤拿垂直底面的「錐高 $h$」當成側面的「斜高／母線 $\\ell$」。",
    "圓錐展開扇形求圓心角 $\\theta=360^\\circ\\times\\dfrac{r}{\\ell}$ 時，把底圓半徑 $r$ 與扇形半徑（母線 $\\ell$）放反。",
    "把平面幾何「兩直線不相交必平行」直接搬到空間中，忽略了空間中的歪斜線。"
  ]
});
