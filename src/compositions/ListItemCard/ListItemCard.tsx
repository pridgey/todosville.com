import { For, Show } from "solid-js";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { Divider } from "~/components/Divider";
import { Flex } from "~/components/Flex";
import { Text } from "~/components/Text";
import { ListItemUIRecord } from "~/types/ListItemUIRecord";
import { toSentenceCase } from "~/utilities/StringUtilities/toSentenceCase";

export const ListItemCard = (props: ListItemUIRecord) => {
  return (
    <Card margin="small" variant="alternate" width="auto">
      <Flex
        Direction="column"
        Height="100%"
        Gap="small"
        JustifyContent="space-between"
      >
        <Flex Direction="column" Gap="small">
          <Text FontSize="header" FontWeight="bold">
            {toSentenceCase(props.item_name)}
          </Text>
          <Show when={!!props.description}>
            <Text>{props.description}</Text>
          </Show>
        </Flex>
        <Show when={!!props.tags.length}>
          <Divider />
          <Flex
            Direction="row"
            Height="unset"
            Gap="small"
            Width="unset"
            Wrap="wrap"
          >
            <For each={props.tags}>
              {(tag) => (
                <Card
                  border="gray"
                  height="auto"
                  padding="mini"
                  variant="outlined"
                  width="auto"
                >
                  <Text
                    Color="gray"
                    FontSize="mini"
                    FontWeight="semibold"
                    FontWrap="nowrap"
                  >
                    {tag.name}
                  </Text>
                </Card>
              )}
            </For>
          </Flex>
        </Show>
      </Flex>
    </Card>
  );
};
