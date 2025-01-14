import { useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Button, ButtonProps } from '@/shared/ui/bricks/common/Button'
import { AppStateContext } from '@/shared/context/app-state-context'
import { SlideElementsContext } from '@/shared/context/slide-elements-context'

type Props = {
  currentSlideIndex: number
  children?: React.ReactNode
} & Omit<ButtonProps, 'onClick' | 'children'>

export const AddNewSlide = ({
  currentSlideIndex,
  children = 'Create a slide +',
  ...rest
}: Props) => {
  const { setElements } = useContext(SlideElementsContext)
  const { setOpenedSidenav } = useContext(AppStateContext)

  return (
    <Button
      {...rest}
      onClick={() => {
        setElements(prev => [
          ...prev,
          {
            'slide-id': `slide-${currentSlideIndex + 1}`,
            id: `text-node-${uuidv4()}`,
            bg: 'red',
            type: 'text-node',
            content: 'New Text',
            position: { x: 500, y: 300 },
            size: {
              width: 300,
              height: 100,
            },
          },
          {
            'slide-id': `slide-${currentSlideIndex + 1}`,
            id: `text-node-${uuidv4()}`,
            bg: 'red',
            type: 'text-node',
            content: 'New Text',
            position: { x: 500, y: 300 },
            size: {
              width: 300,
              height: 100,
            },
          },
        ])

        setOpenedSidenav(false)
      }}
    >
      {children}
    </Button>
  )
}
