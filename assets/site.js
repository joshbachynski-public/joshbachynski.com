(function () {
  "use strict";

  const appearances = Array.isArray(window.APPEARANCES) ? window.APPEARANCES : [];
  const monthFormatter = new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" });

  function displayDate(item) {
    return item.dateLabel || monthFormatter.format(new Date(item.date + "T00:00:00Z"));
  }

  function appearanceRow(item, index, compact) {
    const classes = compact ? "appearance-row featured-row reveal" : "appearance-row archive-row";
    const number = String(index + 1).padStart(2, "0");
    return `
      <a class="${classes}" href="${item.url}" target="_blank" rel="noopener" data-topics="${item.topics.join(" ")}">
        <span class="appearance-date">${displayDate(item)}</span>
        <span class="appearance-copy">
          <span class="appearance-show">${item.show}</span>
          <strong>${item.title}</strong>
        </span>
        <span class="appearance-topic">${item.label}</span>
        <span class="appearance-open" aria-label="Open episode ${number}">↗</span>
      </a>`;
  }

  const featuredContainer = document.querySelector("[data-featured-appearances]");
  if (featuredContainer) {
    const featured = appearances.filter((item) => item.featured).slice(0, 6);
    featuredContainer.innerHTML = featured.map((item, index) => appearanceRow(item, index, true)).join("");
  }

  const list = document.querySelector("[data-appearance-list]");
  const search = document.querySelector("[data-appearance-search]");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const separateThemeLinks = Array.from(document.querySelectorAll("[data-theme-link]"));
  const empty = document.querySelector("[data-archive-empty]");
  const countNodes = Array.from(document.querySelectorAll("[data-appearance-count]"));
  let activeFilter = "all";

  function renderArchive() {
    if (!list) return;
    const query = search ? search.value.trim().toLowerCase() : "";
    const filtered = appearances.filter((item) => {
      const matchesTopic = activeFilter === "all" || item.topics.includes(activeFilter);
      const haystack = `${item.show} ${item.title} ${item.label}`.toLowerCase();
      return matchesTopic && (!query || haystack.includes(query));
    });

    list.innerHTML = filtered.map((item, index) => appearanceRow(item, index, false)).join("");
    if (empty) empty.hidden = filtered.length !== 0;
  }

  countNodes.forEach((node) => {
    node.textContent = String(appearances.length);
  });

  document.querySelectorAll("[data-all-appearance-count]").forEach((node) => {
    const separateCount = Number(node.dataset.separateCount || 0);
    const suffix = node.dataset.suffix || "";
    node.textContent = `${appearances.length + separateCount}${suffix}`;
  });

  document.querySelectorAll("[data-appearance-total]").forEach((node) => {
    node.textContent = `${appearances.length} verified`;
  });

  const showCount = new Set(appearances.map((item) => item.show)).size;
  document.querySelectorAll("[data-show-count]").forEach((node) => {
    node.textContent = String(showCount);
  });

  const coveredTopics = ["seo", "ai", "philosophy", "business"];
  const topicCounts = Object.fromEntries(
    coveredTopics.map((topic) => [topic, appearances.filter((item) => item.topics.includes(topic)).length])
  );
  document.querySelectorAll("[data-topic-count]").forEach((node) => {
    const topic = node.dataset.topicCount;
    if (topicCounts[topic] !== undefined) node.textContent = String(topicCounts[topic]);
  });

  const requestedFilter = window.location.hash.slice(1);
  const requestedFilterButton = filterButtons.find((button) => button.dataset.filter === requestedFilter);
  if (requestedFilterButton) {
    activeFilter = requestedFilter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === requestedFilterButton));
  } else if (window.location.hash === "#conspiracy-theories") {
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    separateThemeLinks.forEach((item) => item.classList.add("is-active"));
  }

  if (list) renderArchive();
  if (search) search.addEventListener("input", renderArchive);

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      separateThemeLinks.forEach((item) => item.classList.remove("is-active"));
      renderArchive();
    });
  });

  separateThemeLinks.forEach((link) => {
    link.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.remove("is-active"));
      separateThemeLinks.forEach((item) => item.classList.toggle("is-active", item === link));
    });
  });

  const header = document.querySelector("[data-header]");
  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
  }

  const portrait = document.querySelector(".hero-portrait img");
  if (portrait && !reducedMotion) {
    window.addEventListener("scroll", () => {
      const movement = Math.min(window.scrollY * 0.035, 16);
      portrait.style.transform = `translate3d(0, ${movement}px, 0) scale(1.035)`;
    }, { passive: true });
  }
})();
