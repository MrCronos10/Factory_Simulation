import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sprout, Factory, Workflow, Menu, X, Play, Square,
  Sun, Moon, Volume2, VolumeX, Globe,
} from 'lucide-react'
import type { SceneKey } from '../game/gameTypes'
import { translate, LANGS, type Lang } from '../data/i18n'
import SaveMenu from './SaveMenu'

const SCENE_ICONS: Record<SceneKey, React.ComponentType<{ size?: number }>> = {
  farm: Sprout, factory: Factory, process: Workflow,
}

type Props = {
  scene: SceneKey
  onChange: (s: SceneKey) => void
  language: Lang
  onLanguageChange: (l: Lang) => void
  dayNight: 'day' | 'night'
  onDayNightToggle: () => void
  soundEnabled: boolean
  onSoundToggle: () => void
  tourActive: boolean
  onTourToggle: () => void
  onSave: () => void
  onLoad: () => void
  onReset: () => void
}

/**
 * Top nav bar: scene tabs with animated underline (framer-motion `layoutId`),
 * tour toggle, day/night, sound, language, save menu.
 * On mobile the extras collapse into a hamburger sheet.
 */
export default function TopNavigation(props: Props) {
  const { scene, onChange, language } = props
  const t = (k: string) => translate(language, k)
  const [menuOpen, setMenuOpen] = useState(false)

  const scenes: SceneKey[] = ['farm', 'factory', 'process']
  const sceneLabel = (s: SceneKey) => t(`nav.${s}`)

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 py-2 bg-black/50 backdrop-blur-md border-b border-white/10"
    >
      <div className="text-sm sm:text-base font-semibold tracking-wide text-emerald-200 truncate">
        Manure → Organic Fertilizer
      </div>

      {/* Scene tabs — always visible, with animated underline */}
      <div className="flex gap-1 sm:gap-2 items-center">
        {scenes.map((s) => {
          const Icon = SCENE_ICONS[s]
          const active = scene === s
          return (
            <button
              key={s}
              onClick={() => onChange(s)}
              className={`relative flex items-center gap-1.5 px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                active ? 'text-emerald-200' : 'text-white/70 hover:text-white'
              }`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{sceneLabel(s)}</span>
              {active && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute left-2 right-2 -bottom-0.5 h-0.5 rounded-full bg-emerald-400"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Desktop extras */}
      <div className="hidden md:flex items-center gap-2">
        <ExtrasBar {...props} />
      </div>

      {/* Mobile: hamburger */}
      <button
        className="md:hidden p-2 rounded-full bg-white/10 text-white"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Menu"
      >
        {menuOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full right-2 mt-1 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex flex-col gap-2 z-40"
          >
            <ExtrasBar {...props} vertical />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function ExtrasBar({
  language, onLanguageChange, dayNight, onDayNightToggle,
  soundEnabled, onSoundToggle, tourActive, onTourToggle,
  onSave, onLoad, onReset, vertical = false,
}: Props & { vertical?: boolean }) {
  const t = (k: string) => translate(language, k)
  const wrap = vertical ? 'flex flex-col gap-2' : 'flex items-center gap-2'
  return (
    <div className={wrap}>
      <IconBtn onClick={onTourToggle} title={tourActive ? t('nav.stopTour') : t('nav.playTour')} active={tourActive}>
        {tourActive ? <Square size={13} /> : <Play size={13} />}
        <span className={vertical ? '' : 'hidden lg:inline'}>{tourActive ? t('nav.stopTour') : t('nav.playTour')}</span>
      </IconBtn>
      <IconBtn onClick={onDayNightToggle} title={t('nav.dayNight')}>
        {dayNight === 'day' ? <Sun size={13} /> : <Moon size={13} />}
      </IconBtn>
      <IconBtn onClick={onSoundToggle} title={t('nav.sound')} active={soundEnabled}>
        {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
      </IconBtn>
      <LanguagePicker language={language} onChange={onLanguageChange} />
      <SaveMenu onSave={onSave} onLoad={onLoad} onReset={onReset} />
    </div>
  )
}

function IconBtn({
  onClick, title, children, active,
}: { onClick: () => void; title: string; children: React.ReactNode; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
        active
          ? 'bg-emerald-500/25 border border-emerald-400/40 text-emerald-100'
          : 'bg-white/10 text-white hover:bg-white/20'
      }`}
    >
      {children}
    </button>
  )
}

function LanguagePicker({ language, onChange }: { language: Lang; onChange: (l: Lang) => void }) {
  const [open, setOpen] = useState(false)
  const current = LANGS.find((l) => l.code === language)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs bg-white/10 text-white hover:bg-white/20"
      >
        <Globe size={13} />
        {current?.label}
      </button>
      {open && (
        <div className="absolute right-0 mt-1 rounded-lg bg-black/85 border border-white/10 overflow-hidden z-40">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => { onChange(l.code); setOpen(false) }}
              className={`block w-full text-left px-3 py-1.5 text-xs ${
                l.code === language ? 'bg-emerald-500/25 text-emerald-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
