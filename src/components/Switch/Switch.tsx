import { Switch as KobatleSwitch } from "@kobalte/core/switch";
import styles from "./Switch.module.css";

type SwitchProps = {
  Checked?: boolean;
  DefaultChecked?: boolean;
  Disabled?: boolean;
  Error?: string;
  HelperText?: string;
  Label: string;
  LabelPosition?: "side" | "top";
  OnChange?: (checked: boolean) => void;
};

export const Switch = (props: SwitchProps) => {
  return (
    <KobatleSwitch
      checked={props.Checked}
      classList={{
        [styles.switch_labelTop]:
          props.LabelPosition === "top" || !props.LabelPosition,
        [styles.switch_labelSide]: props.LabelPosition === "side",
      }}
      defaultChecked={props.DefaultChecked}
      disabled={props.Disabled}
      onChange={props.OnChange}
      validationState={props.Error ? "invalid" : "valid"}
      value={props.Checked ? "on" : "off"}
    >
      <KobatleSwitch.Label class={styles.switch_label}>
        {props.Label}
      </KobatleSwitch.Label>
      <KobatleSwitch.Input class={styles.switch_input} />
      <KobatleSwitch.Control class={styles.switch_control}>
        <KobatleSwitch.Thumb class={styles.switch_thumb} />
      </KobatleSwitch.Control>
      <KobatleSwitch.Description class={styles.switch_helper}>
        {props.HelperText}
      </KobatleSwitch.Description>
      <KobatleSwitch.ErrorMessage class={styles.switch_error}>
        {props.Error}
      </KobatleSwitch.ErrorMessage>
    </KobatleSwitch>
  );
};
