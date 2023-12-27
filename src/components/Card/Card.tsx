import styles from "./Card.module.css";
import { Dynamic } from "solid-js/web";
import type { JSX, ValidComponent } from "solid-js";
import type { CommonStyleProps } from "~/styles/theme";
import { digestCommonProps } from "~/styles/theme";

type CardProps = {
  As?: ValidComponent;
  children: JSX.Element;
} & CommonStyleProps;

export const Card = (props: CardProps) => {
  return (
    <Dynamic
      classList={{
        [styles.card]: true,
        component: true,
      }}
      component={props.As ?? "div"}
      style={{ ...digestCommonProps(props) }}
    >
      {props.children}
    </Dynamic>
  );
};
