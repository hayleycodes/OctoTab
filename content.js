// Prepend the PR number (e.g. "#123 · ") to the tab title on GitHub PR pages.

function prNumberFromUrl() {
  const match = location.pathname.match(/\/pull\/(\d+)/);
  return match ? match[1] : null;
}

const PREFIX_RE = /^(#\d+ · )+/;

function stripPrefix() {
  document.title = document.title.replace(PREFIX_RE, "");
}

function applyPrNumber() {
  const pr = prNumberFromUrl();
  if (!pr) return;
  if (!document.title) return; // title not populated yet (early document_start)

  const prefix = `#${pr} · `;
  if (document.title.startsWith(prefix)) return;

  // Collapse any existing prefix(es) — e.g. a stale one from a different PR, or
  // an accidental double — before adding a single fresh one.
  const cleaned = document.title.replace(PREFIX_RE, "");
  document.title = prefix + cleaned;
}

applyPrNumber();

// GitHub is a single-page app (Turbo). It rewrites the title after our script
// runs — and on navigation it can replace the whole <title> element — so we
// can't just observe one node once. Observe the document persistently and
// re-apply whenever anything (including a swapped-in title) changes.
new MutationObserver(applyPrNumber).observe(document.documentElement, {
  childList: true,
  subtree: true,
  characterData: true,
});

// Re-apply whenever we (re)enter the page: navigation, load, and back/forward
// or bfcache restores (pageshow).
for (const ev of ["turbo:load", "turbo:render", "pjax:end", "DOMContentLoaded", "load", "pageshow"]) {
  window.addEventListener(ev, applyPrNumber, true);
}

// Strip our prefix whenever the page is about to be cached or left, so the
// title that gets stored (Turbo snapshot, browser back/forward cache, history)
// is always GitHub's clean original. Otherwise a restore starts with our
// "#123 · " and re-applying briefly stacks it into "#123 · #123 · ...".
for (const ev of ["turbo:before-cache", "pjax:beforeReplace", "pagehide", "beforeunload"]) {
  window.addEventListener(ev, stripPrefix, true);
}
