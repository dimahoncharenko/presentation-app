import { useState } from 'react'
import { Check } from 'lucide-react'

import { Button } from '@/shared/ui/bricks/common/Button'
import { Textarea } from '@/shared/ui/bricks/common/textarea'

type Props = {
  handleSubmit: (value: string) => void
  initialValue: string
  highlightNumber?: string
  numberOffset?: number
}

export const EditableCodeSnippet = ({
  highlightNumber,
  numberOffset,
  handleSubmit,
  initialValue,
}: Props) => {
  const [editable, setEditable] = useState(true)
  const [code, setCode] = useState(initialValue)

  if (editable) {
    return (
      <div className='absolute left-0 inline-flex h-full w-full'>
        <Textarea
          value={code}
          className='h-full resize-none px-1 py-0 text-black'
          onChange={e => {
            setCode(e.target.value)
          }}
          placeholder='Put your code here...'
        />

        <Button
          variant='none'
          size='auto'
          className='absolute right-1 top-1 text-green-300'
          onClick={() => {
            console.log('Submitting code: ', code)
            handleSubmit(code)
            setEditable(false)
          }}
        >
          <Check className='!size-3' />
        </Button>
      </div>
    )
  }

  return (
    <pre onDoubleClick={() => setEditable(true)}>
      <code
        data-trim
        data-noescape
        className='h-full'
        data-line-numbers={highlightNumber}
        data-ln-start-from={`${numberOffset}`}
      >
        {code}
      </code>
    </pre>
  )
}
