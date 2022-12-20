import {
  Editable,
  EditablePreview,
  EditableInput,
  Tooltip,
} from '@chakra-ui/react'
import React, { useState } from 'react'

type EditableProps = {
  defaultName: string
  onNewName: (newName: string) => void
}
export const EditableTypebotName = ({
  defaultName,
  onNewName,
}: EditableProps) => {
  const [currentName, setCurrentName] = useState(defaultName)

  const submitNewName = (newName: string) => {
    if (newName === '') return setCurrentName(defaultName)
    if (newName === defaultName) return
    onNewName(newName)
  }

  return (
    <Tooltip label="Rename">
      <Editable
        value={currentName}
        onChange={setCurrentName}
        onSubmit={submitNewName}
      >
        <EditablePreview
          noOfLines={2}
          cursor="pointer"
          maxW="150px"
          overflow="hidden"
          display="flex"
          alignItems="center"
          fontSize="14px"
          minW="30px"
          minH="20px"
          bgColor={currentName === '' ? 'gray.100' : 'inherit'}
        />
        <EditableInput fontSize="14px" />
      </Editable>
    </Tooltip>
  )
}
