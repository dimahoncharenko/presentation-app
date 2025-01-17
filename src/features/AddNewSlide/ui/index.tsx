import { useContext } from 'react'

import { useSlidesStore } from '@/entities/Slide/lib/slide-store-provider'
import { Button, ButtonProps } from '@/shared/ui/bricks/common/Button'
import { AppStateContext } from '@/shared/context/app-state-context'

type Props = {
  currentSlideIndex: number
  children?: React.ReactNode
} & Omit<ButtonProps, 'onClick' | 'children'>

export const AddNewSlide = ({
  currentSlideIndex,
  children = 'Create a slide +',
  ...rest
}: Props) => {
  const { setOpenedSidenav } = useContext(AppStateContext)
  const { addSlide } = useSlidesStore(state => state)

  return (
    <Button
      {...rest}
      onClick={() => {
        addSlide(currentSlideIndex)
        setOpenedSidenav(false)
      }}
    >
      {children}
    </Button>
  )
}
