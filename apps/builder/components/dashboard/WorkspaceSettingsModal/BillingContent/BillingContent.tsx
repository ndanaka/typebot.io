import { HStack, Stack, Text } from '@chakra-ui/react'
import { StripeClimateLogo } from 'assets/logos/StripeClimateLogo'
import { NextChakraLink } from 'components/nextChakra/NextChakraLink'
import { ChangePlanForm } from 'components/shared/ChangePlanForm'
import { useWorkspace } from 'contexts/WorkspaceContext'
import { Plan } from 'db'
import React from 'react'
import { CurrentSubscriptionContent } from './CurrentSubscriptionContent'
import { InvoicesList } from './InvoicesList'
import { UsageContent } from './UsageContent/UsageContent'

export const BillingContent = () => {
  const { workspace, refreshWorkspace } = useWorkspace()

  if (!workspace) return null
  return (
    <Stack spacing="10" w="full">
      <UsageContent workspace={workspace} />
      <Stack gap="2">
        <CurrentSubscriptionContent
          plan={workspace.plan}
          stripeId={workspace.stripeId}
          onCancelSuccess={() =>
            refreshWorkspace({
              plan: Plan.FREE,
              additionalChatsIndex: 0,
              additionalStorageIndex: 0,
            })
          }
        />
        <HStack maxW="500px">
          <StripeClimateLogo />
          <Text fontSize="xs" color="gray.500">
            Typebot is contributing 1% of your subscription to remove CO₂ from
            the atmosphere.{' '}
            <NextChakraLink
              href="https://climate.stripe.com/5VCRAq"
              isExternal
              textDecor="underline"
            >
              More info.
            </NextChakraLink>
          </Text>
        </HStack>
        {workspace.plan !== Plan.CUSTOM &&
          workspace.plan !== Plan.LIFETIME &&
          workspace.plan !== Plan.OFFERED && <ChangePlanForm />}
      </Stack>

      {workspace.stripeId && <InvoicesList workspace={workspace} />}
    </Stack>
  )
}
