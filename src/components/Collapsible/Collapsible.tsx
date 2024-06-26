import { Collapsible as KobalteCollapsible } from "@kobalte/core";
import { FiChevronDown } from "solid-icons/fi";
import type { JSX } from "solid-js";
import styles from "./Collapsible.module.css";

type CollapsibleProps = {
  DefaultExpanded?: boolean;
  Content: JSX.Element;
  Title: string;
  Width?: string;
};

export const Collapsible = (props: CollapsibleProps) => {
  return (
    <KobalteCollapsible.Root
      class={styles.root}
      defaultOpen={props.DefaultExpanded}
      style={{ "--collapsible-width": props.Width ?? "100%" }}
    >
      <KobalteCollapsible.Trigger class={styles.collapsibleTrigger}>
        <span>{props.Title}</span>
        <FiChevronDown class={styles.collapsibleTriggerIcon} />
      </KobalteCollapsible.Trigger>
      <KobalteCollapsible.Content class={styles.collapsibleContent}>
        {props.Content}
      </KobalteCollapsible.Content>
    </KobalteCollapsible.Root>
  );
};
