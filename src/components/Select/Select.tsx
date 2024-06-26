import { Select as KobalteSelect } from "@kobalte/core/select";
import { FiChevronDown, FiCheck } from "solid-icons/fi";
import styles from "./Select.module.css";

interface SelectOptionProps {
  value: string;
  display: string;
  disabled?: boolean;
}

type SelectProps = {
  Error?: string;
  HelperText?: string;
  Label: string;
  OnChange?: (newValue: SelectOptionProps) => void;
  Options: SelectOptionProps[];
  Placeholder?: string;
  Width?: string;
};

export const Select = (props: SelectProps) => {
  return (
    <KobalteSelect
      class={styles.select_root}
      onChange={props.OnChange}
      options={props.Options}
      optionValue="value"
      optionTextValue="display"
      optionDisabled="disabled"
      placeholder={props.Placeholder}
      itemComponent={(props) => (
        <KobalteSelect.Item item={props.item} class={styles.select_item}>
          <KobalteSelect.ItemLabel>
            {props.item.rawValue.display}
          </KobalteSelect.ItemLabel>
          <KobalteSelect.ItemIndicator class={styles.select_itemIndicator}>
            <FiCheck />
          </KobalteSelect.ItemIndicator>
        </KobalteSelect.Item>
      )}
      style={{ "--select-width": props.Width ?? "100%" }}
    >
      <KobalteSelect.Label class={styles.select_label}>
        {props.Label}
      </KobalteSelect.Label>
      <KobalteSelect.Trigger
        class={styles.select_trigger}
        aria-label={props.Label}
      >
        <KobalteSelect.Value<SelectOptionProps> class={styles.select_value}>
          {(state) => state.selectedOption().display}
        </KobalteSelect.Value>
        <KobalteSelect.Icon class={styles.select_icon}>
          <FiChevronDown />
        </KobalteSelect.Icon>
      </KobalteSelect.Trigger>
      <KobalteSelect.Description class={styles.select_helper}>
        {props.HelperText}
      </KobalteSelect.Description>
      <KobalteSelect.ErrorMessage class={styles.select_error}>
        {props.Error}
      </KobalteSelect.ErrorMessage>
      <KobalteSelect.Portal>
        <KobalteSelect.Content class={styles.select_content}>
          <KobalteSelect.Listbox class={styles.select_listbox} />
        </KobalteSelect.Content>
      </KobalteSelect.Portal>
    </KobalteSelect>
  );
};
