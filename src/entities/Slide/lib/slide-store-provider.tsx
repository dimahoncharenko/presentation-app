'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'

import { createSlidesStore, type SlidesStore } from '../model/store'

export type SlidesStoreApi = ReturnType<typeof createSlidesStore>

export const SlidesContext = createContext<SlidesStoreApi | undefined>(
  undefined,
)

export interface SlidesStoreProviderProps {
  children: ReactNode
}

export const SlidesStoreProvider = ({ children }: SlidesStoreProviderProps) => {
  const storeRef = useRef<SlidesStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createSlidesStore()
  }

  return (
    <SlidesContext.Provider value={storeRef.current}>
      {children}
    </SlidesContext.Provider>
  )
}

export const useSlidesStore = <T,>(selector: (store: SlidesStore) => T): T => {
  const counterStoreContext = useContext(SlidesContext)

  if (!counterStoreContext) {
    throw new Error(`useSlidesStore must be used within SlidesStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
