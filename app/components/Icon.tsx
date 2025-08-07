import Image from 'next/image'

interface IconProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export default function Icon({ src, alt, width = 64, height = 64, className = '' }: IconProps) {
  return (
    <Image
      src={`/assets/${src}`}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  )
}
