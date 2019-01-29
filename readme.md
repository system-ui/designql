# DesignQL

A self-documenting design system specification for GraphQL.

```gql
query {
  theme {
    colors
    boxShadows
    a11yCombos {
      contrast
      backgroundColor
      color
    }
  }
  component(name: { eq: "Button" }) {
    docs
    propsTable {
      key
      defaultValue
      description
      type {
        name
        description
      }
    }
    styledApi {
      permutations
    }
  }
}
```

## What is it?

DesignQL provides a GraphQL based definition of a design system's primitives that can be queried _and_ written to by all members of a team.
This provides a powerful API for documenting components that still remains flexible for design system teams to have control of design and branding.
It also provides a convenient mechanism for cloning for prototyping one-offs or experimenting with changes to the design system itself (theme, components, etc.).

## Why?

When we build and document design systems we're often forced to reinvent the wheel with bespoke implementations.
There are numerous design system and styleguide tools out there, but they often couple you to custom DSLs or lack flexibility.
DesignQL seeks to provide users with a free and open API to build out design systems and document them with ease.
Tables of props, playgrounds, and much more can be scaffolded out just from the source code and a colocated MDX file.

These days design and development for teams often have numerous render targets.
Keeping them in sync can be difficult, especially when attempting to design generatively, access programmatically, or combine with tools lacking read/write APIs.
Future goals of this project will include outputting a design system's primitives and tokens to React (styled-components/emotion/css modules), Vue, vanilla HTML/CSS (Tachyons, BEM, Tailwind).

We want to share it with the community for a few reasons:

- :family: Improve upon it as a community
- :recycle: Encourage adoption with other design/development tools
- :wrench: Community-based implementations for other libraries/frameworks/etc
- :lock: Avoid lock in for users

## Table of contents

- [Features](#features)
- [How does it work?](#how-does-it-work)
  - [Implementation](#implementation)
  - [Naming conventions](#namingconventions)
- [Specification](#specification)
  - [Types](#types)
    - [DesignSystem](#designsystem)
    - [Component](#component)
    - [Theme](#theme)
    - [Branding](#branding)
    - [StyledFunction](#styledfunction)
    - [Primitives](#primitives)
      - [ColorMap](#colormap)
      - [JSON](#json)

## How does it work?

A design system typically consists of the same key parts:

- :art: theme
- :nail_care: branding
- :ballot_box: components
- :books: documentation
- :trohpy: icons

DesignQL boils this down to a schema that can be shared amongst a team and their projects.
It exposes a GraphQL API that can be used to document React code with many CSS-in-JS libraries and down the road export to other render targets like (Atomic CSS, React Native, Vue).

More importantly, it defines and provides an interface for programmatic access mentioned earlier.

### Implementation

DesignQL consists of multiple libraries that handle different types of source files.

Libraries:

- react-docgen
- styled-system
- MDX
- Gatsby

#### Example

Here's an example Button component:

```js
import styled from 'styled-components'
import { color, space } from 'styled-system'
import { variant, size } from './styled-functions'

/* @component */
export const Button = styled.button`
  appearance: button;

  ${color}
  ${space}
  ${variant}
  ${size}
`

Button.displayName = 'Button'

Button.defaultProps = {
  variant: 'primary',
  size: 'md'
}
Button.propTypes = {
  color: color.propTypes,
  variant: variant.propTypes,
  size: size.propTypes,
  ...space.propTypes
}
```

### Naming conventions

In order to keep the MVP as simple as possible, DesignQL currently expects a particular layout structure:

- `src/Button.js`
- `src/Button.mdx`

If there isn't a colocated MDX file it's no problem, DesignQL will do its best to parse out metadata.

### Future

- Source theme data from numerous locations
  - CSS Stats
  - Figma
  - Sketch
  - Framer

## Specification

The DesignQL is defined by the following GraphQL schema:

### Types

The following types are used to define styling, styled functions, components, and theming.

#### DesignSystem

The DesignSystem is the top level type that contains a theme, components, and docs.

```gql
type DesignSystem: {
  theme: Theme!
  branding: Branding!
  components: [Components!]
}
```

#### Component

Components are elements that have a name, props, styling, styled functions and documentation.

```gql
type Component: {
  """
  Name of the component, Pascal cased
  """
  name: String!
  """
  Description of the component
  """
  description: String
  """
  HTML element type, also accepts react native primitive types
  """
  element: String!
  """
  Default props to apply to the component
  """
  defaultProps: JSON
  """
  Property types that the component accepts
  """
  propTypes: JSON
  """
  Property control API of the component, defined as a static property
  """
  propertyControls: JSON
  """
  List of StyledFunctions for the component
  """
  StyledFunctions: [StyledFunction!]
  """
  Additional metadata for the component, including information like status
  """
  metadata: JSON
  """
  Component specific documentation
  """
  docs: String
  """
  Location of the source file on disk
  """
  srcPath: String!
  """
  Location of the MDX file on disk
  """
  docsPath: String
}
```

#### Theme

Themes are objects that define the values used by style props.
Themes ensure consistent margin, padding, colors, font sizes, and other UI constants.

A design system can also define multiple themes.
For example, a team might have a theme for apps and a theme for marketing pages.

```gql
type Theme: {
  """typography"""
  fonts: JSON
  fontSizes: JSON
  fontWeights: JSON
  lineHeights: JSON
  letterSpacings: JSON
  
  """skins"""
  colors: ColorMap
  shadows: JSON

  """layout"""
  space: JSON
  widths: JSON
  minWidths: JSON
  maxWidths: JSON
  heights: JSON
  minHeights: JSON
  maxHeights: JSON

  """borders"""
  borders: JSON
  radii: JSON

  """variants"""
  variants: JSON

  """media queries"""
  mediaQueries: [String!]
}
```

#### Branding

Branding consists of a brand's primary colors and its logos.
Queries can be made that automatically return the proper logo type and its color based on parameters.

For example, if the background where the logo will be placed is a dark purple, the white logo is returned to ensure proper contrast.

```gql
type Branding {
  """
  List of Logos
  """
  logos: [Logo!]
  """
  Branding specific colors
  """
  colors: ColorMap!
  """
  Documentation for branding
  """
  docs: String
}
```

#### Styled Function

A styled function is based on Styled System.
Styled functions have access to the theme, props, and optionally core Styled System functions.
They return a JSON object.

```gql
type StyledFunction {
  """
  Name for the function
  """
  name: String!
  """
  Component property
  """
  prop: String!
  """
  Name of core styled-system function
  """
  styledSystem: String
  """
  JSON property to set, defaults to prop
  """
  JSONProp: String
  """
  Convert numbers to px values
  """
  toPx: Boolean
  """
  Variant key (for example: buttons)
  """
  variantKey: String
  """
  Does this map to a theme key
  """
  themeKey: String
  """
  Documentation for the function
  """
  docs: String
}
```

### Primitive Types

- ColorMap
- JSON

#### ColorMap

ColorMap consists of an object with nested objects, arrays, and strings.
A color can be represented in hex, rgb, rgba, hsl, or a color name.

Values can only be strings.

Here's an example:

```js
{
  base: 'black',
  bg: 'white',
  blue: '#07c',
  grays: [
    '#999',
    '#555',
    '#111'
  ]
}
```

#### JSON

JSON properties can be an Int, Float, or String so we introduce a `JSONProperty` type.

```js
import { GraphQLJSON } from 'designql'

const typeDef = `
scalar JSON
`

const resolvers = {
  JSON: GraphQLJSON
}
```

## Authors

- John Otander

## License

MIT
