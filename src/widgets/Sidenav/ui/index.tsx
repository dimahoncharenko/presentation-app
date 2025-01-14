'use client'

import { useCallback, useContext, useEffect, useState } from 'react'
import {
  Code,
  HighlighterIcon,
  ImagePlusIcon,
  ScrollTextIcon,
  TypeIcon,
  Wrench,
} from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import { AddNewSlide } from '@/features/AddNewSlide'
import { SlideElement } from '@/entities/SlideElement'
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
import { placeCentered } from '../lib'

type DeckState = {
  indexh: number
  indexv: number
}

export const Sidenav = () => {
  const { elements, setElements } = useContext(SlideElementsContext)
  const { deckRef } = useContext(RevealContext)
  const { openedSidenav, setOpenedSidenav } = useContext(AppStateContext)
  const [currentSlide, setCurrentSlide] = useState(
    deckRef.current?.getState().indexh || 0,
  )

  const { setValue, control, watch, reset } = useForm({
    defaultValues: {
      image: null as null | File,
    },
  })

  const image = watch('image')

  // Applies the initial slide attributes such as background color
  useEffect(() => {
    const handleSlideChanged = (event: Event) => {
      const currentSlide = event as unknown as DeckState
      setCurrentSlide(currentSlide.indexh)
    }

    if (deckRef.current) {
      deckRef.current.sync()
    }
    deckRef.current?.on('slidechanged', handleSlideChanged)

    return () => {
      deckRef.current?.off('slidechanged', handleSlideChanged)
    }
  }, [deckRef.current])

  const addNodeToSlide = useCallback(
    ({
      position,
      size,
      content,
      type,
    }: {
      type: SlideElement['type']
      content: string
      position?: SlideElement['position']
      size?: SlideElement['size']
    }) => {
      setElements([
        ...elements,
        {
          'slide-id': `slide-${currentSlide}`,
          id: `${type}-${uuidv4()}`,
          type,
          content,
          position: position ?? placeCentered(),
          size: size ?? {
            width: 300,
            height: 300,
          },
        },
      ])

      setOpenedSidenav(false)
    },
    [currentSlide, elements, setElements],
  )

  useEffect(() => {
    if (image) {
      addNodeToSlide({
        type: 'image-node',
        content: URL.createObjectURL(image),
      })
      reset()
    }
  }, [image, setElements, elements, currentSlide, reset, addNodeToSlide])

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
          addNodeToSlide({
            type: 'text-node',
            content: 'New Text',
            size: {
              width: 300,
              height: 100,
            },
          })
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
          addNodeToSlide({
            type: 'flip-words-node',
            content: '',
            size: {
              width: 300,
              height: 100,
            },
          })
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
          addNodeToSlide({
            type: 'text-highlight-node',
            content: 'Sample Text',
            size: {
              width: 300,
              height: 100,
            },
          })
        }}
      >
        <HighlighterIcon className='mb-[2px] !size-6' />
        Add highlighted text
      </Button>

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
              onClick={() => {}}
            >
              <Code className='mb-[2px] !size-6' />
              Add code snippet
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <AddNewSlide currentSlideIndex={currentSlide} />
    </div>
  )
}
