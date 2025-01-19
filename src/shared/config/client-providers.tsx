'use client'

import dynamic from 'next/dynamic'
import { DndContext } from '@dnd-kit/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { SlidesStoreProvider } from '@/entities/Slide/lib/slide-store-provider'
import { AppStateProvider } from '@/shared/context/app-state-context'
import { SelectedNodesProvider } from '../context/selected-nodes'

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
      <SlidesStoreProvider>
        <SelectedNodesProvider>
          <AppStateProvider>
            <DndContext>
              <RevealProvider>{children}</RevealProvider>
            </DndContext>
          </AppStateProvider>
        </SelectedNodesProvider>
      </SlidesStoreProvider>
    </QueryClientProvider>
  )
}
