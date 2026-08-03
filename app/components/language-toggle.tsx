"use client";

import { useEffect, useSyncExternalStore } from "react";

type Language = "zh" | "en";

function getLanguage(): Language {
  return window.localStorage.getItem("mathpath-language") === "en" ? "en" : "zh";
}

function subscribeToLanguage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("mathpath-language-updated", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("mathpath-language-updated", onStoreChange);
  };
}

export function LanguageToggle() {
  const language = useSyncExternalStore(subscribeToLanguage, getLanguage, () => "zh");

  useEffect(() => {
    document.documentElement.dataset.language = language;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  function choose(next: Language) {
    window.localStorage.setItem("mathpath-language", next);
    window.dispatchEvent(new CustomEvent("mathpath-language-updated"));
  }

  return (
    <div className="language-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={language === "zh" ? "active" : ""}
        aria-pressed={language === "zh"}
        onClick={() => choose("zh")}
      >
        中文
      </button>
      <button
        type="button"
        className={language === "en" ? "active" : ""}
        aria-pressed={language === "en"}
        onClick={() => choose("en")}
      >
        EN
      </button>
    </div>
  );
}
