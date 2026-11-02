/* 架構重建卡（國中）14：比例問題（第二批第 8 張，2026-11-02）。格式見高中專案 _scripts/frame_cards/FORMAT.md；數值例由 verify_frames.py（verify_part3.py）驗算。 */
FRAME({
  id: "ratio", stage: "jh", no: 14, n: "比例問題",
  scope: "七、九年級",
  curr: ["N-7-9", "N-9-1"],   // 課綱碼只給資料用，不印在學生看的卡上
  time: 10,
  intro: "從七年級的「比、正反比」到九年級的「連比、相似形比例線段」，解題流程可以用一棵決策樹串起來。A 樹整理「看到什麼條件 → 用哪一招」，背面 B 表整理按比例分配、百分率連續增減與相似形的長度／面積比。想不出來就寫「?」，不要空著。",
  sections: [
    {
      id: "t", title: "A　比例問題決策樹：看到什麼 → 用哪一招", type: "tree", edgeLabel: "看到",
      fields: [{ id: "how", n: "做法或公式" }, { id: "pre", n: "前提或易錯" }],
      nodes: [
        { id: "0", n: "第 0 步：先換成同單位、求比值",
          fields: [{ id: "how", n: "比與比值的定義" }, { id: "pre", n: "動手前先檢查什麼" }],
          ans: {
            how: "$a:b$ 的比值 $=\\dfrac{a}{b}$（$b\\ne 0$）；同乘或同除一個非零數，比值不變",
            pre: "前後項有單位（如公尺 vs 公分、小時 vs 分鐘）一定要先換成同單位才能消掉；後項不能為 $0$"
          },
          tools: ["number/ratio/比與比值"], kp: ["ratio"],
          ex: [
            { id: "rt0", q: "$3\\text{ 公尺}:50\\text{ 公分}$ 化為最簡整數比後的比值", a: "$300:50=6:1$，比值 $6$", val: "6" }
          ]
        },
        { id: "1", n: "招① 比例式交叉相乘", parent: "0", edge: "兩個比相等 $a:b=c:d$（或 $\\dfrac{a}{b}=\\dfrac{c}{d}$），已知三項求第四項",
          ans: {
            how: "外項乘積 $=$ 內項乘積：$a:b=c:d\\iff ad=bc$（寫成分數即交叉相乘）",
            pre: "$a,d$ 是外項、$b,c$ 是內項，別配成前項乘前項；若項是含加減的式子（如 $x+2$）要加括號"
          },
          tools: ["number/ratio/比例式與交叉相乘"], kp: ["ratio"],
          ex: [
            { id: "rt1", q: "$(x+1):4=9:6$，則 $x=$", a: "$6(x+1)=36\\Rightarrow x=5$", val: "5" }
          ]
        },
        { id: "2", n: "招② 正比（商固定）", parent: "0", edge: "$x$ 變 $2$ 倍，$y$ 也跟著變 $2$ 倍（如單價固定時的數量與總價）",
          ans: {
            how: "$\\dfrac{y}{x}=k$（即 $y=kx$，$k\\ne 0$ 為固定比值）",
            pre: "不是「$x$ 大 $y$ 也大」就叫正比（例如 $y=x+3$ 不是正比），必須是比值 $\\dfrac{y}{x}$ 固定不變"
          },
          tools: ["number/ratio/正比與反比"], kp: ["ratio"],
          ex: [
            { id: "rt2", q: "$y$ 與 $x$ 成正比，當 $x=3$ 時 $y=12$，則 $x=5$ 時 $y=$", a: "$20$（$y=4x$）", val: "20" }
          ]
        },
        { id: "3", n: "招③ 反比（乘積固定）", parent: "0", edge: "$x$ 變 $2$ 倍，$y$ 反而變 $\\dfrac12$ 倍（如距離固定時的速率與時間）",
          ans: {
            how: "$xy=k$（$k\\ne 0$ 為固定乘積）",
            pre: "兩個量的乘積固定才叫反比；若速率比為 $a:b$，走相同距離的時間比要倒過來變成 $\\dfrac1a:\\dfrac1b=b:a$"
          },
          tools: ["number/ratio/正比與反比"], kp: ["ratio"],
          ex: [
            { id: "rt3", q: "$y$ 與 $x$ 成反比，當 $x=4$ 時 $y=15$，則 $x=6$ 時 $y=$", a: "$10$（$xy=60$）", val: "10" }
          ]
        },
        { id: "4", n: "招④ 兩個比串成連比 $a:b:c$", parent: "0", edge: "給兩組兩數比（如 $a:b$ 與 $b:c$），要合成三個量的連比",
          ans: {
            how: "找出兩組比裡「共同的那一項」（如 $b$），利用最小公倍數把兩邊的 $b$ 擴分成同一個數，再串成 $a:b:c$",
            pre: "共同項還沒化成一樣之前，絕對不能直接把數字抄在一起"
          },
          tools: ["number/ratio/連比的意義與化簡", "similar/sim/連比例"], kp: ["ratio", "sim"],
          ex: [
            { id: "rt4", q: "$a:b=2:3$、$b:c=4:5$，化為最簡整數連比 $a:b:c=$", a: "$8:12:15$", val: "(8,12,15)" }
          ]
        },
        { id: "5", n: "招⑤ 設比例常數 $k$", parent: "4", edge: "已知連比 $a:b:c=p:q:r$，要求代數式的值或解未知數",
          ans: {
            how: "設 $a=pk$、$b=qk$、$c=rk$（$k\\ne 0$）代入條件求 $k$；若題目給 $2x=3y=4z$：設 $2x=3y=4z=k$ 得倒數比 $x:y:z=\\dfrac12:\\dfrac13:\\dfrac14=6:4:3$，或同除以 $12$ 得 $\\dfrac{x}{6}=\\dfrac{y}{4}=\\dfrac{z}{3}$，直接讀出 $6:4:3$",
            pre: "$2x=3y=4z$ 的連比是倒數比 $6:4:3$，不是 $2:3:4$"
          },
          tools: ["number/ratio/連比例式（設比例常數 k）"], kp: ["ratio"],
          ex: [
            { id: "rt5a", q: "$a:b:c=2:3:4$ 且 $a+b+c=45$，則 $c=$", a: "$20$（$9k=45\\Rightarrow k=5$）", val: "20" },
            { id: "rt5b", q: "非零三數滿足 $2x=3y=4z$，則最簡整數比 $x:y:z=$", a: "$6:4:3$", val: "(6,4,3)" }
          ]
        }
      ]
    },
    {
      id: "b", title: "延伸（背面）　按比例分配、百分率增減與相似形比例", type: "table", back: true, rowH: 13,
      fields: [{ id: "when", n: "看到什麼題型" }, { id: "how", n: "公式或列式" }, { id: "pre", n: "前提或易錯" }],
      rows: [
        { id: "6", n: "按比例分配", reduce: ["5"], reduceNote: "就是招⑤設每一份為 $k$，總和 $(a+b+c)k=T$",
          ans: {
            when: "把總量 $T$（總金額、總長、三角形內角和 $180^\\circ$）按 $a:b:c$ 分給三部分",
            how: "先算「一份」$=\\dfrac{T}{a+b+c}$，再各自乘以 $a,b,c$（或直接乘佔比 $\\dfrac{a}{a+b+c}$）",
            pre: "幾何題常把總量藏起來（例如三角形三內角比要自己帶入總和 $180^\\circ$、互補兩角帶入 $180^\\circ$）"
          },
          tools: ["number/ratio/連比的應用（按比例分配）"], kp: ["ratio"],
          ex: [
            { id: "rt6", q: "三角形三內角度數比為 $1:2:3$，最大角幾度", a: "$180^\\circ\\times\\dfrac{3}{1+2+3}=90^\\circ$", val: "90" }
          ]
        },
        { id: "7", n: "百分率的連續增減",
          ans: {
            when: "成本加乘定價再打折、先漲 $a\\%$ 再跌 $b\\%$",
            how: "增加 $a\\%$ 乘以 $\\left(1+\\dfrac{a}{100}\\right)$；減少（或打折減去）$b\\%$ 乘以 $\\left(1-\\dfrac{b}{100}\\right)$",
            pre: "先漲 $20\\%$ 再跌 $20\\%$ 的第二次基準已經變大，相乘是 $1.2\\times 0.8=0.96$（變為原來的 $96\\%$），不會回到原價"
          },
          tools: ["number/ratio/百分率的增減"], kp: ["ratio"],
          ex: [
            { id: "rt7", q: "原價 $1000$ 元的商品，先漲 $20\\%$ 再跌 $20\\%$ 後售價幾元", a: "$1000\\times 1.2\\times 0.8=960$", val: "960" }
          ]
        },
        { id: "8", n: "平行線截比例線段與相似形面積比", reduce: ["1"], reduceNote: "列出對應邊比例式後，用招①交叉相乘求解",
          ans: {
            when: "三角形內有平行截線 $\\overline{DE}\\parallel\\overline{BC}$，或問相似圖形的周長比、面積比",
            how: "① 平行截線：側邊用「部分比部分」$\\overline{AD}:\\overline{DB}=\\overline{AE}:\\overline{EC}$，但底邊要用「部分比全體」$\\overline{DE}:\\overline{BC}=\\overline{AD}:\\overline{AB}$；② 邊長比 $k\\Rightarrow$ 周長比 $k$、面積比 $k^2$",
            pre: "別把 $\\overline{DE}:\\overline{BC}$ 寫成 $\\overline{AD}:\\overline{DB}$；面積比是邊長比的「平方」"
          },
          tools: ["similar/sim/平行線截比例線段", "similar/sim/對應高的比、周長比與面積比"], kp: ["sim", "ratio"],
          ex: [
            { id: "rt8", q: "$\\triangle ABC$ 中 $\\overline{DE}\\parallel\\overline{BC}$，$\\overline{AD}:\\overline{DB}=2:3$，則 $\\overline{DE}:\\overline{BC}$ 與面積比 $\\triangle ADE:\\triangle ABC$ 依序為", a: "$\\dfrac25$ 與 $\\dfrac{4}{25}$", val: "(2/5, 4/25)" }
          ]
        }
      ]
    }
  ],
  final: [
    { id: "f1", q: "「正比 $\\dfrac{y}{x}=k$」和「反比 $xy=k$」在判斷一個量變 $3$ 倍時，另一個量各怎麼變？", ans: "正比是商固定，一個量變 $3$ 倍，另一個量也變 $3$ 倍；反比是乘積固定，一個量變 $3$ 倍，另一個量變成原來的 $\\dfrac13$ 倍。", lines: 2 },
    { id: "f2", q: "招⑤「設比例常數 $k$」為什麼是解連比題的萬用鑰匙？", ans: "因為設 $a=2k,b=3k,c=4k$ 後，三個未知數瞬間降成「只有一個未知數 $k$」，不管是代進方程式求解還是代進分式約分，都退化回一元一次運算。", lines: 2 }
  ],
  example: { q: "①「小明年齡增加，爸爸年齡也增加，所以兩人年齡成正比」對嗎？②「$2x=3y$（$x,y\\ne 0$），所以 $x:y=2:3$」對嗎？", ans: "①不對。兩人年齡的「差」固定，但「比值」不固定（例如 $1$ 歲對 $31$ 歲是 $\\dfrac{1}{31}$，$10$ 歲對 $40$ 歲是 $\\dfrac{1}{4}$），所以不是正比。②不對。由外項乘積＝內項乘積，$x:y=3:2$ 才會得到 $2x=3y$（係數要倒過來）。", lines: 2 },
  pitfalls: [
    "前後項單位不同（例如公尺與公分、小時與分鐘）沒換算就直接求比值。",
    "比例式 $a:b=c:d$ 誤寫成前項乘前項 $ac=bd$（應為外項乘外項＝內項乘內項 $ad=bc$）。",
    "看到「$x$ 變大、$y$ 也變大」就直接說是正比，沒檢查比值 $\\dfrac{y}{x}$ 是否固定。",
    "$a:b=2:3$、$b:c=4:5$ 沒把共同項 $b$ 通分就直接寫成 $2:3:5$。",
    "看到 $2x=3y=4z$ 直接寫 $x:y:z=2:3:4$（應取倒數比 $\\dfrac12:\\dfrac13:\\dfrac14=6:4:3$）。",
    "先漲 $a\\%$ 再跌 $a\\%$ 以為回到原價（其實變為 $(1-\\frac{a^2}{10000})$ 倍，一定比原價低）。",
    "三角形平行截線把底邊比 $\\overline{DE}:\\overline{BC}$ 誤寫成部分比部分 $\\overline{AD}:\\overline{DB}$。"
  ]
});
