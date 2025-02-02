import Image, { ImageProps } from 'next/image'

import { cn } from '@/shared/lib/cn-merge'
import { ImageContextMenu } from './context-menu'

type Props = ImageProps

export const EditableImage = (props: Props) => {
  return (
    <ImageContextMenu>
      <Image
        {...props}
        className={cn(
          '!m-0 !max-h-full !max-w-full select-none',
          props.className,
        )}
        fill
      />
    </ImageContextMenu>
  )
}
