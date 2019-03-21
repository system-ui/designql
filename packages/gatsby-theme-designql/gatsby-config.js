const path = require('path')
const { resolver } = require('react-docgen')
const annotationResolver = require('react-docgen-annotation-resolver').default

module.exports = ({
  defaultLayouts = {},
  docsPath = 'docs',
  componentsPath = 'src/docs',
  components = {},
  theme = {},
  figma
} = {}) => {
  const themeLayouts = {
    default: require.resolve('./src/components/Layout')
  }

  const plugins = [
    {
      resolve: 'gatsby-mdx',
      options: {
        extensions: [".md", ".mdx"],
        defaultLayouts: {
          ...themeLayouts,
          ...defaultLayouts
        }
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'components',
        path: componentsPath
      }
    },
    {
      resolve: 'gatsby-plugin-page-creator',
      options: {
        name: 'docs',
        path: docsPath,
        ignore: ['**/\.*']
      },
    },
    {
      resolve: 'gatsby-transformer-react-docgen',
      options: {
        resolver: (ast, recast) => {
          const { findAllExportedComponentDefinitions } = resolver
          const annotatedComponents = annotationResolver(ast, recast)
          const exportedComponents = findAllExportedComponentDefinitions(ast, recast)

          return annotatedComponents.concat(exportedComponents)
        }
      }
    },
    {
      resolve: 'gatsby-transformer-styled-system',
      options: { components, theme }
    }
  ]

  if (figma) {
    plugins.push({
      resolve: 'gatsby-source-figma',
      options: figma
    })
  }

  return {
    siteMetadata: {
      title: 'Gatsby Blog',
      siteUrl: 'https://gatsbyjs.org'
    },
    plugins
  }
}
