import {
  Flex,
  HStack,
  Popover,
  PopoverTrigger,
  useColorModeValue,
  useDisclosure,
  useEventListener,
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import {
  BubbleBlock,
  BubbleBlockContent,
  DraggableBlock,
  Block,
  BlockWithOptions,
  TextBubbleContent,
  TextBubbleBlock,
  LogicBlockType,
} from 'models'
import { isBubbleBlock, isTextBubbleBlock } from 'utils'
import { BlockNodeContent } from './BlockNodeContent/BlockNodeContent'
import { BlockIcon, useTypebot } from '@/features/editor'
import { SettingsPopoverContent } from './SettingsPopoverContent'
import { BlockNodeContextMenu } from './BlockNodeContextMenu'
import { SourceEndpoint } from '../../Endpoints/SourceEndpoint'
import { useRouter } from 'next/router'
import { SettingsModal } from './SettingsPopoverContent/SettingsModal'
import { BlockSettings } from './SettingsPopoverContent/SettingsPopoverContent'
import { TargetEndpoint } from '../../Endpoints'
import { MediaBubblePopoverContent } from './MediaBubblePopoverContent'
import { ContextMenu } from '@/components/ContextMenu'
import { setMultipleRefs } from '@/utils/helpers'
import { TextBubbleEditor } from '@/features/blocks/bubbles/textBubble'
import {
  NodePosition,
  useGraph,
  useBlockDnd,
  useDragDistance,
  ParentModalProvider,
} from '../../../providers'
import { hasDefaultConnector } from '../../../utils'

export const BlockNode = ({
  block,
  isConnectable,
  indices,
  onMouseDown,
}: {
  block: Block
  isConnectable: boolean
  indices: { blockIndex: number; groupIndex: number }
  onMouseDown?: (blockNodePosition: NodePosition, block: DraggableBlock) => void
}) => {
  const bg = useColorModeValue('gray.50', 'gray.850')
  const previewingBorderColor = useColorModeValue('blue.400', 'blue.300')
  const borderColor = useColorModeValue('gray.200', 'gray.800')
  const { query } = useRouter()
  const {
    setConnectingIds,
    connectingIds,
    openedBlockId,
    setOpenedBlockId,
    setFocusedGroupId,
    previewingEdge,
    isReadOnly,
    previewingBlock,
  } = useGraph()
  const { mouseOverBlock, setMouseOverBlock } = useBlockDnd()
  const { typebot, updateBlock } = useTypebot()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isPopoverOpened, setIsPopoverOpened] = useState(
    openedBlockId === block.id
  )
  const [isEditing, setIsEditing] = useState<boolean>(
    isTextBubbleBlock(block) && block.content.plainText === ''
  )
  const blockRef = useRef<HTMLDivElement | null>(null)

  const isPreviewing =
    isConnecting ||
    previewingEdge?.to.blockId === block.id ||
    previewingBlock?.id === block.id

  const onDrag = (position: NodePosition) => {
    if (block.type === 'start' || !onMouseDown) return
    onMouseDown(position, block)
  }
  useDragDistance({
    ref: blockRef,
    onDrag,
    isDisabled: !onMouseDown || block.type === 'start',
  })

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure()

  useEffect(() => {
    if (query.blockId?.toString() === block.id) setOpenedBlockId(block.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    setIsConnecting(
      connectingIds?.target?.groupId === block.groupId &&
        connectingIds?.target?.blockId === block.id
    )
  }, [connectingIds, block.groupId, block.id])

  const handleModalClose = () => {
    updateBlock(indices, { ...block })
    onModalClose()
  }

  const handleMouseEnter = () => {
    if (isReadOnly) return
    if (mouseOverBlock?.id !== block.id)
      setMouseOverBlock({ id: block.id, ref: blockRef })
    if (connectingIds)
      setConnectingIds({
        ...connectingIds,
        target: { groupId: block.groupId, blockId: block.id },
      })
  }

  const handleMouseLeave = () => {
    if (mouseOverBlock) setMouseOverBlock(undefined)
    if (connectingIds?.target)
      setConnectingIds({
        ...connectingIds,
        target: { ...connectingIds.target, blockId: undefined },
      })
  }

  const handleCloseEditor = (content: TextBubbleContent) => {
    const updatedBlock = { ...block, content } as Block
    updateBlock(indices, updatedBlock)
    setIsEditing(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    setFocusedGroupId(block.groupId)
    e.stopPropagation()
    if (isTextBubbleBlock(block)) setIsEditing(true)
    setOpenedBlockId(block.id)
  }

  const handleExpandClick = () => {
    setOpenedBlockId(undefined)
    onModalOpen()
  }

  const handleBlockUpdate = (updates: Partial<Block>) =>
    updateBlock(indices, { ...block, ...updates })

  const handleContentChange = (content: BubbleBlockContent) =>
    updateBlock(indices, { ...block, content } as Block)

  useEffect(() => {
    setIsPopoverOpened(openedBlockId === block.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedBlockId])

  useEventListener('pointerdown', (e) => e.stopPropagation(), blockRef.current)

  return isEditing && isTextBubbleBlock(block) ? (
    <TextBubbleEditor
      id={block.id}
      initialValue={block.content.richText}
      onClose={handleCloseEditor}
    />
  ) : (
    <ContextMenu<HTMLDivElement>
      renderMenu={() => <BlockNodeContextMenu indices={indices} />}
    >
      {(ref, isContextMenuOpened) => (
        <Popover
          placement="left"
          isLazy
          isOpen={isPopoverOpened}
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <Flex
              pos="relative"
              ref={setMultipleRefs([ref, blockRef])}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              data-testid={`block`}
              w="full"
            >
              <HStack
                flex="1"
                userSelect="none"
                p="3"
                borderWidth={
                  isContextMenuOpened || isPreviewing ? '2px' : '1px'
                }
                borderColor={
                  isContextMenuOpened || isPreviewing
                    ? previewingBorderColor
                    : borderColor
                }
                margin={isContextMenuOpened || isPreviewing ? '-1px' : 0}
                rounded="lg"
                cursor={'pointer'}
                bg={bg}
                align="flex-start"
                w="full"
                transition="border-color 0.2s"
              >
                <BlockIcon
                  type={block.type}
                  mt="1"
                  data-testid={`${block.id}-icon`}
                />
                <BlockNodeContent block={block} indices={indices} />
                <TargetEndpoint
                  pos="absolute"
                  left="-34px"
                  top="16px"
                  blockId={block.id}
                />
                {isConnectable && hasDefaultConnector(block) && (
                  <SourceEndpoint
                    source={{
                      groupId: block.groupId,
                      blockId: block.id,
                    }}
                    pos="absolute"
                    right="-34px"
                    bottom="10px"
                  />
                )}
              </HStack>
            </Flex>
          </PopoverTrigger>
          {hasSettingsPopover(block) && (
            <>
              <SettingsPopoverContent
                block={block}
                onExpandClick={handleExpandClick}
                onBlockChange={handleBlockUpdate}
              />
              <ParentModalProvider>
                <SettingsModal isOpen={isModalOpen} onClose={handleModalClose}>
                  <BlockSettings
                    block={block}
                    onBlockChange={handleBlockUpdate}
                  />
                </SettingsModal>
              </ParentModalProvider>
            </>
          )}
          {typebot && isMediaBubbleBlock(block) && (
            <MediaBubblePopoverContent
              typebotId={typebot.id}
              block={block}
              onContentChange={handleContentChange}
            />
          )}
        </Popover>
      )}
    </ContextMenu>
  )
}

const hasSettingsPopover = (block: Block): block is BlockWithOptions =>
  !isBubbleBlock(block) && block.type !== LogicBlockType.CONDITION

const isMediaBubbleBlock = (
  block: Block
): block is Exclude<BubbleBlock, TextBubbleBlock> =>
  isBubbleBlock(block) && !isTextBubbleBlock(block)
