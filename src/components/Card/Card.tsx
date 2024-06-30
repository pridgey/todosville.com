import type { JSX } from "solid-js";
import styles from "./Card.module.css";

type CardProps = {
  border?:
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
  dropIn?: boolean;
  height?: string;
  position?: "relative" | "absolute";
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  variant?: "default" | "alternate";
  width?: string;
};

export const Card = (props: CardProps) => {
  return (
    <div
      classList={{
        [styles.card]: true,
        [styles.dropIn]: props.dropIn,
      }}
      style={{
        position: props.position || "relative",
        top: props.top,
        bottom: props.bottom,
        left: props.left,
        right: props.right,
        "--card-background":
          props.variant === "alternate"
            ? "var(--color-fullbackground)"
            : "var(--color-background)",
        "--card-border": props.border
          ? `1px solid var(--color-${props.border})`
          : "none",
        "--card-shadow":
          props.variant === "alternate"
            ? "var(--box-shadow-medium)"
            : "var(--box-shadow-small)",
        "--card-height": props.height || "unset",
        "--card-width": props.width || "unset",
      }}
    >
      {props.children}
    </div>
  );
};
