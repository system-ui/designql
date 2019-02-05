# gatsby-theme-designql

> :warning: This is experimental and subject to breaking changes.

## Installation

```sh
yarn add gatsby-theme-designql
```

## Usage

```js
// gatsby-config.js
module.exports = {
  return {
    __experimentalThemes: [
      {
        resolve: 'gatsby-theme-designql',
        options: {
          docsPath: '/docs'
        }
      }
    ]
  }
}
```

### Configuration

Key | Default | Description
--- | --- | ---
`docsPath` | `/` | Root path for documentation pages
`componentDocsPath` | `/components` | Path for rendered component docs pages
`componentsPath` | `src/components` | Path for components source files
