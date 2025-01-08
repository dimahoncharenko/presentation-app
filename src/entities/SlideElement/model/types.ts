type SharedProperties = {
  'slide-id': string
  id: string
  content: string
  spacing: {
    x: number
    y: number
  }
  size?: {
    width: number
    height: number
  }
  bg?: string
}

export type SlideImage = {
  type: 'image-node'
} & SharedProperties

export type SlideText = {
  type: 'text-node'
} & SharedProperties

export type SlideFlipWords = {
  type: 'flip-words-node'
} & SharedProperties

export type SlideTextHighlight = {
  type: 'text-highlight-node'
} & SharedProperties

export type SlideElement =
  | SlideText
  | SlideImage
  | SlideFlipWords
  | SlideTextHighlight
