import { useState } from 'react'
import { Editor } from '@tiptap/react'
import { Check, Info, Loader, LockKeyhole, LockKeyholeOpen } from 'lucide-react'

import { Button } from '@/shared/ui/bricks/common/Button'
import { Input } from '@/shared/ui/bricks/common/input'
import { Switch } from '@/shared/ui/bricks/common/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/bricks/common/tooltip'
import { aiApi } from '../lib/service'
import { getSelectedText } from '../lib/utils'

type Props = {
  editor: Editor
}

export const FancyRewriter = ({ editor }: Props) => {
  const [applyToWhole, setApplyToWhole] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [value, setValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsEditing(true)

      const response = await aiApi.remakeText(
        value,
        applyToWhole ? editor.$doc.textContent : getSelectedText(editor),
      )

      setIsEditing(false)

      if (!applyToWhole) {
        const { from } = editor.state.selection
        editor
          .chain()
          .focus()
          .deleteSelection()
          .insertContentAt(from, `${response?.text} `)
          .run()
      } else {
        editor.chain().setContent(`${response?.text}`).run()
      }
    } catch (err) {
      console.error(err)
      setIsEditing(false)
    }
  }

  return (
    <div className='w-full'>
      <div className='flex justify-between rounded-t-md bg-gray-200 p-1'>
        <div className='inline-flex items-center'>
          <Switch
            className='scale-[40%] border border-gray-400'
            checked={!applyToWhole}
            onCheckedChange={() => setApplyToWhole(prev => !prev)}
            color='rgb(156, 163, 175)'
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className='-ml-2'>
                <Info className='text-gray-600' size={8} />
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-xs'>
                  {`When it's true, the remake applies only to the selected text`}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          size='auto'
          variant={'none'}
          className='text-gray-400'
          onClick={() => setDisabled(!disabled)}
        >
          {disabled ? (
            <LockKeyhole className='!size-3' />
          ) : (
            <LockKeyholeOpen className='!size-3' />
          )}
        </Button>
      </div>
      <Input
        value={value}
        variant='clean'
        disabled={disabled}
        className='w-full gap-2 rounded-none px-0 text-sm'
        containerClassname='flex gap-3 items-center px-2 bg-gray-200'
        onChange={e => setValue(e.target.value)}
        placeholder='How do you want to rewrite?'
        rightSection={
          <>
            {isEditing && (
              <Loader className='animate-spin text-gray-400' size={16} />
            )}
            {!isEditing && value && (
              <Check
                className='cursor-pointer'
                size={16}
                onClick={handleSubmit}
              />
            )}
          </>
        }
      />
    </div>
  )
}
