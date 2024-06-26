import { Checkbox as KobalteCheckbox } from "@kobalte/core";
import { FiCheck } from "solid-icons/fi";
import { BsDash } from "solid-icons/bs";
import { VsClose } from "solid-icons/vs";
import styles from "./Checkbox.module.css";
import { Match, Switch } from "solid-js";

type CheckboxProps = {
  Checked?: boolean;
  DefaultChecked?: boolean;
  Disabled?: boolean;
  Error?: string;
  HelperText?: string;
  Indeterminate?: boolean;
  Label: string;
  OnChange?: (checked: boolean) => void;
};

export const Checkbox = (props: CheckboxProps) => {
  return (
    <KobalteCheckbox.Root
      class={styles.container}
      defaultChecked={props.DefaultChecked}
      disabled={props.Disabled}
      indeterminate={props.Indeterminate}
      onChange={props.OnChange}
      validationState={props.Error ? "invalid" : "valid"}
      value={props.Checked ? "true" : undefined}
    >
      <KobalteCheckbox.Input class={styles.checkbox_input} />
      <KobalteCheckbox.Control class={styles.checkbox_control}>
        <KobalteCheckbox.Indicator class={styles.checkbox_indicator}>
          <Switch>
            <Match when={props.Error}>
              <VsClose />
            </Match>
            <Match when={props.Indeterminate}>
              <BsDash />
            </Match>
            <Match when={!props.Indeterminate}>
              <FiCheck />
            </Match>
          </Switch>
        </KobalteCheckbox.Indicator>
      </KobalteCheckbox.Control>
      <KobalteCheckbox.Label class={styles.checkbox_label}>
        {props.Label}
      </KobalteCheckbox.Label>
      <KobalteCheckbox.Description class={styles.checkbox_helper}>
        {props.HelperText}
      </KobalteCheckbox.Description>
      <KobalteCheckbox.ErrorMessage class={styles.checkbox_error}>
        {props.Error}
      </KobalteCheckbox.ErrorMessage>
    </KobalteCheckbox.Root>
  );
};
