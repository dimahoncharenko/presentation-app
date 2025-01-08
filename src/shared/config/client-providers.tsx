'use client'

import dynamic from 'next/dynamic'
import { DndContext } from '@dnd-kit/core'

import { AppStateProvider } from '../context/app-state-context'

const RevealProvider = dynamic(
  async () => (await import('../context/reveal-context')).RevealProvider,
  {
    ssr: false,
  },
)

type Props = {
  children: React.ReactNode
}

export const ClientProviders = ({ children }: Props) => {
  return (
    <AppStateProvider>
      <DndContext>
        <RevealProvider>{children}</RevealProvider>
      </DndContext>
    </AppStateProvider>
  )
}
