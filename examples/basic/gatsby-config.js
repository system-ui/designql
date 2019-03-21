require('dotenv').config()
const path = require('path')
const Components = require('gatsby-ui')

module.exports = {
  siteMetadata: {
    title: 'Gatsby UI'
  },
  __experimentalThemes: [
    {
      resolve: 'gatsby-theme-designql',
      options: {
        components: Components,
        theme: Components.theme,
        docsPath: path.join(__dirname, './docs'),
        componentsPath: path.join(__dirname, '../../node_modules/gatsby-ui/src'),
        figma: {
          fileId: process.env.FIGMA_FILE_ID,
          //projectId: process.env.FIGMA_PROJECT_ID,
          accessToken: process.env.FIGMA_TOKEN,
        }
      }
    }
  ]
}
