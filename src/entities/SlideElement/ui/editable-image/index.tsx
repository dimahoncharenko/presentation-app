import Image, { ImageProps } from 'next/image'

import { cn } from '@/shared/lib/cn-merge'
import { useImageAttributes } from '../../lib/useImageAttributes'
import {
  parseFiltersAttributeToClassname,
  parseFramesAttributeToClassname,
} from '../../lib/utils'
import { ImageContextMenu } from './context-menu'

type Props = ImageProps

export const EditableImage = ({ id, ...props }: Props) => {
  const [
    attributes,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _,
    {
      toggleFilterAttribute,
      toggleFrameAttribute,
      clearFiltersAttribute,
      clearFramesAttribute,
    },
  ] = useImageAttributes()

  return (
    <ImageContextMenu
      changeFilter={toggleFilterAttribute}
      changeFrame={toggleFrameAttribute}
      clearFrames={clearFramesAttribute}
      clearFilters={clearFiltersAttribute}
      elementId={`${id}`}
    >
      <Image
        {...props}
        className={cn(
          '!m-0 !max-h-full !max-w-full select-none',
          parseFramesAttributeToClassname(attributes.frames),
          parseFiltersAttributeToClassname(attributes.filters),
          props.className,
        )}
        fill
      />
    </ImageContextMenu>
  )
}
