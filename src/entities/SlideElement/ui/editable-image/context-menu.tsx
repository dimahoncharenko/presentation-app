'use client'

import { ReactNode, useContext, useEffect } from 'react'
import Image from 'next/image'
import { HoveredSubMenu } from '@/shared/ui/hovered-sub-menu'
import { Controller, useForm } from 'react-hook-form'

import { useSlidesStore } from '@/entities/Slide/lib/slide-store-provider'
import { Button } from '@/shared/ui/bricks/common/Button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/ui/bricks/common/context-menu'
import { Input } from '@/shared/ui/bricks/common/input'
import { AppStateContext } from '@/shared/context/app-state-context'
import { ImageAttributes } from '../../lib/useImageAttributes'
import { parseFilterProperty, parseImageFrame } from '../../lib/utils'

type Props = {
  children: ReactNode
  changeFrame: (attr: ImageAttributes['frame']) => void
  changeFilter: (attr: ImageAttributes['filter']) => void
  elementId: string
}

export const ImageContextMenu = ({
  children,
  changeFilter,
  changeFrame,
  elementId,
}: Props) => {
  const { currentSlide } = useContext(AppStateContext)
  const slidesState = useSlidesStore(state => state)

  const { setValue, control, watch } = useForm({
    defaultValues: {
      image: null as null | File,
    },
  })

  const image = watch('image')

  useEffect(() => {
    if (image) {
      slidesState.replaceNode(`slide-${currentSlide}`, elementId, {
        id: elementId,
        content: URL.createObjectURL(image),
        position: {
          x: 0,
          y: 0,
        },
        type: 'image-node',
      })
    }
  }, [elementId, image, currentSlide])

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className='relative min-w-[215px]'>
        <ContextMenuItem inset onSelect={e => e.preventDefault()}>
          <Controller
            control={control}
            name='image'
            render={({ field: { name, onBlur, ref, disabled } }) => {
              return (
                <>
                  <label htmlFor='image-replace' className='cursor-pointer'>
                    <span>Replace image</span>
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
                    id='image-replace'
                  />
                </>
              )
            }}
          />
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Button variant='none'>Frames</Button>
          <HoveredSubMenu>
            <div
              onClick={() => changeFrame('none')}
              className='cursor-pointer'
              title='none'
            >
              <Image
                src='/images/image-placeholder.svg'
                width={32}
                height={32}
                alt=''
              />
            </div>
            {(['shadowed', 'bordered', 'rounded'] as const).map(
              (frame, index) => (
                <div
                  key={index}
                  onClick={() => changeFrame(frame)}
                  title={frame}
                  className='cursor-pointer'
                >
                  <Image
                    src='/images/image-placeholder.svg'
                    width={32}
                    height={32}
                    alt=''
                    className={parseImageFrame(frame)}
                  />
                </div>
              ),
            )}
          </HoveredSubMenu>
        </ContextMenuItem>
        <ContextMenuItem>
          <Button variant='none'>Filters</Button>
          <HoveredSubMenu>
            <div
              onClick={() => changeFilter('none')}
              className='cursor-pointer'
              title='none'
            >
              <Image
                src='/images/image-placeholder.svg'
                width={32}
                height={32}
                alt=''
              />
            </div>
            {(['grayscale', 'sepia', 'hue-rotate(220deg)'] as const).map(
              (filter, index) => (
                <div
                  key={index}
                  onClick={() => changeFilter(filter)}
                  title={filter}
                  className='cursor-pointer'
                >
                  <Image
                    src='/images/image-placeholder.svg'
                    width={32}
                    height={32}
                    alt=''
                    className={parseFilterProperty(filter)}
                  />
                </div>
              ),
            )}
          </HoveredSubMenu>
        </ContextMenuItem>
        <ContextMenuSeparator />
      </ContextMenuContent>
    </ContextMenu>
  )
}
