import { Card } from "~/components/Card";
import { Button } from "~/components/Button";

const Content = () => {
  return (
    <div
      style={{
        padding: "var(--spacing-large)",
        display: "flex",
        "flex-direction": "column",
        gap: "var(--spacing-medium)",
      }}
    >
      <Card>Card Component</Card>
      <Button Type="button">Filled (Default) Button</Button>
      <Button Type="button" Variant="outlined">
        Outlined Button
      </Button>
      <Button Type="button" Variant="text">
        Text Button
      </Button>
      <Button Type="button" Variant="text-outline">
        Text (Outlined) Button
      </Button>
      <Button Type="button" Variant="text-underline">
        Text (Underlined) Button
      </Button>
      <span>
        - Define all the common styling props, padding, margin, width, height,
        etc - Create CommonProps for all of these - Create helper function that
        will convert these to css variables, agnostic to component
        (--custom-height or something) - Helper function accepts props object,
        and an object containing defaults specific to the component - Return
        spreadable object - Spread into component style
      </span>
    </div>
  );
};

/*
List of common props that affect CSS
|  Props          |  Default (Global)     |
- GridArea           unset
- Height             unset
- Width              unset
- Padding            unset
- Margin             unset
- BackgroundColor    --color-background
- Color              --color-text
- FontSize           --font-size-text
- FontWeight         unset
*/

const StyleGuide = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "0px",
        left: "0px",
        right: "0px",
        bottom: "0px",
        display: "flex",
        "flex-direction": "row",
      }}
    >
      <div
        class="light-override"
        style={{
          background: "var(--color-background)",
          width: "100%",
        }}
      >
        <Content />
      </div>
      <div
        style={{
          width: "100%",
        }}
      >
        <Content />
      </div>
    </div>
  );
};

export default StyleGuide;
