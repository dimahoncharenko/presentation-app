import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

import { Button } from '@/shared/ui/bricks/common/Button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/ui/bricks/common/context-menu'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/shared/ui/bricks/common/hover-card'

type Props = {
  children: ReactNode
}

export const ImageContextMenu = ({ children }: Props) => {
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
          <HoverCard>
            <HoverCardTrigger className='ml-auto cursor-pointer'>
              <ChevronRight />
            </HoverCardTrigger>
            <HoverCardContent className='absolute -right-[185px] -top-8 z-10 w-40 rounded-md border border-gray-200 bg-white p-2 shadow-sm'>
              Border
            </HoverCardContent>
          </HoverCard>
        </ContextMenuItem>
        <ContextMenuSeparator />
      </ContextMenuContent>
    </ContextMenu>
  )
}
