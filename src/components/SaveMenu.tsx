import { Save, Upload, RotateCcw } from 'lucide-react'

type Props = {
  onSave: () => void
  onLoad: () => void
  onReset: () => void
}

/** Minimal save/load/reset controls, top-right of the top nav. */
export default function SaveMenu({ onSave, onLoad, onReset }: Props) {
  return (
    <div className="flex items-center gap-1">
      <IconBtn onClick={onSave} title="Save game"><Save size={14} /></IconBtn>
      <IconBtn onClick={onLoad} title="Load game"><Upload size={14} /></IconBtn>
      <IconBtn
        onClick={() => {
          if (confirm('Reset the game? This clears your save.')) onReset()
        }}
        title="Reset game"
      >
        <RotateCcw size={14} />
      </IconBtn>
    </div>
  )
}

function IconBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
    >
      {children}
    </button>
  )
}
