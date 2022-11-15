import { parseVariables } from '@/features/variables'
import { EdgeId, LogicState } from '@/types'
import {
  Comparison,
  ComparisonOperators,
  ConditionBlock,
  LogicalOperator,
  Variable,
} from 'models'
import { isNotDefined, isDefined } from 'utils'

export const executeCondition = (
  block: ConditionBlock,
  { typebot: { variables } }: LogicState
): EdgeId | undefined => {
  const { content } = block.items[0]
  const isConditionPassed =
    content.logicalOperator === LogicalOperator.AND
      ? content.comparisons.every(executeComparison(variables))
      : content.comparisons.some(executeComparison(variables))
  return isConditionPassed
    ? block.items[0].outgoingEdgeId
    : block.outgoingEdgeId
}

const executeComparison =
  (variables: Variable[]) => (comparison: Comparison) => {
    if (!comparison?.variableId) return false
    const inputValue = (
      variables.find((v) => v.id === comparison.variableId)?.value ?? ''
    ).trim()
    const value = parseVariables(variables)(comparison.value).trim()
    if (isNotDefined(value)) return false
    switch (comparison.comparisonOperator) {
      case ComparisonOperators.CONTAINS: {
        return inputValue.toLowerCase().includes(value.toLowerCase())
      }
      case ComparisonOperators.EQUAL: {
        return inputValue === value
      }
      case ComparisonOperators.NOT_EQUAL: {
        return inputValue !== value
      }
      case ComparisonOperators.GREATER: {
        return parseFloat(inputValue) > parseFloat(value)
      }
      case ComparisonOperators.LESS: {
        return parseFloat(inputValue) < parseFloat(value)
      }
      case ComparisonOperators.IS_SET: {
        return isDefined(inputValue) && inputValue.length > 0
      }
    }
  }
