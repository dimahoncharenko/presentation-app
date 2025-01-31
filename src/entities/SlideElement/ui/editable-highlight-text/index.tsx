import { EditableElement } from '@/shared/ui/editable-element'

import { InputSlot } from './input-slot'
import { OutputSlot } from './output-slot'

type Props = {
  initialValue: string
  handleSubmit: (value: string) => void
}

export const EditableHighlightText = ({
  initialValue,
  handleSubmit,
}: Props) => {
  return (
    <EditableElement
      initialValue={initialValue}
      inputSlot={inputProps => (
        <InputSlot {...inputProps} handleSubmit={handleSubmit} />
      )}
      outputSlot={outputProps => <OutputSlot {...outputProps} />}
    />
  )
}
