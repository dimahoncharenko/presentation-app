import { colors } from '../lib/color-palettes'

type Props = {
  palette: typeof colors.DOOM
  handleClick: (color: string) => void
}

export const ColorPalette = ({ palette, handleClick }: Props) => {
  return (
    <div className='flex justify-center py-2'>
      {palette.map(({ color, label }, index) => (
        <div
          key={index}
          className='group relative cursor-pointer'
          onClick={() => handleClick(color)}
        >
          <span
            style={{
              backgroundColor: color,
            }}
            className='-ml-2 inline-block size-10 rounded-full border border-black'
          ></span>
          <span className='absolute -bottom-4 left-0 -ml-2 text-xs opacity-0 transition-opacity group-hover:opacity-100'>
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
