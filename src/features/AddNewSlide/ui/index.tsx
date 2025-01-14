import { useContext } from 'react'

import { placeCentered } from '@/widgets/Sidenav'
import { Button } from '@/shared/ui/bricks/common/Button'
import { SlideElementsContext } from '@/shared/context/slide-elements-context'

type Props = {
  currentSlideIndex: number
}

export const AddNewSlide = ({ currentSlideIndex }: Props) => {
  const { elements, setElements } = useContext(SlideElementsContext)

  return (
    <Button
      onClick={() => {
        setElements(prev => [
          ...prev,
          {
            'slide-id': `slide-${currentSlideIndex + 1}`,
            id: `text-node-${elements.length + 1}`,
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
      }}
    >
      Create a slide +
    </Button>
  )
}
