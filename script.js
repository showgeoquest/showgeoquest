// Top: 常時ほんのり発光 + たまにキラッ
(() => {
  function sparkle(el){
    if(!el) return;
    el.classList.remove("sparkle");
    // 連続発火でも確実にアニメが走るように
    void el.offsetWidth;
    el.classList.add("sparkle");
  }

  window.addEventListener("DOMContentLoaded", () => {
    const primary = document.querySelector(".btn.primary");
    const logo = document.querySelector(".logo");

    // たまにキラッ（8〜14秒に1回くらい）
    const tick = () => {
      sparkle(primary);
      sparkle(logo);
      const next = 8000 + Math.random() * 6000;
      setTimeout(tick, next);
    };
    setTimeout(tick, 2500);
  });
})();