import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

import { cn } from '@/shared/lib/cn-merge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../../bricks/common/hover-card'

type Props = {
  children: ReactNode
  classNames?: Partial<{
    handler: string
    content: string
  }>
}

export const HoveredSubMenu = ({ children, classNames }: Props) => {
  return (
    <HoverCard>
      <HoverCardTrigger
        className={cn('ml-auto cursor-pointer', classNames?.handler)}
      >
        <ChevronRight />
      </HoverCardTrigger>
      <HoverCardContent
        className={cn(
          'absolute -right-[185px] -top-8 z-10 flex w-40 flex-wrap gap-1 rounded-md border border-gray-200 bg-white p-2 shadow-sm',
          classNames?.content,
        )}
      >
        {children}
      </HoverCardContent>
    </HoverCard>
  )
}
