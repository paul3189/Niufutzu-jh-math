/* 課本章節 → 工具地圖單元對照（2026-10-30 起，國中教材部維護）
 * 用途：學習計畫「段考範圍」依課本章節勾選時，自動對到地圖單元（＝道場單元 id）。
 * units 用「領域id.主題id」（例 angle.proof），和直覺道場、錯題本的單元 id 相同；不要用單獨的主題 id（center 在兩個領域都有）。
 * 章節號以康軒、翰林、南一九上共同的 1-1～3-2 為準（老師 10-30 提供的參考目錄）；
 * 某節只有一部分在某單元時也列進去，ext: true 表示課本標「補充」、地圖也掛補充標籤的內容。
 * 目前只有九上；其他冊照同格式往下加。 */
window.TEXTBOOK_MAP = {
  "九上": [
    { sec: "1-1", n: "連比", units: ["number.ratio", "similar.sim"],
      tools: ["number/ratio/連比的意義與化簡", "number/ratio/連比例式（設比例常數 k）", "number/ratio/連比的應用（按比例分配）", "similar/sim/連比例"] },
    { sec: "1-2", n: "平行線截比例線段、中點連線、中點坐標（補充）", units: ["similar.sim", "function.coord"],
      tools: ["similar/sim/平行線截比例線段", "similar/sim/平行線截比例線段（一般情形）", "similar/sim/三角形兩邊中點連線定理", "function/coord/中點坐標"],
      ext: ["function/coord/中點坐標"] },
    { sec: "1-3", n: "縮小放大、相似多邊形、相似三角形判別、相似形的畫法", units: ["similar.sim"],
      tools: ["similar/sim/相似多邊形（定義）", "similar/sim/AA 相似（兩組角相等）", "similar/sim/SAS 相似（兩邊成比例且夾角相等）", "similar/sim/SSS 相似（三邊成比例）", "similar/sim/相似形的畫法（以一點為中心縮放）"] },
    { sec: "1-4", n: "相似形的應用：母子相似、邊長與面積、簡易測量、特殊直角三角形、三角比", units: ["similar.sim", "similar.pyth", "similar.trig"],
      tools: ["similar/sim/型態④ 母子型（直角三角形的高）", "similar/sim/對應高的比、周長比與面積比", "similar/sim/簡易測量①：影長", "similar/sim/簡易測量②：鏡子反射", "similar/sim/簡易測量③：標竿（三點一線）", "similar/pyth/特殊直角三角形", "similar/pyth/45-45-90 三角形"] },
    { sec: "2-1", n: "圓的基本名詞、弧長與扇形面積、點與圓、直線與圓", units: ["circle.parts", "circle.arc", "circle.tangent"] },
    { sec: "2-2", n: "弧的度數、圓心角、圓周角", units: ["circle.angle", "circle.parts"],
      tools: ["circle/parts/圓心角與弧", "circle/angle/圓周角定理", "circle/angle/同弧上的圓周角相等", "circle/angle/直徑所對的圓周角是直角", "circle/angle/圓內接四邊形對角互補"] },
    { sec: "3-1", n: "幾何證明、畢氏定理的應用、代數證明", units: ["angle.proof", "angle.cong", "similar.pyth"] },
    { sec: "3-2", n: "三角形的外心、內心、重心", units: ["angle.center"] }
  ]
};
