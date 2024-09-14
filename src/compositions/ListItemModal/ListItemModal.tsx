import { useAction, useSubmission } from "@solidjs/router";
import { createEffect, Match, Show, Switch } from "solid-js";
import { createSignal } from "solid-js";
import { Card } from "~/components/Card";
import { Checkbox } from "~/components/Checkbox";
import { Flex } from "~/components/Flex";
import { Input } from "~/components/Input";
import { Modal } from "~/components/Modal";
import { Select } from "~/components/Select";
import { Text } from "~/components/Text";
import { createListItem } from "~/lib/db";
import { emptyListItem, ListItemRecord } from "~/types/ListItemRecord";
import {
  calculateCooldownSeconds,
  CooldownUnit,
} from "~/utilities/calculateCooldownSeconds";
import { ListItemForm } from "./Subcompositions/ListItemForm";

type ListItemModalProps = {
  SelectedItem?: ListItemRecord;
  OnClose: () => void;
  OnCreated: () => void;
};

export const ListItemModal = (props: ListItemModalProps) => {
  // The state of the list item being created/edited
  const [listItemState, setListItemState] = createSignal<ListItemRecord>(
    props.SelectedItem || emptyListItem
  );

  // Any form validation errors
  const [validationErrors, setValidationErrors] = createSignal<
    Record<string, string>
  >({});

  // Solid-Start action to create the new list item
  const createNewListItem = useAction(createListItem);
  const createListItemAction = useSubmission(createListItem);

  return (
    <Modal
      Banner={listItemState().image_url}
      CancelLabel="Nevermind"
      OnClose={props.OnClose}
      OnSubmit={
        listItemState().id
          ? undefined
          : async () => {
              if (listItemState()) {
                // Validate the item has a name
                if (!listItemState().item_name) {
                  // Show an error if the item has no name and return early
                  setValidationErrors((prev) => ({
                    ...prev,
                    item_name: "Please enter a name for your item",
                  }));
                  return;
                }
                // All must be good, create the item
                await createNewListItem(listItemState()!);
                props.OnCreated();
              }
            }
      }
      Pending={createListItemAction.pending}
      SubmitLabel={"Create My New Item"}
      Title={listItemState().item_name || "Create New Item"}
    >
      <Switch>
        <Match when={listItemState().id}>
          <Flex Direction="column" Gap="medium">
            <Text FontSize="large">{listItemState().description}</Text>
          </Flex>
        </Match>
        <Match when={!listItemState().id}>
          <ListItemForm
            Errors={validationErrors()}
            ListItem={listItemState()}
            OnChange={setListItemState}
          />
        </Match>
      </Switch>
    </Modal>
  );
};
