import React from 'react'
import {Provider} from 'gatsby-ui'

export const wrapRootElement = ({ element }) => (
  React.createElement(Provider, {}, element)
)
