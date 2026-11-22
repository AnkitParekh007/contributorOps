# First-contributor and public-site accessibility acceptance — 2026-11-22

This record documents **actual checks** for issues [#5](https://github.com/AnkitParekh007/contributorOps/issues/5), [#8](https://github.com/AnkitParekh007/contributorOps/issues/8), and [#11](https://github.com/AnkitParekh007/contributorOps/issues/11).

## Evidence

The [one-time real-browser verification run](https://github.com/AnkitParekh007/contributorOps/actions/runs/45040373835) completed successfully with the actual Vite site built and previewed in Chromium on Node.js 22. Its one-shot workflow deleted itself after executing.

- **1440px dark and 390px light:** focus a Share Hub Copy button using the keyboard and activate it with Enter; verify focus remains on the button, the status announcement says the correct message was copied, and the clipboard receives the real audience-specific content.
- **Clipboard denied:** verify an accessible status announcement and a visible corrective error message; focus remains on the copy button.
- **GitHub API returns 503:** the Growth dashboard shows a retryable error instead of inventing zero stars, forks, or contributors. The metric grid is absent until repository data has actually been fetched.
- **Mobile overflow:** both the Share Hub and Growth dashboard were checked for no page-wide horizontal overflow.

This browser run deliberately **mocks the clipboard and GitHub failure response** to test deterministic success/failure paths. It is not a claim about GitHub service availability or production conversion metrics. Native share-sheet UI varies by platform and was not exercised in the Linux browser.

## Implementation and accessibility

- The Share Hub uses `role="status"` and `aria-live="polite"` for transient feedback and distinguishes clipboard permission errors from user-cancelled native shares.
- Action labels include the audience. No code moves keyboard focus to feedback messages.
- The shared `AsyncState` component has typed `loading`, `empty`, and `error` variants, an explicit retry action slot, theme-compatible colors, and reduced-motion support.
- The first-contribution guide uses current Node.js 22+ commands, separates local demo behavior from live GitHub permissions, and includes a safe fork-to-PR example.

## Release gate

PR CI must pass TypeScript, API tests, builds, site-quality checks, Lighthouse budgets, CodeQL, and high/critical dependency audits before merging. These results remain separate from the browser acceptance evidence above.
