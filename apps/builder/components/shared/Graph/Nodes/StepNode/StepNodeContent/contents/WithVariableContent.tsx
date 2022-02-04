import { InputStep } from 'models'
import { chakra, Text } from '@chakra-ui/react'
import React from 'react'
import { useTypebot } from 'contexts/TypebotContext'
import { byId } from 'utils'

type Props = {
  step: InputStep
}

export const WithVariableContent = ({ step }: Props) => {
  const { typebot } = useTypebot()
  const variableName = typebot?.variables.find(
    byId(step.options.variableId)
  )?.name

  return (
    <Text>
      Collect{' '}
      <chakra.span
        bgColor="orange.400"
        color="white"
        rounded="md"
        py="0.5"
        px="1"
      >
        {variableName}
      </chakra.span>
    </Text>
  )
}
