import {
  ItemIndices,
  Item,
  InputStepType,
  StepWithItems,
  ButtonItem,
} from 'models'
import { SetTypebot } from '../TypebotContext'
import produce from 'immer'
import { cleanUpEdgeDraft } from './edges'
import { byId, stepHasItems } from 'utils'
import cuid from 'cuid'

export type ItemsActions = {
  createItem: (
    item: ButtonItem | Omit<ButtonItem, 'id'>,
    indices: ItemIndices
  ) => void
  updateItem: (indices: ItemIndices, updates: Partial<Omit<Item, 'id'>>) => void
  detachItemFromStep: (indices: ItemIndices) => void
  deleteItem: (indices: ItemIndices) => void
}

const itemsAction = (setTypebot: SetTypebot): ItemsActions => ({
  createItem: (
    item: ButtonItem | Omit<ButtonItem, 'id'>,
    { blockIndex, stepIndex, itemIndex }: ItemIndices
  ) =>
    setTypebot((typebot) =>
      produce(typebot, (typebot) => {
        const step = typebot.blocks[blockIndex].steps[stepIndex]
        if (step.type !== InputStepType.CHOICE) return
        const newItem = {
          ...item,
          stepId: step.id,
          id: 'id' in item ? item.id : cuid(),
        }
        if (item.outgoingEdgeId) {
          const edgeIndex = typebot.edges.findIndex(byId(item.outgoingEdgeId))
          edgeIndex !== -1
            ? (typebot.edges[edgeIndex].from = {
                blockId: step.blockId,
                stepId: step.id,
                itemId: newItem.id,
              })
            : (newItem.outgoingEdgeId = undefined)
        }
        step.items.splice(itemIndex, 0, newItem)
      })
    ),
  updateItem: (
    { blockIndex, stepIndex, itemIndex }: ItemIndices,
    updates: Partial<Omit<Item, 'id'>>
  ) =>
    setTypebot((typebot) =>
      produce(typebot, (typebot) => {
        const step = typebot.blocks[blockIndex].steps[stepIndex]
        if (!stepHasItems(step)) return
        ;(typebot.blocks[blockIndex].steps[stepIndex] as StepWithItems).items[
          itemIndex
        ] = {
          ...step.items[itemIndex],
          ...updates,
        } as Item
      })
    ),
  detachItemFromStep: ({ blockIndex, stepIndex, itemIndex }: ItemIndices) =>
    setTypebot((typebot) =>
      produce(typebot, (typebot) => {
        const step = typebot.blocks[blockIndex].steps[
          stepIndex
        ] as StepWithItems
        step.items.splice(itemIndex, 1)
      })
    ),
  deleteItem: ({ blockIndex, stepIndex, itemIndex }: ItemIndices) =>
    setTypebot((typebot) =>
      produce(typebot, (typebot) => {
        const step = typebot.blocks[blockIndex].steps[
          stepIndex
        ] as StepWithItems
        const removingItem = step.items[itemIndex]
        step.items.splice(itemIndex, 1)
        cleanUpEdgeDraft(typebot, removingItem.id)
      })
    ),
})

export { itemsAction }
