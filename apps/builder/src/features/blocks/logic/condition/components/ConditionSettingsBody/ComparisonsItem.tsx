import { Stack } from '@chakra-ui/react'
import { DropdownList } from '@/components/DropdownList'
import { Comparison, Variable, ComparisonOperators } from 'models'
import { TableListItemProps } from '@/components/TableList'
import { VariableSearchInput } from '@/components/VariableSearchInput'
import { Input } from '@/components/inputs'

export const ComparisonItem = ({
  item,
  onItemChange,
}: TableListItemProps<Comparison>) => {
  const handleSelectVariable = (variable?: Variable) => {
    if (variable?.id === item.variableId) return
    onItemChange({ ...item, variableId: variable?.id })
  }

  const handleSelectComparisonOperator = (
    comparisonOperator: ComparisonOperators
  ) => {
    if (comparisonOperator === item.comparisonOperator) return
    onItemChange({ ...item, comparisonOperator })
  }
  const handleChangeValue = (value: string) => {
    if (value === item.value) return
    onItemChange({ ...item, value })
  }

  return (
    <Stack p="4" rounded="md" flex="1" borderWidth="1px">
      <VariableSearchInput
        initialVariableId={item.variableId}
        onSelectVariable={handleSelectVariable}
        placeholder="Search for a variable"
      />
      <DropdownList<ComparisonOperators>
        currentItem={item.comparisonOperator}
        onItemSelect={handleSelectComparisonOperator}
        items={Object.values(ComparisonOperators)}
        placeholder="Select an operator"
      />
      {item.comparisonOperator !== ComparisonOperators.IS_SET && (
        <Input
          defaultValue={item.value ?? ''}
          onChange={handleChangeValue}
          placeholder="Type a value..."
        />
      )}
    </Stack>
  )
}
