import { useAction } from "@solidjs/router";
import { createEffect, Show } from "solid-js";
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

type AddItemModalProps = {
  OnClose: () => void;
  OnCreated: () => void;
};

export const AddItemModal = (props: AddItemModalProps) => {
  // Controls whether or not to show the repetition options
  const [taskRepeats, setTaskRepeats] = createSignal(false);
  // Repetition options
  const [repeatNumber, setRepeatNumber] = createSignal(0);
  const [repeatUnit, setRepeatUnit] = createSignal<CooldownUnit>();

  // The state of the list item being created/edited
  const [listItemState, setListItemState] =
    createSignal<ListItemRecord>(emptyListItem);

  // Any form validation errors
  const [validationErrors, setValidationErrors] = createSignal<
    Record<string, string>
  >({});

  // Solid-Start action to create the new list item
  const createNewListItem = useAction(createListItem);

  // Determine cooldown seconds based on user input (listitem needs number of seconds)
  createEffect(() => {
    if (taskRepeats() && repeatNumber() && repeatUnit()) {
      const cooldownInSeconds = calculateCooldownSeconds(
        repeatNumber(),
        repeatUnit() ?? "days"
      );

      setListItemState((prev) => ({
        ...prev,
        cooldown_seconds: cooldownInSeconds,
      }));
    } else if (!taskRepeats() && listItemState().cooldown_seconds > 0) {
      setListItemState((prev) => ({
        ...prev,
        cooldown_seconds: 0,
      }));
    }
  });

  return (
    <Modal
      CancelLabel="Nevermind"
      OnClose={props.OnClose}
      OnSubmit={async () => {
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
      }}
      SubmitLabel="Create My New Item"
      Title="Add a New Item"
    >
      <Flex Direction="column" Gap="medium">
        <Input
          Error={validationErrors()["item_name"]}
          Label="Item name"
          OnChange={(newTitle) =>
            setListItemState((prev) => ({
              ...prev,
              item_name: newTitle,
            }))
          }
        />
        <Input
          Multiline={true}
          Label="Description"
          OnChange={(newDesc) => {
            setListItemState((prev) => ({
              ...prev,
              description: newDesc,
            }));
          }}
        />
        <Checkbox
          Checked={taskRepeats()}
          Label="This Task Repeats"
          OnChange={(checked) => setTaskRepeats(checked)}
        />
        <Show when={taskRepeats()}>
          <Card padding="medium" variant="alternate">
            <Flex Direction="column" Gap="medium">
              <Text>
                A repeated task will start a countdown once it is checked and
                when that time has elapsed, will uncheck itself.
              </Text>
              <Flex
                AlignItems="center"
                Direction="row"
                JustifyContent="space-between"
                Gap="medium"
              >
                <Input
                  Label="Repeat Every..."
                  OnChange={(newRepeatNumber) =>
                    setRepeatNumber(
                      isNaN(Number(newRepeatNumber))
                        ? 0
                        : Number(newRepeatNumber)
                    )
                  }
                  Type="number"
                />
                <Select
                  Label="Time Unit"
                  OnChange={(newUnit) =>
                    setRepeatUnit(newUnit.value as unknown as CooldownUnit)
                  }
                  Options={[
                    {
                      display: "Seconds",
                      value: "seconds",
                    },
                    {
                      display: "Minutes",
                      value: "minutes",
                    },
                    {
                      display: "Hours",
                      value: "hours",
                    },
                    {
                      display: "Days",
                      value: "days",
                    },
                    {
                      display: "Weeks",
                      value: "weeks",
                    },
                    {
                      display: "Months",
                      value: "months",
                    },
                    {
                      display: "Years",
                      value: "years",
                    },
                  ]}
                />
              </Flex>
            </Flex>
          </Card>
        </Show>
      </Flex>
    </Modal>
  );
};
