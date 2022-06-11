import { Flex, useDisclosure } from '@chakra-ui/react'
import { StatsCards } from 'components/analytics/StatsCards'
import { Graph } from 'components/shared/Graph'
import { useToast } from 'components/shared/hooks/useToast'
import { UpgradeModal } from 'components/shared/modals/UpgradeModal'
import { GraphProvider } from 'contexts/GraphContext'
import { useTypebot } from 'contexts/TypebotContext/TypebotContext'
import { Stats } from 'models'
import React from 'react'
import { useAnswersCount } from 'services/analytics'

export const AnalyticsContent = ({ stats }: { stats?: Stats }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { typebot, publishedTypebot } = useTypebot()
  const { showToast } = useToast()
  const { answersCounts } = useAnswersCount({
    typebotId: publishedTypebot && typebot?.id,
    onError: (err) => showToast({ title: err.name, description: err.message }),
  })
  return (
    <Flex
      w="full"
      pos="relative"
      bgColor="gray.50"
      h="full"
      justifyContent="center"
    >
      {publishedTypebot && answersCounts && stats && (
        <GraphProvider groups={publishedTypebot?.groups ?? []} isReadOnly>
          <Graph
            flex="1"
            typebot={publishedTypebot}
            onUnlockProPlanClick={onOpen}
            answersCounts={[
              { ...answersCounts[0], totalAnswers: stats?.totalStarts },
              ...answersCounts?.slice(1),
            ]}
          />
        </GraphProvider>
      )}
      <UpgradeModal onClose={onClose} isOpen={isOpen} />
      <StatsCards stats={stats} pos="absolute" top={10} />
    </Flex>
  )
}
