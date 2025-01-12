import { createContext, Dispatch, SetStateAction, useState } from 'react'

type AppStateContext = {
  openedSidenav: boolean
  setOpenedSidenav: Dispatch<SetStateAction<boolean>>
  selectedColor: { indexh: number; color: string }
  setSelectedColor: Dispatch<SetStateAction<{ indexh: number; color: string }>>
}

export const AppStateContext = createContext({} as AppStateContext)

type Props = {
  children: React.ReactNode
}

export const AppStateProvider = ({ children }: Props) => {
  const [openedSidenav, setOpenedSidenav] = useState(false)
  const [selectedColor, setSelectedColor] = useState<{
    indexh: number
    color: string
  }>({
    color: '',
    indexh: 0,
  })

  return (
    <AppStateContext
      value={{
        openedSidenav,
        setOpenedSidenav,
        selectedColor,
        setSelectedColor,
      }}
    >
      {children}
    </AppStateContext>
  )
}
