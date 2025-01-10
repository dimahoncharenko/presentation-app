import * as React from 'react'
import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/lib/cn-merge'

const inputVariants = cva(
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent items-center file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  {
    variants: {
      variant: {
        default: '',
        clean:
          'border-0 outline focus-visible:ring-0 !outline-none !focus-visible:outline-none !focus-visible:ring-[transparent] shadow-none',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  rightSection?: React.ReactNode
  containerClassname?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, containerClassname, type, variant, rightSection, ...props },
    ref,
  ) => {
    return (
      <div className={cn(containerClassname)}>
        <input
          className={cn('', inputVariants({ variant, className }))}
          type={type}
          ref={ref}
          {...props}
        />
        {rightSection}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
