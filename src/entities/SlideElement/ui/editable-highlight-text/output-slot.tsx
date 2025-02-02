import { Dispatch, SetStateAction } from 'react'

import { TextHighlight } from '@/shared/ui/bricks/featured/TextHighlight'
import { filterParagraphContent } from '../../lib/utils'

type OutputSlotProps = {
  content: string
  setEditable: Dispatch<SetStateAction<boolean>>
}

export const OutputSlot = ({ content, setEditable }: OutputSlotProps) => {
  return (
    <p
      className='!m-0'
      onDoubleClick={e => {
        e.stopPropagation()
        setEditable(true)
      }}
    >
      <TextHighlight
        dangerouslySetInnerHTML={{ __html: filterParagraphContent(content) }}
      />
    </p>
  )
}
