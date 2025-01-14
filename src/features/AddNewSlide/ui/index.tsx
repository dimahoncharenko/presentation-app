import { useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { placeCentered } from '@/widgets/Sidenav'
import { Button } from '@/shared/ui/bricks/common/Button'
import { AppStateContext } from '@/shared/context/app-state-context'
import { SlideElementsContext } from '@/shared/context/slide-elements-context'

type Props = {
  currentSlideIndex: number
}

export const AddNewSlide = ({ currentSlideIndex }: Props) => {
  const { setElements } = useContext(SlideElementsContext)
  const { setOpenedSidenav } = useContext(AppStateContext)

  return (
    <Button
      onClick={() => {
        setElements(prev => [
          ...prev,
          {
            'slide-id': `slide-${currentSlideIndex + 1}`,
            id: `text-node-${uuidv4()}`,
            bg: 'red',
            type: 'text-node',
            content: 'New Text',
            position: placeCentered(),
            size: {
              width: 300,
              height: 100,
            },
          },
        ])

        setOpenedSidenav(false)
      }}
    >
      Create a slide +
    </Button>
  )
}
