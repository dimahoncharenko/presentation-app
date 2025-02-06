import { AnimatedElement } from './useAnimated'

export const parseAnimation = (type: AnimatedElement['type']) => {
  switch (type) {
    case 'bounce':
      return 'animate-bounce'
    case 'ping':
      return 'animate-ping'
    case 'pulse':
      return 'animate-pulse'
    case 'spin':
      return 'animate-spin'
  }
}
