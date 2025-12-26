// ===== 学びの館（北海道・東北）クリックで情報表示：完全版 =====

// 北海道・東北の県庁所在地（最小セット）
const CAPITALS = {
  "北海道": "札幌市",
  "青森": "青森市",
  "岩手": "盛岡市",
  "宮城": "仙台市",
  "秋田": "秋田市",
  "山形": "山形市",
  "福島": "福島市",
};

// 県名と県庁所在地名が「一致しない」もの（北海道・東北だと宮城だけ）
const MISMATCH = {
  "宮城": "仙台市（県名と違う）",
};

// 県名のゆれ（SVGの<title>が「青森 / Aomori」みたいな形式なので先頭だけ取る）
function normalizePrefName(titleText) {
  // "宮城 / Miyagi" -> "宮城"
  const jp = titleText.split("/")[0].trim();
  // たまに "鹿児島 / Kagoshima" みたいに「県」付きのケースがあるなら落とす
  return jp.replace(/(都|道|府|県)$/g, "");
}

// 北海道・東北の対象class
const TARGET_SELECTOR = [
  ".hokkaido",
  ".aomori",
  ".iwate",
  ".miyagi",
  ".akita",
  ".yamagata",
  ".fukushima",
].join(", ");

function setInfo(name) {
  const status = document.getElementById("infoStatus");
  const capital = document.getElementById("infoCapital");
  const mismatch = document.getElementById("infoMismatch");

  status.textContent = name;

  capital.textContent = CAPITALS[name] ?? "—";

  if (MISMATCH[name]) {
    mismatch.textContent = MISMATCH[name];
  } else {
    mismatch.textContent = "—（該当なし）";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const embed = document.getElementById("mapEmbed");
  const status = document.getElementById("infoStatus");

  if (!embed) return;

  // embedのSVGが読み込まれたら中身を触れる
  embed.addEventListener("load", () => {
    const svgDoc = embed.getSVGDocument?.();
    if (!svgDoc) {
      status.textContent = "SVGが読み込めませんでした";
      return;
    }

    // GeoloniaのSVGは <g class="prefectures"> の中に県ごとの <g class="xxx prefecture"> がある想定
    const targets = svgDoc.querySelectorAll(TARGET_SELECTOR);

    if (!targets || targets.length === 0) {
      status.textContent = "北海道・東北が見つかりませんでした";
      return;
    }

    // 触りやすくする（hoverなどはCSSを触らずJSで最低限）
    targets.forEach((g) => {
      g.style.cursor = "pointer";

      g.addEventListener("click", () => {
        const t = g.querySelector("title")?.textContent ?? "";
        const name = normalizePrefName(t);
        if (!name) return;

        setInfo(name);
      });
    });

    // 初期表示
    status.textContent = "県をクリックしてね";
  });
});