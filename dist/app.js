(function () {
  "use strict";
  const { storageKey, detectLanguage } = window.FortressLanguage;
  const settings = window.FORTRESS_SETTINGS;
  const tabs = [...document.querySelectorAll("[data-tab]")];
  const panels = [...document.querySelectorAll("[role=tabpanel]")];
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionButton = document.getElementById("motion-toggle");
  let motionPaused = false;
  try { motionPaused = localStorage.getItem("fortress.motion") === "off"; } catch { /* Storage is optional. */ }
  let manualChoice;
  try { manualChoice = localStorage.getItem(storageKey); } catch { /* Storage can be disabled. */ }

  function applyLanguage(language) {
    document.documentElement.lang = language;
    const korean = language === "ko";
    const title = korean ? "역천: The Sky Breaker" : "The Sky Breaker";
    document.title = `${title} | FORTRESS`;
    document.querySelectorAll("[data-placeholder]").forEach((node) => {
      const id = document.createElement("span");
      id.className = "placeholder-id";
      id.textContent = `${node.dataset.placeholder}:`;
      node.replaceChildren(id, document.createTextNode(` ${korean ? "임시 내용입니다" : "Temporary content."}`));
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
    document.querySelectorAll(".member-github").forEach((link) => {
      const account = link.querySelector("span").textContent;
      link.setAttribute("aria-label", korean ? `${account} GitHub 프로필 (새 탭)` : `${account} on GitHub (opens a new tab)`);
    });
    syncMotion();
  }

  function syncMotion() {
    const paused = motionPaused || motionQuery.matches;
    const korean = document.documentElement.lang === "ko";
    document.body.dataset.motion = paused ? "off" : "on";
    document.getElementById("motion-label").textContent = korean ? `효과 ${paused ? "꺼짐" : "켜짐"}` : `MOTION ${paused ? "OFF" : "ON"}`;
    motionButton.setAttribute("aria-pressed", String(paused));
    motionButton.disabled = motionQuery.matches;
    motionButton.setAttribute("aria-label", motionQuery.matches
      ? (korean ? "기기의 동작 줄이기 설정 적용 중" : "Reduced motion is enabled on your device")
      : (korean ? `시각 효과 ${paused ? "켜기" : "끄기"}` : `Turn ${paused ? "on" : "off"} visual effects`));
  }
  motionButton.addEventListener("click", () => {
    motionPaused = !motionPaused;
    try { localStorage.setItem("fortress.motion", motionPaused ? "off" : "on"); } catch { /* Current visit still works. */ }
    syncMotion();
  });
  motionQuery.addEventListener("change", syncMotion);
  document.addEventListener("visibilitychange", () => document.body.classList.toggle("is-background", document.hidden));

  const embers = document.getElementById("embers");
  for (let index = 0; index < 18; index++) {
    const ember = document.createElement("span");
    ember.className = "ember";
    ember.style.left = `${(index * 61 + 9) % 100}%`;
    ember.style.top = `${35 + (index * 17) % 65}%`;
    ember.style.setProperty("--duration", `${17 + index % 9}s`);
    ember.style.setProperty("--delay", `${-index * 2.7}s`);
    embers.append(ember);
  }

  document.querySelectorAll(".member").forEach((card) => {
    let frame;
    card.addEventListener("pointermove", (event) => {
      if (document.body.dataset.motion === "off" || event.pointerType !== "mouse") return;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty("--light-x", `${event.clientX - bounds.left}px`);
        card.style.setProperty("--light-y", `${event.clientY - bounds.top}px`);
        frame = null;
      });
    });
  });

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
    panels.forEach((panel) => {
      const active = panel.id === selected.getAttribute("aria-controls");
      const wasHidden = panel.hidden;
      panel.hidden = !active;
      if (!active) panel.classList.remove("is-entering");
      else if (wasHidden && document.body.dataset.motion !== "off") panel.classList.add("is-entering");
    });
    if (focus) selected.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateTab(tab.dataset.tab);
      window.location.hash = tab.dataset.tab;
    });
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
  panels.forEach((panel) => panel.addEventListener("animationend", (event) => {
    if (event.target === panel) panel.classList.remove("is-entering");
  }));

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
