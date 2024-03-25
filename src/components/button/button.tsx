import { As, Button as KobatleButton } from "@kobalte/core";
import type { JSX } from "solid-js";
import styled from "./button.module.css";
import { Show } from "solid-js/web";
import { TbLoader2 } from "solid-icons/tb";

export type ButtonProps = {
  Color?: "primary" | "secondary" | "tertiary" | "success" | "error";
  children: JSX.Element;
  Disabled?: boolean;
  Href?: string;
  OnClick?: () => void;
  Pending?: boolean;
  Type?: "button" | "submit";
  Variant?: "full" | "outlined" | "text";
};

const ButtonChildren = (props: {
  children: JSX.Element;
  isPending: boolean;
}) => {
  if (typeof props.children === "string") {
    return (
      <div class={styled.button_content}>
        {props.children}
        <Show when={props.isPending}>
          <div class={styled.spin}>
            <TbLoader2 />
          </div>
        </Show>
      </div>
    );
  } else {
    // Is not a string
    return props.isPending ? (
      <div class={styled.spin}>
        <TbLoader2 />
      </div>
    ) : (
      props.children
    );
  }
};

export const Button = (props: ButtonProps) => {
  if (!!props.Href) {
    return (
      <KobatleButton.Root
        asChild={true}
        class={styled.button}
        classList={{
          [styled.button]: true,
          [styled.button_link]: true,
          [styled.button_outlined]: props.Variant === "outlined",
          [styled.button_text]: props.Variant === "text",
        }}
        disabled={props.Disabled}
        onClick={() => props.OnClick?.()}
        style={{
          "--button-color": `var(--color-${props.Color ?? "primary"})`,
        }}
        type={props.Type ?? "button"}
      >
        <As component="a" href={props.Href}>
          {props.children}
        </As>
      </KobatleButton.Root>
    );
  }

  return (
    <KobatleButton.Root
      class={styled.button}
      classList={{
        [styled.button]: true,
        [styled.button_outlined]: props.Variant === "outlined",
        [styled.button_text]: props.Variant === "text",
      }}
      disabled={props.Disabled}
      onClick={() => props.OnClick?.()}
      style={{
        "--button-color": `var(--color-${props.Color ?? "primary"})`,
      }}
      type={props.Type ?? "button"}
    >
      <ButtonChildren isPending={props.Pending ?? false}>
        {props.children}
      </ButtonChildren>
    </KobatleButton.Root>
  );
};
