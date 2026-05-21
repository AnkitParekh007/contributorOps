import type { ReactNode } from "react";

interface DocsLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function DocsLayout({ title, description, children }: DocsLayoutProps) {
  return (
    <div className="docs-layout">
      <div className="docs-hero">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="docs-stack">{children}</div>
    </div>
  );
}
