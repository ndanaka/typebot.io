import React from 'react'
import { Text } from '@chakra-ui/react'
import { RedirectOptions } from 'models'

type Props = { url: RedirectOptions['url'] }

export const RedirectNodeContent = ({ url }: Props) => (
  <Text color={url ? 'currentcolor' : 'gray.500'} noOfLines={1}>
    {url ? `Redirect to ${url}` : 'Configure...'}
  </Text>
)
