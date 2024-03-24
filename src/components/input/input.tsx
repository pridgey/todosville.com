import { TextField } from "@kobalte/core";
import styles from "./input.module.css";
import { createEffect, createSignal } from "solid-js";

export type InputProps = {
  DefaultValue?: string;
  Error?: string;
  HelperText?: string;
  Label: string;
  Name?: string;
  OnChange?: (newValue: string) => void;
  Placeholder?: string;
  Type?: "text" | "password";
};

export const Input = (props: InputProps) => {
  const [error, setError] = createSignal(props.Error);

  createEffect(() => {
    setError(props.Error);
  });

  return (
    <TextField.Root
      class={styles.input_root}
      defaultValue={props.DefaultValue}
      name={props.Name}
      onChange={props.OnChange}
      validationState={!!props.Error ? "invalid" : "valid"}
    >
      <TextField.Label class={styles.input_label}>
        {props.Label}
      </TextField.Label>
      <TextField.Input
        class={styles.input_control}
        placeholder={props.Placeholder}
        type={props.Type}
      />
      <TextField.Description class={styles.input_helper}>
        {props.HelperText}
      </TextField.Description>
      <TextField.ErrorMessage class={styles.input_error}>
        {props.Error}
      </TextField.ErrorMessage>
    </TextField.Root>
  );
};
