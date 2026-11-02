"use strict";

const effectsButton = document.querySelector(".effects-button");
if (effectsButton) {
  effectsButton.hidden = false;
  effectsButton.addEventListener("click", () => {
    const effectsOff = document.body.classList.toggle("effects-off");
    effectsButton.setAttribute("aria-pressed", String(!effectsOff));
    effectsButton.textContent = effectsOff ? "glow: off" : "glow: on";
  });
}

const copyStatus = document.querySelector("#copy-status");
if (navigator.clipboard && window.isSecureContext) {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        button.textContent = "[ copied ]";
        copyStatus.textContent = "Link copied.";
      } catch {
        button.textContent = "[ retry ]";
        copyStatus.textContent = "Copy was unavailable. You can copy the visible link instead.";
      }
      window.setTimeout(() => { button.textContent = "[ copy ]"; }, 2200);
    });
  });
}
