import React from 'react'
import {Code, Container, Heading, Table, Text, Provider} from 'gatsby-ui'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'

import Layout from './Layout'

const DESCRIPTIONS = {
  as: 'Element that the component will render as.',
  alignSelf: 'Aligns flex items of the current flex line overriding the align-items value',
  bg: 'Set background color, pulls from colors in theme',
  borderColor: 'Set border color, pulls from colors in theme',
  boxShadow: 'Set box shadow, pulls from shadows in theme',
  color: 'Set text color, pulls from colors in theme',
  display: 'Set display for the element',
  flex: 'Set flex attribute',
  order: 'Set flex order',
  textAlign: 'Set text alignment',
  width: 'Set width',
  fontWeight: 'Set font weight',
  fontSize: 'Set font size'
}

const formatDefaultValue = value => value.replace(/^'/, '').replace(/'$/, '')

export default ({
  title,
  metadata,
  docs
}) => {

  if (docs) {
    return (
      <Layout>
        <Container my={[3, 4, 5]} maxWidth="measureWide">
          <MDXRenderer>{docs}</MDXRenderer>
          <Provider>
            <Heading mt={4}>Table of properties</Heading>
            <Table mt={3}>
              <Table.THead>
                <Table.TR>
                  <Table.TH>Prop</Table.TH>
                  <Table.TH>Default</Table.TH>
                  <Table.TH>Description</Table.TH>
                </Table.TR>
              </Table.THead>
              <Table.TBody>
                {metadata.props.map(prop =>
                  <Table.TR key={prop.name}>
                    <Table.TD>{prop.name}</Table.TD>
                    <Table.TD>
                      <Code bg="white">
                        {prop.defaultValue ? formatDefaultValue(prop.defaultValue.value) : 'None'}
                      </Code>
                    </Table.TD>
                    <Table.TD>
                      <Text as="span" color="grays.8" fontSize={1}>
                        <i>{prop.description || DESCRIPTIONS[prop.name] || 'None'}</i>
                      </Text>
                    </Table.TD>
                  </Table.TR>
                )}
              </Table.TBody>
            </Table>
          </Provider>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <Heading as="h1" fontSize={8}>{title}</Heading>
      <table>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {metadata.props.map(prop =>
            <tr key={prop.name}>
              <td>{prop.name}</td>
              <td>{prop.defaultValue ? prop.defaultValue.value : 'None'}</td>
              <td>{prop.description ? prop.description.text : ''}</td>
            </tr>
          )}
        </tbody>
      </table>
    </Layout>
  )
}