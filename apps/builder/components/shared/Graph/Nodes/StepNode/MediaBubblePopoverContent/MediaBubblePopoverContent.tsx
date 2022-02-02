import {
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from '@chakra-ui/react'
import { ImageUploadContent } from 'components/shared/ImageUploadContent'
import {
  BubbleStep,
  BubbleStepContent,
  BubbleStepType,
  TextBubbleStep,
} from 'models'
import { useRef } from 'react'
import { VideoUploadContent } from './VideoUploadContent'

type Props = {
  step: Exclude<BubbleStep, TextBubbleStep>
  onContentChange: (content: BubbleStepContent) => void
}

export const MediaBubblePopoverContent = (props: Props) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const handleMouseDown = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <Portal>
      <PopoverContent onMouseDown={handleMouseDown} w="500px">
        <PopoverArrow />
        <PopoverBody ref={ref} shadow="lg">
          <MediaBubbleContent {...props} />
        </PopoverBody>
      </PopoverContent>
    </Portal>
  )
}

export const MediaBubbleContent = ({ step, onContentChange }: Props) => {
  const handleImageUrlChange = (url: string) => onContentChange({ url })

  switch (step.type) {
    case BubbleStepType.IMAGE: {
      return (
        <ImageUploadContent
          url={step.content?.url}
          onSubmit={handleImageUrlChange}
        />
      )
    }
    case BubbleStepType.VIDEO: {
      return (
        <VideoUploadContent content={step.content} onSubmit={onContentChange} />
      )
    }
  }
}
