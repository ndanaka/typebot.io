import {
  Flex,
  HStack,
  Popover,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import {
  BubbleStep,
  BubbleStepContent,
  ConditionStep,
  DraggableStep,
  Step,
  StepWithOptions,
  TextBubbleContent,
  TextBubbleStep,
} from 'models'
import { useGraph } from 'contexts/GraphContext'
import { StepIcon } from 'components/editor/StepsSideBar/StepIcon'
import { isBubbleStep, isTextBubbleStep } from 'utils'
import { StepNodeContent } from './StepNodeContent/StepNodeContent'
import { useTypebot } from 'contexts/TypebotContext'
import { ContextMenu } from 'components/shared/ContextMenu'
import { SettingsPopoverContent } from './SettingsPopoverContent'
import { StepNodeContextMenu } from './StepNodeContextMenu'
import { SourceEndpoint } from '../../Endpoints/SourceEndpoint'
import { hasDefaultConnector } from 'services/typebots'
import { useRouter } from 'next/router'
import { SettingsModal } from './SettingsPopoverContent/SettingsModal'
import { StepSettings } from './SettingsPopoverContent/SettingsPopoverContent'
import { TextBubbleEditor } from './TextBubbleEditor'
import { TargetEndpoint } from '../../Endpoints'
import { MediaBubblePopoverContent } from './MediaBubblePopoverContent'
import { NodePosition, useDragDistance } from 'contexts/GraphDndContext'
import { setMultipleRefs } from 'services/utils'

export const StepNode = ({
  step,
  isConnectable,
  indices,
  onMouseDown,
}: {
  step: Step
  isConnectable: boolean
  indices: { stepIndex: number; blockIndex: number }
  onMouseDown?: (stepNodePosition: NodePosition, step: DraggableStep) => void
}) => {
  const { query } = useRouter()
  const {
    setConnectingIds,
    connectingIds,
    openedStepId,
    setOpenedStepId,
    setFocusedBlockId,
    previewingEdge,
  } = useGraph()
  const { updateStep } = useTypebot()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isPopoverOpened, setIsPopoverOpened] = useState(
    openedStepId === step.id
  )
  const [isEditing, setIsEditing] = useState<boolean>(
    isTextBubbleStep(step) && step.content.plainText === ''
  )
  const stepRef = useRef<HTMLDivElement | null>(null)

  const isPreviewing = isConnecting || previewingEdge?.to.stepId === step.id

  const onDrag = (position: NodePosition) => {
    if (step.type === 'start' || !onMouseDown) return
    onMouseDown(position, step)
  }
  useDragDistance({
    ref: stepRef,
    onDrag,
    isDisabled: !onMouseDown || step.type === 'start',
  })

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure()

  useEffect(() => {
    if (query.stepId?.toString() === step.id) setOpenedStepId(step.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    setIsConnecting(
      connectingIds?.target?.blockId === step.blockId &&
        connectingIds?.target?.stepId === step.id
    )
  }, [connectingIds, step.blockId, step.id])

  const handleModalClose = () => {
    updateStep(indices, { ...step })
    onModalClose()
  }

  const handleMouseEnter = () => {
    if (connectingIds)
      setConnectingIds({
        ...connectingIds,
        target: { blockId: step.blockId, stepId: step.id },
      })
  }

  const handleMouseLeave = () => {
    if (connectingIds?.target)
      setConnectingIds({
        ...connectingIds,
        target: { ...connectingIds.target, stepId: undefined },
      })
  }

  const handleCloseEditor = (content: TextBubbleContent) => {
    const updatedStep = { ...step, content } as Step
    updateStep(indices, updatedStep)
    setIsEditing(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    setFocusedBlockId(step.blockId)
    e.stopPropagation()
    if (isTextBubbleStep(step)) setIsEditing(true)
    setOpenedStepId(step.id)
  }

  const handleExpandClick = () => {
    setOpenedStepId(undefined)
    onModalOpen()
  }

  const handleStepUpdate = (updates: Partial<Step>) =>
    updateStep(indices, { ...step, ...updates })

  const handleContentChange = (content: BubbleStepContent) =>
    updateStep(indices, { ...step, content } as Step)

  useEffect(() => {
    setIsPopoverOpened(openedStepId === step.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedStepId])

  return isEditing && isTextBubbleStep(step) ? (
    <TextBubbleEditor
      initialValue={step.content.richText}
      onClose={handleCloseEditor}
    />
  ) : (
    <ContextMenu<HTMLDivElement>
      renderMenu={() => <StepNodeContextMenu indices={indices} />}
    >
      {(ref, isOpened) => (
        <Popover
          placement="left"
          isLazy
          isOpen={isPopoverOpened}
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <Flex
              pos="relative"
              ref={setMultipleRefs([ref, stepRef])}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              data-testid={`step`}
              w="full"
            >
              <HStack
                flex="1"
                userSelect="none"
                p="3"
                borderWidth={isOpened || isPreviewing ? '2px' : '1px'}
                borderColor={isOpened || isPreviewing ? 'blue.400' : 'gray.200'}
                margin={isOpened || isPreviewing ? '-1px' : 0}
                rounded="lg"
                cursor={'pointer'}
                bgColor="gray.50"
                align="flex-start"
                w="full"
                transition="border-color 0.2s"
              >
                <StepIcon
                  type={step.type}
                  mt="1"
                  data-testid={`${step.id}-icon`}
                />
                <StepNodeContent step={step} indices={indices} />
                <TargetEndpoint
                  pos="absolute"
                  left="-32px"
                  top="19px"
                  stepId={step.id}
                />
                {isConnectable && hasDefaultConnector(step) && (
                  <SourceEndpoint
                    source={{
                      blockId: step.blockId,
                      stepId: step.id,
                    }}
                    pos="absolute"
                    right="-34px"
                    bottom="10px"
                  />
                )}
              </HStack>
            </Flex>
          </PopoverTrigger>
          {hasSettingsPopover(step) && (
            <>
              <SettingsPopoverContent
                step={step}
                onExpandClick={handleExpandClick}
                onStepChange={handleStepUpdate}
              />
              <SettingsModal isOpen={isModalOpen} onClose={handleModalClose}>
                <StepSettings step={step} onStepChange={handleStepUpdate} />
              </SettingsModal>
            </>
          )}
          {isMediaBubbleStep(step) && (
            <MediaBubblePopoverContent
              step={step}
              onContentChange={handleContentChange}
            />
          )}
        </Popover>
      )}
    </ContextMenu>
  )
}

const hasSettingsPopover = (
  step: Step
): step is StepWithOptions | ConditionStep => !isBubbleStep(step)

const isMediaBubbleStep = (
  step: Step
): step is Exclude<BubbleStep, TextBubbleStep> =>
  isBubbleStep(step) && !isTextBubbleStep(step)
