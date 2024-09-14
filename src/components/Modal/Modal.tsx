import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import styles from "./Modal.module.css";
import { Text } from "../Text";
import { Button } from "../Button";
import { IoClose } from "solid-icons/io";
import { Show } from "solid-js";

type ModalProps = {
  Banner?: string;
  children: JSX.Element;
  CancelLabel?: string;
  OnClose: () => void;
  OnSubmit?: () => void;
  Pending?: boolean;
  SubmitColor?: "primary" | "danger";
  SubmitLabel?: string;
  Title?: string;
  Width?: string;
};

export const Modal = (props: ModalProps) => {
  return (
    <Portal>
      <div class={styles.container}>
        <dialog
          class={styles.modal}
          open={true}
          style={{ "--modal-width": props.Width ?? "500px" }}
        >
          <Show when={!!props.Banner?.length}>
            <img src={props.Banner} alt="Banner" class={styles.banner} />
          </Show>
          <span
            classList={{
              [styles.title]: !props.Banner,
              [styles.bannerTitle]: !!props.Banner,
            }}
            style={{ "grid-area": "title" }}
          >
            <Show when={!!props.Title}>
              <Text
                As="h1"
                FontWeight="bold"
                FontSize={!!props.Banner?.length ? "large" : "header"}
              >
                {props.Title}
              </Text>
            </Show>
          </span>
          <span style={{ "grid-area": "close" }}>
            <Button
              Color={props.Banner?.length ? "primary" : "text"}
              Disabled={props.Pending}
              OnClick={() => props.OnClose()}
              Padding="medium"
              Pending={props.Pending}
              Type="button"
              Variant={props.Banner?.length ? "full" : "text"}
            >
              <IoClose />
            </Button>
          </span>
          <div class={styles.body}>{props.children}</div>
          <Show when={!!props.OnSubmit}>
            <div class={styles.buttonbar}>
              <Button
                Disabled={props.Pending}
                OnClick={() => props.OnClose()}
                Pending={props.Pending}
                Type="button"
                Variant="text"
              >
                {props.CancelLabel || "Cancel"}
              </Button>
              <Button
                Color={props.SubmitColor === "danger" ? "error" : "primary"}
                Disabled={props.Pending}
                OnClick={() => [props.OnSubmit?.()]}
                Pending={props.Pending}
                Type="button"
              >
                {props.SubmitLabel || "Submit"}
              </Button>
            </div>
          </Show>
        </dialog>
      </div>
    </Portal>
  );
};
