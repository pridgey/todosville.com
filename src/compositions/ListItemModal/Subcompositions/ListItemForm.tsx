import { createEffect, createSignal, Show } from "solid-js";
import { Card } from "~/components/Card";
import { Checkbox } from "~/components/Checkbox";
import { Flex } from "~/components/Flex";
import { Input } from "~/components/Input";
import { Select } from "~/components/Select";
import { Text } from "~/components/Text";
import { ListItemRecord } from "~/types/ListItemRecord";
import {
  calculateCooldownSeconds,
  CooldownUnit,
} from "~/utilities/calculateCooldownSeconds";

type ListItemFormProps = {
  Errors: Record<string, string>;
  ListItem: ListItemRecord;
  OnChange: (modifiedItem: ListItemRecord) => void;
};

/**
 * Subcomposition for the ListItemModal that contains the form fields for the list item.
 * Allows for creating or editing a list item record.
 */
export const ListItemForm = (props: ListItemFormProps) => {
  // Controls whether or not to show the repetition options
  const [taskRepeats, setTaskRepeats] = createSignal(false);
  // Repetition options
  const [repeatNumber, setRepeatNumber] = createSignal(0);
  const [repeatUnit, setRepeatUnit] = createSignal<CooldownUnit>();

  // Determine cooldown seconds based on user input (listitem needs number of seconds)
  createEffect(() => {
    if (taskRepeats() && repeatNumber() && repeatUnit()) {
      // Calculate the cooldown seconds based on the user's input and update the list item
      const cooldownInSeconds = calculateCooldownSeconds(
        repeatNumber(),
        repeatUnit() ?? "days"
      );

      props.OnChange({
        ...props.ListItem,
        cooldown_seconds: cooldownInSeconds,
      });
    } else if (!taskRepeats() && props.ListItem.cooldown_seconds > 0) {
      // If for some reason the box is unchecked, but there are seconds, clear them
      props.OnChange({
        ...props.ListItem,
        cooldown_seconds: 0,
      });
    }
  });

  return (
    <Flex Direction="column" Gap="medium">
      <Input
        DefaultValue={props.ListItem.item_name}
        Error={props.Errors["item_name"]}
        Label="Item name"
        OnChange={(newTitle) =>
          props.OnChange({
            ...props.ListItem,
            item_name: newTitle,
          })
        }
      />
      <Input
        DefaultValue={props.ListItem.description}
        Multiline={true}
        Label="Description"
        OnChange={(newDesc) => {
          props.OnChange({
            ...props.ListItem,
            description: newDesc,
          });
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
              A repeated task will start a countdown once it is checked and when
              that time has elapsed, will uncheck itself.
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
                    isNaN(Number(newRepeatNumber)) ? 0 : Number(newRepeatNumber)
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
  );
};
