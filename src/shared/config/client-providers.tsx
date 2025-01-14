'use client'

import dynamic from 'next/dynamic'
import { DndContext } from '@dnd-kit/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AppStateProvider } from '@/shared/context/app-state-context'
import { DroppedElementsProvider } from '@/shared/context/slide-elements-context'

const RevealProvider = dynamic(
  async () => (await import('@/shared/context/reveal-context')).RevealProvider,
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
      <DroppedElementsProvider>
        <AppStateProvider>
          <DndContext>
            <RevealProvider>{children}</RevealProvider>
          </DndContext>
        </AppStateProvider>
      </DroppedElementsProvider>
    </QueryClientProvider>
  )
}
