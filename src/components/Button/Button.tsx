import styles from "./Button.module.css";
import type { JSX } from "solid-js";
import { ColorDict, FontSizeDict } from "~/styles/theme";
import { createMemo } from "solid-js";
import { TbLoader2 } from "solid-icons/tb";

type ButtonCommonProps = {
  BackgroundColor?: keyof typeof ColorDict;
  Disabled?: boolean;
  children: JSX.Element;
  Class?: string;
  GridArea?: string;
  ID?: string;
  Icon?: JSX.Element;
  Padding?: JSX.CSSProperties["padding"];
  Pending?: boolean;
  Style?: JSX.CSSProperties;
  Size?: keyof typeof FontSizeDict;
  TextColor?: keyof typeof ColorDict;
  Variant?: "filled" | "outlined" | "text" | "text-outline" | "text-underline";
};

export type ButtonEleProps = ButtonCommonProps & {
  Type: "button" | "submit";
  OnClick?: (e?: MouseEvent) => void;
  Ref?: HTMLButtonElement;
};

export type ButtonAnchorProps = ButtonCommonProps & {
  Href: string;
  Ref?: HTMLAnchorElement;
  Target?: HTMLAnchorElement["target"];
};

export type ButtonProps = ButtonEleProps | ButtonAnchorProps;

export const Button = (props: ButtonProps) => {
  const buttonColor = props.BackgroundColor
    ? ColorDict[props.BackgroundColor]
    : undefined;
  const textColor = props.TextColor ? ColorDict[props.TextColor] : undefined;
  const fontSize = FontSizeDict[props.Size ?? "text"];

  const childIsString = typeof props.children === "string";

  if ((props as ButtonAnchorProps).Href) {
    return (
      <a
        classList={{
          [styles.button]: true,
          [styles.filled]: props.Variant === "filled" || !props.Variant,
          [styles.outlined]: props.Variant === "outlined",
          [styles.text]: props.Variant === "text",
          [styles.textoutline]: props.Variant === "text-outline",
          [styles.textunderline]: props.Variant === "text-underline",
          [props.Class || ""]: !!props.Class,
        }}
        href={(props as ButtonAnchorProps).Href}
        id={props.ID}
        ref={props.Ref as HTMLAnchorElement}
        style={{
          "background-color": buttonColor,
          "--button-color": textColor,
          "font-size": fontSize,
          "grid-area": props.GridArea,
          padding: props.Padding ?? "2rem",
          ...props.Style,
        }}
        target={(props as ButtonAnchorProps).Target}
      >
        {!childIsString && props.Pending ? (
          <TbLoader2 class={styles.spin} />
        ) : (
          props.children
        )}
        {childIsString && props.Pending ? (
          <TbLoader2 class={styles.spin} />
        ) : (
          props.Icon
        )}
      </a>
    );
  }

  return (
    <button
      disabled={props.Disabled || props.Pending}
      classList={{
        [styles.button]: true,
        [styles.filled]: props.Variant === "filled" || !props.Variant,
        [styles.outlined]: props.Variant === "outlined",
        [styles.text]: props.Variant === "text",
        [styles.textoutline]: props.Variant === "text-outline",
        [styles.textunderline]: props.Variant === "text-underline",
        [props.Class || ""]: !!props.Class,
      }}
      id={props.ID}
      ref={props.Ref as HTMLButtonElement}
      style={{
        "background-color": buttonColor,
        "--button-color": textColor,
        "font-size": fontSize,
        "grid-area": props.GridArea,
        padding: props.Padding ?? "2rem",
        ...props.Style,
      }}
      type={(props as ButtonEleProps).Type}
      onClick={(e) => (props as ButtonEleProps).OnClick?.(e)}
    >
      {!childIsString && props.Pending ? (
        <TbLoader2 class={styles.spin} />
      ) : (
        props.children
      )}
      {childIsString && props.Pending ? (
        <TbLoader2 class={styles.spin} />
      ) : (
        props.Icon
      )}
    </button>
  );
};
