'use client'

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useAnimated } from '@/entities/AnimatedElement/lib/useAnimated'
import { RevealContext } from './reveal-context'

type AppStateContext = {
  openedSidenav: boolean
  setOpenedSidenav: Dispatch<SetStateAction<boolean>>
  selectedColor: { indexh: number; color: string }
  setSelectedColor: Dispatch<SetStateAction<{ indexh: number; color: string }>>
  currentSlide: number
  animated: ReturnType<typeof useAnimated>
}

export const AppStateContext = createContext({} as AppStateContext)

type DeckState = {
  indexh: number
  indexv: number
}

type Props = {
  children: React.ReactNode
}

export const AppStateProvider = ({ children }: Props) => {
  const { deckRef } = useContext(RevealContext)
  const animated = useAnimated()

  const [openedSidenav, setOpenedSidenav] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(
    deckRef.current?.getState().indexh || 0,
  )
  const [selectedColor, setSelectedColor] = useState<{
    indexh: number
    color: string
  }>({
    color: '',
    indexh: 0,
  })

  useEffect(() => {
    const handleSlideChanged = (event: Event) => {
      const currentSlide = event as unknown as DeckState
      setCurrentSlide(currentSlide.indexh)
    }

    if (deckRef.current) {
      deckRef.current.sync()
    }
    deckRef.current?.on('slidechanged', handleSlideChanged)

    return () => {
      deckRef.current?.off('slidechanged', handleSlideChanged)
    }
  }, [deckRef.current])

  return (
    <AppStateContext
      value={{
        openedSidenav,
        setOpenedSidenav,
        selectedColor,
        setSelectedColor,
        currentSlide,
        animated: [...animated],
      }}
    >
      {children}
    </AppStateContext>
  )
}
