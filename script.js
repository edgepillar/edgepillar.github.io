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
function enableCopy(button, getValue, successMessage = "Link copied.") {
  if (!button || !navigator.clipboard || !window.isSecureContext) return;
  button.hidden = false;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(getValue());
      button.textContent = "[ copied ]";
      copyStatus.textContent = successMessage;
    } catch {
      button.textContent = "[ retry ]";
      copyStatus.textContent = "Copy was unavailable. You can copy the visible address or link instead.";
    }
    window.setTimeout(() => { button.textContent = "[ copy ]"; }, 2200);
  });
}
document.querySelectorAll("[data-copy]").forEach((button) => {
  enableCopy(button, () => button.dataset.copy);
});

const emailRow = document.querySelector("#email-row");
const revealEmail = document.querySelector("#reveal-email");
const emailAddress = document.querySelector("#email-address");
const copyEmail = document.querySelector("#copy-email");
const openpgpRow = document.querySelector("#openpgp-row");
const openpgpLink = document.querySelector("#openpgp-link");

if (emailRow && revealEmail && emailAddress && openpgpRow && openpgpLink) {
  emailRow.hidden = false;

  revealEmail.addEventListener("click", () => {
    // This only deters simple source scrapers; it is not encryption.
    const address = [["edge", "pillar"].join(""), ["proton", "mail"].join("") + ".com"].join("@");
    emailAddress.textContent = address;
    emailAddress.href = `mailto:${address}`;
    openpgpLink.href = `https://keys.openpgp.org/search?q=${encodeURIComponent(address)}`;
    emailAddress.hidden = false;
    openpgpRow.hidden = false;
    enableCopy(copyEmail, () => address, "Email address copied.");
    revealEmail.setAttribute("aria-expanded", "true");
    revealEmail.hidden = true;
    copyStatus.textContent = "Email address and OpenPGP link revealed.";
    emailAddress.focus();
  });
}
