'use client'

import React from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

import { cn } from '@/shared/lib/cn-merge'

export const HeroHighlight = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
}) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return
    const { left, top } = currentTarget.getBoundingClientRect()

    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }
  return (
    <div
      className={cn(
        'group relative flex h-[40rem] w-full items-center justify-center bg-white dark:bg-black',
        containerClassName,
      )}
      onMouseMove={handleMouseMove}
    >
      <div className='pointer-events-none absolute inset-0 bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800' />
      <motion.div
        className='pointer-events-none absolute inset-0 opacity-0 transition duration-300 bg-dot-thick-indigo-500 group-hover:opacity-100 dark:bg-dot-thick-indigo-500'
        style={{
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }}
      />

      <div className={cn('relative z-20', className)}>{children}</div>
    </div>
  )
}

export const TextHighlight = ({
  children,
  className,
  dangerouslySetInnerHTML,
}: {
  children?: React.ReactNode
  className?: string
  dangerouslySetInnerHTML?:
    | {
        __html: string | TrustedHTML
      }
    | undefined
}) => {
  return (
    <motion.span
      initial={{
        backgroundSize: '0% 100%',
      }}
      animate={{
        backgroundSize: '100% 100%',
      }}
      transition={{
        duration: 2,
        ease: 'linear',
        delay: 0.5,
      }}
      style={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
      }}
      className={cn(
        `relative inline-flex rounded-lg bg-gradient-to-r from-indigo-300 to-purple-300 px-3 dark:from-indigo-500 dark:to-purple-500`,
        className,
      )}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    >
      {children}
    </motion.span>
  )
}
