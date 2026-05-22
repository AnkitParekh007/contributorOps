import { useTheme } from "../context/ThemeContext";

interface BrandLogoProps {
  className?: string;
  alt?: string;
}

export function BrandLogo({
  className = "brand-logo",
  alt = "ContributorOps logo",
}: BrandLogoProps) {
  const { theme } = useTheme();
  const src = `${import.meta.env.BASE_URL}${theme === "dark" ? "contributor-ops-logo-dark.png" : "contributor-ops-logo-light.png"}`;

  return <img className={className} src={src} alt={alt} />;
}
