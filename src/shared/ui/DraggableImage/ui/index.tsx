'use client'

import { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { SlideElementsContext } from '@/shared/context/slide-elements-context'
import { useDndMonitor } from '@dnd-kit/core'

import { SlideElement } from '@/entities/SlideElement/model/types'
import { Draggable } from '../../Draggable/ui'

type Props = {
  element: SlideElement
  handleRemove: () => void
}

export const DraggableImage = ({ element }: Props) => {
  const { setElements } = useContext(SlideElementsContext)
  const [state, setState] = useState(element)

  useDndMonitor({
    onDragEnd(event) {
      setElements(prev =>
        prev.map(el => {
          if (el.id === event.active.id && event.active.id === element.id) {
            el.spacing = {
              x: el.spacing.x + event.delta.x,
              y: el.spacing.y + event.delta.y,
            }
          }

          return el
        }),
      )
    },
  })

  useEffect(() => {
    setState({ ...element })
  }, [element.spacing.x, element.spacing.y, element.id])

  return (
    <>
      <Draggable id={element.id} element={element}>
        <div
          style={{
            width: state.size?.width,
            height: state.size?.height,
            top: state.spacing.y,
            left: state.spacing.x,
          }}
        >
          <Image
            src={state.content}
            alt={state.id}
            width={state.size?.width}
            height={state.size?.height}
          />
        </div>
      </Draggable>
    </>
  )
}
