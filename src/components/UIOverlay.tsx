import type { ReactNode } from 'react'

type Props = { children: ReactNode }

/**
 * Fullscreen non-blocking layer that holds HUD/overlay UI on top of the 3D canvas.
 * Individual overlay pieces are responsible for enabling pointer events on
 * their own interactive children.
 */
export default function UIOverlay({ children }: Props) {
  return <div className="pointer-events-none absolute inset-0 z-10 [&_button]:pointer-events-auto [&_aside]:pointer-events-auto [&_nav]:pointer-events-auto">{children}</div>
}
