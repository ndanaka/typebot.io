import { Typebot } from 'models'

export type TypebotInDashboard = Pick<
  Typebot,
  'id' | 'name' | 'publishedTypebotId' | 'icon'
>
