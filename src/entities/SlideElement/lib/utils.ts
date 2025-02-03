import { ImageAttributes } from './useImageAttributes'

export const filterParagraphContent = (input: string) => {
  const regex = /<p[^>]*>(.*?)<\/p>/ // Matches any <p> tag and captures its content
  const match = input.match(regex)

  return match ? match[1] : '' // Return the captured content, or an empty string if no match
}

export const splitText = (htmlString: string): string[] => {
  return htmlString
    .replace(/<\/?span[^>]*>/g, '|')
    .split('|')
    .map(str => str.trim())
    .filter(Boolean)
}

export const wrapWordsInSpans = (htmlString: string): string => {
  const container = document.createElement('div')
  container.innerHTML = htmlString

  const processNode = (node: Node): Node[] => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent
        ?.split(/\s+/)
        .map(word => {
          if (!word.trim()) return null
          const span = document.createElement('span')
          span.textContent = word
          span.setAttribute('id', 'split') // Apply ID if needed
          return span
        })
        .filter(Boolean) as Node[]
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.nodeName === 'SPAN'
    ) {
      return processNode(node.firstChild!) // Ensure existing spans remain intact
    }
    return [node]
  }

  const newNodes = Array.from(container.childNodes).flatMap(processNode)
  container.innerHTML = '' // Clear container
  newNodes.forEach(node => container.appendChild(node))

  return container.innerHTML
}

export const splitTextPreserveSpans = (htmlString: string): string[] => {
  const container = document.createElement('div')
  container.innerHTML = htmlString

  const result: string[] = []

  container.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Split plain text into words and add them separately
      const words = node.textContent?.trim().split(/\s+/) || []
      result.push(...words)
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      (node as HTMLElement).tagName === 'SPAN'
    ) {
      // Cast node to HTMLElement to safely access outerHTML
      result.push((node as HTMLElement).outerHTML)
    }
  })

  return result
}

export const parseFilterProperty = (filter: ImageAttributes['filter']) => {
  switch (filter) {
    case 'sepia':
      return 'filter sepia'
    case 'grayscale':
      return 'filter grayscale'
    case 'hue-rotate(220deg)':
      return 'filter hue-rotate-[220deg]'
    default:
      return ''
  }
}

export const parseImageFrame = (frame: ImageAttributes['frame']) => {
  switch (frame) {
    case 'rounded':
      return 'rounded-lg'
    case 'bordered':
      return 'border-2 border-gray-500'
    case 'shadowed':
      return 'shadow-2xl'
    default:
      return ''
  }
}
