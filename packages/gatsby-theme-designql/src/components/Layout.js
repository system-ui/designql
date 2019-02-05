import React from 'react'
import { StaticQuery, Link as GatsbyLink, graphql } from 'gatsby'
import Sidepane from 'sidepane'
import { Box, Flex, Link, Provider } from 'gatsby-ui'

const SIDEPANE_WIDTH = 256

export default ({ children }) => (
  <Provider>
    <StaticQuery
      query={graphql`
        query {
          pages: allSitePage(
            filter: { path: { ne: "/dev-404-page/" } }
          ) {
            edges {
              node {
                path
                parent {
                  ... on File {
                    name
                    sourceInstanceName
                  }
                }
                pluginCreator {
                  name
                }
                context {
                  displayName
                }
              }
              next {
                path
              }
              previous {
                path
              }
            }
          }
        }
      `}
      render={data => (
        <>
          <Flex>
            <Sidepane width={SIDEPANE_WIDTH}>
              <Box p={[3, 4, 5]}>
                {data.pages.edges.map(({ node: page }) => {
                  if (page.path === '/') {
                    return null
                  }

                  let name = page.path
                  if (page.context && (page.context.title || page.context.displayName)) {
                    name = page.context.title || page.context.displayName
                  } else if (page.parent && page.parent.name) {
                    name = page.parent.name
                  }

                  return (
                    <Box pt={2}>
                      <Link
                        key={page.path}
                        as={GatsbyLink}
                        to={page.path}
                        color="grays.8"
                      >
                        {name}
                      </Link>
                    </Box>
                  )
                })}
              </Box>
            </Sidepane>
          </Flex>
          <Box mt={[3, 4, 5]} ml={[0, SIDEPANE_WIDTH, SIDEPANE_WIDTH]}>
            {children}
          </Box>
        </>
      )}
    />
  </Provider>
)
