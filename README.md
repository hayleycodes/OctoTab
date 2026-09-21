# OctoTab

A tiny Chrome extension that puts the pull request number at the front of the browser tab title on GitHub PR pages — so you can tell your open PRs apart at a glance.

For example, a tab titled:

> Fix the login bug by author · Pull Request #123 · owner/repo

becomes:

> **#123 ·** Fix the login bug by author · Pull Request #123 · owner/repo

## Install

OctoTab isn't on the Chrome Web Store, so load it as an unpacked extension:

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the `OctoTab` folder.
5. Open any GitHub pull request — the tab title now starts with the PR number.

Works in any Chromium-based browser (Chrome, Edge, Brave, Arc, …).

## How it works

A single content script ([content.js](content.js)) reads the PR number from the
URL and prepends it to the tab title. GitHub is a single-page app that rewrites
the title on navigation, so the script re-applies the prefix on navigation and
back/forward events, and strips it again before the page is cached — so the
number never gets stored and doubled up.

## Permissions

None beyond running on `github.com/*/*/pull/*` pages. No network access, no data
collection.

## License

MIT
