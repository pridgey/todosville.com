import { Dynamic } from "solid-js/web";
import type { JSX } from "solid-js/jsx-runtime";

export type TextProps = {
  Align?: "left" | "center" | "right" | "justify";
  As?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  Color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "success"
    | "error"
    | "gray"
    | "fullwhite"
    | "fullblack"
    | "white"
    | "black"
    | "text";
  children: JSX.Element;
  FontSize?: "mini" | "small" | "text" | "header" | "large" | "extra-large";
  FontWeight?: "light" | "normal" | "semibold" | "bold";
  FontWrap?: "wrap" | "nowrap";
};

export const Text = (props: TextProps) => {
  return (
    <Dynamic
      component={props.As ?? "span"}
      style={{
        color: `var(--color-${props.Color ?? "text"})`,
        "font-family": "var(--font-family)",
        "font-size": `var(--font-size-${props.FontSize ?? "text"})`,
        "font-weight": `var(--font-weight-${props.FontWeight ?? "normal"})`,
        "text-align": props.Align ?? "left",
        "white-space": props.FontWrap === "nowrap" ? "nowrap" : undefined,
      }}
    >
      {props.children}
    </Dynamic>
  );
};
