import { AudioLines } from "lucide-react";

interface BrandLogoProps {
  compact?: boolean;
}

export default function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className={`brand-logo ${compact ? "brand-logo--compact" : ""}`}>
      <span className="brand-logo__icon">
        <AudioLines size={compact ? 18 : 22} />
      </span>

      <span className="brand-logo__name">
        Nuzio <strong>AI</strong>
      </span>
    </div>
  );
}
