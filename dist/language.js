(function (root) {
  "use strict";
  const storageKey = "fortress.language";
  const isLanguage = (value) => value === "en" || value === "ko";
  const chooseLanguage = (saved, country) => isLanguage(saved) ? saved : country === "KR" ? "ko" : "en";

  async function detectLanguage({ saved, fetchCountry, getChoice, apply }) {
    apply(chooseLanguage(saved));
    if (isLanguage(saved)) return;
    try {
      const country = await fetchCountry();
      // A visitor's selection while the request is pending must win.
      if (!isLanguage(getChoice())) apply(chooseLanguage(null, country));
    } catch {
      // English remains usable when offline, on static hosting, or on timeout.
    }
  }

  root.FortressLanguage = Object.freeze({ storageKey, isLanguage, chooseLanguage, detectLanguage });
})(globalThis);
