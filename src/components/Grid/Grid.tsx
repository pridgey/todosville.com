import type { JSX } from "solid-js";
import { paddingToCSS } from "../../styles/themeUtils";

type GridProps = {
  AlignItems?: "start" | "end" | "center" | "stretch";
  Areas?: string[];
  children: JSX.Element;
  Columns?: string;
  Gap?: "small" | "medium" | "large";
  JustifyItems?: "start" | "end" | "center" | "stretch";
  Rows?: string;
  Padding?: "small" | "medium" | "large";
  PaddingX?: "small" | "medium" | "large";
  PaddingY?: "small" | "medium" | "large";
  Width?: string;
};

export const Grid = (props: GridProps) => {
  const gridStyles: JSX.CSSProperties = {
    display: "grid",
    "align-items": props.AlignItems ?? "center",
    "justify-items": props.JustifyItems ?? "stretch",
    "grid-template-columns": props.Columns ?? "min-content",
    "grid-template-rows": props.Rows ?? "min-content",
    "grid-template-areas": `"${props.Areas?.join('" "') ?? ""}"`,
    gap: props.Gap ? `var(--spacing-${props.Gap})` : undefined,
    padding: paddingToCSS(
      props.PaddingX ?? props.Padding,
      props.PaddingY ?? props.Padding
    ),
    width: props.Width ?? "100%",
  };

  return <div style={gridStyles}>{props.children}</div>;
};
