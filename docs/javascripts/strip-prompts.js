// docs/javascripts/strip-prompts.js
(() => {
  console.log("[strip-prompts] loaded");

  // 프롬프트 패턴: "$ " 또는 "(venv) $ "
  const PROMPT_RE = /^\s*(\([^)]+\)\s*)?\$\s+/;

  function stripPromptsIfNeeded(text) {
    const lines = text.split("\n");

    // ✅ 첫 줄이 프롬프트로 시작하지 않으면 손대지 않음
    if (!PROMPT_RE.test(lines[0])) {
      return null;   // ← null = 기본 복사 로직 사용
    }

    // 프롬프트가 있을 때만 strip
    return lines
      .map(line => line.replace(PROMPT_RE, ""))
      .join("\n")
      .replace(/\n+$/, ""); // 끝 개행 제거
  }

  function patch(btn) {
    const target = btn.getAttribute("data-clipboard-target");
    if (!target) return;

    const codeEl = document.querySelector(target);
    if (!codeEl) return;

    const raw = codeEl.textContent ?? "";
    const cleaned = stripPromptsIfNeeded(raw);

    // ❌ 프롬프트가 없으면 아무것도 안 건드림
    if (cleaned === null) return;

    // ✅ 프롬프트가 있을 때만 개입
    btn.setAttribute("data-clipboard-text", cleaned);
    btn.removeAttribute("data-clipboard-target");
  }

  function bind() {
    const buttons = document.querySelectorAll(
      'button.md-code__button[data-md-type="copy"]'
    );

    buttons.forEach(btn => {
      if (btn.dataset.stripPromptsBound === "1") return;
      btn.dataset.stripPromptsBound = "1";

      // copy 전에 실행
      btn.addEventListener("pointerdown", () => patch(btn), true);
      btn.addEventListener("mousedown",   () => patch(btn), true);
      btn.addEventListener("click",       () => patch(btn), true);
    });
  }

  // navigation.instant 대응
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(() => bind());
  } else {
    window.addEventListener("load", bind);
  }
})();
