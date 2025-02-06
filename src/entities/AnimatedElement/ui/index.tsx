import { ReactNode, useContext } from 'react'

import { AppStateContext } from '@/shared/context/app-state-context'
import { cn } from '@/shared/lib/cn-merge'
import { parseAnimation } from '../lib/utils'

type Props = {
  id: string
  className?: string
  children: ReactNode
  disabled?: boolean
}

export const AnimatedElement = ({
  className,
  children,
  id,
  disabled,
}: Props) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    animated: [_, { queryAnimatedElementById }],
  } = useContext(AppStateContext)

  const isAnimated =
    queryAnimatedElementById(id) || queryAnimatedElementById(id + '_node')

  return (
    <div
      className={cn(
        className,
        isAnimated && !disabled && parseAnimation(isAnimated.type),
      )}
    >
      {children}
    </div>
  )
}
