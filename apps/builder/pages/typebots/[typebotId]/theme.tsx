import { Flex } from '@chakra-ui/layout'
import { Seo } from 'components/Seo'
import { TypebotHeader } from 'components/shared/TypebotHeader'
import { ThemeContent } from 'components/theme/ThemeContent'
import React from 'react'

const ThemePage = () => (
  <Flex overflow="hidden" h="100vh" flexDir="column">
    <Seo title="Theme" />
    <TypebotHeader />
    <ThemeContent />
  </Flex>
)

export default ThemePage
