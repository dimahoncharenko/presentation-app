import { ReactNode } from 'react'
import Image from 'next/image'
import { HoveredSubMenu } from '@/shared/ui/hovered-sub-menu'

import { Button } from '@/shared/ui/bricks/common/Button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/ui/bricks/common/context-menu'
import { ImageAttributes } from '../../lib/useImageAttributes'
import { parseFilterProperty, parseImageFrame } from '../../lib/utils'

type Props = {
  children: ReactNode
  changeFrame: (attr: ImageAttributes['frame']) => void
  changeFilter: (attr: ImageAttributes['filter']) => void
}

export const ImageContextMenu = ({
  children,
  changeFilter,
  changeFrame,
}: Props) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className='min-w-[215px]'>
        <ContextMenuItem>
          <Button variant='none'>Replace image</Button>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Button variant='none'>Delete image</Button>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Button variant='none'>Frames</Button>
          <HoveredSubMenu>
            <div
              onClick={() => changeFrame('none')}
              className='cursor-pointer'
              title='none'
            >
              <Image
                src='/images/image-placeholder.svg'
                width={32}
                height={32}
                alt=''
              />
            </div>
            {(['shadowed', 'bordered', 'rounded'] as const).map(
              (frame, index) => (
                <div
                  key={index}
                  onClick={() => changeFrame(frame)}
                  title={frame}
                  className='cursor-pointer'
                >
                  <Image
                    src='/images/image-placeholder.svg'
                    width={32}
                    height={32}
                    alt=''
                    className={parseImageFrame(frame)}
                  />
                </div>
              ),
            )}
          </HoveredSubMenu>
        </ContextMenuItem>
        <ContextMenuItem>
          <Button variant='none'>Filters</Button>
          <HoveredSubMenu>
            <div
              onClick={() => changeFilter('none')}
              className='cursor-pointer'
              title='none'
            >
              <Image
                src='/images/image-placeholder.svg'
                width={32}
                height={32}
                alt=''
              />
            </div>
            {(['grayscale', 'sepia', 'hue-rotate(220deg)'] as const).map(
              (filter, index) => (
                <div
                  key={index}
                  onClick={() => changeFilter(filter)}
                  title={filter}
                  className='cursor-pointer'
                >
                  <Image
                    src='/images/image-placeholder.svg'
                    width={32}
                    height={32}
                    alt=''
                    className={parseFilterProperty(filter)}
                  />
                </div>
              ),
            )}
          </HoveredSubMenu>
        </ContextMenuItem>
        <ContextMenuSeparator />
      </ContextMenuContent>
    </ContextMenu>
  )
}
