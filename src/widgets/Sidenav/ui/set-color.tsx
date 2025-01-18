'use client'

import { useEffect, useState } from 'react'
import { DecoratedText } from '@/shared/ui/DecoratedText'
import { Palette, Save } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { useDebounceValue } from 'usehooks-ts'

import { Button } from '@/shared/ui/bricks/common/Button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/bricks/common/sheet'
import { cn } from '@/shared/lib/cn-merge'
import { STORAGE_KEYS } from '@/shared/constants/local-storage-keys'
import { colors } from '../lib/color-palettes'
import classes from './classes.module.css'
import { ColorPalette } from './color-palette'

type Props = {
  hideText: boolean
  handleClick: (color: string) => void
  closeSidenav: () => void
}

export const SetColor = ({ handleClick, hideText, closeSidenav }: Props) => {
  const [opened, setOpened] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [color, setColor] = useState('')
  const [debouncedColor] = useDebounceValue(color, 100)
  const [showSaveButton, setShowSaveButton] = useState(false)
  const [notify, setNotify] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  useEffect(() => {
    if (opened) {
      closeSidenav()
    }
    setIsMounted(true) // Set isMounted to true after the component mounts
  }, [opened])

  useEffect(() => {
    if (debouncedColor) {
      handleClick(debouncedColor)
      setShowSaveButton(true)
    } else if (!debouncedColor) {
      setShowSaveButton(false)
    }
  }, [debouncedColor])

  const customPalette: typeof colors.DOOM | null = JSON.parse(
    `${localStorage.getItem(STORAGE_KEYS.CUSTOM_PALETTE)}`,
  )

  useEffect(() => {
    if (!showSaveButton) {
      setNotify(true)
    }

    return () => {
      setNotify(false)
    }
  }, [showSaveButton])

  const handleSave = () => {
    if (customPalette) {
      localStorage.setItem(
        STORAGE_KEYS.CUSTOM_PALETTE,
        JSON.stringify(
          customPalette.concat({
            color: debouncedColor,
            label: `Custom color ${customPalette.length + 1}`,
          }),
        ),
      )
    } else {
      localStorage.setItem(
        STORAGE_KEYS.CUSTOM_PALETTE,
        JSON.stringify([
          {
            color: debouncedColor,
            label: 'Custom color 1',
          },
        ]),
      )
    }

    setShowSaveButton(false)
  }

  return (
    <Sheet onOpenChange={setOpened} open={opened}>
      <SheetTrigger className='flex items-center justify-start gap-3 p-0 text-lg text-[#a59ea0]'>
        <Palette className='!size-6' />
        <span
          className={cn(
            'opacity-0 transition-opacity',
            !hideText && 'opacity-1',
          )}
        >
          Set Color
        </span>
      </SheetTrigger>
      <SheetContent
        overlay={false}
        onMouseEnter={() => closeSidenav()}
        aria-describedby={undefined}
        className='bg-opacity-0'
      >
        <SheetHeader>
          <SheetTitle className='uppercase'>
            Choose a color from palettes
          </SheetTitle>
          <div className='flex flex-col gap-2 py-5'>
            <DecoratedText className='border-y-[#e2c63c] bg-[url(https://images.unsplash.com/photo-1571847140471-1d7766e825ea?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]'>
              VINTAGE
            </DecoratedText>
            <ColorPalette handleClick={handleClick} palette={colors.VINTAGE} />

            <DecoratedText className='border-y-[#78786c] bg-[url(https://images.unsplash.com/photo-1604919335926-6c648c481853?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]'>
              DOOM
            </DecoratedText>
            <ColorPalette handleClick={handleClick} palette={colors.DOOM} />

            <DecoratedText className='border-y-[#F2D5D5] bg-[url(https://mir-s3-cdn-cf.behance.net/projects/202/1f70f0208070275.66ec05f3a9230.png)]'>
              ELEGANCY
            </DecoratedText>
            <ColorPalette handleClick={handleClick} palette={colors.ELEGANCY} />
          </div>
        </SheetHeader>
        <SheetTitle className='inline-flex items-center uppercase'>
          Or pick your own color
          <Button variant={'none'} onClick={handleFlip}>
            <Palette className={cn(notify && 'animate-ping repeat-1')} />
          </Button>
        </SheetTitle>
        <div
          className={cn(
            'perspective-1000 relative h-64 w-full',
            classes.cardContainer,
          )}
        >
          <div
            className={cn(
              'duration-600 transform-style-preserve-3d relative h-full w-full transition-transform',
              classes.card,
              isMounted && isFlipped ? classes.flipped : classes.unflipped,
            )}
          >
            <div
              className={cn(
                'backface-hidden absolute h-full w-full items-center justify-center bg-white',
                classes.cardFront,
              )}
            >
              <div className='relative w-full'>
                <HexColorPicker
                  color={color}
                  onChange={value => setColor(value)}
                  className='!w-full'
                />
                <Button
                  variant={'none'}
                  className={cn(
                    'absolute hidden w-full rounded-none text-black',
                    showSaveButton && 'inline-flex items-center',
                  )}
                  onClick={handleSave}
                >
                  <Save /> <span>Save to custom palette</span>
                </Button>
              </div>
            </div>
            <div
              className={cn(
                'backface-hidden rotate-x-180 absolute w-full rounded-lg bg-gray-200 p-1',
                classes.cardBack,
              )}
            >
              <div className='flex h-full w-full flex-wrap gap-1'>
                {customPalette &&
                  customPalette.map((color, index) => (
                    <span
                      onClick={() => handleClick(color.color)}
                      key={index}
                      className='size-5 cursor-pointer rounded-sm'
                      style={{ backgroundColor: color.color }}
                    ></span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
