'use client'

import dynamic from 'next/dynamic'
import { DndContext } from '@dnd-kit/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AppStateProvider } from '../context/app-state-context'

const RevealProvider = dynamic(
  async () => (await import('../context/reveal-context')).RevealProvider,
  {
    ssr: false,
  },
)

const queryClient = new QueryClient()

type Props = {
  children: React.ReactNode
}

export const ClientProviders = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        <DndContext>
          <RevealProvider>{children}</RevealProvider>
        </DndContext>
      </AppStateProvider>
    </QueryClientProvider>
  )
}
