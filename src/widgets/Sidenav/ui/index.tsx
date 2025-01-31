'use client'

import { useCallback, useContext, useEffect, useState } from 'react'
import {
  ArrowLeft,
  CirclePlus,
  Code,
  HighlighterIcon,
  ImagePlusIcon,
  PanelLeft,
  ScrollTextIcon,
  Trash2,
  TypeIcon,
  Wrench,
} from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import { AddNewSlide } from '@/features/AddNewSlide'
import { useSlidesStore } from '@/entities/Slide/lib/slide-store-provider'
import { SlideElement } from '@/entities/SlideElement'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/bricks/common/accordion'
import { Button } from '@/shared/ui/bricks/common/Button'
import { Input } from '@/shared/ui/bricks/common/input'
import { Sidebar, SidebarBody } from '@/shared/ui/bricks/featured/sidebar'
import { AppStateContext } from '@/shared/context/app-state-context'
import { RevealContext } from '@/shared/context/reveal-context'
import { cn } from '@/shared/lib/cn-merge'
import { SetColor } from './set-color'

type DeckState = {
  indexh: number
  indexv: number
}

export const Sidenav = () => {
  const { deckRef } = useContext(RevealContext)
  const { openedSidenav, setSelectedColor, setOpenedSidenav } =
    useContext(AppStateContext)

  const [currentSlide, setCurrentSlide] = useState(
    deckRef.current?.getState().indexh || 0,
  )

  const [showedSidenav, setShowedSidenav] = useState(false)
  const slidesState = useSlidesStore(state => state)

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
      slidesState.addNodeToSlide(`slide-${currentSlide}`, {
        id: `${type}-${uuidv4()}`,
        type,
        content,
        position: position ?? { x: 500 - 250, y: 300 },
        size: size ?? {
          width: 300,
          height: 300,
        },
      })

      setOpenedSidenav(false)
    },
    [currentSlide, slidesState.slides.length],
  )

  useEffect(() => {
    if (image) {
      addNodeToSlide({
        type: 'image-node',
        content: URL.createObjectURL(image),
      })
      reset()
    }
  }, [image, slidesState.slides.length, currentSlide, reset, addNodeToSlide])

  return (
    <div className='custom-controls absolute z-30 w-full'>
      <Button
        variant='none'
        className='absolute hidden md:block'
        onClick={() => {
          setShowedSidenav(prev => !prev)
        }}
      >
        <PanelLeft className='!size-6 !text-black' />
      </Button>
      <Sidebar open={openedSidenav} setOpen={setOpenedSidenav} animate>
        <SidebarBody
          className={cn(
            'absolute z-50 h-screen items-start justify-between gap-10 overflow-y-auto overflow-x-hidden transition-transform',
            !showedSidenav && 'xl:-translate-x-16',
          )}
        >
          <div className='flex flex-1 flex-col gap-3'>
            <SetColor
              closeSidenav={() => {
                setShowedSidenav(false)
                setOpenedSidenav(false)
              }}
              handleClick={color => {
                setSelectedColor({
                  indexh: deckRef.current!.getState().indexh,
                  color,
                })
              }}
              hideText={!openedSidenav}
            />

            <Button
              variant='none'
              size='auto'
              className='items-center justify-start gap-3 p-0 text-lg text-[#a59ea0]'
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
              <span
                className={cn(
                  'opacity-0 transition-opacity',
                  openedSidenav && 'opacity-1',
                )}
              >
                Add Text
              </span>
            </Button>

            <Controller
              control={control}
              name='image'
              render={({ field: { name, onBlur, ref, disabled } }) => {
                return (
                  <>
                    <label
                      htmlFor='image-upload'
                      className='inline-flex cursor-pointer items-center gap-3 text-lg text-[#a59ea0]'
                    >
                      <ImagePlusIcon className='mb-[2px] size-6' />
                      <span
                        className={cn(
                          'opacity-0 transition-opacity',
                          openedSidenav && 'opacity-1',
                        )}
                      >
                        Add Image
                      </span>
                    </label>
                    <Input
                      name={name}
                      onBlur={onBlur}
                      ref={ref}
                      disabled={disabled}
                      onChange={evt =>
                        evt.target.files &&
                        setValue('image', evt.target.files?.[0])
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
              className='items-center justify-start gap-3 p-0 text-lg text-[#a59ea0]'
              onClick={() => {
                addNodeToSlide({
                  type: 'flip-words-node',
                  content: 'Type Here',
                  size: {
                    width: 300,
                    height: 100,
                  },
                })
              }}
            >
              <ScrollTextIcon className='mb-[2px] !size-6' />
              <span
                className={cn(
                  'opacity-0 transition-opacity',
                  openedSidenav && 'opacity-1',
                )}
              >
                Add flipped text
              </span>
            </Button>

            <Button
              variant='none'
              size='auto'
              className='items-center justify-start gap-3 p-0 text-lg text-[#a59ea0]'
              onClick={() => {
                addNodeToSlide({
                  type: 'text-highlight-node',
                  content: 'New Text',
                  size: {
                    width: 300,
                    height: 100,
                  },
                })
              }}
            >
              <HighlighterIcon className='mb-[2px] !size-6' />
              <span
                className={cn(
                  'opacity-0 transition-opacity',
                  openedSidenav && 'opacity-1',
                )}
              >
                Add highlighted text
              </span>
            </Button>

            <Accordion type='single' collapsible className='h-full w-full'>
              <AccordionItem value='tools' className='border-0'>
                <AccordionTrigger className='m-0 py-0 hover:no-underline'>
                  <div className='!m-0 flex items-center gap-3 text-lg text-[#a59ea0]'>
                    <Wrench className='mb-[2px] !size-6' />
                    <span
                      style={{
                        fontFamily: 'Lato, sans-serif',
                      }}
                      className={cn(
                        'opacity-0 transition-opacity',
                        openedSidenav && 'opacity-1',
                      )}
                    >
                      Other tools
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent hidden={!openedSidenav} className='m-0 pl-4'>
                  <Button
                    variant='none'
                    size='auto'
                    className='text-md m-0 gap-3 py-0 text-[#a59ea0]'
                    onClick={() => {
                      addNodeToSlide({
                        type: 'code-snippet-node',
                        content: 'console.log("Sample code")',
                        size: {
                          width: 300,
                          height: 100,
                        },
                      })
                    }}
                  >
                    <Code className='mb-[2px] mt-0 !size-6' />
                    <span
                      className={cn(
                        'opacity-0 transition-opacity',
                        openedSidenav && 'opacity-1',
                      )}
                    >
                      Add code snippet
                    </span>
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <AddNewSlide
              variant='none'
              className='items-center justify-start gap-3 p-0 text-lg text-[#a59ea0]'
              currentSlideIndex={currentSlide}
            >
              <CirclePlus className='mb-[2px] mt-0 !size-6 fill-black stroke-white' />
              <span
                className={cn(
                  'opacity-0 transition-opacity',
                  openedSidenav && 'opacity-1',
                )}
              >
                Create next slide
              </span>
            </AddNewSlide>

            <Button
              onClick={() => {
                slidesState.removeSlide(`slide-${currentSlide}`)
                deckRef.current?.sync()
              }}
              variant='none'
              className='items-center justify-start gap-3 p-0 text-lg text-[#a59ea0]'
            >
              <Trash2 className='mb-[2px] mt-0 !size-6' />
              <span
                className={cn(
                  'opacity-0 transition-opacity',
                  openedSidenav && 'opacity-1',
                )}
              >
                Remove the slide
              </span>
            </Button>

            <Button
              variant='none'
              className='items-center justify-start gap-3 p-0 text-lg text-[#a59ea0]'
              onClick={() => {
                setShowedSidenav(false)
                setOpenedSidenav(false)
              }}
            >
              <ArrowLeft className='mb-[2px] mt-0 !size-6' />
              <span
                className={cn(
                  'opacity-0 transition-opacity',
                  openedSidenav && 'opacity-1',
                )}
              >
                Hide
              </span>
            </Button>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  )
}
