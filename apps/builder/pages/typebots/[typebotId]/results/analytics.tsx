import { Flex } from '@chakra-ui/layout'
import { ResultsContent } from 'layouts/results/ResultsContent'
import { Seo } from 'components/Seo'
import { TypebotHeader } from 'components/shared/TypebotHeader'
import React from 'react'

const AnalyticsPage = () => (
  <Flex overflow="hidden" h="100vh" flexDir="column">
    <Seo title="Analytics" />
    <TypebotHeader />
    <ResultsContent />
  </Flex>
)

export default AnalyticsPage
