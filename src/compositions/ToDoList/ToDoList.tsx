import { createSignal, For, Match, onCleanup, Switch } from "solid-js";
import { Mason } from "solid-mason";
import { Flex } from "~/components/Flex";
import { ListItemCard } from "../ListItemCard";
import { ListItemUIRecord } from "~/types/ListItemUIRecord";

type ToDoListProps = {
  ListItems: ListItemUIRecord[];
  OnClick: (ListItem: ListItemUIRecord) => void;
};

/**
 * Composition that holds the to-do list items and renders them based on screen size.
 Will render in client side only thanks to its index
 */
const ToDoListComponent = (props: ToDoListProps) => {
  const [screenWidth, setScreenWidth] = createSignal(window.innerWidth);

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  window.addEventListener("resize", () => {
    handleResize();
  });

  onCleanup(() => {
    window.removeEventListener("resize", handleResize);
  });

  return (
    <>
      <Switch>
        <Match when={screenWidth() < 768}>
          <Flex Direction="column" Gap="medium">
            <For each={props.ListItems}>
              {(item) => (
                <ListItemCard OnClick={() => props.OnClick(item)} {...item} />
              )}
            </For>
          </Flex>
        </Match>
        <Match when={screenWidth() >= 768}>
          <Mason as="div" items={props.ListItems} columns={4}>
            {(item) => (
              <ListItemCard OnClick={() => props.OnClick(item)} {...item} />
            )}
          </Mason>
        </Match>
      </Switch>
    </>
  );
};

export default ToDoListComponent;
