import { Button } from "antd";
import type { ButtonProps } from "antd";

export interface BrandButtonProps extends ButtonProps {
  variantStyle?: "solid" | "outline";
}

/**
 * Site CTA button: uppercase, letter-spaced, squared corners.
 * Solid maroon by default, outlined ink variant for secondary actions.
 */
export default function BrandButton({
  variantStyle = "solid",
  className = "",
  ...props
}: BrandButtonProps) {
  return (
    <Button
      type={variantStyle === "solid" ? "primary" : "default"}
      className={`brand-label !px-7 text-[13px] ${
        variantStyle === "outline"
          ? "!border-ink !bg-transparent !text-ink hover:!border-maroon hover:!text-maroon"
          : ""
      } ${className}`}
      {...props}
    />
  );
}
