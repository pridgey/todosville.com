// Primary defined colors in the theme
type Colors =
  | "Background"
  | "BackgroundFull"
  | "Black"
  | "Error"
  | "Foreground"
  | "ForegroundFull"
  | "Gray"
  | "Primary"
  | "Secondary"
  | "Success"
  | "Tertiary"
  | "Text"
  | "White";

// Easy to access dictionary to convert Color type to CSS
type ColorDictionary = Record<Colors, `var(--color-${string})`>;
export const ColorDict: ColorDictionary = {
  Background: "var(--color-background)",
  BackgroundFull: "var(--color-fullbackground)",
  Black: "var(--color-black)",
  Error: "var(--color-error)",
  Foreground: "var(--color-foreground)",
  ForegroundFull: "var(--color-fullforeground)",
  Gray: "var(--color-gray)",
  Primary: "var(--color-primary)",
  Secondary: "var(--color-secondary)",
  Success: "var(--color-success)",
  Tertiary: "var(--color-tertiary)",
  Text: "var(--color-text)",
  White: "var(--color-white)",
};

// Primary defined font sizes in the theme
type FontSizes = "mini" | "text" | "header" | "large";

type FontSizeDictionary = Record<FontSizes, `var(--font-size-${string})`>;
export const FontSizeDict: FontSizeDictionary = {
  mini: "var(--font-size-mini)",
  text: "var(--font-size-text)",
  header: "var(--font-size-header)",
  large: "var(--font-size-large)",
};

// Primary defined font weights in the theme
type FontWeights = "light" | "normal" | "semibold" | "bold";

type FontWeightDictionary = Record<FontWeights, `var(--font-weight-${string})`>;
export const FontWeightDict: FontWeightDictionary = {
  light: "var(--font-weight-light)",
  normal: "var(--font-weight-normal)",
  semibold: "var(--font-weight-semibold)",
  bold: "var(--font-weight-bold)",
};

// Primary defined spacings (border-radius, gap, etc)
type Spacings = "small" | "medium" | "large";

type SpacingsDictionary = Record<Spacings, `var(--spacing-${string})`>;
export const SpacingDict: SpacingsDictionary = {
  small: "var(--spacing-small)",
  medium: "var(--spacing-medium)",
  large: "var(--spacing-large)",
};

// Type of common style props to be shared among components
export type CommonStyleProps = {
  GridArea?: string;
  Height?: string;
  Width?: string;
  Padding?: string;
  Margin?: string;
  BackgroundColor?: Colors;
  Color?: Colors;
  FontSize?: FontSizes;
  FontWeight?: FontWeights;
  Border?: string;
  BorderRadius?: Spacings;
};

// Dictionary for common component prop CSS variables
type CommonStylePropsDictionary = Record<
  keyof CommonStyleProps,
  `--component-${string}`
>;
const CommonStylePropsDict: CommonStylePropsDictionary = {
  GridArea: "--component-grid-area",
  Height: "--component-height",
  Width: "--component-width",
  Padding: "--component-padding",
  Margin: "--component-margin",
  BackgroundColor: "--component-background-color",
  Color: "--component-color",
  FontSize: "--component-font-size",
  FontWeight: "--component-font-weight",
  Border: "--component-border",
  BorderRadius: "--component-border-radius",
};

// Utility function to translate common style props into CSS
export const digestCommonProps = (
  props: CommonStyleProps & Record<string, unknown>
) => {
  const resultingCSS: Record<string, unknown> = {};

  Object.keys(props).forEach((propKey) => {
    // If key is of CommonStyleProps...
    if (propKey in CommonStylePropsDict) {
      const commonStyleKey: keyof CommonStyleProps =
        propKey as keyof CommonStyleProps;

      // Get the key string
      const cssKey: string = CommonStylePropsDict[commonStyleKey];

      // Get the key value
      let cssValue = props[propKey]; // What the prop actually is

      // Transform if a dictionary is needed
      if (["BackgroundColor", "Color"].includes(commonStyleKey)) {
        cssValue = ColorDict[cssValue as Colors];
      }
      if (commonStyleKey === "FontSize") {
        cssValue = FontSizeDict[cssValue as FontSizes];
      }
      if (commonStyleKey === "FontWeight") {
        cssValue = FontWeightDict[cssValue as FontWeights];
      }
      if (commonStyleKey === "BorderRadius") {
        cssValue = SpacingDict[cssValue as Spacings];
      }

      // Add to result
      resultingCSS[cssKey] = cssValue;
    }
  });

  return resultingCSS;
};
