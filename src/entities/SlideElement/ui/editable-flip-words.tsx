import { useState } from 'react'
import { Check, X } from 'lucide-react'

import { Button } from '../../../shared/ui/bricks/common/Button'
import { Input } from '../../../shared/ui/bricks/common/input'
import { FlipWords } from '../../../shared/ui/bricks/featured/FlipWords'

type Props = {
  handleSubmit: (value: string) => void
  handleDelete: () => void
  initialValue: string
}

export const EditableFlipWords = ({
  handleSubmit,
  handleDelete,
  initialValue,
}: Props) => {
  const [editable, setEditable] = useState(true)
  const [words, setWords] = useState(initialValue)

  if (editable) {
    return (
      <div className='absolute left-0 inline-flex w-full'>
        <Input
          value={words}
          variant='clean'
          className='px-1 py-0'
          onChange={e => {
            setWords(e.target.value)
          }}
          placeholder='Separate words by commas'
        />
        <div className='flex flex-col justify-between p-1'>
          <Button
            variant='none'
            size='auto'
            className='hover:text-green-300'
            onClick={() => {
              handleSubmit(words)
              setEditable(false)
            }}
          >
            <Check className='!size-3' />
          </Button>
          <Button
            variant='none'
            size='auto'
            className='hover:text-red-400'
            onClick={() => {
              handleDelete()
              setEditable(false)
            }}
          >
            <X className='!size-3' />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      onDoubleClick={() => setEditable(true)}
      className='flex h-full items-center justify-center'
    >
      <FlipWords duration={1} words={words.split(',')} />
    </div>
  )
}
