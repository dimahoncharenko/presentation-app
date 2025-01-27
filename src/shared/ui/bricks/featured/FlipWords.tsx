'use client'

import React, { CSSProperties, useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@/shared/lib/cn-merge'

export const FlipWords = ({
  id,
  words,
  duration = 3000,
  className,
  style = {},
}: {
  id: string
  words: string[]
  duration?: number
  className?: string
  style?: CSSProperties
}) => {
  const [currentWord, setCurrentWord] = useState(words[0])
  const [isAnimating, setIsAnimating] = useState<boolean>(false)

  const startAnimation = useCallback(() => {
    const word = words[words.indexOf(currentWord) + 1] || words[0]
    setCurrentWord(word)
    setIsAnimating(true)
  }, [currentWord, words])

  useEffect(() => {
    if (!isAnimating)
      setTimeout(() => {
        startAnimation()
      }, duration)
  }, [isAnimating, duration, startAnimation])

  // Preprocess input to merge fragmented HTML strings
  const preprocessWords = (words: string[]): string[] => {
    const sanitizedWords: string[] = []
    let tempWord = ''

    words.forEach(word => {
      tempWord += word

      // If the tempWord forms valid HTML, push it and reset
      try {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = tempWord

        // If parsing succeeds, we treat it as a valid word
        if (tempDiv.innerHTML) {
          sanitizedWords.push(tempWord)
          tempWord = '' // Reset for the next word
        }
      } catch {
        // Ignore errors and keep accumulating the word
      }
    })

    // Push any remaining word in tempWord
    if (tempWord.trim()) {
      sanitizedWords.push(tempWord)
    }

    return sanitizedWords
  }

  const parseWord = (word: string) => {
    const sanitizedWord = sanitizeHTML(word)
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = sanitizedWord
    return parseNodes(Array.from(tempDiv.childNodes))
  }

  const parseNodes = (
    nodes: ChildNode[],
    parentStyles: React.CSSProperties = {},
  ): { text: string; styles: CSSProperties }[] => {
    return nodes
      .map(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return {
            text: node.textContent || '',
            styles: parentStyles,
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement
          const elementStyles = {
            ...parentStyles,
            ...(element.getAttribute('style')
              ? parseInlineStyle(element.getAttribute('style')!)
              : {}),
          }

          return parseNodes(Array.from(element.childNodes), elementStyles)
        }
        return { text: '', styles: parentStyles }
      })
      .flat()
  }

  const sanitizedWords = preprocessWords(words)
  const parsedWord = parseWord(
    sanitizedWords[words.indexOf(currentWord)] || sanitizedWords[0],
  )

  return (
    <AnimatePresence
      onExitComplete={() => {
        setIsAnimating(false)
      }}
    >
      <motion.div
        id={id}
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 10,
        }}
        exit={{
          opacity: 0,
          y: -40,
          x: 40,
          filter: 'blur(8px)',
          scale: 2,
          position: 'absolute',
        }}
        className={cn(
          'relative z-10 inline-block px-2 text-left text-neutral-900 dark:text-neutral-100',
          className,
        )}
        style={style}
        key={currentWord}
      >
        {parsedWord.map(({ text, styles }, wordIndex) => (
          <motion.span
            key={text + wordIndex}
            initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              delay: wordIndex * 0.3,
              duration: 0.3,
            }}
            className='inline-block whitespace-nowrap'
            style={styles}
          >
            {text.split('').map((letter, letterIndex) => (
              <motion.span
                key={letter + letterIndex}
                initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  delay: wordIndex * 0.3 + letterIndex * 0.05,
                  duration: 0.2,
                }}
                className='inline-block'
              >
                {letter}
              </motion.span>
            ))}
          </motion.span>
        ))}
        <span className='inline-block'>&nbsp;</span>
      </motion.div>
    </AnimatePresence>
  )
}

// Helper function to parse inline styles from a string
const parseInlineStyle = (style: string): React.CSSProperties => {
  return style
    .split(';')
    .reduce((styles: React.CSSProperties, styleProperty: string) => {
      if (!styleProperty.trim()) return styles

      const [key, value] = styleProperty.split(':')
      if (key && value) {
        const cssKey = camelCase(key.trim()) as string
        ;(styles as { [P in string]: string })[cssKey] = value.trim()
      }

      return styles
    }, {} as React.CSSProperties)
}

// Convert kebab-case to camelCase for inline style properties
const camelCase = (str: string) => {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

// Sanitize HTML input
const sanitizeHTML = (html: string): string => {
  return html
    .replace(/(\r\n|\n|\r)/gm, '') // Remove line breaks
    .replace(/\s+(?=[,;:)}>\]])/g, '') // Remove extra spaces before punctuation
    .replace(/\s{2,}/g, ' ') // Collapse multiple spaces into one
    .trim()
}
