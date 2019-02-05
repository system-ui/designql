import React from 'react'
import { graphql } from 'gatsby'

import Component from '../Component'

export default props => (
  <>
    <Component {...props.pageContext} {...props.data} />
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </>
)

export const pageQuery = graphql`
  query($displayName: String!) {
    metadata: componentMetadata(displayName: { eq: $displayName }) {
      displayName
      description {
        text
      }
      props {
        name
        type {
          name
          value
        }
        defaultValue {
          value
        }
        description {
          text
        }
      }
    }
  }
`