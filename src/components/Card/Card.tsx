import styles from "./Card.module.css";
import { Dynamic } from "solid-js/web";
import type { JSX, ValidComponent } from "solid-js";

type CardProps = {
  As?: ValidComponent;
  children: JSX.Element;
};

export const Card = (props: CardProps) => {
  return (
    <Dynamic class={styles.card} component={props.As ?? "div"}>
      {props.children}
    </Dynamic>
  );
};
