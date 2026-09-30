import { Component, type ReactNode } from 'react'
import { MonitorX } from 'lucide-react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

/**
 * Isolates 3D canvas failures (e.g. no WebGL context) so the rest of the UI
 * — HUD, navigation, panels — keeps working instead of unmounting the app.
 */
export default class SceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0f0a] text-center px-6">
          <MonitorX size={40} className="text-emerald-400/70" />
          <div className="text-white font-semibold">3D view unavailable</div>
          <p className="text-white/60 text-sm max-w-sm">
            Your browser or device couldn't start WebGL, so the 3D scene can't render.
            The rest of the simulation still works — try a different browser or enable
            hardware acceleration.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
