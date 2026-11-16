const details = {
  "zenon-spv": { description: "Resource-bounded verification for the Zenon Network of Momentum." },
  "zenon-x402-poc": { tag: "EXPERIMENT", description: "Exploring Zenon as a settlement rail for HTTP-native payments." },
  "bitcoin-payments-zenon": { tag: "RESEARCH DRAFT", description: "Independent research on Bitcoin payments and Zenon resource services." },
  "ptlc-research": { tag: "RESEARCH DRAFT", description: "Offline Bitcoin-to-Zenon PTLC research and synthetic recovery tests." },
  zats: { tag: "PROOF OF CONCEPT", description: "A Zenon proof of concept for hiding zats in a PNG." },
};

export function describeRepository(repository) {
  return {
    tag: repository.fork ? "FORK" : "PUBLIC REPOSITORY",
    description: repository.fork ? "Public fork on GitHub." : "Public repository on GitHub.",
    ...details[repository.name],
  };
}

export function selectRepositories(repositories, mode = "recent", limit = 3) {
  return [...repositories].sort((a, b) => {
    const recent = Date.parse(b.pushedAt) - Date.parse(a.pushedAt);
    const stars = b.stars - a.stars;
    return (mode === "popular" ? stars || recent : recent || stars)
      || a.name.localeCompare(b.name, "en");
  }).slice(0, limit);
}

export function formatRepositoryDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  }).format(new Date(value));
}

export function repositoryMetadata(repository) {
  const stars = `${repository.stars} ${repository.stars === 1 ? "star" : "stars"}`;
  return `${repository.language || "Code"} / ${stars} / Pushed ${formatRepositoryDate(repository.pushedAt)}`;
}
