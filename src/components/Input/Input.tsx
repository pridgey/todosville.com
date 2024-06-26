import { TextField } from "@kobalte/core";
import styles from "./Input.module.css";
import { Match, Switch, createEffect, createSignal } from "solid-js";

export type InputProps = {
  DefaultValue?: string;
  Error?: string;
  HelperText?: string;
  Label: string;
  Multiline?: boolean;
  Name?: string;
  OnChange?: (newValue: string) => void;
  Placeholder?: string;
  Type?: "text" | "password" | "number" | "time" | "date";
  Width?: string;
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
      style={{ "--input-width": props.Width ?? "100%" }}
      validationState={!!props.Error ? "invalid" : "valid"}
    >
      <TextField.Label class={styles.input_label}>
        {props.Label}
      </TextField.Label>
      <Switch>
        <Match when={props.Multiline}>
          <TextField.TextArea
            classList={{
              [styles.input_control]: true,
              [styles.input_multiline]: true,
            }}
            placeholder={props.Placeholder}
          />
        </Match>
        <Match when={!props.Multiline}>
          <TextField.Input
            class={styles.input_control}
            placeholder={props.Placeholder}
            type={props.Type}
          />
        </Match>
      </Switch>
      <TextField.Description class={styles.input_helper}>
        {props.HelperText}
      </TextField.Description>
      <TextField.ErrorMessage class={styles.input_error}>
        {props.Error}
      </TextField.ErrorMessage>
    </TextField.Root>
  );
};
