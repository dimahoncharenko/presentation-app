'use client'

const sidenavWidth = 250

export const placeCentered = () => ({
  x: (window.innerWidth + sidenavWidth) / 2 - 150,
  y: window.innerHeight / 2 - 50,
})
