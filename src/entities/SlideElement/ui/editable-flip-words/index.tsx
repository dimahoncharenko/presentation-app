import { EditableElement } from '@/shared/ui/editable-element'

import { InputSlot } from './input-slot'
import { OutputSlot } from './output-slot'

type EditableFlippableTextProps = {
  initialValue: string
  handleSubmit: (value: string) => void
}

export const EditableFlippableText = ({
  initialValue,
  handleSubmit,
}: EditableFlippableTextProps) => {
  return (
    <EditableElement
      initialValue={initialValue}
      outputSlot={outputProps => <OutputSlot {...outputProps} />}
      inputSlot={inputProps => (
        <InputSlot {...inputProps} handleSubmit={handleSubmit} />
      )}
    />
  )
}
