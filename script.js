// SHOW GEO QUEST 共通スクリプト（トップ用の演出中心）
// ・押したら沈む（CSSで対応）
// ・制覇/地方ボタンは“キラッ✨”を出す（crackle クラス）

(function () {
  function spawnSpark(x, y) {
    const s = document.createElement("div");
    s.className = "spark";
    s.style.left = x + "px";
    s.style.top = y + "px";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 650);
  }

  function onCrackleClick(e) {
    // クリック位置が取れない場合に備えて中央も用意
    const x = (typeof e.clientX === "number") ? e.clientX : (window.innerWidth / 2);
    const y = (typeof e.clientY === "number") ? e.clientY : (window.innerHeight / 2);

    // 3発くらい、少しずらして出す
    spawnSpark(x, y);
    spawnSpark(x + 14, y - 8);
    spawnSpark(x - 10, y + 12);
  }

  window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".crackle").forEach((el) => {
      el.addEventListener("click", onCrackleClick, { passive: true });
    });
  });
})();