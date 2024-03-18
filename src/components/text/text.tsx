import { Dynamic } from "solid-js/web";
import type { JSX } from "solid-js/jsx-runtime";

export type TextProps = {
  As?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: JSX.Element;
  FontSize?: "mini" | "text" | "header" | "large" | "extra-large";
  FontWeight?: "light" | "normal" | "semibold" | "bold";
};

export const Text = ({
  As = "span",
  children,
  FontSize = "text",
  FontWeight = "normal",
}: TextProps) => {
  return (
    <Dynamic
      component={As}
      style={{
        color: "var(--color-text)",
        "font-family": "var(--font-family)",
        "font-size": `var(--font-size-${FontSize})`,
        "font-weight": `var(--font-weight-${FontWeight})`,
      }}
    >
      {children}
    </Dynamic>
  );
};
