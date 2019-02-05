const fs = require('fs')
const crypto = require('crypto')

const { GraphQLString, GraphQLJSON, } = require('gatsby/graphql')

const digest = str =>
  crypto
    .createHash('md5')
    .update(str)
    .digest('hex')

const getPropTypes = (propTypes = {}) => {
  const metadata = Object.keys(propTypes).reduce((a, key) => {
    const type = propTypes[key]
    const meta = type.meta
    if (!meta || typeof meta !== 'object') return a
    a[key] = meta
    return a
  }, {})
  return metadata
}

const getTagName = ext => {
  const [ last ] = ext.slice(-1)
  return last || 'div'
}

const getExtensions = (Comp, ext = []) => {
  if (!Comp.defaultProps || !Comp.defaultProps.is) return ext
  const e = Comp.defaultProps.is
  if (typeof e !== 'function') return ext
  ext.push(e)
  // recursive - side effects
  getExtensions(e, ext)
  return ext
}

const isComponentNode = node =>
  node.internal.mediaType === `application/javascript` ||
  node.internal.mediaType === `text/jsx`

const isComponent = Comp =>
  Comp && Comp['$$typeof'] && typeof Comp === 'object' && typeof Comp.render === 'function'

// Copied from https://github.com/jxnblk/styled-system
const systemDocs = Comp => {
  if (!Comp) return {}
  if (!isComponent(Comp)) return {}

  const metadata = Object.assign({}, Comp)
  metadata.propTypes = getPropTypes(Comp.propTypes)
  metadata.extensions = getExtensions(Comp)
  metadata.tagName = getTagName(metadata.extensions)
  return metadata
}

exports.onCreateNode = async ({
  node,
  loadNodeContent,
  actions,
  createNodeId
}, {
  components
}) => {
  const { createNode, createParentChildLink } = actions

  if (!isComponentNode(node)) {
    return
  }

  const Component = components[node.name]
  if (!isComponent(Component)) {
    return
  }

  const name = Component.displayName || node.name

  const content = await loadNodeContent(node)
  const metadata = systemDocs(Component)
  const { tagName, propTypes, defaultProps } = metadata
  
  const nodeId = `${node.id}--${name}--StyledSystem`
  const contentDigest = digest(content)
  const css = metadata.componentStyle
    ? metadata.componentStyle.rules.filter(s => typeof s === 'string').join('')
    : ''

  let styledSystemNode = {
    name,
    tagName,
    propTypes,
    defaultProps,
    css,
    src: content,
    id: createNodeId(nodeId),
    children: [],
    parent: node.id,
    internal: {
      contentDigest,
      type: 'StyledSystem',
    },
  }

  createParentChildLink({ parent: node, child: styledSystemNode })
  createNode(styledSystemNode)
}

exports.setFieldsOnGraphQLNodeType = ({ type }) => {
  if (type.name !== 'StyledSystem') {
    return
  }

  return {
    name: { type: GraphQLString },
    tagName: { type: GraphQLString },
    css: { type: GraphQLString },
    propTypes: { type: GraphQLJSON },
    defaultProps: { type: GraphQLJSON },
    src: { type: GraphQLString }
  }
}
