(function () {
  "use strict";
  const { storageKey, detectLanguage } = window.FortressLanguage;
  const settings = window.FORTRESS_SETTINGS;
  const tabs = [...document.querySelectorAll("[data-tab]")];
  const panels = [...document.querySelectorAll("[role=tabpanel]")];
  let manualChoice;
  try { manualChoice = localStorage.getItem(storageKey); } catch { /* Storage can be disabled. */ }

  function applyLanguage(language) {
    document.documentElement.lang = language;
    const korean = language === "ko";
    const title = korean ? "역천: The Sky Breaker" : "The Sky Breaker";
    document.title = `${title} | FORTRESS`;
    document.querySelectorAll("[data-placeholder]").forEach((node) => {
      node.textContent = `${node.dataset.placeholder}: ${korean ? "임시 내용입니다" : "Temporary content."}`;
    });
    document.querySelectorAll("[data-en][data-ko]").forEach((node) => { node.textContent = node.dataset[language]; });
    document.querySelectorAll("[data-game-title]").forEach((node) => { node.textContent = title; });
    document.querySelectorAll("[data-language]").forEach((node) => {
      node.setAttribute("aria-pressed", String(node.dataset.language === language));
    });
    const logo = document.getElementById("game-logo");
    logo.src = korean ? "assets/logo-ko.png" : "assets/logo-en.png";
    logo.alt = title;
    logo.classList.toggle("is-korean", korean);
    document.getElementById("brand-subtitle").hidden = !korean;
    document.getElementById("steam-link").setAttribute("aria-label", korean ? "Steam에서 역천 보기 (새 탭)" : "The Sky Breaker on Steam (opens a new tab)");
    document.getElementById("open-trailer").setAttribute("aria-label", korean ? "트레일러 열기" : "Open trailer");
    document.querySelector(".main-nav").setAttribute("aria-label", korean ? "주 메뉴" : "Main menu");
  }

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      manualChoice = button.dataset.language;
      applyLanguage(manualChoice);
      try { localStorage.setItem(storageKey, manualChoice); } catch { /* Choice still works for this visit. */ }
    });
  });

  function activateTab(name, focus = false) {
    const selected = tabs.find((tab) => tab.dataset.tab === name) || tabs[0];
    tabs.forEach((tab) => {
      const active = tab === selected;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel.id !== selected.getAttribute("aria-controls"); });
    if (focus) selected.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => { window.location.hash = tab.dataset.tab; });
    tab.addEventListener("keydown", (event) => {
      let target;
      if (event.key === "ArrowRight") target = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") target = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") target = 0;
      if (event.key === "End") target = tabs.length - 1;
      if (target === undefined) return;
      event.preventDefault();
      window.location.hash = tabs[target].dataset.tab;
      activateTab(tabs[target].dataset.tab, true);
    });
  });
  window.addEventListener("hashchange", () => activateTab(location.hash.slice(1)));
  activateTab(location.hash.slice(1));

  const dialog = document.getElementById("trailer-dialog");
  const video = document.getElementById("trailer-video");
  const placeholder = document.getElementById("trailer-placeholder");
  if (settings.trailerSrc) {
    video.src = settings.trailerSrc;
    video.hidden = false;
    placeholder.hidden = true;
    video.addEventListener("error", () => { video.hidden = true; placeholder.hidden = false; });
  }
  document.getElementById("open-trailer").addEventListener("click", () => { dialog.showModal(); });
  document.getElementById("close-trailer").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => { video.pause(); });
  document.getElementById("steam-link").href = settings.steamUrl;

  detectLanguage({
    saved: manualChoice,
    getChoice: () => manualChoice,
    apply: applyLanguage,
    fetchCountry: async () => {
      if (location.protocol === "file:") return null;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      try {
        const response = await fetch("/api/country", { cache: "no-store", credentials: "same-origin", signal: controller.signal });
        if (!response.ok) return null;
        const data = await response.json();
        return data.country;
      } finally { clearTimeout(timeout); }
    }
  });
})();
