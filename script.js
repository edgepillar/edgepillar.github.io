"use strict";

import { repositorySnapshot } from "./repositories-data.mjs";
import { describeRepository, formatRepositoryDate, repositoryMetadata, selectRepositories } from "./repository-order.mjs";
import { donationAddresses } from "./donation-addresses.mjs";
import { createAlienBackdrop } from "./alien-backdrop.mjs";

const alienBackdrop = createAlienBackdrop(document.querySelector("#alien-backdrop"));

const effectsButton = document.querySelector(".effects-button");
if (effectsButton) {
  effectsButton.hidden = false;
  effectsButton.addEventListener("click", () => {
    const effectsOff = document.body.classList.toggle("effects-off");
    effectsButton.setAttribute("aria-pressed", String(!effectsOff));
    effectsButton.textContent = effectsOff ? "glow: off" : "glow: on";
    alienBackdrop.refresh();
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

const repositoryList = document.querySelector("#repository-list");
const repositorySort = document.querySelector(".repository-sort");
if (repositoryList && repositorySort) {
  function showRepositories(mode) {
    const projects = selectRepositories(repositorySnapshot.repositories, mode);
    const element = (tag, className, text) => {
      const node = document.createElement(tag);
      node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const cards = projects.map((repository, index) => {
      const details = describeRepository(repository);
      const link = element("a", "project");
      link.href = repository.url;
      link.rel = "noreferrer";
      const number = element("span", "project-number", String(index + 1).padStart(2, "0"));
      number.setAttribute("aria-hidden", "true");
      const content = element("div", "project-content");
      const title = element("div", "project-title");
      title.append(element("h3", "", repository.name), element("span", "tag", details.tag));
      content.append(title, element("p", "", details.description), element("span", "project-meta", repositoryMetadata(repository)));
      const arrow = element("span", "project-arrow", "↗");
      arrow.setAttribute("aria-hidden", "true");
      link.append(number, content, arrow);
      return link;
    });
    repositoryList.replaceChildren(...cards);
    repositorySort.querySelectorAll("button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.repositorySort === mode));
    });
    document.querySelector("#repository-updated").textContent = `Data updated ${formatRepositoryDate(repositorySnapshot.updatedAt)}`;
    document.querySelector("#repository-status").textContent = mode === "popular"
      ? "Showing the three repositories with the most stars."
      : "Showing the three most recently pushed repositories.";
  }
  showRepositories("recent");
  repositorySort.hidden = false;
  repositorySort.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-repository-sort]");
    if (button) showRepositories(button.dataset.repositorySort);
  });
}

const donationBox = document.querySelector(".donation-box");
if (donationBox) {
  const address = document.querySelector("#donation-address");
  const reveal = document.querySelector("#donation-reveal");
  const copy = document.querySelector("#donation-copy");
  const status = document.querySelector("#donation-status");
  let asset = "BTC";
  let revealed = false;

  enableCopy(copy, () => donationAddresses[asset], "Donation address copied.");
  function updateDonation() {
    const configured = typeof donationAddresses[asset] === "string" && donationAddresses[asset].length > 0;
    donationBox.dataset.donationAsset = asset;
    donationBox.querySelectorAll("[data-donation-choice]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.donationChoice === asset));
    });
    document.querySelector("#donation-network").textContent = asset === "BTC" ? "BITCOIN NETWORK" : "ZENON NETWORK";
    address.textContent = configured ? donationAddresses[asset] : `${asset} address pending`;
    address.hidden = !revealed;
    address.classList.toggle("address-pending", !configured);
    reveal.hidden = revealed;
    reveal.setAttribute("aria-expanded", String(revealed));
    copy.hidden = !revealed;
    copy.disabled = !(configured && navigator.clipboard && window.isSecureContext);
    copy.setAttribute("aria-label", `Copy ${asset} donation address`);
    copy.textContent = "[ copy ]";
  }
  donationBox.querySelectorAll("[data-donation-choice]").forEach((button) => {
    button.disabled = false;
    button.addEventListener("click", () => {
      asset = button.dataset.donationChoice;
      updateDonation();
      status.textContent = donationAddresses[asset]
        ? `${asset} selected. ${revealed ? "Donation address shown." : "Reveal the donation address to continue."}`
        : `${asset} donation address pending.`;
    });
  });
  reveal.addEventListener("click", () => {
    revealed = true;
    updateDonation();
    address.tabIndex = -1;
    address.focus();
    status.textContent = donationAddresses[asset] ? `${asset} donation address revealed.` : `${asset} address pending.`;
  });
  updateDonation();
}
