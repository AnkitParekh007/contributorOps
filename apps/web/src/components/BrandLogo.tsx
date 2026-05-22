interface BrandLogoProps {
  theme: "light" | "dark";
  compact?: boolean;
}

export function BrandLogo({ theme, compact = false }: BrandLogoProps) {
  const src = theme === "light" ? "/contributorops-logo-light.svg" : "/contributorops-logo-dark.svg";
  const iconSrc = theme === "light" ? "/contributorops-icon-light.svg" : "/contributorops-icon-dark.svg";

  return (
    <div className={`brand-logo ${compact ? "brand-logo-compact" : ""}`}>
      <img
        className="brand-logo-wordmark"
        src={src}
        alt="ContributorOps"
      />
      <img
        className="brand-logo-icon"
        src={iconSrc}
        alt=""
        aria-hidden="true"
      />
    </div>
  );
}
