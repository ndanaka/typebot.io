import { Block, Edge, Settings, Theme, Variable } from './typebot'
import { PublicTypebot as PublicTypebotFromPrisma } from 'db'

export type PublicTypebot = Omit<
  PublicTypebotFromPrisma,
  'blocks' | 'theme' | 'settings' | 'variables' | 'edges'
> & {
  blocks: Block[]
  variables: Variable[]
  edges: Edge[]
  theme: Theme
  settings: Settings
}
