import { useEffect } from 'react'
import {
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceNumber,
} from '@rive-app/react-webgl2'
import { Fit, Alignment, Layout } from '@rive-app/webgl2'

interface RiveCursorTrackerProps {
  /** Path to the .riv file (e.g., "/animations/rive/look-login.riv") */
  src: string
  /** Mouse X position normalized to -1..1 */
  mouseX: number
  /** Mouse Y position normalized to -1..1 */
  mouseY: number
  /** Artboard name in the .riv file */
  artboard?: string
  /** State machine name in the .riv file */
  stateMachine?: string
  /** ViewModel name for gaze control */
  viewModelName?: string
  /** X-axis input name on the ViewModel */
  xAxisName?: string
  /** Y-axis input name on the ViewModel */
  yAxisName?: string
  className?: string
}

export default function RiveCursorTracker({
  src,
  mouseX,
  mouseY,
  artboard = 'Main',
  stateMachine = 'State Machine 1',
  viewModelName = 'GazeControl',
  xAxisName = 'xAxis',
  yAxisName = 'yAxis',
  className = '',
}: RiveCursorTrackerProps) {
  const { rive, RiveComponent } = useRive({
    src,
    artboard,
    stateMachines: [stateMachine],
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  })

  const viewModel = useViewModel(rive, { name: viewModelName })
  const viewModelInstance = useViewModelInstance(viewModel, { rive })

  const xAxis = useViewModelInstanceNumber(xAxisName, viewModelInstance)
  const yAxis = useViewModelInstanceNumber(yAxisName, viewModelInstance)

  useEffect(() => {
    if (xAxis.value !== null) xAxis.setValue(mouseX)
    if (yAxis.value !== null) yAxis.setValue(mouseY)
  }, [mouseX, mouseY, xAxis, yAxis])

  return (
    <div className={`relative ${className}`}>
      {!rive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse" />
        </div>
      )}
      <RiveComponent
        className="w-full h-full"
        aria-label="Animated character that follows your cursor"
      />
    </div>
  )
}
