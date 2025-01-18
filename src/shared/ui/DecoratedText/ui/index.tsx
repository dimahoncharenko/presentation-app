import { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn-merge'

type Props = {
  children: ReactNode
  className?: string
}

export const DecoratedText = ({ children, className }: Props) => {
  return (
    <p
      style={{
        filter: 'drop-shadow(0px 0px 0.3px black)',
      }}
      className={cn(
        'border-y-2 bg-[url(https://images.unsplash.com/photo-1416269223193-bc45028133f5?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-contain bg-clip-text bg-center py-1 text-center text-3xl tracking-wider text-transparent',
        className,
      )}
    >
      {children}
    </p>
  )
}
