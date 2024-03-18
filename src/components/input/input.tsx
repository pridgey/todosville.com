import { TextField } from "@kobalte/core";
import styles from "./input.module.css";

export type InputProps = {
  DefaultValue?: string;
  Error?: string;
  HelperText?: string;
  Label: string;
  Name?: string;
  OnChange: (newValue: string) => void;
  Placeholder?: string;
};

export const Input = ({
  DefaultValue,
  Error,
  HelperText,
  Label,
  Name,
  OnChange,
  Placeholder,
}: InputProps) => {
  return (
    <TextField.Root
      class={styles.input_root}
      defaultValue={DefaultValue}
      name={Name}
      onChange={OnChange}
    >
      <TextField.Label class={styles.input_label}>{Label}</TextField.Label>
      <TextField.Input class={styles.input_control} placeholder={Placeholder} />
      <TextField.Description class={styles.input_helper}>
        {HelperText}
      </TextField.Description>
      <TextField.ErrorMessage>{Error}</TextField.ErrorMessage>
    </TextField.Root>
  );
};
