import { For } from "solid-js";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
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
        Gap="medium"
        JustifyContent="space-between"
      >
        <Flex Direction="column" Gap="small">
          <Text FontSize="header" FontWeight="bold">
            {toSentenceCase(props.item_name)}
          </Text>
          <Text>{props.description}</Text>
        </Flex>
        <Flex
          Direction="row"
          Height="unset"
          Gap="small"
          Width="unset"
          Wrap="wrap"
        >
          <For
            each={["Tag One", "Tag Two", "Tag Three", "Tag Four", "Tag Five"]}
          >
            {(tag) => (
              <Card height="auto" padding="small" width="auto">
                <Text FontSize="mini" FontWeight="bold" FontWrap="nowrap">
                  {tag}
                </Text>
              </Card>
            )}
          </For>

          <Button
            Color="foreground"
            FontSize="mini"
            Padding="small"
            Variant="outlined"
          >
            Add Tag
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};
