import type { JSX } from "solid-js";

export type FlexProps = {
  AlignItems?: "flex-start" | "flex-end" | "center";
  children: JSX.Element;
  Direction: "row" | "column";
  Gap?: "small" | "medium" | "large";
  JustifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  Padding?: "small" | "medium" | "large";
  Width?: string;
};

export const Flex = (props: FlexProps) => {
  return (
    <div
      style={{
        display: "flex",
        "align-items": props.AlignItems,
        "flex-direction": props.Direction,
        gap: `var(--spacing-${props.Gap})`,
        "justify-content": props.JustifyContent,
        padding: `var(--spacing-${props.Padding})`,
        width: props.Width,
      }}
    >
      {props.children}
    </div>
  );
};
