import Image, { ImageProps } from 'next/image'

import { cn } from '@/shared/lib/cn-merge'
import { useImageAttributes } from '../../lib/useImageAttributes'
import { parseFilterProperty, parseImageFrame } from '../../lib/utils'
import { ImageContextMenu } from './context-menu'

type Props = ImageProps

export const EditableImage = ({ id, ...props }: Props) => {
  const [attributes, setAttributes] = useImageAttributes()

  return (
    <ImageContextMenu
      changeFilter={filter => setAttributes(prev => ({ ...prev, filter }))}
      changeFrame={frame => setAttributes(prev => ({ ...prev, frame }))}
      elementId={`${id}`}
    >
      <Image
        {...props}
        className={cn(
          '!m-0 !max-h-full !max-w-full select-none',
          parseImageFrame(attributes.frame),
          parseFilterProperty(attributes.filter),
          props.className,
        )}
        fill
      />
    </ImageContextMenu>
  )
}
