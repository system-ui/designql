const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

const ComponentDoc = require.resolve('./src/components/templates/ComponentDoc')

exports.createPages = async ({ graphql, actions }, pluginOptions) => {
  const { createPage } = actions
  const { formatDisplayName, componentDocsPath = '/components' } = pluginOptions

  // const { docsPath } = pluginOptions

  const result = await graphql(`
    {
      docs: allFile(
        filter: {
          sourceInstanceName: { eq: "components" }
          extension: { eq: "mdx" }
        }
      ) {
        edges {
          node {
            name
            sourceInstanceName
            childMdx {
              rawBody
              code {
                body
              }
            }
          }
        }
      }

      components: allComponentMetadata {
        edges {
          node {
            displayName
            parent {
              ... on File {
                name
              }
            }
          }
        }
      }

      system: allStyledSystem {
        edges {
          node {
            id
            name
            tagName
            css
            propTypes
            defaultProps
          }
        }
      }
    }
  `)

  if (result.errors) {
    console.log(result.errors)
    throw new Error('Could not query components', result.errors)
  }

  // Aggregate colocated MDX files
  const { components } = result.data
  const componentDocs = result.data.docs.edges.reduce((acc, { node }) => {
    acc[node.name] = node
    return acc
  }, {})

  // Create component pages
  components.edges.forEach(({ node }) => {
    const { frontmatter = {} } = node
    const title = frontmatter.title || node.parent.name
    const path = frontmatter.path || `${componentDocsPath}/${title}`

    let docs = ''
    if (componentDocs[title]) {
      docs = componentDocs[title].childMdx.code.body
    }

    createPage({
      path,
      context: {
        ...node,
        title,
        docs
      },
      component: ComponentDoc
    })
  })
}

exports.onPreBootstrap = ({ store }) => {
  const { program } = store.getState()

  const dirs = [
    path.join(program.directory, 'src/pages')
  ]

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      mkdirp.sync(dir)
    }
  })
}

exports.onCreateWebpackConfig = ({ loaders, actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.dirname(require.resolve('gatsby-theme-docs')),
          use: [loaders.js()]
        }
      ]
    }
  })
}
