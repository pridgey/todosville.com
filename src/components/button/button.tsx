import { Button as KobatleButton } from "@kobalte/core";
import type { JSX } from "solid-js";
import styled from "./button.module.css";

export type ButtonProps = {
  Color?: "primary" | "secondary" | "tertiary" | "success" | "error";
  children: JSX.Element;
  OnClick: () => void;
  Variant?: "full" | "outlined" | "text";
};

export const Button = (props: ButtonProps) => {
  return (
    <KobatleButton.Root
      class={styled.button}
      classList={{
        [styled.button]: true,
        [styled.button_outlined]: props.Variant === "outlined",
        [styled.button_text]: props.Variant === "text",
      }}
      onClick={() => props.OnClick()}
      style={{
        "--button-color": `var(--color-${props.Color ?? "primary"})`,
      }}
    >
      {props.children}
    </KobatleButton.Root>
  );
};
