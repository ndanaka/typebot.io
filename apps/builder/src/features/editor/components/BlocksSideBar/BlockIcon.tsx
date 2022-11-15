import { IconProps } from '@chakra-ui/react'
import {
  BubbleBlockType,
  InputBlockType,
  IntegrationBlockType,
  LogicBlockType,
  BlockType,
} from 'models'
import React from 'react'
import { TextBubbleIcon } from '@/features/blocks/bubbles/textBubble'
import { ImageBubbleIcon } from '@/features/blocks/bubbles/image'
import { VideoBubbleIcon } from '@/features/blocks/bubbles/video'
import { ChatwootLogo } from '@/features/blocks/integrations/chatwoot'
import { FlagIcon } from '@/components/icons'
import { SendEmailIcon } from '@/features/blocks/integrations/sendEmail'
import { PabblyConnectLogo } from '@/features/blocks/integrations/pabbly'
import { MakeComLogo } from '@/features/blocks/integrations/makeCom'
import { ZapierLogo } from '@/features/blocks/integrations/zapier'
import { WebhookIcon } from '@/features/blocks/integrations/webhook'
import { GoogleSheetsLogo } from '@/features/blocks/integrations/googleSheets'
import { TypebotLinkIcon } from '@/features/blocks/logic/typebotLink'
import { CodeIcon } from '@/features/blocks/logic/code'
import { RedirectIcon } from '@/features/blocks/logic/redirect'
import { ConditionIcon } from '@/features/blocks/logic/condition'
import { SetVariableIcon } from '@/features/blocks/logic/setVariable'
import { FileInputIcon } from '@/features/blocks/inputs/fileUpload'
import { RatingInputIcon } from '@/features/blocks/inputs/rating'
import { PaymentInputIcon } from '@/features/blocks/inputs/payment'
import { ButtonsInputIcon } from '@/features/blocks/inputs/buttons'
import { PhoneInputIcon } from '@/features/blocks/inputs/phone'
import { DateInputIcon } from '@/features/blocks/inputs/date'
import { UrlInputIcon } from '@/features/blocks/inputs/url'
import { EmailInputIcon } from '@/features/blocks/inputs/emailInput'
import { NumberInputIcon } from '@/features/blocks/inputs/number'
import { TextInputIcon } from '@/features/blocks/inputs/textInput'
import { EmbedBubbleIcon } from '@/features/blocks/bubbles/embed'
import { GoogleAnalyticsLogo } from '@/features/blocks/integrations/googleAnalytics'

type BlockIconProps = { type: BlockType } & IconProps

export const BlockIcon = ({ type, ...props }: BlockIconProps) => {
  switch (type) {
    case BubbleBlockType.TEXT:
      return <TextBubbleIcon {...props} />
    case BubbleBlockType.IMAGE:
      return <ImageBubbleIcon {...props} />
    case BubbleBlockType.VIDEO:
      return <VideoBubbleIcon {...props} />
    case BubbleBlockType.EMBED:
      return <EmbedBubbleIcon color="blue.500" {...props} />
    case InputBlockType.TEXT:
      return <TextInputIcon color="orange.500" {...props} />
    case InputBlockType.NUMBER:
      return <NumberInputIcon color="orange.500" {...props} />
    case InputBlockType.EMAIL:
      return <EmailInputIcon color="orange.500" {...props} />
    case InputBlockType.URL:
      return <UrlInputIcon color="orange.500" {...props} />
    case InputBlockType.DATE:
      return <DateInputIcon color="orange.500" {...props} />
    case InputBlockType.PHONE:
      return <PhoneInputIcon color="orange.500" {...props} />
    case InputBlockType.CHOICE:
      return <ButtonsInputIcon color="orange.500" {...props} />
    case InputBlockType.PAYMENT:
      return <PaymentInputIcon color="orange.500" {...props} />
    case InputBlockType.RATING:
      return <RatingInputIcon color="orange.500" {...props} />
    case InputBlockType.FILE:
      return <FileInputIcon color="orange.500" {...props} />
    case LogicBlockType.SET_VARIABLE:
      return <SetVariableIcon color="purple.500" {...props} />
    case LogicBlockType.CONDITION:
      return <ConditionIcon color="purple.500" {...props} />
    case LogicBlockType.REDIRECT:
      return <RedirectIcon color="purple.500" {...props} />
    case LogicBlockType.CODE:
      return <CodeIcon color="purple.500" {...props} />
    case LogicBlockType.TYPEBOT_LINK:
      return <TypebotLinkIcon color="purple.500" {...props} />
    case IntegrationBlockType.GOOGLE_SHEETS:
      return <GoogleSheetsLogo {...props} />
    case IntegrationBlockType.GOOGLE_ANALYTICS:
      return <GoogleAnalyticsLogo {...props} />
    case IntegrationBlockType.WEBHOOK:
      return <WebhookIcon {...props} />
    case IntegrationBlockType.ZAPIER:
      return <ZapierLogo {...props} />
    case IntegrationBlockType.MAKE_COM:
      return <MakeComLogo {...props} />
    case IntegrationBlockType.PABBLY_CONNECT:
      return <PabblyConnectLogo {...props} />
    case IntegrationBlockType.EMAIL:
      return <SendEmailIcon {...props} />
    case IntegrationBlockType.CHATWOOT:
      return <ChatwootLogo {...props} />
    case 'start':
      return <FlagIcon {...props} />
  }
}
