import { Text } from '@chakra-ui/react'
import {
  Block,
  StartBlock,
  BubbleBlockType,
  InputBlockType,
  LogicBlockType,
  IntegrationBlockType,
  BlockIndices,
} from 'models'
import { ItemNodesList } from '../../ItemNode'
import { TextBubbleContent } from '@/features/blocks/bubbles/textBubble'
import { ImageBubbleContent } from '@/features/blocks/bubbles/image'
import { VideoBubbleContent } from '@/features/blocks/bubbles/video'
import { EmbedBubbleContent } from '@/features/blocks/bubbles/embed'
import { TextInputNodeContent } from '@/features/blocks/inputs/textInput'
import { NumberNodeContent } from '@/features/blocks/inputs/number'
import { EmailInputNodeContent } from '@/features/blocks/inputs/emailInput'
import { UrlNodeContent } from '@/features/blocks/inputs/url'
import { PhoneNodeContent } from '@/features/blocks/inputs/phone'
import { DateNodeContent } from '@/features/blocks/inputs/date'
import { SetVariableContent } from '@/features/blocks/logic/setVariable'
import { WebhookContent } from '@/features/blocks/integrations/webhook'
import { ChatwootBlockNodeLabel } from '@/features/blocks/integrations/chatwoot'
import { RedirectNodeContent } from '@/features/blocks/logic/redirect'
import { CodeNodeContent } from '@/features/blocks/logic/code'
import { PabblyConnectNodeContent } from '@/features/blocks/integrations/pabbly'
import { WithVariableContent } from './WithVariableContent'
import { PaymentInputContent } from '@/features/blocks/inputs/payment'
import { RatingInputContent } from '@/features/blocks/inputs/rating'
import { FileInputContent } from '@/features/blocks/inputs/fileUpload'
import { TypebotLinkContent } from '@/features/blocks/logic/typebotLink'
import { GoogleSheetsNodeContent } from '@/features/blocks/integrations/googleSheets'
import { GoogleAnalyticsNodeContent } from '@/features/blocks/integrations/googleAnalytics/components/GoogleAnalyticsNodeContent'
import { ZapierContent } from '@/features/blocks/integrations/zapier'
import { SendEmailContent } from '@/features/blocks/integrations/sendEmail'
import { isInputBlock, isChoiceInput, blockHasItems } from 'utils'
import { MakeComNodeContent } from '@/features/blocks/integrations/makeCom'

type Props = {
  block: Block | StartBlock
  indices: BlockIndices
}
export const BlockNodeContent = ({ block, indices }: Props): JSX.Element => {
  if (blockHasItems(block))
    return <ItemNodesList block={block} indices={indices} />

  if (
    isInputBlock(block) &&
    !isChoiceInput(block) &&
    block.options.variableId
  ) {
    return <WithVariableContent block={block} />
  }

  switch (block.type) {
    case BubbleBlockType.TEXT: {
      return <TextBubbleContent block={block} />
    }
    case BubbleBlockType.IMAGE: {
      return <ImageBubbleContent block={block} />
    }
    case BubbleBlockType.VIDEO: {
      return <VideoBubbleContent block={block} />
    }
    case BubbleBlockType.EMBED: {
      return <EmbedBubbleContent block={block} />
    }
    case InputBlockType.TEXT: {
      return (
        <TextInputNodeContent
          placeholder={block.options.labels.placeholder}
          isLong={block.options.isLong}
        />
      )
    }
    case InputBlockType.NUMBER: {
      return (
        <NumberNodeContent placeholder={block.options.labels.placeholder} />
      )
    }
    case InputBlockType.EMAIL: {
      return (
        <EmailInputNodeContent placeholder={block.options.labels.placeholder} />
      )
    }
    case InputBlockType.URL: {
      return <UrlNodeContent placeholder={block.options.labels.placeholder} />
    }
    case InputBlockType.PHONE: {
      return <PhoneNodeContent placeholder={block.options.labels.placeholder} />
    }
    case InputBlockType.DATE: {
      return <DateNodeContent />
    }
    case InputBlockType.PAYMENT: {
      return <PaymentInputContent block={block} />
    }
    case InputBlockType.RATING: {
      return <RatingInputContent block={block} />
    }
    case InputBlockType.FILE: {
      return <FileInputContent options={block.options} />
    }
    case LogicBlockType.SET_VARIABLE: {
      return <SetVariableContent block={block} />
    }
    case LogicBlockType.REDIRECT: {
      return <RedirectNodeContent url={block.options.url} />
    }
    case LogicBlockType.CODE: {
      return (
        <CodeNodeContent
          name={block.options.name}
          content={block.options.content}
        />
      )
    }
    case LogicBlockType.TYPEBOT_LINK:
      return <TypebotLinkContent block={block} />

    case IntegrationBlockType.GOOGLE_SHEETS: {
      return (
        <GoogleSheetsNodeContent
          action={'action' in block.options ? block.options.action : undefined}
        />
      )
    }
    case IntegrationBlockType.GOOGLE_ANALYTICS: {
      return (
        <GoogleAnalyticsNodeContent
          action={
            block.options?.action
              ? `Track "${block.options?.action}" `
              : undefined
          }
        />
      )
    }
    case IntegrationBlockType.WEBHOOK: {
      return <WebhookContent block={block} />
    }
    case IntegrationBlockType.ZAPIER: {
      return <ZapierContent block={block} />
    }
    case IntegrationBlockType.PABBLY_CONNECT: {
      return <PabblyConnectNodeContent block={block} />
    }
    case IntegrationBlockType.MAKE_COM: {
      return <MakeComNodeContent block={block} />
    }
    case IntegrationBlockType.EMAIL: {
      return <SendEmailContent block={block} />
    }
    case IntegrationBlockType.CHATWOOT: {
      return <ChatwootBlockNodeLabel block={block} />
    }
    case 'start': {
      return <Text>Start</Text>
    }
  }
}
