import { Skeleton as KobalteSkeleton } from "@kobalte/core";
import styles from "./Skeleton.module.css";

type SkeletonProps = {
  height?: string;
  width?: string;
};

export const Skeleton = (props: SkeletonProps) => {
  return (
    <KobalteSkeleton.Root
      class={styles.skeleton}
      radius={10}
      style={{
        "--skeleton-height": props.height ?? "auto",
        "--skeleton-width": props.width ?? "100%",
      }}
    />
  );
};
