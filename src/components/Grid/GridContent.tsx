import type { JSX } from "solid-js";

type GridContentProps = {
  AlignSelf?: "start" | "end" | "center" | "stretch";
  Area?: string;
  children: JSX.Element;
  ColumnSpan?: string;
  JustifySelf?: "start" | "end" | "center" | "stretch";
  RowSpan?: string;
};

export const GridContent = (props: GridContentProps) => {
  return (
    <div
      style={{
        "align-self": props.AlignSelf,
        "grid-area": props.Area,
        "grid-column": props.ColumnSpan,
        "grid-row": props.RowSpan,
        "justify-self": props.JustifySelf,
      }}
    >
      {props.children}
    </div>
  );
};
