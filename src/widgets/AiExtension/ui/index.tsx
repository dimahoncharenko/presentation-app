import { useEffect, useState } from 'react'
import { Check, WandSparkles, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/shared/ui/bricks/common/Button'
import { Input } from '@/shared/ui/bricks/common/input'
import { cn } from '@/shared/lib/cn-merge'

type Props = {
  children: (content: string) => React.ReactNode
  forceHidden?: boolean
}

export const AiExtension = ({ children, forceHidden }: Props) => {
  const [isPrompting, setIsPrompting] = useState(false)
  const [content, setContent] = useState('')

  const form = useForm({
    defaultValues: {
      prompt: '',
    },
  })

  useEffect(() => {
    if (forceHidden) {
      setIsPrompting(false)
    }
  }, [forceHidden])

  return (
    <div className='relative'>
      {children(content)}
      <Button
        variant='none'
        size='auto'
        onClick={() => {
          setIsPrompting(true)
        }}
        className='absolute -right-0 -top-0 opacity-0 hover:opacity-80'
      >
        <WandSparkles className='!size-4' />
      </Button>
      {isPrompting && (
        <form
          onSubmit={form.handleSubmit(async values => {
            console.log(values)
          })}
          className={cn(
            'absolute top-0 flex h-full w-full items-center gap-1 bg-white text-black',
            forceHidden && 'hidden',
          )}
        >
          <Controller
            control={form.control}
            name='prompt'
            render={({ field }) => (
              <Input
                variant='clean'
                {...field}
                placeholder='Enter your prompt here...'
              />
            )}
          />
          <div className='flex flex-col px-1'>
            <Button variant='none' size='auto' type='submit'>
              <Check className='!size-4' />
            </Button>
            <Button
              variant='none'
              size='auto'
              onClick={() => {
                setIsPrompting(false)
                setContent('')
              }}
            >
              <X className='!size-4' />
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
