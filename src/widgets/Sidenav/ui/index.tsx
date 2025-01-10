'use client'

import { useContext, useEffect } from 'react'
import {
  HighlighterIcon,
  ImagePlusIcon,
  ScrollTextIcon,
  TypeIcon,
} from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/shared/ui/bricks/common/Button'
import { Input } from '@/shared/ui/bricks/common/input'
import { AppStateContext } from '@/shared/context/app-state-context'
import { RevealContext } from '@/shared/context/reveal-context'
import { SlideElementsContext } from '@/shared/context/slide-elements-context'
import { cn } from '@/shared/lib/cn-merge'

export const Sidenav = () => {
  const { elements, setElements } = useContext(SlideElementsContext)
  const { deckRef } = useContext(RevealContext)
  const { openedSidenav } = useContext(AppStateContext)

  const { setValue, control, watch, reset } = useForm({
    defaultValues: {
      image: null as null | File,
    },
  })

  const currentSlideIndex = deckRef.current?.getState().indexh
  const image = watch('image')

  useEffect(() => {
    if (image) {
      setElements([
        ...elements,
        {
          'slide-id': `slide-${currentSlideIndex}`,
          id: `image-node-${elements.length}`,
          type: 'image-node',
          content: URL.createObjectURL(image),
          spacing: {
            x: 500,
            y: 250,
          },
          size: {
            width: 300,
            height: 300,
          },
        },
      ])
      reset()
    }
  }, [image, setElements, elements, currentSlideIndex, reset])

  return (
    <div
      className={cn(
        'absolute bottom-0 right-0 top-0 flex w-[250px] flex-col items-start gap-2 !bg-slate-100 p-4 opacity-0 transition xl:px-8',
        openedSidenav && 'opacity-1',
      )}
    >
      <Button
        variant='none'
        size='auto'
        className='gap-3 text-xl'
        onClick={() => {
          setElements([
            ...elements,
            {
              'slide-id': `slide-${currentSlideIndex}`,
              id: `text-node-${elements.length}`,
              type: 'text-node',
              content: 'New Text',
              spacing: {
                x: 500,
                y: 250,
              },
              size: {
                width: 300,
                height: 100,
              },
            },
          ])
        }}
      >
        <TypeIcon className='mb-[2px] !size-6' />
        Add Text
      </Button>

      <Controller
        control={control}
        name='image'
        render={({ field: { name, onBlur, ref, disabled } }) => {
          return (
            <>
              <label
                htmlFor='image-upload'
                className='inline-flex cursor-pointer items-center gap-3 text-xl'
              >
                <ImagePlusIcon className='mb-[2px] size-6' />
                Add Image
              </label>
              <Input
                name={name}
                onBlur={onBlur}
                ref={ref}
                disabled={disabled}
                onChange={evt =>
                  evt.target.files && setValue('image', evt.target.files?.[0])
                }
                type='file'
                className='hidden'
                id='image-upload'
              />
            </>
          )
        }}
      />

      <Button
        variant='none'
        size='auto'
        className='gap-3 text-xl'
        onClick={() => {
          setElements([
            ...elements,
            {
              'slide-id': `slide-${currentSlideIndex}`,
              id: `flip-words-node-${elements.length}`,
              type: 'flip-words-node',
              content: '',
              spacing: {
                x: 500,
                y: 250,
              },
              size: {
                width: 300,
                height: 100,
              },
            },
          ])
        }}
      >
        <ScrollTextIcon className='mb-[2px] !size-6' />
        Add flipped text
      </Button>

      <Button
        variant='none'
        size='auto'
        className='gap-3 text-xl'
        onClick={() => {
          setElements([
            ...elements,
            {
              'slide-id': `slide-${currentSlideIndex}`,
              id: `text-highlight-node-${elements.length}`,
              type: 'text-highlight-node',
              content: 'Sample text',
              spacing: {
                x: 500,
                y: 250,
              },
              size: {
                width: 300,
                height: 100,
              },
            },
          ])
        }}
      >
        <HighlighterIcon className='mb-[2px] !size-6' />
        Add highlighted text
      </Button>
    </div>
  )
}
