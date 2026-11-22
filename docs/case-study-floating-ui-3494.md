# Case study: a ContributorOps-assisted pull request merged upstream

> **Verified external contribution, not a simulated demo.** This case study documents one public pull request. It does not establish a general merge rate, hiring outcome, or the number of ContributorOps users.

## Outcome

[**floating-ui/floating-ui#3494 — fix(react): restore overlay scroll instantly on iOS**](https://github.com/floating-ui/floating-ui/pull/3494) was opened on August 9, 2026, and **merged by the upstream project on October 26, 2026**.

The upstream PR explicitly disclosed: "This contribution was prepared with AI assistance and submitted by ContributorOps after deterministic scope, duplicate, policy, and exact-patch safety checks." That disclosure is the public evidence linking ContributorOps to the contribution.

## Problem

When an iOS overlay finished its scroll lock, a positional `window.scrollTo(scrollX, scrollY)` call could inherit `scroll-behavior: smooth` from the document. That made restoration visibly animate rather than immediately restore the saved scroll position.

## Focused change

The accepted patch updated `packages/react/src/components/FloatingOverlay.tsx`:

```diff
-      window.scrollTo(scrollX, scrollY);
+      window.scrollTo({left: scrollX, top: scrollY, behavior: 'instant'});
```

It also added a patch changeset for `@floating-ui/react` at `.changeset/calm-dragons-scroll.md`.

## What the workflow demonstrates

1. **Narrow scope:** one targeted restoration call, rather than an unrelated rewrite.
2. **Maintainer-compatible delivery:** a focused upstream PR with the package's required changeset.
3. **Disclosure:** the PR identifies AI assistance and ContributorOps, instead of presenting the change as unaided work.
4. **Public outcome:** upstream marked the pull request merged.

## Important limitations

The PR describes validation against the current source path, but says an iOS Safari visual regression could not be faithfully executed in the ContributorOps runner. Upstream validation and the maintainer's merge decision are observable; do **not** claim ContributorOps ran live iOS Safari tests, increased employment outcomes, or automatically merged the change.

This is an example of **one verified contribution**. The public browser demo remains deterministic and fictional; it is not an interactive reproduction of this upstream PR.

## Inspect the evidence

- [Upstream merged PR and discussion](https://github.com/floating-ui/floating-ui/pull/3494)
- [ContributorOps architecture](./architecture.md)
- [Interactive and standing authorization boundaries](./security-model.md)
- [Safety policy](./safety-policy.md)
- [Try the fictional, no-token browser walkthrough](https://ankitparekh007.github.io/contributorOps/#/demo)
