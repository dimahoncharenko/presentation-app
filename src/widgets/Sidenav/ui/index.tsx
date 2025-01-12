'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import {
  Code,
  HighlighterIcon,
  ImagePlusIcon,
  Palette,
  ScrollTextIcon,
  TypeIcon,
  Wrench,
} from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { Controller, useForm } from 'react-hook-form'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/bricks/common/accordion'
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
  const [openedColorPicker, setOpenedColorPicker] = useState(false)
  const currentSlideIndex = useRef<number>(0)

  const { setValue, control, watch, reset } = useForm({
    defaultValues: {
      image: null as null | File,
      slideBg: 'white',
    },
  })

  const image = watch('image')
  const color = watch('slideBg')

  // Applies the initial slide attributes such as background color
  useEffect(() => {
    if (deckRef.current) {
      deckRef.current?.sync()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckRef.current])

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

  useEffect(() => {
    if (deckRef.current && color) {
      setElements(prev =>
        prev.map(el => {
          if (el['slide-id'] === `slide-${currentSlideIndex.current}`) {
            return {
              ...el,
              bg: color,
            }
          }
          return el
        }),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color])

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
        className='gap-3 text-lg'
        onClick={() => {
          setElements([
            ...elements,
            {
              'slide-id': `slide-${currentSlideIndex}`,
              id: `text-node-${elements.length}`,
              type: 'text-node',
              content: 'New Text',
              bg: 'red',
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
                className='inline-flex cursor-pointer items-center gap-3 text-lg'
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
        className='gap-3 text-lg'
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
        className='gap-3 text-lg'
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

      <Button
        variant='none'
        size='auto'
        className='gap-3 break-all text-left text-lg/[1em]'
        onClick={() => {
          setOpenedColorPicker(!openedColorPicker)
        }}
      >
        <Palette className='mb-[2px] !size-6' />
        Slide background color
      </Button>
      <Controller
        control={control}
        name='slideBg'
        render={({ field: { value, onChange, onBlur } }) => {
          return (
            <HexColorPicker
              className={cn(
                '!h-0 overflow-hidden px-3 transition-all',
                openedColorPicker && '!h-44',
              )}
              color={value}
              onBlur={onBlur}
              onChange={onChange}
            />
          )
        }}
      />

      <Accordion type='single' collapsible className='w-full'>
        <AccordionItem value='tools' className='border-0'>
          <AccordionTrigger className='py-0 hover:no-underline'>
            <p className='flex items-center gap-3 text-lg'>
              <Wrench className='mb-[2px] !size-6' /> Other tools
            </p>
          </AccordionTrigger>
          <AccordionContent className='pl-4'>
            <Button
              variant='none'
              size='auto'
              className='text-md gap-3 py-2'
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
              <Code className='mb-[2px] !size-6' />
              Add code snippet
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        onClick={() => {
          setElements(prev => [
            ...prev,
            {
              'slide-id': `slide-${(currentSlideIndex.current || 0) + 1}`,
              id: `text-node-${elements.length + 1}`,
              bg: 'red',
              type: 'text-node',
              content: 'New Text',
              spacing: {
                x: window.innerWidth / 2 - 150,
                y: window.innerHeight / 2 - 50,
              },
              size: {
                width: 300,
                height: 100,
              },
            },
          ])
        }}
      >
        Create a first slide +
      </Button>
    </div>
  )
}
